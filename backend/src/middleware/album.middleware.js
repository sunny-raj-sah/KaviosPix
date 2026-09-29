const Album = require("../models/Album");

const requireAlbumOwner = async (req, res, next) => {
  try {
    const { albumId } = req.params;

    const album = await Album.findOne({
      albumId,
    });

    if (!album) {
      return res.status(404).json({
        success: false,
        message: "Album not found",
      });
    }

    if (album.ownerId !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: "Only the album owner can perform this action",
      });
    }

    req.album = album;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify album ownership",
      error: error.message,
    });
  }
};

module.exports = {
  requireAlbumOwner,
};