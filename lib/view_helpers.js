module.exports.init = function(app) {

  app.locals.padNum = function (n) {
    if (n < 10) {
      return "0" + n;
    }
    return "" + n;
  };

};
