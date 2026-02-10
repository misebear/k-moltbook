# Bybit Auto Trader (SOLUSDT)

## Setup
```bash
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
```

## Run
```bash
python bot.py
```

## Config
Edit `config.json`:
- symbol: SOL/USDT:USDT
- leverage: 80
- stop_loss_pct: 0.45
- take_profit_pct: 0.30
- position_fraction: 0.50
- daily_max_drawdown: 0.50

## Notes
- Long-only box breakout on 1m. Box = last 30 mins high/low.
- Entry: bullish 1m close breaks above box high.
- Exit: stop loss or take profit.
