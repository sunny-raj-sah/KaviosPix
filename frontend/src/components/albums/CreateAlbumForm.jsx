import { useState } from "react";

function CreateAlbumForm({
  onCreate,
  creating = false,
  onCancel,
}) {
  const [name, setName] = useState("");
  const [description, setDescription] =
    useState("");

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();
    const trimmedDescription =
      description.trim();

    // Frontend validation
    if (!trimmedName) {
      setError("Album name is required.");
      return;
    }

    setError("");

    const success = await onCreate({
      name: trimmedName,
      description: trimmedDescription,
    });

    if (success) {
      setName("");
      setDescription("");
      setError("");
    }
  };

  const handleCancel = () => {
    setName("");
    setDescription("");
    setError("");

    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="card border-0 shadow-sm mb-4">
      <div className="card-body p-4">

        {/* Header */}
        <div className="mb-4">
          <div className="d-flex align-items-center gap-3">
            <div
              className="d-flex align-items-center justify-content-center bg-primary-subtle text-primary rounded-3"
              style={{
                width: "44px",
                height: "44px",
                flexShrink: 0,
              }}
            >
              <span className="fs-5">
                +
              </span>
            </div>

            <div>
              <h2 className="h5 fw-bold mb-1">
                Create Album
              </h2>

              <p className="text-secondary small mb-0">
                Create a new album to organize
                your photos.
              </p>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="alert alert-danger"
            role="alert"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Album Name */}
          <div className="mb-3">
            <label
              htmlFor="createAlbumName"
              className="form-label fw-semibold"
            >
              Album Name
              <span className="text-danger ms-1">
                *
              </span>
            </label>

            <input
              id="createAlbumName"
              type="text"
              className={`form-control ${
                error && !name.trim()
                  ? "is-invalid"
                  : ""
              }`}
              placeholder="e.g. Goa Trip"
              value={name}
              onChange={(event) => {
                setName(event.target.value);

                if (error) {
                  setError("");
                }
              }}
              disabled={creating}
              autoComplete="off"
              maxLength={100}
            />

            <div className="form-text">
              Give your album a short, meaningful
              name.
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <label
              htmlFor="createAlbumDescription"
              className="form-label fw-semibold"
            >
              Description
              <span className="text-secondary fw-normal ms-1">
                (optional)
              </span>
            </label>

            <textarea
              id="createAlbumDescription"
              className="form-control"
              rows="4"
              placeholder="Describe what this album contains..."
              value={description}
              onChange={(event) =>
                setDescription(
                  event.target.value
                )
              }
              disabled={creating}
              maxLength={500}
            />

            <div className="form-text d-flex justify-content-between">
              <span>
                Optional description for the album.
              </span>

              <span>
                {description.length}/500
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="d-flex flex-column flex-sm-row gap-2">
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={
                creating || !name.trim()
              }
            >
              {creating ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />

                  Creating Album...
                </>
              ) : (
                "Create Album"
              )}
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary px-4"
              onClick={handleCancel}
              disabled={creating}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAlbumForm;