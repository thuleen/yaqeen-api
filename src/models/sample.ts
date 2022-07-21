import {
  Association,
  CreationOptional,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  InferAttributes,
  InferCreationAttributes,
  DataTypes,
  Model,
  NonAttribute,
  ForeignKey,
} from "sequelize";
import db from "../db/config";
import Clinic from "./clinic";

class Sample extends Model {
  declare id: CreationOptional<number>;
  declare testType: CreationOptional<string>;
  declare tagNo: CreationOptional<string>;
  declare pName: CreationOptional<string>;
  declare pMobileNo: CreationOptional<string>;
  declare pIdType: CreationOptional<string>;
  declare pSocId: CreationOptional<string>;
  declare samplePhotoDataUri: CreationOptional<Buffer>;
  declare pending: CreationOptional<boolean>;
  declare lastActiveStep: CreationOptional<number>;
  declare interpretAt: CreationOptional<Date>;
  declare photoTakenAt: CreationOptional<Date>;

  declare ClinicId: ForeignKey<Clinic["id"]>;
  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

Sample.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    testType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tagNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pMobileNo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pIdType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    pSocId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    samplePhotoDataUri: {
      type: DataTypes.BLOB("long"),
      allowNull: true,
    },
    pending: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    lastActiveStep: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    interpretAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    photoTakenAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "samples",
    sequelize: db,
    paranoid: true,
  }
);

export default Sample;
