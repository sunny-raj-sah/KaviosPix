import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { getAlbums, shareAlbum } from "../services/album.service";

import {
  getAlbumImages,
  getImageFile,
  uploadImage,
  updateFavorite,
  addComment,
   deleteComment,
    deleteImage,
} from "../services/image.service";

import {
  revokeAlbumAccess,
} from "../services/album.service";

import AlbumHeader from "../components/albums/AlbumHeader";
import AlbumUploadForm from "../components/albums/AlbumUploadForm";
import ImageGallery from "../components/images/ImageGallery";
import ImageFilter from "../components/images/ImageFilter";
import AlbumShareForm from "../components/albums/AlbumShareForm";

function AlbumDetails() {
  const { user } = useAuth();
  const { albumId } = useParams();

  const [album, setAlbum] = useState(null);
  const [images, setImages] = useState([]);

  const [loadingAlbum, setLoadingAlbum] = useState(true);

  const [loadingImages, setLoadingImages] = useState(true);

  const [error, setError] = useState("");

  // Image URLs
  const [imageUrls, setImageUrls] = useState({});
  const [updatingFavorite, setUpdatingFavorite] = useState(null);

  // Upload state
  const [selectedFile, setSelectedFile] = useState(null);

  const [showUploadForm, setShowUploadForm] = useState(false);

  const [uploading, setUploading] = useState(false);

  const [uploadError, setUploadError] = useState("");
  //  comment
  const [addingComment, setAddingComment] = useState(null);

  // filter
  const [activeTags, setActiveTags] = useState([]);

  const [filtering, setFiltering] = useState(false);

  //sharing
  const [sharing, setSharing] = useState(false);
// delete state for the image
const [deletingImage, setDeletingImage] = useState(null);

// adding the name and tag to upload the image
const [person, setPerson] = useState("");
const [tags, setTags] = useState("");
//comment delete
const [deletingComment, setDeletingComment] =
  useState(null);


  // to revok the share  album to the mail id
  const [revokingUser, setRevokingUser] =
  useState(null);
  // handler to revok the share  album to the mail id
  const handleRevokeAccess = async (email) => {
  const confirmed = window.confirm(
    `Are you sure you want to revoke album access for ${email}?`
  );

  if (!confirmed) {
    return;
  }

  try {
    setRevokingUser(email);
    setError("");

    await revokeAlbumAccess(albumId, email);

    setAlbum((currentAlbum) => ({
      ...currentAlbum,
      sharedUsers: currentAlbum.sharedUsers.filter(
        (sharedEmail) =>
          sharedEmail.toLowerCase() !==
          email.toLowerCase()
      ),
    }));
  } catch (err) {
    console.error(
      "Failed to revoke album access:",
      err
    );

    setError(
      err.response?.data?.message ||
        "Failed to revoke album access."
    );
  } finally {
    setRevokingUser(null);
  }
};
  // delete comment handler
  const handleDeleteComment = async (
  imageId,
  commentIndex
) => {
  try {
    setDeletingComment({
      imageId,
      commentIndex,
    });

    setError("");

    await deleteComment(
      albumId,
      imageId,
      commentIndex
    );

    setImages((currentImages) =>
      currentImages.map((image) => {
        const currentImageId =
          image.imageId || image._id;

        if (currentImageId !== imageId) {
          return image;
        }

        const updatedComments = [
          ...(image.comments || []),
        ];

        updatedComments.splice(commentIndex, 1);

        return {
          ...image,
          comments: updatedComments,
        };
      })
    );
  } catch (err) {
    console.error(
      "Failed to delete comment:",
      err
    );

    setError(
      err.response?.data?.message ||
        err.message ||
        "Failed to delete comment."
    );

    throw err;
  } finally {
    setDeletingComment(null);
  }
};
// delete the image handeler
const handleDeleteImage = async (imageId) => {
  try {
    setDeletingImage(imageId);
    setError("");

    await deleteImage(albumId, imageId);

    setImages((currentImages) =>
      currentImages.filter(
        (image) =>
          (image.imageId || image._id) !== imageId
      )
    );
  } catch (err) {
    setError(
      err.response?.data?.message ||
        "Failed to delete image."
    );
  } finally {
    setDeletingImage(null);
  }
};
  // for share feature   control
  const isAlbumOwner = Boolean(
    album?.ownerId && user?.userId && album.ownerId === user.userId,
  );
  // sharing  details
  const handleShareAlbum = async (emails) => {
    try {
      setSharing(true);
      setError("");

      const response = await shareAlbum(albumId, emails);

      console.log("POST /albums/:albumId/share response:", response);

      const updatedSharedUsers = response?.data?.sharedUsers;

      if (Array.isArray(updatedSharedUsers)) {
        setAlbum((currentAlbum) => ({
          ...currentAlbum,
          sharedUsers: updatedSharedUsers,
        }));
      } else {
        setAlbum((currentAlbum) => ({
          ...currentAlbum,
          sharedUsers: [...(currentAlbum.sharedUsers || []), ...emails],
        }));
      }

      return true;
    } catch (err) {
      console.error("Failed to share album:", err);

      setError(err.response?.data?.message || "Failed to share album.");

      return false;
    } finally {
      setSharing(false);
    }
  };

  // filter handler
  const handleApplyFilter = async (tags) => {
    try {
      setFiltering(true);
      setError("");

      setActiveTags(tags);

      await loadImages(tags);
    } catch (err) {
      console.error("Failed to filter images:", err);

      setError(err.response?.data?.message || "Failed to filter images.");
    } finally {
      setFiltering(false);
    }
  };

  const handleClearFilter = async () => {
    try {
      setFiltering(true);
      setError("");

      setActiveTags([]);

      await loadImages([]);
    } catch (err) {
      console.error("Failed to clear image filters:", err);

      setError(err.response?.data?.message || "Failed to clear filters.");
    } finally {
      setFiltering(false);
    }
  };
  //comment handler
  const handleAddComment = async (imageId, comment) => {
    try {
      setAddingComment(imageId);

      const response = await addComment(albumId, imageId, comment);

      const updatedComments = response?.data?.comments || [];

      setImages((currentImages) =>
        currentImages.map((image) => {
          const currentImageId = image.imageId || image._id;

          if (currentImageId !== imageId) {
            return image;
          }

          return {
            ...image,
            comments: updatedComments,
          };
        }),
      );

      return true;
    } catch (err) {
      console.error("Failed to add comment:", err);

      setError(err.response?.data?.message || "Failed to add comment.");

      return false;
    } finally {
      setAddingComment(null);
    }
  };
  // favorite handler
  const handleToggleFavorite = async (imageId, isFavorite) => {
    try {
      setUpdatingFavorite(imageId);

      await updateFavorite(albumId, imageId, isFavorite);

      setImages((currentImages) =>
        currentImages.map((image) => {
          const currentImageId = image.imageId || image._id;

          if (currentImageId !== imageId) {
            return image;
          }

          return {
            ...image,
            isFavorite,
          };
        }),
      );
    } catch (err) {
      console.error("Failed to update favorite:", err);

      setError(err.response?.data?.message || "Failed to update favorite.");
    } finally {
      setUpdatingFavorite(null);
    }
  };
  // --------------------------------------------------
  // LOAD ALBUM
  // --------------------------------------------------

  const loadAlbum = async () => {
    try {
      setLoadingAlbum(true);
      setError("");

      const response = await getAlbums();

      console.log("GET /albums response:", response);

      let albumList = [];

      if (Array.isArray(response)) {
        albumList = response;
      } else if (Array.isArray(response?.albums)) {
        albumList = response.albums;
      } else if (Array.isArray(response?.data)) {
        albumList = response.data;
      }

      const foundAlbum = albumList.find(
        (albumItem) => (albumItem.albumId || albumItem._id) === albumId,
      );

      if (!foundAlbum) {
        setError("Album not found.");
        setAlbum(null);
        return;
      }

      setAlbum(foundAlbum);
    } catch (err) {
      console.error("Failed to load album:", err);

      setError(err.response?.data?.message || "Failed to load album.");
    } finally {
      setLoadingAlbum(false);
    }
  };

  // --------------------------------------------------
  // LOAD PROTECTED IMAGE FILES
  // --------------------------------------------------

  const loadImageFiles = async (imageList) => {
    try {
      const results = await Promise.all(
        imageList.map(async (image) => {
          const imageId = image.imageId || image._id;

          if (!imageId) {
            return null;
          }

          const blob = await getImageFile(albumId, imageId);

          const objectUrl = URL.createObjectURL(blob);

          return {
            imageId,
            objectUrl,
          };
        }),
      );

      const urlMap = {};

      results.forEach((result) => {
        if (!result) {
          return;
        }

        urlMap[result.imageId] = result.objectUrl;
      });

      setImageUrls(urlMap);
    } catch (err) {
      console.error("Failed to load image files:", err);
    }
  };

  // --------------------------------------------------
  // LOAD IMAGES
  // --------------------------------------------------

  //   const loadImages = async (tags = activeTags) => {
  //     try {
  //       setLoadingImages(true);

  //       const response =
  //         await getAlbumImages( albumId,
  //     tags.join(","));

  //       console.log(
  //         "GET /albums/:albumId/images response:",
  //         response
  //       );

  //       let imageList = [];

  //       if (Array.isArray(response)) {
  //         imageList = response;
  //       } else if (
  //         Array.isArray(response?.images)
  //       ) {
  //         imageList = response.images;
  //       } else if (
  //         Array.isArray(response?.data)
  //       ) {
  //         imageList = response.data;
  //       }

  //       setImages(imageList);

  //       if (imageList.length > 0) {
  //         await loadImageFiles(imageList);
  //       } else {
  //         setImageUrls({});
  //       }
  //     } catch (err) {
  //       console.error(
  //         "Failed to load album images:",
  //         err
  //       );
  //     } finally {
  //       setLoadingImages(false);
  //     }
  //   };
  const loadImages = async (tags = activeTags) => {
    try {
      setLoadingImages(true);

      const response = await getAlbumImages(albumId, tags.join(","));

      console.log("GET /albums/:albumId/images response:", response);

      let imageList = [];

      if (Array.isArray(response)) {
        imageList = response;
      } else if (Array.isArray(response?.images)) {
        imageList = response.images;
      } else if (Array.isArray(response?.data)) {
        imageList = response.data;
      }

      setImages(imageList);

      if (imageList.length > 0) {
        await loadImageFiles(imageList);
      } else {
        setImageUrls({});
      }
    } catch (err) {
      console.error("Failed to load album images:", err);

      setError(err.response?.data?.message || "Failed to load album images.");
    } finally {
      setLoadingImages(false);
    }
  };

  // --------------------------------------------------
  // FILE VALIDATION
  // --------------------------------------------------

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const maxSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setSelectedFile(null);

      setUploadError("Only JPEG, PNG, and WebP images are allowed.");

      event.target.value = "";

      return;
    }

    if (file.size > maxSize) {
      setSelectedFile(null);

      setUploadError("Image size must not exceed 5 MB.");

      event.target.value = "";

      return;
    }

    setSelectedFile(file);
    setUploadError("");
  };

  // --------------------------------------------------
  // UPLOAD IMAGE
  // --------------------------------------------------

  // const handleUploadImage = async (event) => {
  //   event.preventDefault();

  //   if (!selectedFile) {
  //     setUploadError("Please select an image.");

  //     return;
  //   }

  //   try {
  //     setUploading(true);
  //     setUploadError("");

  //     const formData = new FormData();

  //     formData.append("image", selectedFile);

  //     const response = await uploadImage(albumId, formData);

  //     console.log("POST /albums/:albumId/images response:", response);

  //     setSelectedFile(null);
  //     setShowUploadForm(false);

  //     await loadImages();
  //   } catch (err) {
  //     console.error("Failed to upload image:", err);

  //     setUploadError(
  //       err.response?.data?.message || err.message || "Failed to upload image.",
  //     );
  //   } finally {
  //     setUploading(false);
  //   }
  // };
const handleUploadImage = async (event) => {
  event.preventDefault();

  if (!selectedFile) {
    setUploadError("Please select an image.");

    return;
  }

  try {
    setUploading(true);
    setUploadError("");

    const formData = new FormData();

    formData.append("image", selectedFile);

    // Optional person name
    if (person.trim()) {
      formData.append("person", person.trim());
    }

    // Optional tags
    if (tags.trim()) {
      const tagList = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      tagList.forEach((tag) => {
        formData.append("tags", tag);
      });
    }

    const response = await uploadImage(albumId, formData);

    console.log(
      "POST /albums/:albumId/images response:",
      response
    );

    setSelectedFile(null);
    setPerson("");
    setTags("");
    setShowUploadForm(false);

    await loadImages();
  } catch (err) {
    console.error("Failed to upload image:", err);

    setUploadError(
      err.response?.data?.message ||
        err.message ||
        "Failed to upload image."
    );
  } finally {
    setUploading(false);
  }
};
  // --------------------------------------------------
  // CLOSE UPLOAD FORM
  // --------------------------------------------------

  const handleCancelUpload = () => {
    setShowUploadForm(false);
    setSelectedFile(null);
    setUploadError("");
  };

  // --------------------------------------------------
  // INITIAL LOAD
  // --------------------------------------------------

  useEffect(() => {
    if (!albumId) {
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAlbum();
    loadImages();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [albumId]);

  // --------------------------------------------------
  // CLEANUP OBJECT URLS
  // --------------------------------------------------

  useEffect(() => {
    return () => {
      Object.values(imageUrls).forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, [imageUrls]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loadingAlbum) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error || !album) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || "Album not found."}
        </div>

        <Link to="/dashboard" className="btn btn-outline-primary">
          ← Back to Albums
        </Link>
      </div>
    );
  }

  const sharedUsers = Array.isArray(album.sharedUsers) ? album.sharedUsers : [];

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="container py-4 py-md-5">
       <AlbumHeader
  album={album}
  sharedUsersCount={sharedUsers.length}
  isAlbumOwner={isAlbumOwner}
  showUploadForm={showUploadForm}
  onToggleUpload={() => {
    setShowUploadForm(
      (current) => !current
    );

    setUploadError("");
  }}
/>     {isAlbumOwner && (
      <AlbumShareForm
        sharedUsers={Array.isArray(album.sharedUsers) ? album.sharedUsers : []}
        onShare={handleShareAlbum}
        sharing={sharing}
         onRevoke={handleRevokeAccess}
  revokingUser={revokingUser}
      />)}
      {showUploadForm && (
        // <AlbumUploadForm
        //   selectedFile={selectedFile}
        //   uploading={uploading}
        //   uploadError={uploadError}
        //   onFileChange={handleFileChange}
        //   onSubmit={handleUploadImage}
        //   onCancel={handleCancelUpload}
        // />
  <AlbumUploadForm
  selectedFile={selectedFile}
  person={person}
  tags={tags}
  uploading={uploading}
  uploadError={uploadError}
  onFileChange={handleFileChange}
  onPersonChange={(event) => setPerson(event.target.value)}
  onTagsChange={(event) => setTags(event.target.value)}
  onSubmit={handleUploadImage}
  onCancel={handleCancelUpload}
/>
      )}
      <ImageFilter
        activeTags={activeTags}
        onApply={handleApplyFilter}
        onClear={handleClearFilter}
        filtering={filtering}
      />
      <ImageGallery
        images={images}
        imageUrls={imageUrls}
        loading={loadingImages}
        onUpload={() => {
          setShowUploadForm(true);
          setUploadError("");
        }}
        onToggleFavorite={handleToggleFavorite}
        updatingFavorite={updatingFavorite}
        onAddComment={handleAddComment}
        addingComment={addingComment}
         isAlbumOwner={isAlbumOwner}
   onDeleteImage={handleDeleteImage}
  deletingImage={deletingImage}
   onDeleteComment={handleDeleteComment}
  deletingComment={deletingComment}
      />
    </div>
  );
}

export default AlbumDetails;
