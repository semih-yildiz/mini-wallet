const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const _ = require("lodash");
const db = require("../models");

exports.createToken = (payload, secretKey, expiresIn) =>
    jwt.sign(payload, secretKey, {
        expiresIn,
        audience: process.env.JWT_AUDIENCE,
        issuer: process.env.JWT_ISSUER
    });

exports.createTokens = (payload, refreshSecret) => {

    const token = exports.createToken(
        payload,
        process.env.JWT_SECRET_KEY,
        `${process.env.JWT_ACCESS_TOKEN_EXPIRES}`
    );
    const refreshToken = exports.createToken(
        payload,
        refreshSecret,
        `${process.env.JWT_REFRESH_TOKEN_EXPIRES}`
    );

    return [token, refreshToken];
};

exports.jwtVerifyToken = token => {
    return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            return err;
        }

        return user;
    });
}

exports.jwtVerifyRefreshToken = token => {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY, (err, user) => {
        if (err) {
            return err;
        }

        return user;
    });
}

exports.refreshToken = async (__rt, next) => {
    const decoded = jwt.decode(__rt);

    if (!decoded.id) {
        return res.status(401).json({
            status: false,
            message: "UNAUTHORIZE-PLEASE-LOGIN"
        });
    }

    const freshUser = await db.user.findByPk(decoded.id);

    if (!freshUser) {
        return res.status(401).json({
            status: false,
            message: "USER-DOES-NOT-EXIST"
        });
    }

    const refreshSecret = process.env.JWT_REFRESH_KEY + freshUser.toJSON().user_password;

    try {
        await promisify(jwt.verify)(__rt, refreshSecret);
    } catch (err) {
        return res.status(401).json({
            status: false,
            message: "REQUIRE-REFRESH-TOKEN"
        });
    }

    const [token, refreshToken] = exports.createTokens(
        _.pick(freshUser.toJSON(), ["id", "verified", "status", "role"]),
        refreshSecret
    );

    if (token && refreshToken) {
        return {
            accessToken: token,
            newRefreshToken: refreshToken
        };
    }
};
