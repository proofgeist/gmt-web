import { createHash, randomBytes } from "crypto";
import { env } from "@/config/env";

const secretKey = process.env.UNSUBSCRIBE_SECRET_KEY || env.RESEND_API_KEY.slice(0, 32);

interface UnsubscribePayload {
  userId: string;
  email: string;
  expiresAt: number;
}

/**
 * Generate a secure unsubscribe token for a user
 * @param userId - The user ID
 * @param email - The user's email address
 * @returns A base64-encoded token string
 */
export function generateUnsubscribeToken(userId: string, email: string): string {
  const expiresAt = Date.now() + 90 * 24 * 60 * 60 * 1000; // 90 days
  const payload: UnsubscribePayload = {
    userId,
    email,
    expiresAt,
  };
  
  const payloadJson = JSON.stringify(payload);
  const random = randomBytes(16).toString("hex");
  const hash = createHash("sha256");
  hash.update(payloadJson + secretKey + random);
  const signature = hash.digest("hex");
  
  const token = `${payloadJson}.${random}.${signature}`;
  return encodeURIComponent(Buffer.from(token).toString("base64"));
}

/**
 * Validate and extract user info from an unsubscribe token
 * @param token - The unsubscribe token to validate
 * @returns The user info if valid, null otherwise
 */
export function validateUnsubscribeToken(token: string): {
  userId: string;
  email: string;
} | null {
  try {
    const decoded = Buffer.from(decodeURIComponent(token), "base64").toString();
    const [payloadJson, random, signature] = decoded.split(".");
    
    if (!payloadJson || !random || !signature) {
      return null;
    }
    
    // Verify signature
    const hash = createHash("sha256");
    hash.update(payloadJson + secretKey + random);
    const expectedSignature = hash.digest("hex");
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const payload: UnsubscribePayload = JSON.parse(payloadJson);
    
    if (Date.now() > payload.expiresAt) {
      return null;
    }
    
    return {
      userId: payload.userId,
      email: payload.email,
    };
  } catch (error) {
    console.error("Error validating unsubscribe token:", error);
    return null;
  }
}

