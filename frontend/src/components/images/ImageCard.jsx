 import ImageComments from "./ImageComments";

function ImageCard({
  image,
  imageUrl,
  onToggleFavorite,
  updatingFavorite,
  onAddComment,
  addingComment,
  isAlbumOwner,
}) {
  const imageId =
    image.imageId || image._id;

  const isFavorite =
    Boolean(image.isFavorite);

  const comments = Array.isArray(
    image.comments
  )
    ? image.comments
    : [];

  return (
    <div className="col-6 col-md-4 col-lg-3">
      <div className="card border-0 shadow-sm h-100 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={
              image.name || "Album image"
            }
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
          <div className="d-flex justify-content-between align-items-start gap-2">
            <h6 className="card-title mb-2 text-truncate">
              {image.name || "Image"}
            </h6>

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
          </div>

          <div className="small text-secondary">
            {image.mimeType ||
              "Unknown type"}
          </div>

          <div className="small text-secondary text-truncate">
            {image.tags?.length
              ? image.tags.join(", ")
              : "No tags"}
          </div>

          {isFavorite && (
            <span className="badge text-bg-warning mt-2">
              Favorite
            </span>
          )}

          <ImageComments
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
          />
        </div>
      </div>
    </div>
  );
}

export default ImageCard;