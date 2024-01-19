const moment = require("moment");
module.exports.getDateAfterDays = (daysToAdd) => {
  try {
    const resultDate = new Date();
    resultDate.setDate(resultDate.getDate() + daysToAdd);
    return resultDate;
  } catch (err) {}
};
