import { Clinic, User } from "../models/";

export interface RegisterClinic {
  name: string;
  address: string;
  postcode: string;
  email: string;
}

const register = async (payload: RegisterClinic) => {
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

  let clinicId = 123;
  return {
    status: "OK",
    message: "Successfully registered clinic",
    result: { clinicId },
  };
};
export { register };
