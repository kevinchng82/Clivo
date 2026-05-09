// In-memory store — grows one entry per unique caller phone number.
// Acceptable for MVP; replace with Redis for multi-instance production deployments.
const requestCounts = new Map<string, { count: number; resetAt: number }>()

export function isRateLimited(key: string, maxRequests = 10, windowMs = 60_000): boolean {
  const now = Date.now()
  const record = requestCounts.get(key)

  if (!record || now > record.resetAt) {
    requestCounts.set(key, { count: 1, resetAt: now + windowMs })
    return false
  }

  if (record.count >= maxRequests) return true

  record.count++
  return false
}
