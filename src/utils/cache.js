const cache = {};

export function setCache(key, data, ttlSeconds = 3600) {
    cache[key] = { data, expires: Date.now() + ttlSeconds * 1000 };
}

export function getCache(key) {
    const cached = cache[key];
    if (!cached) return null;
    if (cached.expires < Date.now()) {
        delete cache[key];
        return null;
    }
    return cached.data;
}
