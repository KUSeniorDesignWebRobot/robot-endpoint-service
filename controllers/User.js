const bCrypt = require("bcrypt-nodejs");
const models = require("../models");
const User = models.User;

module.exports = {
  createUser: function createUser(username, password) {
    let salt = bCrypt.genSaltSync();
    let hash = bCrypt.hashSync(password, salt);
    let myUser = User.build({username:username, password:hash, salt:salt});
    myUser.save();
    return myUser;
  },
  validPassword: function validPassword(user, password) {
    let hash = bCrypt.hashSync(password, user.salt);
    return user.password === hash;
  }
};
