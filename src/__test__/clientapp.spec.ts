import request from "supertest";
import { Express } from "express-serve-static-core";

import cors from "cors";
import db from "../db/config";
import { ClientApp } from "../models";
import { config } from "dotenv";
import createServer from "../utils/server";
import createSessionConfig from "../utils/session";
import clientAppRoutes from "../routes/client-app";

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

let app: Express;

beforeAll(async () => {
  try {
    db.authenticate();

    // await db.models.ClientApp.sync({ force: true });
    const hashedPassword = await hashPassword(FRONTEND_PWD);
    await ClientApp.create({
      password: hashedPassword,
      version: FRONTEND_VER,
    });

    app = await createServer();
    // cors must be placed here before session below, else fail!
    app.use(cors(corsOptions));
    if (isForProduction) app.set("trust proxy", 1);
    app.use(createSessionConfig({ db }));

    // routes - must be placed after configuring session!
    app.use("/", clientAppRoutes);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});

afterAll(async () => {
  db.close();
});

describe("/login-client-app", () => {
  test("should return 400 when no params", async () => {
    const res = await request(app).post(`/login-client-app`);
    expect(res.status).toEqual(400);
  });
  test("should return 400 if wrong password", async () => {
    const res = await request(app).post("/login-client-app").send({
      password: "wrongpassword",
    });
    expect(res.status).toEqual(400);
  });
  test("should return 200 if credentials are met", async () => {
    const res = await request(app).post("/login-client-app").send({
      password: FRONTEND_PWD,
    });
    expect(res.status).toEqual(200);
  });
});
