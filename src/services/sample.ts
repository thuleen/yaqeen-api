import { Clinic, Sample } from "../models/";
import { parseStrToDate } from "../utils"

export interface CreateSample {
  clinicId: number;
  tagNo: string;
  testType: string;
  name: string;
  mobileNo: string;
  idType: string;
  socialId: string;
}

export interface UpdateSamplePhoto extends CreateSample {
  id: number; // record id generated in the sample table
  photoUri: string;
  photoTakenAt: string;
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

  return {
    status: "OK",
    message: "Successfully created sample",
    result: { sample },
  };
};
export { create };

const updatePhoto = async (payload: UpdateSamplePhoto) => {
  const {
    id,
    clinicId,
    tagNo,
    testType,
    name,
    mobileNo,
    idType,
    socialId,
    photoUri,
    photoTakenAt,
  } = payload;

  let sample = await Sample.findOne({
    where: {
      id: id,
      ClinicId: clinicId,
    },
  });
  if (!sample) {
    return {
      status: "Error",
      message: "Could not find the sample record",
    };
  }
  //only update 5 properties...
  sample.pName = name;
  sample.pMobileNo = mobileNo;
  sample.pIdType = idType;
  sample.pSocId = socialId;
  sample.photoUri = Buffer.from(photoUri, "utf-8");
  sample.photoTakenAt = parseStrToDate(photoTakenAt);
  await sample.save();

  return {
    status: "OK",
    message: "Successfully update sample photo",
    result: {
      sample: {
        photoUri: photoUri,
        id: sample.id,
        clinicId: sample.ClinicId,
        tagNo: sample.tagNo,
        testType: sample.testType,
        name: sample.pName,
        mobileNo: sample.pMobileNo,
        idType: sample.pIdType,
        socialId: sample.pSocId,
        photoTakenAt: photoTakenAt,
      },
    },
  };
};
export { updatePhoto };
