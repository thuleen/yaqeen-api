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
let sampleToBeDeletedId: number;
const tagNo = "123";
const testType = "Dengue/NS1Ag";
const patientName = "Najibozo Setan Bengap";
const patientMobileNo = "01344444444";
const patientIdType = "Nric";
const patientSocId = "512332235894574";
const result =
  "c=true/igM=true/igG=false/cC=true/ns1Ag=true/Acute dengue infection, repeated dengue infection";

let app: Express;
let clinic;
Clinic;

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

    const clinic = await Clinic.create({
      name: clinicName,
      address: clinicAddr,
      postcode: clinicPostcode,
    });
    clinicId = clinic.id;
    let user = await clinic.createUser();
    user.email = USER_EMAIL_1;
    hashedPassword = await hashPassword(USER_PWD_1);
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
  const CREATE_SAMPLE_STEP = 0;
  test("should return UNAUTHORIZED when no params", async () => {
    const res = await request(app).post(`/create-sample`);
    expect(res.status).toEqual(UNAUTHORIZED);
  });
  test("should return OK", async () => {
    const res = await request(app).post(`/create-sample`).send({
      password: FRONTEND_PWD,
      lastActiveStep: CREATE_SAMPLE_STEP,
      clinicId: clinicId,
      tagNo: tagNo,
      testType: testType,
    });
    sampleId = res.body.result.sample.id;
    expect(res.status).toEqual(OK);
    expect(res.body.result.sample.tagNo).toEqual(tagNo);
    expect(res.body.result.sample.lastActiveStep).toEqual(CREATE_SAMPLE_STEP);

    const resDel = await request(app).post(`/create-sample`).send({
      password: FRONTEND_PWD,
      lastActiveStep: CREATE_SAMPLE_STEP,
      clinicId: clinicId,
      tagNo: "69",
      testType: testType,
    });
    sampleToBeDeletedId = resDel.body.result.sample.id;
  });
});

describe("/update-patient", () => {
  const UPDATE_SAMPLE_STEP = 1;
  test("should return UNAUTHORIZED when no params", async () => {
    const res = await request(app).put(`/update-patient`);
    expect(res.status).toEqual(UNAUTHORIZED);
  });
  test("should return OK", async () => {
    const res = await request(app).put(`/update-patient`).send({
      password: FRONTEND_PWD,
      id: sampleId,
      lastActiveStep: UPDATE_SAMPLE_STEP,
      clinicId: clinicId,
      name: patientName,
      mobileNo: patientMobileNo,
      idType: patientIdType,
      socialId: patientSocId,
    });
    expect(res.status).toEqual(OK);
    expect(res.body.result.sample.name).toEqual(patientName);
    expect(res.body.result.sample.lastActiveStep).toEqual(UPDATE_SAMPLE_STEP);
  });
});

describe("/update-photo", () => {
  const SAVE_PHOTO_STEP = 2;
  test("should return UNAUTHORIZED when no params", async () => {
    const res = await request(app).put(`/update-photo`);
    expect(res.status).toEqual(UNAUTHORIZED);
  });
  test("should return OK but could not fiind a sample record", async () => {
    const res = await request(app).put(`/update-photo`).send({
      password: FRONTEND_PWD,
      id: 0, // <<-- non existent sample record id
      lastActiveStep: SAVE_PHOTO_STEP,
      clinicId: clinicId,
      tagNo: tagNo,
      testType: testType,
      name: patientName,
      mobileNo: patientMobileNo,
      idType: patientIdType,
      socialId: patientSocId,
      photoUri: samplePhoto,
      photoTakenAt: "2022-07-22 08:07:47",
    });
    expect(res.status).toEqual(OK);
    expect(res.body.message).toEqual("Could not find the sample record");
    expect(res.body.result).toBeUndefined();
  });
  test("should return OK", async () => {
    const res = await request(app).put(`/update-photo`).send({
      password: FRONTEND_PWD,
      id: sampleId,
      lastActiveStep: SAVE_PHOTO_STEP,
      clinicId: clinicId,
      tagNo: tagNo,
      testType: testType,
      name: patientName,
      mobileNo: patientMobileNo,
      idType: patientIdType,
      socialId: patientSocId,
      photoUri: samplePhoto,
      photoTakenAt: "2022-07-22 08:07:47",
    });
    expect(res.status).toEqual(OK);
    expect(res.body.message).toEqual("Successfully update sample photo");
    expect(res.body.result.sample.lastActiveStep).toEqual(SAVE_PHOTO_STEP);
  });
});

describe("/update-result", () => {
  const FINAL_STEP = 3;
  test("should return UNAUTHORIZED when no params", async () => {
    const res = await request(app).put(`/update-result`);
    expect(res.status).toEqual(UNAUTHORIZED);
  });
  test("should return OK", async () => {
    const res = await request(app).put(`/update-result`).send({
      password: FRONTEND_PWD,
      id: sampleId,
      lastActiveStep: FINAL_STEP,
      clinicId: clinicId,
      result: result,
    });
    expect(res.status).toEqual(OK);
    expect(res.body.message).toEqual("Successfully update sample");
    expect(res.body.result.sample.result).toEqual(result);
  });
});

describe("/samples", () => {
  test("should return UNAUTHORIZED when no params", async () => {
    const res = await request(app).post(`/samples`);
    expect(res.status).toEqual(UNAUTHORIZED);
  });
  test("should return OK but wrong clinicId so no sample", async () => {
    const res = await request(app).post(`/samples`).send({
      password: FRONTEND_PWD,
      clinicId: 999,
    });
    expect(res.status).toEqual(OK);
    expect(res.body.result.samples.length).toEqual(0);
  });
  test("should return OK and samples", async () => {
    const res = await request(app).post(`/samples`).send({
      password: FRONTEND_PWD,
      clinicId: clinicId,
    });
    expect(res.status).toEqual(OK);
    expect(res.body.result.samples.length).toEqual(2); // includes a samples to be deleted
  });
});

describe("/delete a sample", () => {
  test("should return UNAUTHORIZED when no params", async () => {
    const res = await request(app).delete(`/sample`);
    expect(res.status).toEqual(UNAUTHORIZED);
  });
  test("should return OK", async () => {
    const res = await request(app).delete(`/sample`).send({
      password: FRONTEND_PWD,
      clinicId: clinicId,
      id: sampleToBeDeletedId,
    });
    expect(res.status).toEqual(OK);
    expect(res.body.result.samples.length).toEqual(1);
  });
});

describe("/get patient samples", () => {
  test("should return UNAUTHORIZED when no params", async () => {
    const res = await request(app).post(`/get-patient-samples`);
    expect(res.status).toEqual(UNAUTHORIZED);
  });
  test("should return OK but status Error with incorrect idType", async () => {
    const res = await request(app).post(`/get-patient-samples`).send({
      password: FRONTEND_PWD,
      idType: "Passport", // incorrect id type
      socialId: patientSocId,
    });
    expect(res.status).toEqual(OK);
    expect(res.body.result.samples).toBeNull();
  });
  test("should return OK", async () => {
    const res = await request(app).post(`/get-patient-samples`).send({
      password: FRONTEND_PWD,
      idType: patientIdType,
      socialId: patientSocId,
    });
    expect(res.status).toEqual(OK);
    expect(res.body.result.samples.length).toBeGreaterThan(0);
  });
});
