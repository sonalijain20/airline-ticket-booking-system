"use strict";

const jwt = require("jsonwebtoken");

module.exports = class AuthTokenMiddleware {
  static async decodeToken(req, res) {
    const accessToken = req.headers["authorization"];
    if (!accessToken) {
      return res.status(403).json({
        statusCode: 403,
        message: "Authorization token missing",
      });
    }
    try {
      const decoded = jwt.verify(
        accessToken.replace("Bearer ", ""),
        process.env.JWT_SECRET_KEY
      );
      console.log(decoded.userInfo);
      req.user = decoded.userInfo;
    } catch (error) {
      return res.status(401).json({
        statusCode: 401,
        message: "Unauthorized",
      });
    }
  }

  static async verifyPassenger(req, res, next) {
    await AuthTokenMiddleware.decodeToken(req, res);
    if (req.user.isAdmin) {
      return res.status(403).json({
        statusCode: 403,
        message: "Forbidden",
      });
    }
    next();
  }

  static async verifyAdmin(req, res, next) {
    await AuthTokenMiddleware.decodeToken(req, res);
    if (!req.user.isAdmin) {
      return res.status(403).json({
        statusCode: 403,
        message: "Forbidden",
      });
    }
    next();
  }
};
