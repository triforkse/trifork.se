var expect = require('chai').expect,
  handbook = require('../lib/handbook'),
  _ = require('lodash');

describe('handbook', function () {
  var text = "# Title\n## Foo\n### Bar\n## Bas\nTest\n[]";

  it('can load the handbook.md file', function () {
    expect(handbook.content()).to.not.equal(null);
  });

  it('should find the all markdown sections', function () {
    var sections = handbook.toc(text);
    expect(sections).to.eql([
      {
        id: "foo",
        title: "Foo",
        subsections: [{id: "bar", title: "Bar"}]
      },
      {
        id: "bas",
        title: "Bas",
        subsections: []
      }]);
  });

  it('should have only reference valid sections of the page', function () {
    var content = handbook.content();
    var REGEXP = /\(\#([a-zA-Z0-9_-]+)\)/g;
    var REGEXP_MATCH = /\(\#([a-zA-Z0-9_-]+)\)/;

    var refs = content.match(REGEXP);

    var sections = handbook.toc(content);
    sections = _.reduce(sections, function (acc, section) {
      acc.push(section.id);
      return acc.concat(_.pluck(section.subsections, "id"));
    }, []);

    for (var i = 0; i < refs.length; i++) {
      var link = refs[i];
      link = link.match(REGEXP_MATCH)[1];
      expect(sections).to.include(link);
    }
  });
});
