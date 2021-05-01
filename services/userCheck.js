const db = require("../models/index");
const utils = require("../services/utils");

async function checkIfLogged(userId, hashedUserAccessToken, provider) {
  console.log("testing user log");

  // Param check
  if (
    userId === undefined ||
    hashedUserAccessToken === undefined ||
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

  const userData = await db.User.findOne({
    where: {
      [idNameInDB]: userId,
      [idTokenInDB]: hashedUserAccessToken,
    },
  });

  if (userData === null) {
    console.log("Data is null");
    return false;
  }

  // Getting UTC string
  const isLoggedUntilDB = userData?.dataValues?.isLoggedUntil;

  if (isLoggedUntilDB) {
    const dbDataIntoDate = new Date(isLoggedUntilDB);

    // Comparing dates from DB to see if user is still logged
    return dbDataIntoDate.getTime() > utils.getNowInUTC().getTime();
  } else {
    return false;
  }
}

const isUserSubscribed = (userIsSubscribedUntil) => {
  if (
    userIsSubscribedUntil === "" ||
    userIsSubscribedUntil === undefined ||
    userIsSubscribedUntil === null
  ) {
    return false;
  }

  const nowUTC = getTodayFromMidnightInUTC();
  const userSubscribeUTC = new Date(userIsSubscribedUntil);

  return userSubscribeUTC > nowUTC;
};

module.exports = { checkIfLogged, isUserSubscribed };
