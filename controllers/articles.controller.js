const { Op } = require("sequelize");
const { Articles, User, File } = require("../models");

const AppError = require("../utils/AppError");
const FileUploader = require("../utils/FileUploader");
const { getPagination, getPagingData } = require("../utils/utility");

async function createArticles(req, res, next) {
  const fileUploader = new FileUploader(
    "http://localhost:3001",
    "/uploads/images/thumbnail"
  );

  let saveFile;
  try {
    const { title, content } = req.body;

    saveFile = await fileUploader.saveFile(req.file);

    if (!saveFile.uuid) {
      throw new AppError(500, "Failed to upload file");
    }

    const data = {
      title,
      content,
      user_uuid: req.decoded.uuid,
      thumbnail_uuid: saveFile.uuid,
      view: 0,
    };

    const saveArticles = await Articles.create(data);

    if (!saveArticles) {
      throw new AppError(500, "Failed to create articles");
    }

    res.status(200).json({
      message: "Successfully create article!",
      data: saveArticles,
    });
  } catch (error) {
    const deleteFile = await fileUploader.deleteFile(saveFile.uuid);
    console.error(error);
    next(error);
  }
}

async function findArticles(req, res, next) {
  try {
    const {
      pageNumber = 1,
      pageSize = 10,
      title,
      content,
      userName,
      user_uuid,
      orderBy,
    } = req.query;

    const whereArticles = {};

    if (title) {
      whereArticles.title = { [Op.iLike]: `%${title}%` };
    }

    if (content) {
      whereArticles.content = { [Op.iLike]: `%${content}%` };
    }

    if (user_uuid) {
      whereArticles.user_uuid = user_uuid;
    }

    const whereUser = {};
    if (userName) {
      whereUser.name = { [Op.iLike]: `%${userName}%` };
    }

    let order = [["created_at", "DESC"]];

    if (orderBy instanceof Array && orderBy.length !== 0) {
      order = orderBy;
    }

    const { limit, offset } = getPagination(+pageNumber, +pageSize);

    const articles = await Articles.findAndCountAll({
      where: whereArticles,
      include: [
        {
          model: User,
          as: "user",
          where: whereUser,
          attributes: ["uuid", "name"],
        },
        {
          model: File,
          as: "thumbnail",
        },
      ],
      order,
      offset,
      limit,
    });

    const pagingData = getPagingData(articles, pageNumber, pageSize);

    res.status(200).json({
      message: "Successfully find articles!",
      data: { ...pagingData },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function getArticleById(req, res, next) {
  try {
    const { uuid } = req.params;

    if (!uuid) {
      throw new AppError(401, "Uuid must be filled!");
    }

    const article = await Articles.findByPk(uuid, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["uuid", "name"],
        },
        {
          model: File,
          as: "thumbnail",
        },
      ],
    });

    if (!article) {
      throw new AppError(404, "Article not found!");
    }

    res.status(200).json({
      message: "Successfully get article!",
      data: article,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = {
  createArticles,
  findArticles,
  getArticleById
};
