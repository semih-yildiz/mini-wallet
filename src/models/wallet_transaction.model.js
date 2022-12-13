const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const WalletTransaction = sequelize.define("wallet_transactions", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        wallet_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        transaction_type: {
            type: Sequelize.ENUM,
            values: ['WITHDRAW', 'DEPOSIT']
        },
        detail: {
            type: Sequelize.STRING,
            allowNull: true
        },
        status: {
            type: Sequelize.ENUM,
            values: ['SUCCESSFULL', 'FAILED']
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        }
    }, {
        freezeTableName: true,
        updatedAt: false,
        deletedAt: false,
        createdAt: false
    });
    WalletTransaction.beforeCreate(walletTransaction => walletTransaction.id = uuidv4());

    return WalletTransaction;
}
