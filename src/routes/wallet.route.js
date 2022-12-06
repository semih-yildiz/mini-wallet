const { Router } = require('express');
const walletRouter = Router();
const walletController = require('../controllers/wallet.controller');

walletRouter.get('/', walletController.getOrders)

module.exports = walletRouter;
