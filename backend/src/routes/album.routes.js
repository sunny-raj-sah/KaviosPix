const express = require("express");

const authenticate = require("../middleware/auth.middleware");



const {
  requireAlbumOwner,
} = require("../middleware/album.middleware");

const {
  requireAlbumAccess,
} = require("../middleware/albumAccess.middleware");
const {
  requireImageInAlbum,
} = require("../middleware/image.middleware");


const {
  createAlbum,
  getAlbums,
    updateAlbum,
  deleteAlbum,
  shareAlbum,
    revokeAlbumAccess,

} = require("../controllers/album.controller");


const uploadSingleImage = require("../middleware/upload.middleware");

const {
  uploadImage,
  getAlbumImages,
  getFavoriteImages,
   updateFavorite,
     addComment,
       deleteComment,
       deleteImage,
         serveImage,
} = require("../controllers/image.controller");

 


const router = express.Router();



router.post("/", authenticate, createAlbum);

router.get("/", authenticate, getAlbums);

router.put(
  "/:albumId",
  authenticate,
  requireAlbumOwner,
  updateAlbum
);

router.delete(
  "/:albumId",
  authenticate,
  requireAlbumOwner,
  deleteAlbum
);

router.post(
  "/:albumId/share",
  authenticate,
  requireAlbumOwner,
  shareAlbum
);

router.delete(
  "/:albumId/share",
  authenticate,
  requireAlbumOwner,
  revokeAlbumAccess
);
router.post(
  "/:albumId/images",
  authenticate,
    requireAlbumOwner,

uploadSingleImage,
  uploadImage
);

router.get(
  "/:albumId/images",
  authenticate,
  requireAlbumAccess,
  getAlbumImages
);

router.put(
  "/:albumId/images/:imageId/favorite",
  authenticate,
  requireAlbumAccess,
  requireImageInAlbum,
  updateFavorite
);

router.post(
  "/:albumId/images/:imageId/comments",
  authenticate,
  requireAlbumOwner,
  requireImageInAlbum,
  addComment
);
router.delete(
  "/:albumId/images/:imageId/comments/:commentId",
  authenticate,
  requireAlbumOwner,
  requireImageInAlbum,
  deleteComment
);

router.get(
  "/:albumId/images/favorites",
  authenticate,
  requireAlbumAccess,
  getFavoriteImages
);

router.delete(
  "/:albumId/images/:imageId",
  authenticate,
  requireAlbumOwner,
  requireImageInAlbum,
  deleteImage
);

router.get(
  "/:albumId/images/:imageId/file",
  authenticate,
  requireAlbumAccess,
  requireImageInAlbum,
  serveImage,
);

module.exports = router;