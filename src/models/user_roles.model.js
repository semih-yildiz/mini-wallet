const User = require('./user.model');

module.exports = (sequelize, Sequelize) => {
    const UserRole = sequelize.define("user_roles", {
        user_id: {
            type: Sequelize.UUID,
            allowNull: false
        },
        role_id: {
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

    return UserRole;
};
