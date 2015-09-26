var expect = require('chai').expect,
  sinon = require('sinon'),
  cache = require("../lib/cache").cache;


describe('cache', function () {

  var clock, f, i, cached_f;

  beforeEach(function () {
    clock = sinon.useFakeTimers();
    i = 0;

    f = sinon.spy(function () {
      return i++;
    });

    cached_f = cache(function () {
      return f();
    }, 100);

    cached_f.enableLogging(false);
  });

  afterEach(function () {
    clock.restore();
  });

  it('Initial and no cached we call the function and set ttl', function () {
    expect(cached_f()).to.equal(0);
    expect(cached_f()).to.equal(0);
  });

  it('if something is cached and ttl has run out we call the function', function () {
    expect(cached_f()).to.equal(0);
    clock.tick(101);
    expect(cached_f()).to.equal(1);
  });

  it("if something is cached and ttl has run out we set a new ttl", function () {
    expect(cached_f()).to.equal(0);
    clock.tick(101);
    expect(cached_f()).to.equal(1);
    expect(cached_f()).to.equal(1);
    clock.tick(101);
    expect(cached_f()).to.equal(2);
  });

  it("new value should not be calculated until the ttl runs out", function () {
    expect(cached_f()).to.equal(0);
    clock.tick(100);
    expect(cached_f()).to.equal(0);
  });

  it("returns the cached value if it crashes, we have a value, and the option is set", function () {
    cached_f = cache(function () {
      return f();
    }, 100, true);
    expect(cached_f()).to.equal(0);
    f = sinon.stub().throws();
    clock.tick(101);
    expect(cached_f()).to.equal(0);

    // TODO: Maybe test that the underlying function is actually called everytime after a crash,
    // or should it actually start a new ttl period to back-off?
  });

  it("returns the default value, if it throws, if no cached value exists and a default value is specified", function () {
    cached_f = cache(function () {
      return f();
    }, 100, true);
    f = sinon.stub().throws();
    expect(cached_f).to.throw();
  });

  it("throws, if the underlying function throws, and no cached value exists and there is no default value", function () {
    cached_f = cache(function () {
      return f();
    }, 100, true, "default");
    f = sinon.stub().throws();
    expect(cached_f()).to.equal("default");
  });
});
