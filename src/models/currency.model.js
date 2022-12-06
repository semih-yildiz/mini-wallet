const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const Currency = sequelize.define("currencies", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        updatedAt: false,
        deletedAt: false,
        createdAt: false
    });
    Currency.beforeCreate(currencies => currencies.id = uuidv4());

    return Currency;
}
