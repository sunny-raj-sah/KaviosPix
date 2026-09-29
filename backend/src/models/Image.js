 const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const imageSchema = new mongoose.Schema(
  {
    imageId: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },

    albumId: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    storageName: {
      type: String,
      required: true,
    },

    storagePath: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    person: {
      type: String,
      trim: true,
      default: "",
    },

    isFavorite: {
      type: Boolean,
      default: false,
    },

    comments: [
      {
        type: String,
        trim: true,
      },
    ],

    size: {
      type: Number,
      required: true,
      min: 1,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Image = mongoose.model("Image", imageSchema);

module.exports = Image;