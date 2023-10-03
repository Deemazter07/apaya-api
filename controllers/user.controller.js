const { Op, where } = require("sequelize");
const { User } = require("../models");
const AppError = require("../utils/AppError");
const { formatPhoneNumber, isEmpty } = require("../utils/utility");
const bcrypt = require("bcrypt");

async function createUser(req, res, next) {
  try {
    const { name, phone, email, password } = req.body;

    if (!name) throw new AppError(401, "Name must be filled!");

    if (!phone && !email) {
      throw new AppError(401, "Phone or Email must be filled!");
    }

    if (!password) throw new AppError(401, "Password must be filled!");

    const hashedPassword = await bcrypt.hash(password, 12);
    if (!hashedPassword) throw new AppError(501, "Failed encrypting password");

    //  reformat phone number
    let phoneNumber = "";
    if (phone) {
      phoneNumber = formatPhoneNumber(phone);

      // * check exitisting user phone
      const findUserByPhone = await User.findOne({
        where: { phone: phoneNumber },
      });
      if (findUserByPhone) {
        throw new AppError(400, `User with phone ${phone} already exist`);
      }
    }

    if (email) {
      // * check exitisting user email
      const findUserByEmail = await User.findOne({ where: { email } });
      if (findUserByEmail) {
        throw new AppError(400, `User with email ${email} already exist`);
      }
    }

    const data = {
      name,
      phone: phone ? phoneNumber : null,
      email: email ? email : null,
      password: hashedPassword,
    };

    const createUser = await User.create(data);

    res.status(201).json({
      message: "Successfully Create User!",
      data: createUser,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function getUserById(req, res, next) {
  try {
    const { uuid } = req.params;

    const user = await User.findByPk(uuid);
    if (!user) {
      throw new AppError(404, `User not found`);
    }

    res.status(200).json({
      message: "Successfully Get User!",
      data: user,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const {
      name,
      phone,
      email,
      old_password,
      new_password,
      confirmation_password,
    } = req.body;
    const { uuid, password } = req.decoded;

    const updateData = { name };

    //  reformat phone number
    let phoneNumber = "";
    if (phone) {
      phoneNumber = formatPhoneNumber(phone);
      updateData.phone = phoneNumber;

      // * check exitisting user phone
      const findUserByPhone = await User.findOne({
        where: { uuid: { [Op.ne]: uuid }, phone: phoneNumber },
      });
      if (findUserByPhone) {
        throw new AppError(400, `User with phone ${phone} already exist`);
      }
    }

    if (email) {
      updateData.email = email;
      // * check exitisting user email
      const findUserByEmail = await User.findOne({
        where: { uuid: { [Op.ne]: uuid }, email },
      });
      if (findUserByEmail) {
        throw new AppError(400, `User with email ${email} already exist`);
      }
    }

    if (old_password) {
      const match = await bcrypt.compare(old_password, password);

      if (!match) {
        throw new AppError(400, "Old Password Not Match!");
      }

      if (!new_password) {
        throw new AppError(400, "New Password Must be filled!");
      }

      if (!confirmation_password) {
        throw new AppError(400, "Confirmation Password Must be filled!");
      }

      if (new_password !== confirmation_password) {
        throw new AppError(
          400,
          "New Password Not Match to Confirmation Password!"
        );
      }

      const hashedPassword = await bcrypt.hash(new_password, 12);
      if (!hashedPassword)
        throw new AppError(501, "Failed encrypting password");
      updateData.password = hashedPassword;
    }

    const updateUser = await User.update(updateData, { where: { uuid } });

    res.status(200).json({
      message: "Succesfully Update User!",
      data: updateUser,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
    next(error);
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
};
