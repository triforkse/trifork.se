module.exports = function (f, ttl, useCachedOnException, defaultValue) {

  var cache = function () {
    var now = (new Date).getTime();

    try {
      if (cache.initial || cache.fetchTime + ttl < now) {
        cache.cachedValue = f.apply(arguments);
        cache.initial = false;
        cache.fetchTime = now;
        console.log("cache miss");
      }
      else {
        console.log("cache hit - ttl: " + cache.fetchTime + ttl + "vs" + now);
      }
    } catch (e) {
      if (useCachedOnException) {
        if (cache.initial && defaultValue !== undefined) {
          console.error("operation failed using default value.", e);
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

  return cache;
};
