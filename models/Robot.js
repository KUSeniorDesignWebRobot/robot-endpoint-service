const Sequelize = require("sequelize");
const bCrypt = require("bcrypt-nodejs");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Robot", {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      RobotId: {
        type: DataTypes.UUID
      },
      UserId: {
        type: DataTypes.UUID
      },
      name: DataTypes.STRING
    }
  );
};
