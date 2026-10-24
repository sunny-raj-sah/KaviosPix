const fs = require("fs/promises");

const path = require("path");
const sharp = require("sharp");

const Image = require("../models/Image");

// const uploadImage = async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Image file is required",
//             });
//         }

//         const {
//             tags,
//             person,
//             isFavorite,
//         } = req.body;

//         let parsedTags = [];

//         if (tags) {
//             if (typeof tags === "string") {
//                 parsedTags = tags
//                     .split(",")
//                     .map((tag) => tag.trim().toLowerCase())
//                     .filter(Boolean);
//             } else if (Array.isArray(tags)) {
//                 parsedTags = tags
//                     .map((tag) => String(tag).trim().toLowerCase())
//                     .filter(Boolean);
//             }
//         }

//         let favorite = false;

//         if (isFavorite !== undefined) {
//             favorite =
//                 isFavorite === true ||
//                 isFavorite === "true";
//         }

//         const image = await Image.create({
//             albumId: req.album.albumId,

//             name: req.file.originalname,

//             storageName: req.file.filename,

//             storagePath: req.file.path,

//             mimeType: req.file.mimetype,

//             tags: parsedTags,

//             person: person?.trim() || "",

//             isFavorite: favorite,

//             comments: [],

//             size: req.file.size,

//             uploadedAt: new Date(),
//         });

//         return res.status(201).json({
//             success: true,
//             message: "Image uploaded successfully",
//             data: {
//                 imageId: image.imageId,
//                 albumId: image.albumId,
//                 name: image.name,
//                 tags: image.tags,
//                 person: image.person,
//                 isFavorite: image.isFavorite,
//                 comments: image.comments,
//                 size: image.size,
//                 uploadedAt: image.uploadedAt,

//                 file: {
//                      storageName: image.storageName,
//       mimeType: image.mimeType,
//                 },
//             },
//         });
//     } catch (error) {
//         if (req.file?.path) {
//             try {
//                 await fs.unlink(req.file.path);
//             } catch (cleanupError) {
//                 console.error(
//                     "Failed to remove uploaded file:",
//                     cleanupError.message
//                 );
//             }
//         }

//         return res.status(500).json({
//             success: false,
//             message: "Failed to upload image",
//             error: error.message,
//         });
//     }
// };


const uploadImage = async (req, res) => {
  let thumbnailPath;

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

    // Parse tags.
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

    // Parse favorite status.
    let favorite = false;

    if (isFavorite !== undefined) {
      favorite =
        isFavorite === true ||
        isFavorite === "true";
    }

    // Create the thumbnail directory.
    const uploadDir = path.dirname(req.file.path);

    const thumbnailDir = path.join(
      uploadDir,
      "thumbnails"
    );

    await fs.mkdir(thumbnailDir, {
      recursive: true,
    });

    // Generate a unique thumbnail filename based
    // on the filename created by Multer.
    const thumbnailName =
      `${path.parse(req.file.filename).name}.webp`;

    thumbnailPath = path.join(
      thumbnailDir,
      thumbnailName
    );

    // Generate an optimized WebP thumbnail.
    await sharp(req.file.path)
      .rotate()
      .resize({
        width: 400,
        height: 400,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 72,
      })
      .toFile(thumbnailPath);

    // Save the existing image metadata.
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
    // Remove the thumbnail if upload processing fails.
    if (thumbnailPath) {
      try {
        await fs.unlink(thumbnailPath);
      } catch (cleanupError) {
        if (cleanupError.code !== "ENOENT") {
          console.error(
            "Failed to remove thumbnail:",
            cleanupError.message
          );
        }
      }
    }

    // Remove the uploaded original file.
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

    console.error("Image upload failed:", error);

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

// const deleteImage = async (req, res) => {
//   try {
//     const image = req.image;

//     // Delete physical image file first
//     try {
//       await fs.unlink(image.storagePath);
//     } catch (error) {
//       // File may already be missing.
//       // We still continue with database cleanup.
//       if (error.code !== "ENOENT") {
//         throw error;
//       }
//     }

//     // Delete image document from MongoDB
//     await image.deleteOne();

//     return res.status(200).json({
//       success: true,
//       message: "Image deleted successfully",
//       data: {
//         imageId: image.imageId,
//         albumId: image.albumId,
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Failed to delete image",
//       error: error.message,
//     });
//   }
// };


const deleteImage = async (req, res) => {
  try {
    const image = req.image;

    // Delete the original image file.
    try {
      await fs.unlink(image.storagePath);
    } catch (error) {
      // Continue if the original file is already missing.
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    // Build the thumbnail path.
    const thumbnailPath = path.join(
      path.dirname(image.storagePath),
      "thumbnails",
      `${path.parse(image.storageName).name}.webp`,
    );

    // Delete the thumbnail file.
    try {
      await fs.unlink(thumbnailPath);
    } catch (error) {
      // Continue if the thumbnail is already missing.
      if (error.code !== "ENOENT") {
        throw error;
      }
    }

    // Delete the image document from MongoDB.
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

 const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const commentIndex = Number(commentId);

    if (
      !Number.isInteger(commentIndex) ||
      commentIndex < 0 ||
      commentIndex >= req.image.comments.length
    ) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    req.image.comments.splice(commentIndex, 1);

    await req.image.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
      data: {
        imageId: req.image.imageId,
        albumId: req.image.albumId,
        comments: req.image.comments,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete comment",
      error: error.message,
    });
  }
};


const serveImageThumbnail = async (req, res) => {
  try {
    const image = req.image;

    // Build the thumbnail path from the original image path.
    const thumbnailDir = path.join(
      path.dirname(image.storagePath),
      "thumbnails",
    );

    const thumbnailName =
      `${path.parse(image.storageName).name}.webp`;

    const thumbnailPath = path.join(
      thumbnailDir,
      thumbnailName,
    );

    // Support older images uploaded before thumbnails existed.
    try {
      await fs.access(thumbnailPath);
    } catch (error) {
      if (error.code !== "ENOENT") {
        throw error;
      }

      // Generate the missing thumbnail from the original.
      await fs.mkdir(thumbnailDir, { recursive: true });

      await sharp(image.storagePath)
        .rotate()
        .resize({
          width: 400,
          height: 400,
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: 72 })
        .toFile(thumbnailPath);
    }

    return res.type("image/webp").sendFile(
      thumbnailPath,
      (error) => {
        if (error && !res.headersSent) {
          return res.status(404).json({
            success: false,
            message: "Image thumbnail not found",
          });
        }
      },
    );
  } catch (error) {
    console.error("Failed to serve image thumbnail:", error);

    if (error.code === "ENOENT") {
      return res.status(404).json({
        success: false,
        message: "Original image file not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to serve image thumbnail",
    });
  }
};

module.exports = {
    uploadImage,
    getAlbumImages,
     updateFavorite,
     addComment ,
     deleteComment,
     getFavoriteImages ,
       deleteImage,
        serveImage,
        serveImageThumbnail,
};