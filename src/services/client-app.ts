import bcrypt from "bcrypt";
import { ClientApp } from "../models/";
import { hashPassword } from "../utils";

const FRONTEND_PWD = process.env.FRONTEND_PWD || "Thuleen123#";

const verifyPassword = (password1: string, password2: string) => {
  return bcrypt.compareSync(password1, password2);
};
export { verifyPassword };

interface CreateClientApp {
  password: string;
  version: string;
}

// call to register an app
const create = async (payload: CreateClientApp) => {
  const { password, version } = payload;
  const client = await ClientApp.findOne({ where: { id: 1 } });
  if (client) {
    return {
      status: "Error",
      message: "A client app already exist",
    };
  }

  const hashedPassword = await hashPassword(password);

  const newapp = await ClientApp.create({
    password: hashedPassword,
    version: version,
  });

  return {
    status: "OK",
    message: "A client app is successfully created",
    result: newapp,
  };
};
export { create };

const login = async (password: string) => {
  const client = await ClientApp.findOne({
    where: { id: 1 },
  });
  if (!client) {
    return {
      status: "Error",
      message: "Could not logged in because no such record for the client app",
    };
  }
  if (!verifyPassword(password, client.password)) {
    return {
      status: "Error",
      message: "Could not logged in because wrong password",
    };
  }
  return { status: "OK", message: "Successfully logged in" };
};
export { login };
