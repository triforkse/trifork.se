var fs = require('fs')
  , md = require('marked')
  , _ = require('lodash');


var content = function () {
  return fs.readFileSync('public/handbook.md', 'utf8');
};

var sectionId = function (text) {
  return (text || "").toLowerCase().replace(/[^\w]+/g, '-');
};

var html = function (content) {

  var renderer = new md.Renderer();

  renderer.heading = function (text, level) {
    var id = sectionId(text);
    return '<a class="u-anchor" name="' + id + '" href="#' +
      id + '"></a>' + '<h' + level + '>' + text + '</h' + level + '>';
  };

  // HACK: marked does not support metadata, do we strip it out.

  content = content.replace(/---[^]+---/mg, '');

  return md(content, {renderer: renderer});
};

var ast = function (content) {
  return md.lexer(content);
};


var sections = function (content) {
  var tree = ast(content);

  var isSection = function (node) {
    return node.type === "heading" && node.depth === 2;
  };

  var isSubSection = function (node) {
    return node.type === "heading" && node.depth === 3;
  };


  var sections = [];

  _.forEach(tree, function (node) {
    var id = sectionId(node.text);

    if (isSection(node)) {
      sections.push(
        {
          id: id,
          title: node.text,
          subsections: []
        }
      )
    }
    else if (isSubSection(node)) {
      var section = sections[sections.length - 1];
      section.subsections.push(
        {
          id: id,
          title: node.text
        }
      );
    }
  });

  return sections;
};


module.exports = {
  content: content,
  html: html,
  toc: sections
};
