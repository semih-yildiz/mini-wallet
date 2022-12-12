const Sequelize = require("sequelize"),
    config = require('../config/config').getConfig();
const db = {};

// setting sequelize configuration
const sequelize = new Sequelize(config.mySqlDatabase, config.mySqlUser, config.mySqlPassword, {
    host: config.mySqlHost,
    port: config.mySqlPort,
    dialect: config.dialect,
    logging: false
});

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.role = require("./role.model.js")(sequelize, Sequelize);
db.userRole = require("./user_roles.model.js")(sequelize, Sequelize);
db.userApiAuth = require('./user_api_auth.model')(sequelize, Sequelize);
db.currency = require("./currency.model.js")(sequelize, Sequelize);
db.wallet = require("./wallet.model.js")(sequelize, Sequelize);
db.walletTransaction = require("./wallet_transaction.model.js")(sequelize, Sequelize);

db.role.belongsToMany(db.user, {
    through: "user_roles",
    foreignKey: "role_id",
    otherKey: "user_id"
});
db.user.belongsToMany(db.role, {
    through: "user_roles",
    foreignKey: "user_id",
    otherKey: "role_id"
});
db.userApiAuth.belongsTo(db.user, {
    foreignKey: 'user_id'
});
db.user.hasMany(db.userApiAuth, {
    foreignKey: "user_id",
    targetKey: "id"
});
db.wallet.belongsTo(db.currency, {
    foreignKey: 'currency_id'
});
db.currency.hasMany(db.wallet, {
    foreignKey: "currency_id",
    targetKey: "id"
});
db.wallet.belongsTo(db.user, {
    foreignKey: 'created_by'
});
db.user.hasMany(db.wallet, {
    foreignKey: "created_by",
    targetKey: "id"
});
db.walletTransaction.belongsTo(db.wallet, {
    foreignKey: 'wallet_id'
});
db.wallet.hasMany(db.walletTransaction, {
    foreignKey: "wallet_id",
    targetKey: "id"
});

module.exports = db;
