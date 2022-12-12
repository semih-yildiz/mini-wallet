//Import models
const db = require("../models");
const { randomBytes } = require('crypto');

exports.createUser = async (data) => {
    try {
        const result = await db.user.create(data);
        if (result) {
            return {
                status: true,
                message: 'USER-CREATED-SUCCESSFUL',
                code: 201,
                id: result.id
            }
        } else {
            return {
                status: false,
                message: 'UNEXPECTED-ERROR',
                code: 500
            }
        }
    } catch (err) {
        return {
            status: false,
            message: "INTERNAL-SERVER-ERROR",
            code: 500
        }
    }
}

exports.generateApiKey = async () => {
    const buffer = randomBytes(32);
    return buffer.toString('base64');
}