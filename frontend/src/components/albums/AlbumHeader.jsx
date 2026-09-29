import { Link } from "react-router-dom";

function AlbumHeader({
 album,
  sharedUsersCount,
  isAlbumOwner,
  showUploadForm,
  onToggleUpload,
}) {
  return (
    <>
      {/* Back */}
      <div className="mb-4">
        <Link
          to="/dashboard"
          className="btn btn-outline-secondary btn-sm"
        >
          ← Back to Albums
        </Link>
      </div>

      {/* Album Header */}
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between gap-3">
            <div>
              <h1 className="h3 fw-bold mb-2">
                {album.name}
              </h1>

              <p className="text-secondary mb-3">
                {album.description ||
                  "No description added."}
              </p>

              <div className="small text-secondary">
                <div className="mb-1">
                  <strong>Album ID:</strong>{" "}
                  <span className="text-break">
                    {album.albumId}
                  </span>
                </div>

                <div className="mb-1">
                  <strong>Shared with:</strong>{" "}
                  {sharedUsersCount} user
                  {sharedUsersCount !== 1
                    ? "s"
                    : ""}
                </div>

                {album.createdAt && (
                  <div>
                    <strong>Created:</strong>{" "}
                    {new Date(
                      album.createdAt
                    ).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>

            <div>
                {isAlbumOwner && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onToggleUpload}
              >
                {showUploadForm
                  ? "Close Upload"
                  : "+ Upload Image"}
              </button>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AlbumHeader;