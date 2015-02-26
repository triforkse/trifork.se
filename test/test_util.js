var originalLog = console.log;

module.exports.enableLogging = function () {
  console.log = originalLog;
};

module.exports.disableLogging = function () {
  console.log = function () {
  };
};
