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

module.exports = { propCheckInObject };
