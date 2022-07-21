import request from "supertest";
import { Express } from "express-serve-static-core";

import cors from "cors";
import db from "../db/config";
import { ClientApp, Clinic, User, Sample } from "../models";
import { config } from "dotenv";
import createServer from "../utils/server";
import createSessionConfig from "../utils/session";
import sampleRoutes from "../routes/sample";
import { OK, UNAUTHORIZED, FORBIDDEN } from "../http-status-code";
import samplePhoto from "./photo";

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

let clinicId: number;
const clinicName = "Klinik A";
const clinicAddr = "No 123, Jalan Kesihatan, Taman Surian";
const clinicPostcode = "89001";
const email = "tipahtertipu@clinicmedivron.com.my";
let usrPassword = "";

let sampleId: number;
const tagNo = "123";
const testType = "Dengue/NS1Ag";
const patientName = "Najibozo Setan Bengap";
const patientMobileNo = "01344444444";
const patienIdType = "Nric";
const patientSocId = "512332235894574";

let app: Express;

beforeAll(async () => {
  try {
    db.authenticate();

    await db.query("SET FOREIGN_KEY_CHECKS = 0"); // only for test!
    await ClientApp.sync({ force: true });
    await Clinic.sync({ force: true });
    await User.sync({ force: true });
    await Sample.sync({ force: true });

    // Create dummy records
    let hashedPassword = await hashPassword(FRONTEND_PWD);
    await ClientApp.create({
      password: hashedPassword,
      version: FRONTEND_VER,
    });

    hashedPassword = await hashPassword(USER_PWD_1);
    // await User.create({
    //   email: USER_EMAIL_1,
    //   password: hashedPassword,
    // });
    const clinic = await Clinic.create({
      name: clinicName,
      address: clinicAddr,
      postcode: clinicPostcode,
    });
    clinicId = clinic.id;
    let user = await clinic.createUser();
    user.email = USER_EMAIL_1;
    user.password = hashedPassword;
    await user.save();

    app = await createServer();
    // cors must be placed here before session below, else fail!
    app.use(cors(corsOptions));
    if (isForProduction) app.set("trust proxy", 1);
    app.use(createSessionConfig({ db }));

    // routes - must be placed after configuring session!
    app.use("/", sampleRoutes);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

afterAll(async () => {
  db.close();
});

describe("/create-sample", () => {
  test("should return UNAUTHORIZED when no params", async () => {
    const res = await request(app).post(`/create-sample`);
    expect(res.status).toEqual(UNAUTHORIZED);
  });
  test("should return OK", async () => {
    const res = await request(app).post(`/create-sample`).send({
      password: FRONTEND_PWD,
      clinicId: clinicId,
      tagNo: tagNo,
      testType: testType,
      name: patientName,
      mobileNo: patientMobileNo,
      idType: patienIdType,
      socialId: patientSocId,
    });
    sampleId = res.body.result.sample.id;
    expect(res.status).toEqual(OK);
    expect(res.body.result.sample.tagNo).toEqual(tagNo);
  });
});

describe("/update-sample-photo", () => {
  test("should return UNAUTHORIZED when no params", async () => {
    const res = await request(app).put(`/update-sample-photo`);
    expect(res.status).toEqual(UNAUTHORIZED);
  });
  test("should return OK but could not fiind a sample record", async () => {
    const res = await request(app).put(`/update-sample-photo`).send({
      password: FRONTEND_PWD,
      id: 0, // <<-- non existent sample record id
      clinicId: clinicId,
      tagNo: tagNo,
      testType: testType,
      name: patientName,
      mobileNo: patientMobileNo,
      idType: patienIdType,
      socialId: patientSocId,
      photoUri: "todo",
    });
    expect(res.status).toEqual(OK);
    expect(res.body.message).toEqual("Could not find the sample record");
  });
  // test("should return OK", async () => {
  //   const res = await request(app)
  //     .put(`/update-sample-photo`)
  //     .send({
  //       password: FRONTEND_PWD,
  //       id: sampleId,
  //       clinicId: clinicId,
  //       tagNo: tagNo,
  //       testType: testType,
  //       name: "Updated " + patientName,
  //       mobileNo: "112" + patientMobileNo,
  //       idType: patienIdType === "Nric" ? "Passport" : "Nric",
  //       socialId: "007" + patientSocId,
  //       photoUri: samplePhoto,
  //     });
  //   expect(res.status).toEqual(OK);
  // });
});
