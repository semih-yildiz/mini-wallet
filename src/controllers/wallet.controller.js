const walletService = require('./../services/wallet.service')
const repo = require('./../repository/base.repository');
const { transactionType, transactionStatus } = require('./../enum');


/**
 * @Description this function create wallet
 * @Param       req - http request
 * @Param       res - http response
 * @Returns     json
 * @Author      Semih Yıldız
 */
exports.createWallet = async (req, res) => {
    const walletData = req.body;

    const response = await repo.create(repo.models.wallet, {
        name: walletData.name,
        currency_id: walletData.currency_id,
        created_by: req.user.id
    });
    res.status(response.code).json(response);
}

/**
 * @Description this function get wallet balance
 * @Param       req - http request
 * @Param       res - http response
 * @Returns     json
 * @Author      Semih Yıldız
 */
exports.getWalletBalance = async (req, res) => {
    const id = req.query.id;

    if (id) {
        const response = await repo.getById(repo.models.wallet, id, ["balance"])
        response.message = response.code == 200 ? "GET-BALANCE-SUCCESSFULLY" : "GET-BALANCE-FAILED"
        res.status(response.code).json(response);
    } else {
        res.status(400).json({
            status: false,
            message: "ID-IS-NOT-PROVIDED"
        });
    }
}

/**
 * @Description this function deposit money in wallet
 * @Param       req - http request
 * @Param       res - http response
 * @Returns     ordersData
 * @Author      Semih Yıldız
*/
exports.depositWallet = async (req, res) => {
    const { id } = req.params;
    const depositData = req.body

    const walletData = await repo.getById(repo.models.wallet, id, ["balance"])
    if (walletData.code == 200 || walletData.data?.balance) {
        const balance = walletData.data.balance + depositData.amount;
        const response = await repo.update(repo.models.wallet, { balance }, { id }, ['balance'])
        walletService.createTransactionLog(id, transactionType.DEPOSIT, depositData.amount, response.code == 200 ? transactionStatus.SUCCESSFULL : transactionStatus.FAILED)
        res.status(response.code).json({
            "status": response.status,
            "message": response.code == 200 ? "DEPOSIT-SUCCESSFULLY" : "DEPOSIT-FAILED",
            "data": response.code == 200 ? { "balance": balance } : ""
        });
    } else {
        res.status(404).json({
            status: false,
            message: "WALLET-NOT-FOUND"
        });
    }
}

/**
 * @Description this function withdraw money in wallet
 * @Param       req - http request
 * @Param       res - http response
 * @Returns     json
 * @Author      Semih Yıldız
*/
exports.withdrawWallet = async (req, res) => {
    const { id } = req.params;
    const depositData = req.body

    const response = await walletService.withdrawOrPayment(id, depositData.amount, transactionType.WITHDRAW)
    res.status(response.code).json(response);
}


/**
 * @Description this function get wallet statement
 * @Param       req - http request
 * @Param       res - http response
 * @Returns     json
 * @Author      Semih Yıldız
 */
exports.getWalletStatement = async (req, res) => {
    const id = req.query.id;

    if (id) {
        const response = await repo.getAll(repo.models.walletTransaction, { wallet_id: id }, ["transaction_type", "detail", "status", "created_at"], [], ["created_at"])
        response.message = response.code == 200 ? "GET-WALLET-STATEMENT-SUCCESSFULLY" : "GET-WALLET-STATEMENT-FAILED"
        res.status(response.code).json(response);
    } else {
        res.status(404).json({
            status: false,
            message: "ID-IS-NOT-PROVIDED"
        });
    }
}

/**
 * @Description this function get payment from wallet
 * @Param       req - http request
 * @Param       res - http response
 * @Returns     json
 * @Author      Semih Yıldız
 */
exports.paymentFromWallet = async (req, res) => {
    const { wallet_id, amount } = req.body

    const response = await walletService.withdrawOrPayment(wallet_id, amount, transactionType.PAYMENT)
    res.status(response.code).json(response);
}