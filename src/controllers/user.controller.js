const userService = require('./../services/user.service')
const repo = require('./../repository/base.repository')

/**
 * @Description this function get Orders
 * @Param       req - http request
 * @Param       res - http response
 * @Returns     json
 * @Author      Semih Yıldız
 */
exports.createUser = async (req, res) => {
    const newUser = req.body;
    const response = await userService.createUser(newUser);
    res.status(response.code).json(response);
}

/**
 * @Description this function get api key
 * @Param       req - http request
 * @Param       res - http response
 * @Param       next
 * @Returns     json
 * @Author      Semih Yıldız 
 */
exports.getApiKey = async function (req, res) {
    const user_id = req.user.id;
    let response = await repo.getByFilter(repo.models.userApiAuth, { user_id });
    if (response.code === 200) {
        response["data"] = { apiKey: response.data.key }
    }
    res.status(response.code).json(response);
}

/**
 * @Description this function generate api key
 * @Param       req - http request
 * @Param       res - http response
 * @Param       next
 * @Returns     ...
 * @Author      Semih Yıldız
 */
exports.apiKeyGenerate = async function (req, res) {
    const user_id = req.user.id;

    const newApiKey = await userService.generateApiKey();
    await repo.destroy(repo.models.userApiAuth, { user_id });
    const responseCreate = await repo.create(repo.models.userApiAuth, {
        user_id,
        key: newApiKey
    });
    if (responseCreate.code === 201) {
        responseCreate["data"] = { apiKey: newApiKey }
    }
    res.status(responseCreate.code).json(responseCreate);
}
