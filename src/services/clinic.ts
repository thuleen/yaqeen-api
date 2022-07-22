import { Clinic, User } from "../models/";
import { hashPassword, ranPassword, isPasswordMatch } from "../utils";
import { notifyUserRegDone } from "./email";

const FRONTEND_CLINIC_URL = `${process.env.FRONTEND_CLINIC_URL} `;

export interface Register {
  name: string;
  address: string;
  postcode: string;
  email: string;
}

export interface Login {
  email: string;
  password: string;
}

const register = async (payload: Register) => {
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

  let nuClinic = await Clinic.create({
    name: name, //clinic name
    address: address,
    postcode: postcode,
  });

  const defaultPassword = ranPassword();
  const hashedPassword = await hashPassword(defaultPassword);
  let nuUser = await nuClinic.createUser();
  nuUser.password = hashedPassword;
  nuUser.email = email;
  await nuUser.save();

  // convert to plain JSON object
  nuUser = nuUser.toJSON();
  nuClinic = nuClinic.toJSON();

  await notifyUserRegDone({
    email: email,
    clinicName: name,
    defaultPassword: defaultPassword,
    url: FRONTEND_CLINIC_URL,
  });

  if (process.env.NODE_ENV === "test") {
    return {
      status: "OK",
      message: `Successfully registered. Email is sent to ${email}`,
      result: {
        clinic: nuClinic,
        usrPassword: defaultPassword,
        userId: nuUser.id,
      },
    };
  }
  return {
    status: "OK",
    message: `Successfully registered. Email is sent to ${email}`,
    result: { clinic: nuClinic, userId: nuUser.id },
  };
};
export { register };

const login = async (payload: Login) => {
  const { email, password } = payload;

  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    return {
      status: "Error",
      message: `Could not find user with the email`,
    };
  }

  const hashedPassword = user.password;
  if (!isPasswordMatch(password, hashedPassword)) {
    return {
      status: "Error",
      message: `Incorrect password`,
    };
  }

  const clinic = await Clinic.findOne({
    where: { id: user.ClinicId },
  });

  return {
    status: "OK",
    message: `Successfully logged in`,
    result: { clinic },
  };
};
export { login };
