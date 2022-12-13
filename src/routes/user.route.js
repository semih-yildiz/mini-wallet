const { Router } = require('express');
const userRouter = Router();
const userController = require('../controllers/user.controller');
const userMiddleware = require("../middlewares/user.middleware");
const { jwtProtect } = require("../middlewares/auth.middleware");

// Handle the add new user route
userRouter.post("/", userMiddleware.checkCreateUser, userController.createUser)
// Handle generate api key
userRouter.post("/api-key-generate", jwtProtect, userController.apiKeyGenerate);
// Handle get api key
userRouter.get("/api-key", jwtProtect, userController.getApiKey);

module.exports = userRouter;
