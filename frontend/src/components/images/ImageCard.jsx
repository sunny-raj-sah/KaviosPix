//  import ImageComments from "./ImageComments";

// function ImageCard({
//   image,
//   imageUrl,
//   onToggleFavorite,
//   updatingFavorite,
//   onAddComment,
//   addingComment,
//   isAlbumOwner,
// }) {
//   const imageId =
//     image.imageId || image._id;

//   const isFavorite =
//     Boolean(image.isFavorite);

//   const comments = Array.isArray(
//     image.comments
//   )
//     ? image.comments
//     : [];

//   return (
//     <div className="col-6 col-md-4 col-lg-3">
//       <div className="card border-0 shadow-sm h-100 overflow-hidden">
//         {imageUrl ? (
//           <img
//             src={imageUrl}
//             alt={
//               image.name || "Album image"
//             }
//             className="w-100"
//             style={{
//               height: "220px",
//               objectFit: "cover",
//             }}
//           />
//         ) : (
//           <div
//             className="bg-light d-flex align-items-center justify-content-center"
//             style={{
//               height: "220px",
//             }}
//           >
//             <div
//               className="spinner-border text-secondary"
//               role="status"
//             >
//               <span className="visually-hidden">
//                 Loading image...
//               </span>
//             </div>
//           </div>
//         )}

//         <div className="card-body p-3">
//           <div className="d-flex justify-content-between align-items-start gap-2">
//             <h6 className="card-title mb-2 text-truncate">
//               {image.name || "Image"}
//             </h6>

//             <button
//               type="button"
//               className={`btn btn-sm ${
//                 isFavorite
//                   ? "btn-warning"
//                   : "btn-outline-secondary"
//               }`}
//               onClick={() =>
//                 onToggleFavorite(
//                   imageId,
//                   !isFavorite
//                 )
//               }
//               disabled={
//                 updatingFavorite === imageId
//               }
//               title={
//                 isFavorite
//                   ? "Remove from favorites"
//                   : "Add to favorites"
//               }
//             >
//               {updatingFavorite === imageId ? (
//                 <span
//                   className="spinner-border spinner-border-sm"
//                   role="status"
//                   aria-hidden="true"
//                 />
//               ) : (
//                 "★"
//               )}
//             </button>
//           </div>

//           <div className="small text-secondary">
//             {image.mimeType ||
//               "Unknown type"}
//           </div>

//           <div className="small text-secondary text-truncate">
//             {image.tags?.length
//               ? image.tags.join(", ")
//               : "No tags"}
//           </div>

//           {isFavorite && (
//             <span className="badge text-bg-warning mt-2">
//               Favorite
//             </span>
//           )}

//           <ImageComments
//             comments={comments}
//             onAddComment={(comment) =>
//               onAddComment(
//                 imageId,
//                 comment
//               )
//             }
//             addingComment={
//               addingComment === imageId
//             }
//               isAlbumOwner={isAlbumOwner}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ImageCard;


// -------------------------------------------------------------

// import ImageComments from "./ImageComments";

// function ImageCard({
//   image,
//   imageUrl,
//   onToggleFavorite,
//   updatingFavorite,
//   onAddComment,
//   addingComment,
//   isAlbumOwner,
//   onDeleteImage,
//   deletingImage,
// }) {
//   const imageId = image.imageId || image._id;

//   const isFavorite = Boolean(image.isFavorite);

//   const comments = Array.isArray(image.comments)
//     ? image.comments
//     : [];

//   const isDeleting = deletingImage === imageId;

//   const formatFileSize = (bytes) => {
//     if (!bytes || bytes <= 0) {
//       return "Unknown size";
//     }

//     const units = ["Bytes", "KB", "MB", "GB"];
//     const index = Math.floor(
//       Math.log(bytes) / Math.log(1024)
//     );

//     return `${(bytes / Math.pow(1024, index)).toFixed(2)} ${
//       units[index] || "Bytes"
//     }`;
//   };

//   const formatUploadDate = (date) => {
//     if (!date) {
//       return "Unknown";
//     }

//     return new Date(date).toLocaleString();
//   };

//   const handleDelete = () => {
//     const confirmed = window.confirm(
//       `Are you sure you want to delete "${image.name || "this image"}"?`
//     );

//     if (!confirmed) {
//       return;
//     }

//     onDeleteImage(imageId);
//   };

//   return (
//     <div className="col-6 col-md-4 col-lg-3">
//       <div className="card border-0 shadow-sm h-100 overflow-hidden">
//         {imageUrl ? (
//           <img
//             src={imageUrl}
//             alt={image.name || "Album image"}
//             className="w-100"
//             style={{
//               height: "220px",
//               objectFit: "cover",
//             }}
//           />
//         ) : (
//           <div
//             className="bg-light d-flex align-items-center justify-content-center"
//             style={{
//               height: "220px",
//             }}
//           >
//             <div
//               className="spinner-border text-secondary"
//               role="status"
//             >
//               <span className="visually-hidden">
//                 Loading image...
//               </span>
//             </div>
//           </div>
//         )}

//         <div className="card-body p-3">
//           {/* Image name + actions */}
//           <div className="d-flex justify-content-between align-items-start gap-2">
//             <h6 className="card-title mb-2 text-truncate">
//               {image.name || "Image"}
//             </h6>

//             <div className="d-flex gap-1">
//               {/* Favorite */}
//               <button
//                 type="button"
//                 className={`btn btn-sm ${
//                   isFavorite
//                     ? "btn-warning"
//                     : "btn-outline-secondary"
//                 }`}
//                 onClick={() =>
//                   onToggleFavorite(
//                     imageId,
//                     !isFavorite
//                   )
//                 }
//                 disabled={
//                   updatingFavorite === imageId ||
//                   isDeleting
//                 }
//                 title={
//                   isFavorite
//                     ? "Remove from favorites"
//                     : "Add to favorites"
//                 }
//               >
//                 {updatingFavorite === imageId ? (
//                   <span
//                     className="spinner-border spinner-border-sm"
//                     role="status"
//                     aria-hidden="true"
//                   />
//                 ) : (
//                   "★"
//                 )}
//               </button>

//               {/* Delete - Owner only */}
//               {isAlbumOwner && (
//                 <button
//                   type="button"
//                   className="btn btn-sm btn-outline-danger"
//                   onClick={handleDelete}
//                   disabled={isDeleting}
//                   title="Delete image"
//                 >
//                   {isDeleting ? (
//                     <span
//                       className="spinner-border spinner-border-sm"
//                       role="status"
//                       aria-hidden="true"
//                     />
//                   ) : (
//                     "🗑"
//                   )}
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Basic information */}
//           <div className="small text-secondary mb-2">
//             {image.mimeType || "Unknown type"}
//           </div>

//           {/* Metadata */}
//           <div className="border-top pt-2 mt-2">
//             <div className="small text-secondary mb-1">
//               <strong>Person:</strong>{" "}
//               {image.person || "Not specified"}
//             </div>

//             <div className="small text-secondary mb-1">
//               <strong>Size:</strong>{" "}
//               {formatFileSize(image.size)}
//             </div>

//             <div className="small text-secondary mb-1">
//               <strong>Uploaded:</strong>{" "}
//               {formatUploadDate(image.uploadedAt)}
//             </div>
//           </div>

//           {/* Tags */}
//           <div className="small text-secondary text-truncate mt-2">
//             <strong>Tags:</strong>{" "}
//             {image.tags?.length
//               ? image.tags.join(", ")
//               : "No tags"}
//           </div>

//           {/* Favorite status */}
//           {isFavorite && (
//             <span className="badge text-bg-warning mt-2">
//               Favorite
//             </span>
//           )}

//           {/* Comments */}
//           <ImageComments
//             comments={comments}
//             onAddComment={(comment) =>
//               onAddComment(imageId, comment)
//             }
//             addingComment={
//               addingComment === imageId
//             }
//             isAlbumOwner={isAlbumOwner}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ImageCard;
// ----------------------------------------------------------------------
// 3
 import { useState } from "react";
import ImageComments from "./ImageComments";

function ImageCard({
 image,
  imageUrl,
  onToggleFavorite,
  updatingFavorite,
  onAddComment,
  addingComment,
  isAlbumOwner,
  onDeleteImage,
  deletingImage,
  onDeleteComment,
  deletingComment,
}) {
  const [showComments, setShowComments] = useState(false);

  const imageId = image.imageId || image._id;

  const isFavorite = Boolean(image.isFavorite);

  const comments = Array.isArray(image.comments)
    ? image.comments
    : [];

  const formatFileSize = (bytes) => {
    if (!bytes) {
      return "Unknown size";
    }

    if (bytes < 1024) {
      return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }

    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  const formatDate = (date) => {
    if (!date) {
      return "Unknown date";
    }

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="col-6 col-md-4 col-lg-3">
      <div className="card border-0 shadow-sm h-100 overflow-hidden">

        {/* Image */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={image.name || "Album image"}
            className="w-100"
            style={{
              height: "220px",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            className="bg-light d-flex align-items-center justify-content-center"
            style={{
              height: "220px",
            }}
          >
            <div
              className="spinner-border text-secondary"
              role="status"
            >
              <span className="visually-hidden">
                Loading image...
              </span>
            </div>
          </div>
        )}

        <div className="card-body p-3">

          {/* Image name + actions */}
          <div className="d-flex justify-content-between align-items-start gap-2">
            <h6
              className="card-title mb-2 text-truncate"
              title={image.name || "Image"}
            >
              {image.name || "Image"}
            </h6>

            <div className="d-flex gap-1 flex-shrink-0">

              {/* Favorite */}
              <button
                type="button"
                className={`btn btn-sm ${
                  isFavorite
                    ? "btn-warning"
                    : "btn-outline-secondary"
                }`}
                onClick={() =>
                  onToggleFavorite(
                    imageId,
                    !isFavorite
                  )
                }
                disabled={
                  updatingFavorite === imageId
                }
                title={
                  isFavorite
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                {updatingFavorite === imageId ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  />
                ) : (
                  "★"
                )}
              </button>

              {/* Delete */}
              {isAlbumOwner && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => {
                    const confirmed = window.confirm(
                      "Are you sure you want to delete this image?"
                    );

                    if (confirmed) {
                      onDeleteImage(imageId);
                    }
                  }}
                  disabled={
                    deletingImage === imageId
                  }
                  title="Delete image"
                >
                  {deletingImage === imageId ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    "🗑"
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Person */}
          <div className="small text-secondary mb-1 text-truncate">
            <span className="fw-semibold">
              Person:
            </span>{" "}
            {image.person || "Not specified"}
          </div>

          {/* File information */}
          <div className="small text-secondary mb-1 text-truncate">
            {image.mimeType || "Unknown type"}
            {" · "}
            {formatFileSize(image.size)}
          </div>

          {/* Upload date */}
          <div className="small text-secondary mb-2">
            Uploaded: {formatDate(image.uploadedAt)}
          </div>

          {/* Tags */}
          <div className="mb-2">
            {image.tags?.length ? (
              <div className="d-flex flex-wrap gap-1">
                {image.tags.map((tag, index) => (
                  <span
                    key={`${tag}-${index}`}
                    className="badge text-bg-light border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : (
              <span className="small text-secondary">
                No tags
              </span>
            )}
          </div>

          {/* Favorite indicator */}
          {isFavorite && (
            <span className="badge text-bg-warning mb-2">
              ★ Favorite
            </span>
          )}

          {/* Comments toggle */}
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary w-100 mt-1"
            onClick={() =>
              setShowComments(
                (current) => !current
              )
            }
          >
            💬 {comments.length}{" "}
            {comments.length === 1
              ? "Comment"
              : "Comments"}

            <span className="ms-1">
              {showComments ? "▲" : "▼"}
            </span>
          </button>

          {/* Comments section */}
          {showComments && (
            <div className="mt-3 pt-3 border-top">
              {/* <ImageComments
                comments={comments}
                onAddComment={(comment) =>
                  onAddComment(
                    imageId,
                    comment
                  )
                }
                addingComment={
                  addingComment === imageId
                }
                isAlbumOwner={
                  isAlbumOwner
                }
              /> */}
              <ImageComments
  comments={comments}
  onAddComment={(comment) =>
    onAddComment(imageId, comment)
  }
  addingComment={addingComment === imageId}
  isAlbumOwner={isAlbumOwner}
  onDeleteComment={(commentIndex) =>
    onDeleteComment(imageId, commentIndex)
  }
  deletingComment={deletingComment?.imageId === imageId
    ? deletingComment.commentIndex
    : null}
/>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ImageCard;