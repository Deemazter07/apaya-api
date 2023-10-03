const { User } = require("../models");

const { isPhoneFormat, isEmailFormat, formatPhoneNumber } = require("../utils/utility");
const AppError = require("../utils/AppError");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { ENV } = require("../utils/env");

async function authLogin(req, res, next) {
  try {
    const { emailPhone, password } = req.body

    let user;

    if (isEmailFormat(emailPhone)) {
      user = await User.findOne({ where: { email: emailPhone }})
    } else if (isPhoneFormat(emailPhone)) {
      user = await User.findOne({ where: { phone: formatPhoneNumber(emailPhone) }})
    } else {
      throw new AppError(401, "Invalid Email or Phone format")
    }

    if (!user) {
      throw new AppError(404, "User not found!")
    }

    const match = await bcrypt.compare(password, user.password);
    
    if (!match) {
      throw new AppError(401, "Invalid Password")
    }
    const token = jwt.sign(user.dataValues, ENV.SECRET_TOKEN)

    user = await user.update({ jwt: token })

    res.status(200).json({
      message: "Successfully Login User!",
      data: user,
    });
    
  } catch (error) {
    console.error(error);
    next(error)
  }
}

async function authMe(req, res, next) {
  try {
    const { uuid } = req.decoded
    const user = await User.findByPk(uuid)

    if (!user) {
      throw new AppError(404, "User not found!")
    }

    res.status(201).json({
      message: "Authentication Succesfully",
      data: user
    })

  } catch (error) {
    console.error(error);
    next(error)
  }
}

module.exports = {
  authLogin,
  authMe
}