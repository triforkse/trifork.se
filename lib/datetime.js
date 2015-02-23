var moment = require("moment");

module.exports.format = function (epoch_time) {
  return moment(epoch_time)
    .tz("Europe/Stockholm")
    .format("MMM Do, YYYY HH:mm");
};
