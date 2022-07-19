import { Sample } from "../models/";

export interface CreateSample {
  clinicId: number;
  tagNo: string;
  testType: string;
  patientName: string;
  patientIdType: string;
  patientSocId: string;
}

const create = async (payload: CreateSample) => {
  const {
    clinicId,
    tagNo,
    testType,
    patientName,
    patientIdType,
    patientSocId,
  } = payload;

  // return {
  //   status: "Error",
  //   message: "Could not logged in because wrong password",
  // };
  return { status: "OK", message: "Successfully logged in" };
};
export { create };
