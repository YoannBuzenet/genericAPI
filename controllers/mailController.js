const nodemailer = require("nodemailer");
const ejs = require("ejs");
const fs = require("fs");
const path = require("path");
var Bugsnag = require("@bugsnag/js");
const { translations } = require("../translations/translations");

function getTemplate(action, locale) {
  let template;
  switch (action) {
    case "userContactUsForm": {
      template =
        __basedir + "/mail_templates/" + locale + "/userContactUsForm.ejs";
      break;
    }
    default: {
      throw new Error("Could not find corresponding template.");
    }
  }
  return template;
}

function getMailTitle(action, locale) {
  let mailTitle;
  switch (action) {
    case "userContactUsForm": {
      mailTitle =
        translations[locale].mailTitle["contactForm.user.contactedUs"];
      break;
    }
    default: {
      throw new Error("Could not find corresponding mailTitle.");
    }
  }

  return mailTitle;
}

function buildTemplateData(action, params, locale) {
  console.log("in building template data, action is :", action);
  //each case of witch should verify the params it needs and throw an error
  let templateData;
  switch (action) {
    case "userContactUsForm": {
      //TO DO Yoann Add data form user contact form
      templateData = {};
      break;
    }
    default: {
      throw new Error(
        "Could not find corresponding action for building templateData."
      );
    }
  }
  return templateData;
}

async function sendEmail(
  action,
  idShop,
  shopMail,
  params = {},
  locale = "fr-FR"
) {
  // test if parameters are here
  if (!shopMail) {
    throw new Error("A parameter is missing in mail PDF function.");
  }

  // create translated mail title
  const mailTitle = getMailTitle(action, locale);

  //Find the right ejs template file
  const templatePath = getTemplate(action, locale);

  const templateData = buildTemplateData(action, params, locale);

  let htmlToSend;
  try {
    htmlToSend = await ejs.renderFile(templatePath, templateData, {
      async: true,
    });
  } catch (err) {
    Bugsnag.notify(new Error(err));
    console.log("error while sending mail", err);
  }

  console.log("html of the mail :", htmlToSend);

  let mailOpts = {
    from: process.env.MAIL_SENDING,
    to: shopMail,
    subject: mailTitle,
    html: htmlToSend,
    attachments: [],
  };

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_NODEMAILER,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASSWORD,
    },
  });

  try {
    const msgSent = await transport.sendMail(mailOpts);
    console.log("mail info", msgSent);
  } catch (e) {
    Bugsnag.notify(new Error(e));
    console.log("errro while sending the mail", e);
  }
}

module.exports = {
  sendEmail,
};
