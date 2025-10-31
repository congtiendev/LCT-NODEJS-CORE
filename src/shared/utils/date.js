const moment = require('moment');

const formatDate = (date, format = 'YYYY-MM-DD') => {
  return moment(date).format(format);
};

const addDays = (date, days) => {
  return moment(date).add(days, 'days').toDate();
};

const subtractDays = (date, days) => {
  return moment(date).subtract(days, 'days').toDate();
};

const isAfter = (date1, date2) => {
  return moment(date1).isAfter(date2);
};

const isBefore = (date1, date2) => {
  return moment(date1).isBefore(date2);
};

const diffInDays = (date1, date2) => {
  return moment(date1).diff(moment(date2), 'days');
};

module.exports = {
  formatDate,
  addDays,
  subtractDays,
  isAfter,
  isBefore,
  diffInDays,
};
