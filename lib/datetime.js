var moment = require("moment");

module.exports.format = function (epoch_time) {
  return moment(epoch_time)
    .utcOffset(60)
    .format("MMM Do, YYYY HH:mm");
};
