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
const USER_EMAIL_1 = "tipahtertipu@gmail.com";
const USER_PWD_1 = "Tipahtertipu123!";

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
  test("should return 400 when no params", async () => {
    const res = await request(app).post(`/register-clinic`);
    expect(res.status).toEqual(400);
  });
  test("should return 400 when client app password is incorrect", async () => {
    const res = await request(app).post(`/register-clinic`).send({
      password: "WronngPassword",
      name: "Klinik Mediveron",
      address: "No 123, Jalan Kesihatan, Taman Surian",
      postcode: "89001",
      email: "tipahtertipu@clinicmedivron.com.my",
    });
    expect(res.status).toEqual(400);
  });
  test("should return 400 when user have same email ", async () => {
    const res = await request(app).post(`/register-clinic`).send({
      password: FRONTEND_PWD,
      name: "Klinik Mediveron",
      address: "No 123, Jalan Kesihatan, Taman Surian",
      postcode: "89001",
      email: USER_EMAIL_1,
    });
    expect(res.status).toEqual(400);
    expect(res.body.message).toEqual(
      "Could not register because email is not unique"
    );
  });

  test("should return 200 when ", async () => {
    const res = await request(app).post(`/register-clinic`).send({
      password: FRONTEND_PWD,
      name: "Klinik Mediveron",
      address: "No 123, Jalan Kesihatan, Taman Surian",
      postcode: "89001",
      email: "tipahtertipu@clinicmedivron.com.my",
    });
    // console.log(res.body);
    expect(res.status).toEqual(200);
    expect(res.body.message).toEqual("Successfully registered clinic");
  });
});
