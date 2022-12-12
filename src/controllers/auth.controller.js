const jwt = require("jsonwebtoken");
const { createTokens, createToken } = require("../lib/generate-token");
const _ = require('lodash');
const { v4: uuidv4 } = require("uuid");

/**
 * @Description provides log in user to the system
 * @Param       req - http request
 * @Param       res - http response
 * @Returns     returns status of the log in process in json base format
 * @Author      Semih Yıldız
 */
exports.login = async (req, res) => {

    const refreshSecret = process.env.JWT_REFRESH_KEY; // 1
    const [token, refreshToken] = createTokens(
        //2
        {
            id: req.user.id,
            verified: req.user.verified,
            status: req.user.status,
            role: req.user.roles && req.user.roles.length && req.user.roles[0],
            session_id: uuidv4()
        },
        refreshSecret
    );
    const payload = { ...req.user, token, refreshToken };

    return res.status(200).json({
        status: true,
        message: "LOGIN-SUCCESSFULLY",
        payload: _.omit(payload, ["password"])
    });
};


/**
 * @Description provides generating New AuthToken From Refresh Token
 * @Param       req - http request
 * @Param       res - http response
 * @Returns     returns status of the generating new access token process in json base format
 * @Author      Semih Yıldız
 */
exports.refreshToken = (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) {
        return res.status(401).json({
            status: false,
            message: "REFRESH-TOKEN-IS-NOT-PROVIDED"
        });
    }

    //Verify token check
    jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
        if (!user) {
            return res.status(403).json({
                status: false,
                message: "TOKEN-IS-NOT-VERIFIED"
            });
        }
        if (err) {
            // Error Occurred
            return res.status(403).json({
                status: false,
                message: "ERROR-OCCURRED"
            });
        }

        //Generate new token
        //Generate refresh_token for 24 hours by using api_secret_key
        const [token, newRefreshToken] = createTokens(
            //2
            {
                id: req.user.id,
                verified: req.user.verified,
                status: req.user.status,
                role: req.user.role,
                session_id: req.session_id
            },
            process.env.JWT_REFRESH_KEY
        );

        const payload = { ...req.user, token, refreshToken: newRefreshToken };
        return res.status(200).json({
            status: true,
            message: "TOKEN-REFRESHED-SUCCESSFULLY",
            payload: _.omit(payload, ["user_password"])
        });
    });
}