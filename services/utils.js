const propCheckInObject = (arrayOfProps, object) => {
  if (!Array.isArray(arrayOfProps)) {
    throw "Argument received in utils function is not an array.";
  }

  let isValid = true;
  const objectPropsName = Object.keys(object);

  // loop sur l'array et check la présence de la data

  for (let i = 0; i < arrayOfProps.length; i++) {
    if (!objectPropsName.includes(arrayOfProps[i])) {
      isValid = false;
    }
  }

  return isValid;
};

const getNowInUTC = () => {
  var date = new Date();
  var now_utc = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );

  return new Date(now_utc);
};

const getStartOfTheDayInUTC = () => {
  var start = new Date();
  start.setHours(0, 0, 0, 0);

  var startOfTheDayUTC = Date.UTC(
    start.getUTCFullYear(),
    start.getUTCMonth(),
    start.getUTCDate(),
    start.getUTCHours(),
    start.getUTCMinutes(),
    start.getUTCSeconds()
  );

  return new Date(startOfTheDayUTC);
};

const getDays7DaysFromNowInUTC = () => {
  var date = new Date();
  date.setDate(date.getDate() - 7);

  var date7daysFromNowUTC = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );

  return new Date(date7daysFromNowUTC);
};

const getDate1MonthFromNowInUTC = () => {
  var date = new Date();
  date.setMonth(date.getMonth() - 1);

  var date1MonthFromNowUTC = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );

  return new Date(date1MonthFromNowUTC);
};

const getStartDateOfCurrentMonthInUTC = () => {
  var date = new Date(),
    y = date.getFullYear(),
    m = date.getMonth();
  var firstDay = new Date(y, m, 1);

  var dateStartOfCurrentMonthUTC = Date.UTC(
    firstDay.getUTCFullYear(),
    firstDay.getUTCMonth(),
    firstDay.getUTCDate(),
    firstDay.getUTCHours(),
    firstDay.getUTCMinutes(),
    firstDay.getUTCSeconds()
  );

  return new Date(dateStartOfCurrentMonthUTC);
};
const getLastDateOfMonthInUTC = (month) => {
  const ajudstedMonth = month - 1;

  var date = new Date(),
    y = date.getFullYear();
  var lastDay = new Date(date.getFullYear(), ajudstedMonth + 1, 0);

  var dateLastDayOfMonthUTC = Date.UTC(
    lastDay.getUTCFullYear(),
    lastDay.getUTCMonth(),
    lastDay.getUTCDate(),
    lastDay.getUTCHours(),
    lastDay.getUTCMinutes(),
    lastDay.getUTCSeconds()
  );

  return new Date(dateLastDayOfMonthUTC);
};

const getStartDateMonthInUTC = (month) => {
  const ajudstedMonth = month - 1;

  var date = new Date(),
    y = date.getFullYear();
  var firstDay = new Date(y, ajudstedMonth, 1);

  var dateStartOfthisMonthUTC = Date.UTC(
    firstDay.getUTCFullYear(),
    firstDay.getUTCMonth(),
    firstDay.getUTCDate(),
    firstDay.getUTCHours(),
    firstDay.getUTCMinutes(),
    firstDay.getUTCSeconds()
  );

  return new Date(dateStartOfthisMonthUTC);
};

const formatNumberToTwoDigit = (number) => {
  let finalNumber = number;
  const stringifiedNumber = number + "";
  if (stringifiedNumber.length === 1) {
    finalNumber = "0" + stringifiedNumber;
  }
  return finalNumber;
};

const getTodayinDATEONLYInUTC = () => {
  var date = new Date();

  var now_DATEONLY =
    "" +
    date.getUTCFullYear() +
    "-" +
    formatNumberToTwoDigit(date.getUTCMonth() + 1) +
    "-" +
    formatNumberToTwoDigit(date.getUTCDate());

  return now_DATEONLY;
};

const countWordsInString = (string) => {
  return string.split(" ").length;
};

const removeUnfinishedSentenceInString = (string) => {
  let newString = string;
  if (string.length === 0) {
    return string;
  }
  if (newString[newString.length - 1] === undefined) {
    return string;
  }

  const regexpPunctuation = /[.!?\\]/;

  while (
    newString[newString.length - 1] !== undefined &&
    !Array.isArray(newString[newString.length - 1].match(regexpPunctuation))
  ) {
    newString = newString.slice(0, -1);
  }

  return newString;
};

const getOneMonthFutureFromNowUTC = () => {
  var date = new Date();
  date.setMonth(date.getMonth() + 1);

  var dateInOneMonthMonthUTC = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );

  return new Date(dateInOneMonthMonthUTC);
};

const get12MonthsFutureFromNowUTC = () => {
  var date = new Date();
  date.setMonth(date.getMonth() + 12);

  var dateIn12MonthMonthUTC = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );

  return new Date(dateIn12MonthMonthUTC);
};

const get1200MonthsFutureFromNowUTC = () => {
  var date = new Date();
  date.setMonth(date.getMonth() + 1200);

  var dateIn1200MonthMonthUTC = Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  );

  return new Date(dateIn1200MonthMonthUTC);
};

const getCurrentMonthUTC = () => {
  var date = new Date();
  return date.getUTCMonth();
};

module.exports = {
  propCheckInObject,
  getNowInUTC,
  getStartOfTheDayInUTC,
  getDays7DaysFromNowInUTC,
  getDate1MonthFromNowInUTC,
  getStartDateOfCurrentMonthInUTC,
  getStartDateMonthInUTC,
  getLastDateOfMonthInUTC,
  getTodayinDATEONLYInUTC,
  formatNumberToTwoDigit,
  countWordsInString,
  removeUnfinishedSentenceInString,
  getOneMonthFutureFromNowUTC,
  get12MonthsFutureFromNowUTC,
  get1200MonthsFutureFromNowUTC,
  getCurrentMonthUTC,
};
