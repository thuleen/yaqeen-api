import hbs from "nodemailer-express-handlebars";
import path from "path";
import nodemailer from "nodemailer";

const SMTP = process.env.SMTP;
const T_USER = process.env.TRANSPORTER_USER;
const T_PASS = process.env.TRANSPORTER_PASSWORD;
const EMAILER_EMAIL = process.env.EMAILER_EMAIL;

const hbsConfig = {
  viewEngine: {
    extName: ".hbs",
    partialsDir: path.join(__dirname, "../../email-handlebars"),
    layoutsDir: path.join(__dirname, "../../email-handlebars/"),
    defaultLayout: "",
  },
  viewPath: path.join(__dirname, "../../email-handlebars/"),
  extName: ".hbs",
};

const getTransport = () => {
  let transporter = nodemailer.createTransport({
    host: SMTP,
    pool: true,
    port: 2525,
    // secure: false, // true for 465, false for other ports
    secure: true, // thuleen.io
    auth: {
      user: T_USER, // generated ethereal user
      pass: T_PASS, // generated ethereal password
    },
  });

  return transporter;
};

export type EmailRegDone = {
  email?: string;
  clinicName?: string; // clinic name
  defaultPassword?: string;
  url: string;
};

const notifyUserRegDone = async (payload: EmailRegDone) => {
  const transporter = getTransport();
  const { email, clinicName, defaultPassword, url } = payload;
  const fs = "large";

  await transporter.use("compile", hbs(hbsConfig));
  const emailContent = {
    from: EMAILER_EMAIL,
    to: email,
    cc: [],
    subject: "Yaqeen - Successfully registered",
    template: "registration-complete",
    context: { clinicName, email, defaultPassword, url, fs },
  };
  await transporter.sendMail(emailContent).catch((error) => {
    console.log(error);
  });
};

export { notifyUserRegDone };
