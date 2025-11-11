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
    // Token is extracted from URL searchParams which automatically URL-decodes it once
    // The token was generated as: encodeURIComponent(Buffer.from(tokenString).toString("base64"))
    // So searchParams.get() gives us the base64 string, which we can decode directly
    let decoded: string;
    try {
      decoded = Buffer.from(token, "base64").toString("utf-8");
    } catch (base64Error) {
      // If base64 decoding fails, try URL-decoding first (in case of double-encoding)
      try {
        const urlDecoded = decodeURIComponent(token);
        decoded = Buffer.from(urlDecoded, "base64").toString("utf-8");
      } catch {
        console.error("[Token Validation] Failed to decode token as base64");
        return null;
      }
    }
    
    // Split from the right since the payload JSON may contain dots (e.g., in email addresses)
    // Format: payloadJson.random.signature
    // Signature is always 64 hex chars (SHA256), random is 32 hex chars (16 bytes)
    const lastDotIndex = decoded.lastIndexOf(".");
    const secondLastDotIndex = decoded.lastIndexOf(".", lastDotIndex - 1);
    
    if (lastDotIndex === -1 || secondLastDotIndex === -1) {
      console.error("[Token Validation] Invalid token format - missing separators");
      console.error("[Token Validation] Decoded length:", decoded.length);
      return null;
    }
    
    const signature = decoded.substring(lastDotIndex + 1);
    const random = decoded.substring(secondLastDotIndex + 1, lastDotIndex);
    const payloadJson = decoded.substring(0, secondLastDotIndex);
    
    if (!payloadJson || !random || !signature) {
      console.error("[Token Validation] Missing parts - payloadJson:", !!payloadJson, "random:", !!random, "signature:", !!signature);
      console.error("[Token Validation] Decoded length:", decoded.length);
      return null;
    }
    
    // Validate lengths
    if (signature.length !== 64) {
      console.error("[Token Validation] Invalid signature length:", signature.length, "expected 64");
      return null;
    }
    if (random.length !== 32) {
      console.error("[Token Validation] Invalid random length:", random.length, "expected 32");
      return null;
    }
    
    // Verify signature
    const hash = createHash("sha256");
    hash.update(payloadJson + secretKey + random);
    const expectedSignature = hash.digest("hex");
    
    if (signature !== expectedSignature) {
      console.error("[Token Validation] Signature mismatch");
      console.error("[Token Validation] Expected:", expectedSignature.substring(0, 20) + "...");
      console.error("[Token Validation] Received:", signature.substring(0, 20) + "...");
      console.error("[Token Validation] Secret key length:", secretKey?.length || 0);
      return null;
    }
    
    const payload: UnsubscribePayload = JSON.parse(payloadJson);
    
    if (Date.now() > payload.expiresAt) {
      console.error("[Token Validation] Token expired. Current time:", Date.now(), "Expires at:", payload.expiresAt);
      return null;
    }
    
    return {
      userId: payload.userId,
      email: payload.email,
    };
  } catch (error) {
    console.error("[Token Validation] Error validating unsubscribe token:", error);
    if (error instanceof Error) {
      console.error("[Token Validation] Error message:", error.message);
      console.error("[Token Validation] Error stack:", error.stack);
    }
    return null;
  }
}

