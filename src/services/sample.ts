import { Clinic, Sample } from "../models/";
import { parseStrToDate } from "../utils";

export interface GetSamples {
  clinicId: string;
}

export interface CreateSample {
  lastActiveStep: number;
  clinicId: number;
  tagNo: string;
  testType: string;
  name: string;
  mobileNo: string;
  idType: string;
  socialId: string;
}

export interface UpdateSamplePatient extends CreateSample {
  id: number; // record id generated in the sample table
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
  const { lastActiveStep, clinicId, tagNo, testType } = payload;

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
    lastActiveStep: lastActiveStep,
    tagNo: tagNo,
    testType: testType,
  });
  // to remove sequelize decorators...
  sample = sample.get({ plain: true });

  return {
    status: "OK",
    message: "Successfully created sample",
    result: { sample: { ...sample } },
  };
};
export { create };

const updatePatient = async (payload: UpdateSamplePatient) => {
  const { id, lastActiveStep, clinicId, name, mobileNo, idType, socialId } =
    payload;

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
  sample.lastActiveStep = lastActiveStep;
  sample.name = name;
  sample.mobileNo = mobileNo;
  sample.idType = idType;
  sample.socialId = socialId;
  await sample.save();
  // to remove sequelize decorators...
  sample = sample.get({ plain: true });

  return {
    status: "OK",
    message: "Successfully update sample patient",
    result: { sample: { ...sample } },
  };
};
export { updatePatient };

const updatePhoto = async (payload: UpdateSamplePhoto) => {
  const {
    id,
    lastActiveStep,
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
  sample.lastActiveStep = lastActiveStep;
  sample.name = name;
  sample.mobileNo = mobileNo;
  sample.idType = idType;
  sample.socialId = socialId;
  sample.photoUri = Buffer.from(photoUri, "utf-8");
  sample.photoTakenAt = parseStrToDate(photoTakenAt);
  await sample.save();
  // to remove sequelize decorators...
  sample = sample.get({ plain: true });
  const strPhotoUri = sample?.photoUri.toString(); // convert Buffer to string

  return {
    status: "OK",
    message: "Successfully update sample photo",
    result: { sample: { ...sample, photoUri: strPhotoUri } },
  };
};
export { updatePhoto };

const updateResult = async (payload: any) => {
  let sample = await Sample.findOne({
    where: { id: payload.id },
  });
  if (!sample) {
    return {
      status: "Error",
      message: "Could not update because could not find the sample",
      result: { sample: null },
    };
  }
  sample.result = payload.result;
  await sample.save();
  sample = sample.get({ plain: true }); // return plain object when returns to client
  return {
    status: "OK",
    message: "Successfully update sample",
    result: { sample: sample },
  };
};
export { updateResult };

const getSamples = async (payload: GetSamples) => {
  const { clinicId } = payload;
  let samples = await Sample.findAll({
    where: {
      ClinicId: clinicId,
    },
  });
  let resultSamples = [];
  samples = samples.map((el) => el.get({ plain: true }));
  var len = samples.length;
  while (len--) {
    resultSamples.push({
      ...samples[len],
      photoUri: samples[len].photoUri?.toString(),
    });
  }

  return {
    status: "OK",
    result: {
      samples: resultSamples,
    },
  };
};
export { getSamples };
