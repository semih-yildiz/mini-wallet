const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        id: {
            type: Sequelize.UUID,
            primaryKey: true,
        },
        first_name: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 100],
                    msg: 'FIRST-NAME-LENGTH-VALIDATION-ERROR'
                }
            }
        },
        second_name: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        last_name: {
            type: Sequelize.STRING,
            validate: {
                len: {
                    args: [3, 100],
                    msg: 'LAST-NAME-LENGTH-VALIDATION-ERROR'
                }
            }
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                len: {
                    args: [3, 100],
                    msg: 'USER-PASSWORD-LENGTH-VALIDATION-ERROR'
                }
            }
        },
        email: {
            type: Sequelize.STRING,
            validate: {
                len: {
                    args: [3, 100],
                    msg: 'USER-EMAIL-LENGTH-VALIDATION-ERROR'
                }
            }
        },
        status: {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        email_verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false
        },
        created_at: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
        },
        updated_at: {
            type: Sequelize.DATE,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false
        },
        deleted_at: {
            type: Sequelize.DATE,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        hooks: {
            afterValidate: function (user) {
                if (user.password != null && user.password != '') {
                    user.password = bcrypt.hashSync(user.password, 8);
                }
            }
        }
    });
    User.beforeCreate(user => user.id = uuidv4());

    return User;
};
