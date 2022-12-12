const repo = require('./../repository/base.repository')
const { checkParameter } = require("./../helper/helper")

/**
 * @Description this function checks before adding user req parameter
 * @Param       req - http request
 * @Param       res - http response
 * @Param       next
 * @Returns     ...
 * @Author      Semih Yıldız
 */
exports.checkCreateWallet = async (req, res, next) => {
    const newWallet = req.body
    const requiredParams = ["name", "currency_id"]
    let validMessage = [];

    validMessage = checkParameter(newWallet, requiredParams)

    if (validMessage.length > 0) {
        res.status(400).json({
            status: false,
            message: validMessage
        });
    } else {
        let response = await repo.getByFilter(repo.models.wallet, { name: newWallet.name });

        if (response.code === 200) {
            res.status(400).json({
                status: false,
                message: "WALLET-NAME-ALREADY-EXIST"
            });
        } else {
            next();
        }
    }
}

/**
 * @Description this function checks the wallet before depositing
 * @Param       req - http request
 * @Param       res - http response
 * @Param       next
 * @Returns     ...
 * @Author      Semih Yıldız
 */
exports.checkDepositAndWithdraw = async (req, res, next) => {
    const deposit = req.body
    const { id } = req.params;
    let validMessage = [];

    if (!id) {
        res.status(400).json({
            status: false,
            message: "ID-IS-NOT-PROVIDED"
        });
    }
    validMessage = checkParameter(deposit, ["amount"])
    if (validMessage.length > 0) {
        res.status(400).json({
            status: false,
            message: validMessage
        });
    } else {
        next();
    }
}