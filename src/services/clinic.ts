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

const create = async (payload: Register) => {
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

  const nuClinic = await Clinic.create({
    name: name, //clinic name
    address: address,
    postcode: postcode,
  });
  const defaultPassword = ranPassword();
  const hashedPassword = await hashPassword(defaultPassword);
  // const nuUser = await User.create({
  //   name: "", // For now empty
  //   email: email,
  //   password: hashedPassword,
  //   ClinicId: nuClinic.id,,,
  // });
  let nuUser = await nuClinic.createUser();
  nuUser.password = hashedPassword;
  nuUser.email = email;
  await nuUser.save();

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
      result: { clinic: nuClinic, usrPassword: defaultPassword },
    };
  }
  return {
    status: "OK",
    message: `Successfully registered. Email is sent to ${email}`,
    result: { clinic: nuClinic },
  };
};
export { create };

const loginUsr = async (payload: Login) => {
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
export { loginUsr };
