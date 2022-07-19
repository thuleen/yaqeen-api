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
} from "sequelize";
import db from "../db/config";
import User from "./user";
import Sample from "./sample";

class Clinic extends Model {
  declare id: CreationOptional<number>;
  declare name: CreationOptional<string>;
  declare address: CreationOptional<string>;
  declare postcode: CreationOptional<string>;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;

  declare getUsers: HasManyGetAssociationsMixin<User>; // Note the null assertions!
  declare createUser: HasManyCreateAssociationMixin<User, "ClinicId">;

  declare Users?: NonAttribute<User[]>; // Note this is optional since it's only populated when explicitly requested in code

  declare getSamples: HasManyGetAssociationsMixin<Sample>; // Note the null assertions!
  declare createSample: HasManyCreateAssociationMixin<Sample, "ClinicId">;

  declare Samples?: NonAttribute<Sample[]>; // Note this is optional since it's only populated when explicitly requested in code
  declare static associations: {
    Users: Association<Clinic, User>;
    Samples: Association<Clinic, Sample>;
  };
}

Clinic.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    postcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "clinics",
    sequelize: db,
    paranoid: true,
  }
);

export default Clinic;
