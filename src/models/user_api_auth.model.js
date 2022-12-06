const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const UserApiAuth = sequelize.define("user_api_auths", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true
        },
        user_id: {
            defaultValue: false,
            type: Sequelize.UUID,
            allowNull: false
        },
        key: {
            type: Sequelize.STRING,
            allowNull: false
        },
        uuid: {
            type: Sequelize.STRING,
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
        },
        expired_at: {
            type: Sequelize.DATE,
            allowNull: true
        }

    }, {
        freezeTableName: true
    });
    UserApiAuth.beforeCreate(uaa => uaa.id = uuidv4());

    return UserApiAuth;
};