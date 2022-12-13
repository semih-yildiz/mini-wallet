const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const Role = sequelize.define("roles", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
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
        freezeTableName: true,
        updatedAt: false,
        deletedAt: false,
        createdAt: false
    });
    Role.beforeCreate(role => role.id = uuidv4());
    return Role;
};
