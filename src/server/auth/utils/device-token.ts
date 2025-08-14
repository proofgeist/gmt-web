import { randomBytes, createHash } from "crypto";
import { cookies } from "next/headers";

const DEVICE_TOKEN_COOKIE = "mfa_device_token";
const TOKEN_EXPIRY_DAYS = 30;

interface DeviceToken {
  token: string;
  userId: string;
}

export function generateDeviceToken(userId: string): string {
  const randomToken = randomBytes(32).toString("hex");
  const hash = createHash("sha256");
  hash.update(userId + randomToken);

  // Create a token object that includes both the hash and userId
  const tokenData: DeviceToken = {
    token: hash.digest("hex"),
    userId,
  };

  // Return encoded token
  return Buffer.from(JSON.stringify(tokenData)).toString("base64");
}

export function parseDeviceToken(token: string): DeviceToken | null {
  try {
    const decoded = Buffer.from(token, "base64").toString();
    return JSON.parse(decoded) as DeviceToken;
  } catch {
    return null;
  }
}

export async function setDeviceTokenCookie(token: string) {
  const cookieStore = await cookies();
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + TOKEN_EXPIRY_DAYS);

  cookieStore.set(DEVICE_TOKEN_COOKIE, token, {
    expires: expiryDate,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function getDeviceToken(): Promise<string | undefined> { 
  const cookieStore = await cookies();
  return cookieStore.get(DEVICE_TOKEN_COOKIE)?.value;
}

export async function clearDeviceToken() {
  const cookieStore = await cookies();
  cookieStore.delete(DEVICE_TOKEN_COOKIE);
}