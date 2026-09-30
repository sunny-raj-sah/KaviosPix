//  import ImageCard from "./ImageCard";

// function ImageGallery({
//   images,
//   imageUrls,
//   loading,
//   onUpload,
//   onToggleFavorite,
//   updatingFavorite,
//   onAddComment,
//   addingComment,
//   isAlbumOwner,
//   deletingImage,
// }) {
//   return (
//     <>
//       <div className="d-flex justify-content-between align-items-center mb-3">
//         <div>
//           <h2 className="h5 fw-bold mb-1">
//             Photos
//           </h2>

//           <p className="text-secondary small mb-0">
//             {images.length} photo
//             {images.length !== 1
//               ? "s"
//               : ""}
//           </p>
//         </div>
//       </div>

//       {loading && (
//         <div className="text-center py-5">
//           <div
//             className="spinner-border"
//             role="status"
//           >
//             <span className="visually-hidden">
//               Loading photos...
//             </span>
//           </div>
//         </div>
//       )}

//       {!loading &&
//         images.length === 0 && (
//           <div className="card border-0 shadow-sm">
//             <div className="card-body text-center py-5">
//               <div className="display-6 mb-3">
//                 🖼️
//               </div>

//               <h3 className="h5 fw-bold">
//                 No photos yet
//               </h3>

//               <p className="text-secondary mb-3">
//                 Upload your first photo to
//                 this album.
//               </p>

//               <button
//                 type="button"
//                 className="btn btn-primary"
//                 onClick={onUpload}
//               >
//                 + Upload Image
//               </button>
//             </div>
//           </div>
//         )}

//       {!loading &&
//         images.length > 0 && (
//           <div className="row g-3">
//             {images.map((image) => {
//               const imageId =
//                 image.imageId ||
//                 image._id;

//               return (
//                 <ImageCard
//                   key={imageId}
//                   image={image}
//                   imageUrl={
//                     imageUrls[imageId]
//                   }
//                   onToggleFavorite={
//                     onToggleFavorite
//                   }
//                   updatingFavorite={
//                     updatingFavorite
//                   }
//                   onAddComment={
//                     onAddComment
//                   }
//                   addingComment={
//                     addingComment
//                   }
//                     isAlbumOwner={isAlbumOwner}
//                      deletingImage={deletingImage}
//                 />
//               );
//             })}
//           </div>
//         )}
//     </>
//   );
// }

// export default ImageGallery;


// ---------------------------------------------------------------------------

import ImageCard from "./ImageCard";

function ImageGallery({
  images,
  imageUrls,
  loading,
  onUpload,
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
  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h2 className="h5 fw-bold mb-1">
            Photos
          </h2>

          <p className="text-secondary small mb-0">
            {images.length} photo
            {images.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {loading && (
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">
              Loading photos...
            </span>
          </div>
        </div>
      )}

      {!loading && images.length === 0 && (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="display-6 mb-3">
              🖼️
            </div>

            <h3 className="h5 fw-bold">
              No photos yet
            </h3>

            <p className="text-secondary mb-3">
              Upload your first photo to this album.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={onUpload}
            >
              + Upload Image
            </button>
          </div>
        </div>
      )}

      {!loading && images.length > 0 && (
        <div className="row g-3">
          {images.map((image) => {
            const imageId =
              image.imageId || image._id;

            return (
              <ImageCard
                key={imageId}
                image={image}
                imageUrl={imageUrls[imageId]}
                onToggleFavorite={onToggleFavorite}
                updatingFavorite={updatingFavorite}
                onAddComment={onAddComment}
                addingComment={addingComment}
                isAlbumOwner={isAlbumOwner}
                onDeleteImage={onDeleteImage}
                deletingImage={deletingImage}
                  onDeleteComment={onDeleteComment}
  deletingComment={deletingComment}
              />
            );
          })}
        </div>
      )}
    </>
  );
}

export default ImageGallery;