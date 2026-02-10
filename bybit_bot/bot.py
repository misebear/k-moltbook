import os
import json
import time
from datetime import datetime, date

import ccxt
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("BYBIT_API_KEY", "")
API_SECRET = os.getenv("BYBIT_API_SECRET", "")

if not API_KEY or not API_SECRET:
    raise SystemExit("Missing BYBIT_API_KEY/BYBIT_API_SECRET in .env")

with open(os.path.join(os.path.dirname(__file__), "config.json"), "r", encoding="utf-8") as f:
    CONFIG = json.load(f)

SYMBOL = CONFIG["symbol"]
LEVERAGE = CONFIG["leverage"]
BOX_WINDOW = CONFIG["box_window_minutes"]
STOP_LOSS_PCT = CONFIG["stop_loss_pct"]
TAKE_PROFIT_PCT = CONFIG["take_profit_pct"]
POSITION_FRACTION = CONFIG["position_fraction"]
DAILY_MAX_DRAWDOWN = CONFIG["daily_max_drawdown"]
DRY_RUN = CONFIG.get("dry_run", False)

STATE_PATH = os.path.join(os.path.dirname(__file__), "state.json")

exchange = ccxt.bybit({
    "apiKey": API_KEY,
    "secret": API_SECRET,
    "enableRateLimit": True,
    "options": {
        "defaultType": "swap",
    },
})


def load_state():
    if os.path.exists(STATE_PATH):
        with open(STATE_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {
        "date": str(date.today()),
        "daily_start_equity": None,
        "position": None,
    }


def save_state(state):
    with open(STATE_PATH, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)


def fetch_equity():
    balance = exchange.fetch_balance()
    total = balance.get("total", {})
    free = balance.get("free", {})
    usdt_total = total.get("USDT") or total.get("USDT:USDT") or 0
    usdt_free = free.get("USDT") or free.get("USDT:USDT") or 0
    return float(usdt_total), float(usdt_free)


def set_leverage():
    try:
        exchange.set_leverage(LEVERAGE, SYMBOL)
    except Exception:
        pass


def get_box():
    candles = exchange.fetch_ohlcv(SYMBOL, timeframe="1m", limit=BOX_WINDOW + 1)
    if len(candles) < BOX_WINDOW + 1:
        return None
    # exclude latest forming candle
    candles = candles[:-1]
    highs = [c[2] for c in candles]
    lows = [c[3] for c in candles]
    return max(highs), min(lows)


def get_last_closed_candle():
    candles = exchange.fetch_ohlcv(SYMBOL, timeframe="1m", limit=2)
    if len(candles) < 2:
        return None
    return candles[-2]


def place_long(qty):
    if DRY_RUN:
        print(f"[DRY RUN] BUY {qty} {SYMBOL}")
        return
    exchange.create_market_buy_order(SYMBOL, qty)


def close_long(qty):
    if DRY_RUN:
        print(f"[DRY RUN] SELL {qty} {SYMBOL}")
        return
    exchange.create_market_sell_order(SYMBOL, qty)


def main():
    state = load_state()
    set_leverage()

    while True:
        try:
            # daily reset
            today = str(date.today())
            if state["date"] != today:
                state["date"] = today
                state["daily_start_equity"] = None
                state["position"] = None

            equity, free = fetch_equity()
            if state["daily_start_equity"] is None:
                state["daily_start_equity"] = equity

            # daily drawdown check
            if equity <= state["daily_start_equity"] * (1 - DAILY_MAX_DRAWDOWN):
                print("[HALT] Daily max drawdown reached.")
                save_state(state)
                time.sleep(60)
                continue

            position = state.get("position")
            last_candle = get_last_closed_candle()
            if not last_candle:
                time.sleep(10)
                continue

            last_open = last_candle[1]
            last_close = last_candle[4]

            if position:
                entry = position["entry"]
                qty = position["qty"]
                stop_price = entry * (1 - STOP_LOSS_PCT)
                take_price = entry * (1 + TAKE_PROFIT_PCT)
                ticker = exchange.fetch_ticker(SYMBOL)
                last_price = ticker["last"]

                if last_price <= stop_price:
                    print("[EXIT] Stop loss hit")
                    close_long(qty)
                    state["position"] = None
                elif last_price >= take_price:
                    print("[EXIT] Take profit hit")
                    close_long(qty)
                    state["position"] = None

            else:
                box = get_box()
                if not box:
                    time.sleep(10)
                    continue
                box_high, box_low = box
                bullish = last_close > last_open
                breakout = last_close > box_high

                if bullish and breakout:
                    # position sizing
                    notional = equity * POSITION_FRACTION * LEVERAGE
                    qty = notional / last_close
                    qty = float(exchange.amount_to_precision(SYMBOL, qty))
                    if qty > 0:
                        print(f"[ENTRY] Long {qty} @ {last_close}")
                        place_long(qty)
                        state["position"] = {
                            "entry": last_close,
                            "qty": qty,
                            "time": datetime.utcnow().isoformat(),
                        }

            save_state(state)
        except Exception as e:
            print("[ERROR]", e)

        time.sleep(30)


if __name__ == "__main__":
    main()
