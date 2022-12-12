const { Router } = require('express');
const walletRouter = Router();
const walletController = require('../controllers/wallet.controller');
const walletMiddleware = require('../middlewares/wallet.middleware');
const { jwtProtect } = require("../middlewares/auth.middleware");
const { checkApiKey } = require("../middlewares/user.middleware");

// Handle add new wallet route
walletRouter.post('/', jwtProtect, walletMiddleware.checkCreateWallet, walletController.createWallet)
// Handle get account balance route
walletRouter.get('/balance', jwtProtect, walletController.getWalletBalance)
// Handle deposit money in wallet route
walletRouter.put('/:id/deposit', jwtProtect, walletMiddleware.checkDepositAndWithdraw, walletController.depositWallet)
// Handle withdraw money in wallet route
walletRouter.put('/:id/withdraw', jwtProtect, walletMiddleware.checkDepositAndWithdraw, walletController.withdrawWallet)
// Handle list my wallet history route
walletRouter.get('/statement', jwtProtect, walletController.getWalletStatement)
// Handle payment with API token route
walletRouter.post('/payment', checkApiKey, walletController.paymentFromWallet)

module.exports = walletRouter;
