var moment = require("moment");

module.exports.format = function (epoch_time) {
  return moment(epoch_time)
    .zone('+0100')
    .format("MMM Do, YYYY HH:mm");
};
