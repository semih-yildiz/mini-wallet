//Import models
const repo = require('./../repository/base.repository')
const { randomBytes } = require('crypto');

/**
 * @Description this function create user function
 * @Param       data
 * @Returns     json
 * @Author      Semih Yıldız
 */
exports.createCustomerUser = async (data) => {
    const userData = await repo.create(repo.models.user, data);
    if (userData.code == 201) {
        return await repo.create(repo.models.userRole, {
            user_id: userData.id,
            role_id: process.env.CUSTOMER_ROLE_ID
        });
    } else {
        return userData
    }
}

/**
 * @Description this function generate api key
 * @Returns     string
 * @Author      Semih Yıldız
 */
exports.generateApiKey = async () => {
    const buffer = randomBytes(32);
    return buffer.toString('base64');
}