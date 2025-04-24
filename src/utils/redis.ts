export function buildCacheKey(base: string, params: Record<string, any>) {
  if (!Object.keys(params).length) return base

  const sortedKeys = Object.keys(params).sort()
  return base + '?' + sortedKeys.map((k) => `${k}=${params[k] ?? ''}`).join('&')
}
