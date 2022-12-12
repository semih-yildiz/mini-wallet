const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");
const { jwtVerifyToken } = require("../lib/generate-Token");

const Op = db.Sequelize.Op;

exports.checkSigninAuth = async (req, res, next) => {
    const { email, password } = req.body;

    const userRow = await db.user.findOne({
        where: {
            email
        },
        include: {
            model: db.role,
            attributes: ['id', 'name']
        }
    })

    if (!userRow || !password || !(bcrypt.compareSync(password, userRow.dataValues.password))) {

        return res.status(400).json({
            status: false,
            message: "INVALID-CREDENTIAL",
        });
    } else {
        req.user = userRow.toJSON();
        next();
    }
};


exports.checkRefreshToken = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({
            status: false,
            message: "REFRESH-TOKEN-IS-NOT-PROVIDED",
        });
    }
    const decoded = jwt.decode(refreshToken);
    if (decoded == null) {
        return res.status(401).json({
            status: false,
            message: "INVALID-TOKEN",
        });
    }
    const freshUser = await db.user.findByPk(decoded.id);
    if (!freshUser) {
        return res.status(401).json({
            status: false,
            message: "USER-NOT-FOUND",
        });
    }
    req.user = freshUser.toJSON();
    req.session_id = decoded.session_id;
    next();
};

/**
 * @Description this middleware function checks jwt authotization
 * @Param       req - http request
 * @Param       res - http response
 * @Param       next
 * @Returns     ...
 * @Author      Onur Döğücü
 */
exports.jwtProtect = (async (req, res, next) => {
    try {
        const authToken = req.headers['x-token'];
        // checks if authorization header param is exist
        if (!authToken) {
            // No token provided!
            return res.status(401).json({
                status: false,
                message: "TOKEN-IS-NOT-PROVIDED",
            });

        }

        const decoded = await jwtVerifyToken(authToken);

        if (decoded.hasOwnProperty('expiredAt')) {
            return res.status(401).json({
                status: false,
                message: "TOKEN-HAS-EXPIRED",
            });
        }

        if (!decoded.status) {
            return res.status(401).json({
                status: false,
                message: "ACCOUNT-HAS-BEEN-INACTIVATED",
            });
        }

        const freshUser = await db.user.findByPk(decoded.id);

        if (!freshUser) {
            return res.status(401).json({
                status: false,
                message: "USER-DOES-NOT-EXIST",
            });
        }

        req.user = freshUser.toJSON();
        req.session_id = decoded.session_id;
        next();
    } catch (err) {
        return res.status(500).json({
            status: false,
            message: "INTERNAL-SERVER-ERROR",
        });
    }
});