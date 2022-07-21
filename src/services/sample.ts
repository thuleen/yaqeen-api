import { Clinic, Sample } from "../models/";

export interface CreateSample {
  clinicId: number;
  tagNo: string;
  testType: string;
  name: string;
  mobileNo: string;
  idType: string;
  socialId: string;
}

const create = async (payload: CreateSample) => {
  const { clinicId, tagNo, testType, name, mobileNo, idType, socialId } =
    payload;

  const clinic = await Clinic.findOne({
    where: { id: clinicId },
  });

  if (!clinic) {
    return {
      status: "Error",
      message: "Could not find clinic record based on clinic id",
    };
  }

  let sample = await clinic.createSample({
    tagNo: tagNo,
    testType: testType,
    pName: name, // patient name
    pMobileNo: mobileNo,
    pIdType: idType,
    pSocId: socialId,
  });

  // return {
  //   status: "Error",
  //   message: "Could not logged in because wrong password",
  // };
  return {
    status: "OK",
    message: "Successfully created sample",
    result: { sample },
  };
};
export { create };
