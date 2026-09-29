const Album = require("../models/Album");

const requireAlbumAccess = async (req, res, next) => {
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

    const isOwner = album.ownerId === req.user.userId;

    const isSharedUser = album.sharedUsers.includes(
      req.user.email
    );

    if (!isOwner && !isSharedUser) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this album",
      });
    }

    req.album = album;
    req.isAlbumOwner = isOwner;

    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to verify album access",
      error: error.message,
    });
  }
};

module.exports = {
  requireAlbumAccess,
};