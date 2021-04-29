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
    case "subscription.canceled": {
      template =
        __basedir + "/mail_templates/" + locale + "/subscriptionCanceled.ejs";
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
    case "userContactUsForm": {
      mailTitle = translations[locale].mailTitle["subscription.canceled"];
      break;
    }
    default: {
      throw new Error("Could not find corresponding mailTitle.");
    }
  }

  return mailTitle;
}

// TO DO Yoann
// créer le chemin pour subscription.canceled

function buildTemplateData(action, params, locale) {
  // param for cancelation : userFirstName

  console.log("in building template data, action is :", action);
  //each case of witch should verify the params it needs and throw an error
  let templateData;
  switch (action) {
    case "userContactUsForm": {
      const { fullName, company, telephone, mail, message } = params;
      templateData = { fullName, company, telephone, mail, message };
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
  mailAdressDestination,
  params = {},
  locale = "fr-FR"
) {
  // test if parameters are here
  if (!mailAdressDestination) {
    throw new Error("Mail parameter is missing.");
  }

  if (locale === undefined || locale === null) {
    locale = "fr-FR";
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
    to: mailAdressDestination,
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
