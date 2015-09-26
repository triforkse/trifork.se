var chai = require('chai'),
  should = chai.should(),
  datetime = require("../lib/datetime");


describe('datetime', function () {
  describe('#format()', function () {
    it('should return a timezone corrected formatted string from a epoch time input', function () {
      datetime.format(1424365200000).should.eq("Feb 19th, 2015 18:00");
    });
  });
});
