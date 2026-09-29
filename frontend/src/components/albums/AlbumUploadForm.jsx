function AlbumUploadForm({
  selectedFile,
  uploading,
  uploadError,
  onFileChange,
  onSubmit,
  onCancel,
}) {
  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">
        <h2 className="h5 fw-bold mb-1">
          Upload Image
        </h2>

        <p className="text-secondary small mb-4">
          Add an image to this album.
        </p>

        {uploadError && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {uploadError}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label
              htmlFor="imageFile"
              className="form-label fw-semibold"
            >
              Select Image
            </label>

            <input
              id="imageFile"
              type="file"
              className="form-control"
              accept="image/jpeg,image/png,image/webp"
              onChange={onFileChange}
              disabled={uploading}
            />

            <div className="form-text">
              Supported formats: JPEG, PNG, WebP.
              Maximum size: 5 MB.
            </div>
          </div>

          {selectedFile && (
            <div className="alert alert-light border">
              <div className="fw-semibold">
                Selected file
              </div>

              <div className="small text-secondary">
                {selectedFile.name}
              </div>

              <div className="small text-secondary">
                {(
                  selectedFile.size /
                  1024 /
                  1024
                ).toFixed(2)}{" "}
                MB
              </div>
            </div>
          )}

          <div className="d-flex gap-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={
                uploading || !selectedFile
              }
            >
              {uploading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />

                  Uploading...
                </>
              ) : (
                "Upload Image"
              )}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              disabled={uploading}
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AlbumUploadForm;