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

class ClientApp extends Model {
  declare id: CreationOptional<number>;
  declare password: CreationOptional<string>;
  declare version: CreationOptional<string>;

  // createdAt can be undefined during creation
  declare createdAt: CreationOptional<Date>;
  // updatedAt can be undefined during creation
  declare updatedAt: CreationOptional<Date>;
}

ClientApp.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    version: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    tableName: "clientapps",
    sequelize: db,
    paranoid: true,
  }
);

export default ClientApp;
