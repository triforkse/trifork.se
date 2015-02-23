PDFDocument = require('pdfkit');
var _ = require('lodash');

var A4 = {width: 595, height: 842};
var MARGINS = {top: 100, right: 60, bottom: 60, left: 60};
var CONTENT_WIDTH = A4.width - MARGINS.left - MARGINS.right;
var CONTENT_SIZE = 12;

var HEADING_SIZES = {
  0: 42,
  1: 24,
  2: 20,
  3: 16
};

var HEADING_MARGIN = {
  0: {top: 0, bottom: 0},
  1: {top: 2, bottom: 0},
  2: {top: 2, bottom: 0},
  3: {top: 1, bottom: 0}
};

var title = function (doc, ordinal, text) {
  doc.moveDown(HEADING_MARGIN[ordinal].top);
  doc.fontSize(HEADING_SIZES[ordinal])
    .text(text)
    .restore();
  doc.moveDown(HEADING_MARGIN[ordinal].bottom);
};

var paragraph = function (doc, text) {
  doc.moveDown();
  doc.fontSize(CONTENT_SIZE)
    .text(text,
    {
      width: CONTENT_WIDTH,
      align: 'justify'
    })
    .restore();
};

module.exports = function (handbook, ostream) {

  var title = handbook.title;
  var author = handbook.author;

  version = 'Version ' + require('../package.json').version

  var doc = new PDFDocument({
    margins: MARGINS
  });

  doc.pipe(ostream);

  title(doc, 0, handbook.title);

  _.forEach(handbook.sections, function (section) {
    doc.addPage();

    title(doc, 1, section.title);

    if (section.introduction) paragraph(doc, section.introduction);
    if (section.content) paragraph(doc, section.content);

    _.forEach(handbook.sections, function (subsection) {

      title(doc, 2, subsection.title);

      if (subsection.introduction) paragraph(doc, subsection.introduction);
      if (subsection.content) paragraph(doc, subsection.content);
    });
  });

  doc.end();

  return true;
};
