module.exports = function(f, ttl) {
    var initial = true;
    var cachedValue;
    var fetchTime;

    return function() {
        var now = (new Date).getTime();

        if (initial || fetchTime + ttl < now) {
            cachedValue = f.apply(arguments);
            initial = false;
            fetchTime = now;
            console.log("cache miss");
        }
        else {
            console.log("cache hit");
        }

        return cachedValue;
    };
};