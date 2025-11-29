import { kv } from "@vercel/kv";
import type { SessionValidationResult, Session, UserSession } from "./session";

const CACHE_PREFIX = "session:";
const CACHE_TTL_SECONDS = 60 * 60 * 24 * 15; // 15 days (shorter than session expiration for safety)

/**
 * Get the cache key for a session ID
 */
function getCacheKey(sessionId: string): string {
  return `${CACHE_PREFIX}${sessionId}`;
}

/**
 * Check if Redis is available (for graceful fallback)
 */
function isRedisAvailable(): boolean {
  try {
    // Check if KV environment variables are set
    return !!(
      process.env.KV_URL ||
      (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN)
    );
  } catch {
    return false;
  }
}

/**
 * Get session from Redis cache
 */
export async function getCachedSession(
  sessionId: string
): Promise<SessionValidationResult | null> {
  if (!isRedisAvailable()) {
    return null;
  }

  try {
    const cacheKey = getCacheKey(sessionId);
    const cached = await kv.get<SessionValidationResult>(cacheKey);
    return cached || null;
  } catch (error) {
    // Log error but don't throw - fallback to FileMaker
    console.error("Redis cache read error:", error);
    return null;
  }
}

/**
 * Store session in Redis cache
 */
export async function setCachedSession(
  sessionId: string,
  result: SessionValidationResult,
  ttlSeconds: number = CACHE_TTL_SECONDS
): Promise<void> {
  if (!isRedisAvailable()) {
    return;
  }

  try {
    const cacheKey = getCacheKey(sessionId);
    await kv.set(cacheKey, result, { ex: ttlSeconds });
  } catch (error) {
    // Log error but don't throw - cache miss is acceptable
    console.error("Redis cache write error:", error);
  }
}

/**
 * Invalidate a session in Redis cache
 */
export async function invalidateCachedSession(
  sessionId: string
): Promise<void> {
  if (!isRedisAvailable()) {
    return;
  }

  try {
    const cacheKey = getCacheKey(sessionId);
    await kv.del(cacheKey);
  } catch (error) {
    // Log error but don't throw
    console.error("Redis cache delete error:", error);
  }
}

/**
 * Invalidate all cached sessions for a user
 * Note: This requires scanning keys, which can be expensive.
 * For better performance, consider maintaining a user->sessions index.
 * 
 * Since @vercel/kv doesn't support SCAN directly, we'll use a different approach:
 * Maintain a set of session IDs per user, or simply invalidate on-demand when needed.
 * For now, we'll skip bulk invalidation and rely on individual session invalidation.
 */
export async function invalidateUserCachedSessions(
  userId: string
): Promise<void> {
  if (!isRedisAvailable()) {
    return;
  }

  // Note: Bulk invalidation by user ID is not efficiently supported by @vercel/kv
  // Individual session invalidation should be used instead.
  // This function is kept for API compatibility but does nothing.
  // Consider implementing a user->sessions index if bulk invalidation is needed.
}

/**
 * Calculate TTL for session cache based on expiration time
 */
export function calculateCacheTTL(expiresAt: Date): number {
  const now = Date.now();
  const expires = expiresAt.getTime();
  const ttlSeconds = Math.max(0, Math.floor((expires - now) / 1000));
  
  // Cap at CACHE_TTL_SECONDS to avoid extremely long cache times
  return Math.min(ttlSeconds, CACHE_TTL_SECONDS);
}
