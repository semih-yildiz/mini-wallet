const { Router } = require("express");
const authController = require("../controllers/auth.controller");
const { checkSigninAuth, checkRefreshToken } = require("../middlewares/auth.middleware");

const authRouter = Router();

// Handle user login route
authRouter.post("/login", checkSigninAuth, authController.login);

// Handle the request of new access token by using refresh token
authRouter.post("/refresh-token", checkRefreshToken, authController.refreshToken);

module.exports = authRouter;
