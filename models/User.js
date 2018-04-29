const Sequelize = require("sequelize");
const bCrypt = require("bcrypt-nodejs");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      salt: DataTypes.STRING
    }
  );
};
