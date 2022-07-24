import request from "supertest";
import { Express } from "express-serve-static-core";

import cors from "cors";
import db from "../db/config";
import { ClientApp, Clinic, User } from "../models";
import { config } from "dotenv";
import createServer from "../utils/server";
import createSessionConfig from "../utils/session";
import clientAppRoutes from "../routes/client-app";
import clinicRoutes from "../routes/clinic";
import { OK, UNAUTHORIZED, FORBIDDEN } from "../http-status-code";

import { hashPassword } from "../utils";

config();

const PORT = parseInt(`${process.env.PORT}`) || 8001;
const isForProduction = process.env.NODE_ENV === "production" ? true : false;
const corsOptions = {
  origin: [`${process.env.FRONTEND_URL}`],
  credentials: true,
};

const FRONTEND_PWD = "Password123";
const FRONTEND_VER = "0.1";
const USER_EMAIL_1 = "test_duplication@email.com";
const USER_PWD_1 = "Tipahtertipu123!";

const clinicName = "Klinik A";
const clinicAddr = "No 123, Jalan Kesihatan, Taman Surian";
const clinicPostcode = "89001";
const email = "tipahtertipu@clinicmedivron.com.my";
let usrPassword = "";

let app: Express;

beforeAll(async () => {
  try {
    db.authenticate();

    await db.query("SET FOREIGN_KEY_CHECKS = 0"); // only for test!
    await ClientApp.sync({ force: true });
    await Clinic.sync({ force: true });
    await User.sync({ force: true });

    // Create dummy records
    let hashedPassword = await hashPassword(FRONTEND_PWD);
    await ClientApp.create({
      password: hashedPassword,
      version: FRONTEND_VER,
    });

    hashedPassword = await hashPassword(USER_PWD_1);
    await User.create({
      email: USER_EMAIL_1,
      password: hashedPassword,
    });

    app = await createServer();
    // cors must be placed here before session below, else fail!
    app.use(cors(corsOptions));
    if (isForProduction) app.set("trust proxy", 1);
    app.use(createSessionConfig({ db }));

    // routes - must be placed after configuring session!
    app.use("/", clientAppRoutes);
    app.use("/", clinicRoutes);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

afterAll(async () => {
  db.close();
});

describe("/register-clinic", () => {
  test("should return UNAUTHORIZED when no params", async () => {
    const res = await request(app).post(`/register-clinic`);
    expect(res.status).toEqual(UNAUTHORIZED);
  });
  test("should return 400 when client app password is incorrect", async () => {
    const res = await request(app).post(`/register-clinic`).send({
      password: "WronngPassword",
      name: clinicName,
      address: clinicAddr,
      postcode: clinicPostcode,
      email: email,
    });
    expect(res.status).toEqual(UNAUTHORIZED);
  });
  test("should return UNAUTHORIZED when user have same email ", async () => {
    const res = await request(app).post(`/register-clinic`).send({
      password: FRONTEND_PWD,
      name: clinicName,
      address: clinicAddr,
      postcode: clinicPostcode,
      email: USER_EMAIL_1, // duplicates!
    });
    expect(res.status).toEqual(OK); // OK because we want frontend to consume the message
    expect(res.body.message).toEqual(
      "Could not register because email is not unique"
    );
  });

  test("should return OK when ", async () => {
    const res = await request(app).post(`/register-clinic`).send({
      password: FRONTEND_PWD,
      name: clinicName,
      address: clinicAddr,
      postcode: clinicPostcode,
      email: email,
    });
    // console.log(res.body.result);
    expect(res.status).toEqual(OK);
    expect(res.body.message).toEqual(
      `Successfully registered. Email is sent to ${email}`
    );
    expect(res.body.result.clinic.name).toEqual(clinicName);
    expect(res.body.result.clinic.address).toEqual(clinicAddr);
    usrPassword = res.body.result.usrPassword;
    expect(res.body.result.userId).toBeGreaterThan(0);
  });
});

describe("/login-clinic-user", () => {
  test("return UNAUTHORIZED when no params", async () => {
    const res = await request(app).post(`/login-clinic-user`);
    expect(res.status).toEqual(UNAUTHORIZED);
  });
  test("return could not find user with dubious email", async () => {
    const res = await request(app).post(`/login-clinic-user`).send({
      password: FRONTEND_PWD,
      email: "dubious@email.com",
      usrPassword: usrPassword,
    });
    expect(res.status).toEqual(OK);
    expect(res.body.message).toEqual("Could not find user with the email");
  });
  test("return incorrect password", async () => {
    const res = await request(app).post(`/login-clinic-user`).send({
      password: FRONTEND_PWD,
      email: email,
      usrPassword: "wronguserpassword",
    });
    expect(res.status).toEqual(OK);
    expect(res.body.message).toEqual("Incorrect password");
  });
  test("return OK", async () => {
    const res = await request(app).post(`/login-clinic-user`).send({
      password: FRONTEND_PWD,
      email: email,
      usrPassword: usrPassword,
    });
    expect(res.status).toEqual(OK);
    expect(res.body.message).toEqual("Successfully logged in");
    expect(res.body.result.clinic.id).toBeGreaterThan(0);
    expect(res.body.result.clinic.name).toEqual(clinicName);
    expect(res.body.result.clinic.address).toEqual(clinicAddr);
    expect(res.body.result.clinic.postcode).toEqual(clinicPostcode);
    expect(res.body.result.user.id).toBeGreaterThan(0);
    expect(res.body.result.user.email).toEqual(email);
  });
});

describe("/update-clinic-user", () => {
  test("return UNAUTHORIZED when no params", async () => {
    const res = await request(app).put(`/update-clinic-user`);
    expect(res.status).toEqual(UNAUTHORIZED);
  });
  test("return OK when update user name", async () => {
    const res = await request(app).put(`/update-clinic-user`).send({
      password: FRONTEND_PWD,
      name: "Alberto Ensteino bin Haji Mambo",
      email: email,
      usrPassword: usrPassword,
    });
    expect(res.status).toEqual(OK);
    expect(res.body.result.user.name).toEqual(
      "Alberto Ensteino bin Haji Mambo"
    );
  });

  test("return OK when update user password", async () => {
    const res = await request(app).put(`/update-clinic-user`).send({
      password: FRONTEND_PWD,
      email: email,
      usrPassword: usrPassword,
      usrNewPassword: "NewPassword123$",
    });
    expect(res.status).toEqual(OK);
    expect(res.body.message).toEqual(
      "Successfully update user info and password"
    );

    // try login with the new password
    const resLogin = await request(app).post(`/login-clinic-user`).send({
      password: FRONTEND_PWD,
      email: email,
      usrPassword: "NewPassword123$",
    });

    expect(resLogin.status).toEqual(OK);
    expect(resLogin.body.message).toEqual("Successfully logged in");
  });
});
