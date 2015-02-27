module.exports.cache = function (f, ttl, useCachedOnException, defaultValue) {

  var cache = function () {
    var now = (new Date).getTime();

    try {
      if (cache.initial || cache.fetchTime + ttl < now) {
        cache.cachedValue = f.apply(arguments);
        cache.initial = false;
        cache.fetchTime = now;
        if (cache.logging) console.log("cache miss");
      }
    } catch (e) {
      if (useCachedOnException) {
        if (cache.initial && defaultValue !== undefined) {
          if (cache.logging) console.error("operation failed using default value.", e);
          return defaultValue;
        }
        else if (cache.initial) {
          throw e;
        }
        else {
          return cache.cachedValue;
        }
      }
      else {
        throw e;
      }
    }

    return cache.cachedValue;
  };

  cache.initial = true;
  cache.cachedValue = undefined;
  cache.fetchTime = undefined;

  cache.logging = true;
  cache.enableLogging = function (enabled) {
    this.logging = enabled;
  };

  return cache;
};
