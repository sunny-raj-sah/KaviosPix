const fs = require("fs/promises");

const Album = require("../models/Album");
const User = require("../models/User");

const Image = require("../models/Image");

const createAlbum = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Album name is required",
      });
    }

    const album = await Album.create({
      name: name.trim(),
      description: description?.trim() || "",
      ownerId: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Album created successfully",
      data: album,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create album",
      error: error.message,
    });
  }
};

const getAlbums = async (req, res) => {
  try {
    const albums = await Album.find({
      $or: [
        {
          ownerId: req.user.userId,
        },
        {
          sharedUsers: req.user.email,
        },
      ],
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: albums.length,
      data: albums,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch albums",
      error: error.message,
    });
  }
};

const updateAlbum = async (req, res) => {
  try {
    const { name,description } = req.body;

      if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Album name is required",
      });
    }

    if (description !== undefined && typeof description !== "string") {
      return res.status(400).json({
        success: false,
        message: "Description must be a string",
      });
    }
      req.album.name = name.trim();

    req.album.description = description?.trim() || "";

    await req.album.save();

    return res.status(200).json({
      success: true,
      message: "Album updated successfully",
      data: req.album,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update album",
      error: error.message,
    });
  }
};

 const deleteAlbum = async (req, res) => {
  try {
    const images = await Image.find({
      albumId: req.album.albumId,
    });

    for (const image of images) {
      try {
        await fs.unlink(image.storagePath);
      } catch (error) {
        if (error.code !== "ENOENT") {
          throw error;
        }
      }
    }

    await Image.deleteMany({
      albumId: req.album.albumId,
    });

    await req.album.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Album and associated images deleted successfully",
      data: {
        albumId: req.album.albumId,
        deletedImages: images.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete album",
      error: error.message,
    });
  }
};

const shareAlbum = async (req, res) => {
  try {
    const { emails } = req.body;

    if (!Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "emails must be a non-empty array",
      });
    }

    const normalizedEmails = [
      ...new Set(
        emails
          .filter((email) => typeof email === "string")
          .map((email) => email.trim().toLowerCase())
      ),
    ];

    if (normalizedEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one valid email is required",
      });
    }

    const invalidEmails = normalizedEmails.filter(
      (email) =>
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    );

    if (invalidEmails.length > 0) {
      return res.status(400).json({
        success: false,
        message: "One or more email addresses are invalid",
        invalidEmails,
      });
    }

    const users = await User.find({
      email: { $in: normalizedEmails },
    });

    const existingUserEmails = new Set(
      users.map((user) => user.email)
    );

    const notFoundEmails = normalizedEmails.filter(
      (email) => !existingUserEmails.has(email)
    );

    if (notFoundEmails.length > 0) {
      return res.status(404).json({
        success: false,
        message: "One or more users do not exist",
        notFoundEmails,
      });
    }

    const ownerEmail = req.user.email;

    const ownerIncluded = normalizedEmails.includes(ownerEmail);

    if (ownerIncluded) {
      return res.status(400).json({
        success: false,
        message: "Album owner does not need to be added as a shared user",
      });
    }

    const existingSharedUsers = new Set(req.album.sharedUsers);

    const newEmails = normalizedEmails.filter(
      (email) => !existingSharedUsers.has(email)
    );

    if (newEmails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "All provided users already have access to this album",
      });
    }

    req.album.sharedUsers.push(...newEmails);

    await req.album.save();

    return res.status(200).json({
      success: true,
      message: "Album shared successfully",
      data: {
        albumId: req.album.albumId,
        sharedUsers: req.album.sharedUsers,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to share album",
      error: error.message,
    });
  }
};

const revokeAlbumAccess = async (req, res) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const sharedUsers = req.album.sharedUsers || [];

    const sharedUserIndex = sharedUsers.findIndex(
      (sharedEmail) =>
        String(sharedEmail).toLowerCase() === normalizedEmail
    );

    if (sharedUserIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "User does not have access to this album",
      });
    }

    req.album.sharedUsers.splice(sharedUserIndex, 1);

    await req.album.save();

    return res.status(200).json({
      success: true,
      message: "Album access revoked successfully",
      data: {
        albumId: req.album.albumId,
        sharedUsers: req.album.sharedUsers,
      },
    });
  } catch (error) {
    console.error("Revoke album access error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to revoke album access",
      error: error.message,
    });
  }
};

module.exports = {
  createAlbum,
  getAlbums,
  updateAlbum,
  deleteAlbum,
  shareAlbum ,
  revokeAlbumAccess,
};