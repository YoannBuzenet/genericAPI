const db = require("../models/index");
const crypto = require("crypto");

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("base64");
};

function checkIfLogged(userId, userAccessToken, provider) {
  // Param check
  if (
    userId === undefined ||
    userAccessToken === undefined ||
    provider === undefined
  ) {
    return false;
  }

  // There are several unique ID to define an user. We get the relevant column name here.
  let idNameInDB;
  if (provider === "google") {
    idNameInDB = "googleId";
  } else {
    throw "Provider not added in the check if logged function";
  }

  // There are several unique token to define an user access. We get the relevant column name here.
  let idTokenInDB;
  if (provider === "google") {
    idTokenInDB = "googleAccessToken";
  } else {
    throw "Provider not added in the check if logged function";
  }

  const userData = db.User.findOne({
    where: {
      [idNameInDB]: userId,
      [idTokenInDB]: hashPassword(userAccessToken),
    },
  });

  if (userData === null) {
    return false;
  }

  const isLoggedUntilDB = userData.dataValues.isLoggedUntil;
  if (isLoggedUntilDB) {
    const dbDataIntoDate = new Date(isLoggedUntilDB);
    // Comparing dates from DB to see if user is still logged
    return dbDataIntoDate.getTime() > new Date().getTime();
  } else {
    return false;
  }
}

module.exports = { checkIfLogged, hashPassword };
