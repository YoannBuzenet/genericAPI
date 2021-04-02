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

module.exports = { propCheckInObject, getNowInUTC, getStartOfTheDayInUTC };
