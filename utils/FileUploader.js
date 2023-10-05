const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { File } = require("../models");

class FileUploader {
  constructor(storage, path) {
    this.storage = storage;
    this.path = path;
    this.directory = `${__dirname}/../`
  }

  async saveFile(file) {
    try {
      const { originalname, mimetype, buffer } = file;
      const uniqueFilename = `${uuidv4()}-${originalname}`;

      // Construct the full URL and path
      const url = this.storage + this.path + "/" + uniqueFilename;
      const filePath = path.join(
        this.directory,
        "public",
        this.path,
        uniqueFilename
      );

      // Create the directory if it doesn't exist
      const directoryPath = path.join(this.directory, "public", this.path);
      await fs.mkdir(directoryPath, { recursive: true });

      // Write the file to the server
      await fs.writeFile(filePath, buffer);

      const fileRecord = await File.create({
        name: uniqueFilename,
        mimetype,
        size: buffer.length,
        storage: this.storage,
        path: this.path + "/" + uniqueFilename,
      });

      return fileRecord;
    } catch (error) {
      console.error("Error saving file:", error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      const file = await File.findByPk(fileId);

      if (!file) {
        throw new Error("File not found");
      }

      const filePath = path.join(this.directory, "public", file.path);

      // Delete the file from the server
      await fs.unlink(filePath);

      // Delete the record from the database
      await file.destroy();

      console.log("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file:", error);
      throw error;
    }
  }
}

module.exports = FileUploader;
