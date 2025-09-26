const cache = new Map();

/**
 * setCache(key, data, ttlSeconds)
 */
export function setCache(key, data, ttlSeconds = 3600) {
    const expires = Date.now() + ttlSeconds * 1000;
    cache.set(key, { data, expires });
}

/**
 * getCache(key) => data | null
 */
export function getCache(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (entry.expires < Date.now()) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}
