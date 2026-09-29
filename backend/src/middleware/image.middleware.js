const Image = require("../models/Image");

const requireImageInAlbum = async (req, res, next) => {
  try {
    const { imageId } = req.params;

    const image = await Image.findOne({
      imageId,
    });

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    if (image.albumId !== req.album.albumId) {
      return res.status(404).json({
        success: false,
        message: "Image not found in this album",
      });
    }

    req.image = image;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify image",
      error: error.message,
    });
  }
};

module.exports = {
  requireImageInAlbum,
};