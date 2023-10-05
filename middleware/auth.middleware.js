const { User } = require("../models");

const jwt = require("jsonwebtoken");
const { ENV } = require("../utils/env");
const AppError = require("../utils/AppError");

async function verifyJwtAuth(req, res, next) {
  try {
    const { authorization } = req.headers
    if (!authorization) {
      throw new AppError(401, "Unauthorized!")
    }
    const bearer = authorization.split(" ")
    const bearerToken = bearer[1]

    const decoded = jwt.verify(bearerToken, ENV.SECRET_TOKEN);
    
    const user = await User.findByPk(decoded.uuid)

    if (!user) {
      throw new AppError(404, "User not found!")
    }

    req.decoded = user.dataValues

    next()
  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = {
  verifyJwtAuth
}