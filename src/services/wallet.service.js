const repo = require('./../repository/base.repository')
const { transactionStatus } = require('./../enum');

/**
 * @Description this function create transaction log
 * @Param       wallet_id
 * @Param       transaction_type
 * @Param       amount
 * @Param       status
 * @Returns     json
 * @Author      Semih Yıldız
 */
exports.createTransactionLog = async (wallet_id, transaction_type, amount, status) => {
    const transactionDetail = `${amount} amount ${transaction_type.toLowerCase() + ' ' + status.toLowerCase()}`
    return await repo.create(repo.models.walletTransaction, {
        wallet_id,
        transaction_type,
        detail: transactionDetail,
        status
    });
}

/**
 * @Description this function withdrawal and payment from wallet
 * @Param       id
 * @Param       amount
 * @Param       transaction_type
 * @Returns     json
 * @Author      Semih Yıldız
 */
exports.withdrawOrPayment = async (id, amount, transaction_type) => {
    const walletData = await repo.getById(repo.models.wallet, id, ["balance"])

    if (walletData.code == 200) {
        if (amount < walletData.data.balance) {
            const balance = walletData.data.balance - amount;
            const response = await repo.update(repo.models.wallet, { balance }, { id }, ['balance'])
            this.createTransactionLog(id, transaction_type, amount, response.code == 200 ? transactionStatus.SUCCESSFULL : transactionStatus.FAILED)
            return {
                status: response.status,
                message: response.code == 200 ? `${transaction_type}-SUCCESSFULLY` : `${transaction_type}-FAILED`,
                data: response.code == 200 ? { "balance": balance } : "",
                code: response.code
            };
        } else {
            this.createTransactionLog(id, transaction_type, amount, transactionStatus.FAILED)
            return {
                status: false,
                message: "INSUFFICIENT-BALANCE",
                code: 400
            };
        }
    } else {
        return {
            status: false,
            message: "WALLET-NOT-FOUND",
            code: 404
        };
    }
}