const fs = require("fs/promises");

const Image = require("../models/Image");

const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required",
            });
        }

        const {
            tags,
            person,
            isFavorite,
        } = req.body;

        let parsedTags = [];

        if (tags) {
            if (typeof tags === "string") {
                parsedTags = tags
                    .split(",")
                    .map((tag) => tag.trim().toLowerCase())
                    .filter(Boolean);
            } else if (Array.isArray(tags)) {
                parsedTags = tags
                    .map((tag) => String(tag).trim().toLowerCase())
                    .filter(Boolean);
            }
        }

        let favorite = false;

        if (isFavorite !== undefined) {
            favorite =
                isFavorite === true ||
                isFavorite === "true";
        }

        const image = await Image.create({
            albumId: req.album.albumId,

            name: req.file.originalname,

            storageName: req.file.filename,

            storagePath: req.file.path,

            mimeType: req.file.mimetype,

            tags: parsedTags,

            person: person?.trim() || "",

            isFavorite: favorite,

            comments: [],

            size: req.file.size,

            uploadedAt: new Date(),
        });

        return res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            data: {
                imageId: image.imageId,
                albumId: image.albumId,
                name: image.name,
                tags: image.tags,
                person: image.person,
                isFavorite: image.isFavorite,
                comments: image.comments,
                size: image.size,
                uploadedAt: image.uploadedAt,

                file: {
                     storageName: image.storageName,
      mimeType: image.mimeType,
                },
            },
        });
    } catch (error) {
        if (req.file?.path) {
            try {
                await fs.unlink(req.file.path);
            } catch (cleanupError) {
                console.error(
                    "Failed to remove uploaded file:",
                    cleanupError.message
                );
            }
        }

        return res.status(500).json({
            success: false,
            message: "Failed to upload image",
            error: error.message,
        });
    }
};

 const getAlbumImages = async (req, res) => {
  try {
    const { tags } = req.query;

    const filter = {
      albumId: req.album.albumId,
    };

    if (tags) {
      const requestedTags = tags
        .split(",")
        .map((tag) => tag.trim().toLowerCase())
        .filter(Boolean);

      if (requestedTags.length > 0) {
        filter.tags = {
          $all: requestedTags,
        };
      }
    }

    const images = await Image.find(filter)
      .select("-storagePath")
      .sort({
        uploadedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: images.length,
      filters: {
        tags: tags || null,
      },
      data: images,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch album images",
      error: error.message,
    });
  }
};

const updateFavorite = async (req, res) => {
  try {
    const { isFavorite } = req.body;

    if (typeof isFavorite !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "isFavorite must be a boolean",
      });
    }

    req.image.isFavorite = isFavorite;

    await req.image.save();

    return res.status(200).json({
      success: true,
      message: isFavorite
        ? "Image added to favorites"
        : "Image removed from favorites",
      data: {
        imageId: req.image.imageId,
        albumId: req.image.albumId,
        isFavorite: req.image.isFavorite,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update favorite status",
      error: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { comment } = req.body;

    if (typeof comment !== "string") {
      return res.status(400).json({
        success: false,
        message: "Comment must be a string",
      });
    }

    const trimmedComment = comment.trim();

    if (!trimmedComment) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    if (trimmedComment.length > 500) {
      return res.status(400).json({
        success: false,
        message: "Comment must not exceed 500 characters",
      });
    }

    req.image.comments.push(trimmedComment);

    await req.image.save();

    return res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: {
        imageId: req.image.imageId,
        albumId: req.image.albumId,
        comments: req.image.comments,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add comment",
      error: error.message,
    });
  }
};

const getFavoriteImages = async (req, res) => {
  try {
    const images = await Image.find({
      albumId: req.album.albumId,
      isFavorite: true,
    })
      .select("-storagePath")
      .sort({
        uploadedAt: -1,
      });

    return res.status(200).json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch favorite images",
      error: error.message,
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const image = req.image;

    // Delete physical image file first
    try {
      await fs.unlink(image.storagePath);
    } catch (error) {
      // File may already be missing.
      // We still continue with database cleanup.
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    // Delete image document from MongoDB
    await image.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
      data: {
        imageId: image.imageId,
        albumId: image.albumId,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete image",
      error: error.message,
    });
  }
};


 const serveImage = async (req, res) => {
  try {
    const image = req.image;

    return res.sendFile(image.storagePath, (error) => {
      if (error && !res.headersSent) {
        return res.status(404).json({
          success: false,
          message: "Image file not found",
        });
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to serve image",
      error: error.message,
    });
  }
};
module.exports = {
    uploadImage,
    getAlbumImages,
     updateFavorite,
     addComment ,
     getFavoriteImages ,
       deleteImage,
        serveImage,
};