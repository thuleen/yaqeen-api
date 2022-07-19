import cors from "cors";
import db from "./db/config";
import { config } from "dotenv";
import clientAppRoutes from "./routes/client-app";
import clinicRoutes from "./routes/clinic";
import createServer from "./utils/server";
import createSessionConfig from "./utils/session";
config();

const PORT = parseInt(`${process.env.PORT}`) || 8001;
const isForProduction = process.env.NODE_ENV === "production" ? true : false;
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    `${process.env.FRONTEND_CLINIC_URL}`,
    `${process.env.FRONTEND_PATIENT_URL}`,
  ],
  credentials: true,
};

const app = createServer();
try {
  db.authenticate();
  console.log("DB connection has been established successfully.");
  // cors must be placed here before session below, else fail!
  app.use(cors(corsOptions));
  if (isForProduction) app.set("trust proxy", 1);
  app.use(createSessionConfig({ db }));
  // routes - must be placed after configuring session!
  app.use("/", clientAppRoutes);
  app.use("/", clinicRoutes);

  app.listen(PORT, () => {
    console.log("Server is running    : " + PORT);
  });
} catch (error) {
  console.error("Unable to connect to the database:", error);
}
