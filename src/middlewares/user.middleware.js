//Import models
const db = require("../models");
const strongRegex = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\[\]<>=^{};':"\\|,/?~()_+-.`´])(?=.{8,})/
const { checkParameter } = require("./../helper/helper")
const repo = require('./../repository/base.repository')

/**
 * @Description this function checks before adding user req parameter
 * @Param       req - http request
 * @Param       res - http response
 * @Param       next
 * @Returns     ...
 * @Author      Semih Yıldız
 */
exports.checkCreateUser = async (req, res, next) => {
    const newUser = req.body
    const requiredParams = ["first_name", "last_name", "email", "password"]
    let validMessage = [];

    validMessage = checkParameter(req.body, requiredParams)

    if (validMessage.length > 0) {
        res.status(400).json({
            status: false,
            message: validMessage
        });
    } else {
        const response = await db.user.findOne({
            where: { email: newUser.email }
        })
        if (response) {
            res.status(400).json({
                status: false,
                message: "USER-ALREADY-REGISTERED"
            });
        } else {
            next();
        }
    }
}


/**
 * @description this function check webhook api key
 * @param       req - http request
 * @param       res - http response
 * @param       next
 * @returns     json
 * @author      Semih Yıldız
 */
exports.checkApiKey = async (req, res, next) => {
    const { api_key } = req.headers;
    if (!api_key) {
        return res.status(400).json({
            status: false,
            message: 'API-KEY-IS-NOT-PROVIDED'
        });
    }
    const response = await repo.getByFilter(repo.models.userApiAuth, { key: api_key });
    if (response.code !== 200) {
        return res.status(401).json({
            status: false,
            message: 'NOT-AUTHORIZED'
        });
    }
    next();
}
