const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const Wallet = sequelize.define("wallets", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        balance: {
            defaultValue: 0,
            type: Sequelize.INTEGER,
            allowNull: true
        },
        currency_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        created_by: {
            defaultValue: false,
            type: Sequelize.UUID,
            allowNull: false
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
            allowNull: false
        },
        deleted_at: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        freezeTableName: true
    });
    Wallet.beforeCreate(wallets => wallets.id = uuidv4());

    return Wallet;
};
