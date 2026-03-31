const multer = require("multer");

const errorHandler = (error, req, res, next) => {
  if (!error) {
    return next();
  }

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "Uploaded file is too large.",
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid upload request",
    });
  }

  if (error.code === "UNSUPPORTED_FILE_TYPE") {
    return res.status(400).json({
      success: false,
      message: error.message || "Only image uploads are allowed",
    });
  }

  if (error.code === "UNSUPPORTED_CHAT_FILE_TYPE") {
    return res.status(400).json({
      success: false,
      message: error.message || "Only image or video uploads are allowed in chat",
    });
  }

  return next(error);
};

module.exports = errorHandler;
