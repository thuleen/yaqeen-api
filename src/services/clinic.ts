import { Clinic, User } from "../models/";
import { hashPassword, ranPassword } from "../utils";
import { notifyUserRegDone } from "./email";

const FRONTEND_CLINIC_URL = `${process.env.FRONTEND_CLINIC_URL} `;

export interface RegisterClinic {
  name: string;
  address: string;
  postcode: string;
  email: string;
}

const create = async (payload: RegisterClinic) => {
  const { name, address, postcode, email } = payload;

  const userRecord = await User.findOne({
    where: { email: email },
  });

  if (userRecord) {
    return {
      status: "Error",
      message: "Could not register because email is not unique",
    };
  }

  const defaultPassword = ranPassword();
  const hashedPassword = await hashPassword(defaultPassword);
  const nuUser = await User.create({
    name: "", // For now empty
    email: email,
    password: hashedPassword,
  });
  const nuClinic = await Clinic.create({
    name: name, //clinic name
    address: address,
    postcode: postcode,
  });

  await notifyUserRegDone({
    email: email,
    clinicName: name,
    defaultPassword: defaultPassword,
    url: FRONTEND_CLINIC_URL,
  });

  return {
    status: "OK",
    message: "Successfully registered a clinic",
    result: { clinic: nuClinic },
  };
};
export { create };
