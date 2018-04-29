var Sequelize = require('sequelize');

const sequelize = new Sequelize("dev", null, null, {
  host: "localhost",
  dialect: "sqlite",
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // SQLite only
  storage: "dev.db"
  // storage: ":memory:"

});

// load models
var models = [
  'User',
  'Robot'
];
models.forEach(function(model) {
  module.exports[model] = sequelize.import(__dirname + '/' + model);
  module.exports[model].sync();
});

// describe relationships
(function(m) {
  m.User.hasMany(m.Robot, {as: 'Robots', foreignKey: 'UserId'});
})(module.exports);

// export connection
module.exports.sequelize = sequelize;
