import bcrypt from "bcrypt";
import { ClientApp } from "../models/";

const FRONTEND_PWD = process.env.FRONTEND_PWD || "Thuleen123#";

const verifyPassword = (password1: string, password2: string) => {
  return bcrypt.compareSync(password1, password2);
};
export { verifyPassword };

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
