const path = require("path");
const result = require("dotenv").config({
  path: path.resolve(process.cwd(), "./.env.local"),
});
if (result.error) {
  throw result.error;
}
module.exports = {
  development: {
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PWD_DEV,
    database: process.env.DB_NAME_DEV,
    logging: false,
    host: process.env.DB_HOST_DEV,
    dialect: "mysql",
  },
  test: {
    username: "root",
    password: null,
    database: "database_generic_api_test",
    host: "127.0.0.1",
    dialect: "mysql",
  },
  production: {
    username: process.env.DB_USERNAME_PROD,
    password: process.env.DB_PWD_PROD,
    database: process.env.DB_NAME_PROD,
    host: process.env.DB_HOST_PRDOler ,
    dialect: "mysql",
  },
};
