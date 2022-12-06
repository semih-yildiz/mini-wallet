const { Router } = require('express');
const walletRoute = require('./wallet.route');
const userRoute = require('./user.route');

const apiRouter = Router();

apiRouter.use('/api/v1/wallet', walletRoute);
apiRouter.use('/api/v1/user', userRoute);

module.exports = apiRouter;
