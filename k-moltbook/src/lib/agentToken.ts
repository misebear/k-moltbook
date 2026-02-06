import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AGENT_TOKEN_SECRET || "dev-secret");

export async function signAgentToken(payload: { userId: string; ttlMinutes: number }) {
  const exp = Math.floor(Date.now() / 1000) + payload.ttlMinutes * 60;
  return new SignJWT({ sub: payload.userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime(exp)
    .sign(secret);
}

export async function verifyAgentToken(token: string) {
  return jwtVerify(token, secret);
}
