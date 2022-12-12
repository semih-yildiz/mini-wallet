const db = require("../models");

exports.models = {
    user: 'user',
    role: 'role',
    userRole: 'userRole',
    wallet: 'wallet',
    walletTransaction: 'walletTransaction',
    currency: 'currency',
    userApiAuth: 'userApiAuth'
}

exports.getModel = (model) => {
    return db[model];
}

/**
 * This function returns the desired columns of the active rows in the model
 * @param    {string}  model
 * @param    {Object}   filter
 * @param    {Array}   attributes
 * @param    {Array}   include
 * @param    {Array}   order
 * @param    {Object}  paranoid
 * @returns  {Object}
 * @author   Semih Yıldız
 */
exports.getAll = async (model, filter = {}, attributes = undefined, include = undefined, order = undefined, paranoid = undefined) => {
    try {
        const result = await db[model].findAll({
            where: filter,
            attributes,
            include,
            order,
            paranoid: paranoid
        })
        if (result && result.length) {
            return {
                status: true,
                data: result,
                code: 200
            }
        }
        return {
            status: true,
            data: [],
            message: 'NOT-FOUND',
            code: 404
        }
    } catch (error) {
        return {
            status: false,
            message: error.message,
            code: 500
        }
    }
}

/**
 * This function runs the given query
 * @param    {string}   query
 * @param    {Object}   replacements
 * @param               singleResult
 * @returns  {Object}
 * @author   Semih Yıldız
 */
exports.select = async (query, replacements, singleResult = false) => {
    try {
        const result = await db.sequelize.query(query,
            {
                raw: true,
                replacements,
                type: db.Sequelize.QueryTypes.SELECT,
            }
        )
        if (result.length > 0) {
            return {
                status: true,
                code: 200,
                data: singleResult ? result[0] : result
            };
        } else {
            return {
                status: true,
                message: "NOT-FOUND",
                code: 404,
                data: singleResult ? {} : []
            };
        }
    } catch (err) {
        return {
            status: false,
            message: err.message,
            code: 500
        };
    }
}

/**
 * This function returns the desired columns of the active rows in the model by id
 * @param    {string}   model
 * @param               id
 * @param    {Array}    attributes
 * @param               include
 * @returns  {Object}
 * @author   Semih Yıldız
 */
exports.getById = async (model, id, attributes = undefined, include = undefined) => {
    try {
        const result = await db[model].findOne({
            where: { id },
            attributes,
            include
        })
        if (result) {
            return {
                status: true,
                data: result,
                code: 200
            }
        } else {
            return {
                status: true,
                data: {},
                message: 'NOT-FOUND',
                code: 404
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message,
            code: 500
        }
    }
}

/**
 * This function returns the desired columns of the active rows in the model by filter
 * @param    {string}   model
 * @param               filter
 * @param    {Array}    attributes
 * @param               include
 * @param               paranoid
 * @returns  {Object}
 * @author   Semih Yıldız
 */
exports.getByFilter = async (model, filter, attributes = undefined, include = undefined, paranoid = undefined) => {
    try {
        const result = await db[model].findOne({
            where: filter,
            attributes,
            include,
            paranoid
        })
        if (result) {
            return {
                status: true,
                data: result,
                code: 200
            }
        } else {
            return {
                status: true,
                data: {},
                message: 'NOT-FOUND',
                code: 404
            }
        }
    } catch (error) {
        return {
            status: false,
            message: error.message,
            code: 500
        }
    }
}


/**
 * Get the number of data in the selected model based on the filter entered
 * @param    {string}  model
 * @param    {object}  filter
 * @returns  {Object}
 * @author   Semih Yıldız
 */
exports.getCountByFilter = async (model, filter) => {
    try {

        const count = await db[model].count({ where: filter })
        return {
            count,
            status: true
        }
    } catch (err) {
        // TODO loglama yapılacak.
        console.log('err => ', err)
        return {
            message: 'UNEXPECTED-ERROR',
            status: false
        }
    }

}

/**
 * Function that checks for any data
 * @param    {string}  model
 * @param    {object}  filter
 * @param    {object}  include
 * @returns  {boolean}
 * @author   Semih Yıldız
 */
exports.any = async (model, filter, include = undefined) => {
    try {
        const count = await db[model].count({ where: filter, include })
        return count > 0;
    } catch (err) {
        console.log(err);
        return false;
    }
}

/**
 * This function is used to save the desired data in the specified model. Bulk or single data can be added.
 * createType = bulkCreate, is used for bulk creation
 * @param    {string}   model
 * @param    {any}      data
 * @param               createType
 * @returns  {Object}
 * @author   Semih Yıldız
 */
exports.create = async (model, data, createType = 'create') => {
    try {
        const result = await db[model][createType](data);
        if (result) {
            return {
                status: true,
                message: 'SUCCESSFULLY-CREATED',
                code: 201,
                id: createType === 'create' ? result.id : null
            }
        } else {
            return {
                status: false,
                message: 'UNEXPECTED-ERROR',
                code: 500
            }
        }
    } catch (err) {
        console.log("err", err)
        // TODO loglama yapılacak.
        let message = err.message;
        let code = 500;
        if (message === 'Validation error') {
            message = 'VALIDATION-ERROR';
            code = 409;
        }
        return {
            status: false,
            message,
            code
        }
    }
}

/**
 * This function is used to update the desired data in the specified model.
 * @param    {string}   model
 * @param    {Object}   data
 * @param    {Object}   filter
 * @param               fields
 * @param               include
 * @param               paranoid
 * @returns  {Object}
 * @author   Semih Yıldız
 */
exports.update = async (model, data, filter, fields = undefined, include = undefined, paranoid = undefined) => {
    try {
        const result = await db[model].update(data, { where: filter, fields, include, paranoid });
        if (result < 1) {
            return {
                status: false,
                message: 'NOT-FOUND',
                code: 404
            }
        }
        return {
            status: true,
            message: 'SUCCESSFULLY-UPDATED',
            code: 200
        }
    } catch (err) {
        // TODO loglama yapılacak.
        let message = err.message;
        let code = 500;
        if (message === 'Validation error') {
            message = 'VALIDATION-ERROR';
            code = 409;
        }
        return {
            status: false,
            message,
            code
        }
    }
}


/**
 * This function delete row by id for selected model
 * @param    {string}  model
 * @param    {any}  id
 * @returns  {Object}
 * @author   Semih Yıldız
 */
exports.delete = async (model, filter) => {
    try {
        const result = await db[model].update({ deleted_at: new Date() }, {
            where: filter
        })
        if (result < 1) {
            return {
                status: false,
                message: 'NOT-FOUND',
                code: 404
            }
        }
        return {
            status: true,
            message: 'SUCCESSFULLY-DELETED',
            code: 200
        }
    } catch (error) {
        return {
            status: false,
            message: error.message,
            code: 500
        }
    }
}

/**
 * This function hard delete rows by filter for selected model
 * @param    {string}  model
 * @param    {Object}  filter
 * @returns  {Object}
 * @author   Semih Yıldız
 */
exports.destroy = async (model, filter) => {
    try {
        const result = await db[model].destroy({
            where: filter,
            force: true
        })
        if (result < 1) {
            return {
                status: false,
                message: 'NOT-FOUND',
                code: 404
            }
        }
        return {
            status: true,
            message: 'SUCCESSFULLY-DELETED',
            code: 200
        }
    } catch (error) {
        console.log("err", error)
        return {
            status: false,
            message: error.message,
            code: 500
        }
    }
}
