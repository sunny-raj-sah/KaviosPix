 
 import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  createAlbum,
  deleteAlbum,
  getAlbums,
  updateAlbum,
} from "../services/album.service";

function Dashboard() {
  const [albums, setAlbums] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Create album UI
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [albumName, setAlbumName] = useState("");
  const [albumDescription, setAlbumDescription] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");

  // Edit album UI
  const [editingAlbum, setEditingAlbum] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] =
    useState("");
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState("");

  // Delete state
  const [deletingAlbumId, setDeletingAlbumId] =
    useState(null);

  // --------------------------------------------------
  // GET ALBUMS
  // --------------------------------------------------

  const loadAlbums = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getAlbums();

      console.log("GET /albums response:", response);

      /*
       * Support common backend response shapes:
       *
       * 1. [album, album]
       * 2. { albums: [album, album] }
       * 3. { data: [album, album] }
       * 4. { success: true, albums: [...] }
       */

      let albumList = [];

      if (Array.isArray(response)) {
        albumList = response;
      } else if (Array.isArray(response?.albums)) {
        albumList = response.albums;
      } else if (Array.isArray(response?.data)) {
        albumList = response.data;
      }

      setAlbums(albumList);
    } catch (err) {
      console.error("Failed to load albums:", err);

      setError(
        err.response?.data?.message ||
          "Failed to load albums."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAlbums();
  }, []);

  // --------------------------------------------------
  // CREATE ALBUM
  // --------------------------------------------------

  const handleCreateAlbum = async (event) => {
    event.preventDefault();

    const trimmedName = albumName.trim();
    const trimmedDescription =
      albumDescription.trim();

    if (!trimmedName) {
      setCreateError("Album name is required.");
      return;
    }

    try {
      setCreating(true);
      setCreateError("");

      const response = await createAlbum({
        name: trimmedName,
        description: trimmedDescription,
      });

      console.log(
        "POST /albums response:",
        response
      );

      /*
       * Backend may return:
       *
       * {
       *   success: true,
       *   album: {...}
       * }
       *
       * OR:
       *
       * {
       *   albumId: "...",
       *   name: "...",
       *   description: "..."
       * }
       */

      const createdAlbum =
        response?.album ||
        response?.data?.album ||
        response?.data ||
        response;

      if (!createdAlbum?.albumId) {
        console.error(
          "Unexpected create album response:",
          response
        );

        throw new Error(
          "Album was created, but the server returned an unexpected response."
        );
      }

      /*
       * Add the newly-created album directly to the UI.
       *
       * This means the user does NOT need to refresh
       * the page to see the album.
       */
      setAlbums((currentAlbums) => [
        createdAlbum,
        ...currentAlbums,
      ]);

      // Reset form
      setAlbumName("");
      setAlbumDescription("");
      setShowCreateForm(false);
    } catch (err) {
      console.error("Failed to create album:", err);

      setCreateError(
        err.response?.data?.message ||
          err.message ||
          "Failed to create album."
      );
    } finally {
      setCreating(false);
    }
  };

  // --------------------------------------------------
  // EDIT ALBUM
  // --------------------------------------------------

  const handleOpenEdit = (album) => {
    setEditingAlbum(album);

    setEditName(album.name || "");
    setEditDescription(
      album.description || ""
    );

    setEditError("");
  };

  const handleCloseEdit = () => {
    setEditingAlbum(null);
    setEditName("");
    setEditDescription("");
    setEditError("");
  };

  const handleUpdateAlbum = async (event) => {
    event.preventDefault();

    const trimmedName = editName.trim();
    const trimmedDescription =
      editDescription.trim();

    if (!trimmedName) {
      setEditError("Album name is required.");
      return;
    }

    const albumId =
      editingAlbum.albumId ||
      editingAlbum._id;

    try {
      setUpdating(true);
      setEditError("");

      const response = await updateAlbum(albumId, {
        name: trimmedName,
        description: trimmedDescription,
      });

      console.log(
        "PUT /albums/:albumId response:",
        response
      );

      const updatedAlbum =
        response?.album ||
        response?.data?.album ||
        response?.data ||
        response;

      setAlbums((currentAlbums) =>
        currentAlbums.map((album) => {
          const currentAlbumId =
            album.albumId || album._id;

          if (currentAlbumId !== albumId) {
            return album;
          }

          return updatedAlbum?.albumId
            ? updatedAlbum
            : {
                ...album,
                name: trimmedName,
                description:
                  trimmedDescription,
              };
        })
      );

      handleCloseEdit();
    } catch (err) {
      console.error("Failed to update album:", err);

      setEditError(
        err.response?.data?.message ||
          "Failed to update album."
      );
    } finally {
      setUpdating(false);
    }
  };

  // --------------------------------------------------
  // DELETE ALBUM
  // --------------------------------------------------

  const handleDeleteAlbum = async (album) => {
    const albumId =
      album.albumId || album._id;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${album.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingAlbumId(albumId);

      await deleteAlbum(albumId);

      setAlbums((currentAlbums) =>
        currentAlbums.filter((currentAlbum) => {
          const currentAlbumId =
            currentAlbum.albumId ||
            currentAlbum._id;

          return currentAlbumId !== albumId;
        })
      );
    } catch (err) {
      console.error("Failed to delete album:", err);

      setError(
        err.response?.data?.message ||
          "Failed to delete album."
      );
    } finally {
      setDeletingAlbumId(null);
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="container py-5">
        <div className="d-flex justify-content-center">
          <div
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">
              Loading...
            </span>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <div className="container py-4 py-md-5">
      {/* PAGE HEADER */}

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">
            My Albums
          </h1>

          <p className="text-secondary mb-0">
            Organize and manage your photos.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShowCreateForm(
              (current) => !current
            );

            setCreateError("");
          }}
        >
          {showCreateForm
            ? "Close"
            : "+ Create Album"}
        </button>
      </div>

      {/* GENERAL ERROR */}

      {error && (
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* CREATE ALBUM CARD */}

      {showCreateForm && (
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <h2 className="h5 fw-bold mb-1">
                  Create Album
                </h2>

                <p className="text-secondary small mb-0">
                  Create a new album for your photos.
                </p>
              </div>
            </div>

            {createError && (
              <div
                className="alert alert-danger"
                role="alert"
              >
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateAlbum}>
              <div className="mb-3">
                <label
                  htmlFor="albumName"
                  className="form-label fw-semibold"
                >
                  Album Name
                </label>

                <input
                  id="albumName"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Goa Trip"
                  value={albumName}
                  onChange={(event) =>
                    setAlbumName(
                      event.target.value
                    )
                  }
                  disabled={creating}
                />
              </div>

              <div className="mb-3">
                <label
                  htmlFor="albumDescription"
                  className="form-label fw-semibold"
                >
                  Description
                </label>

                <textarea
                  id="albumDescription"
                  className="form-control"
                  rows="3"
                  placeholder="Describe this album..."
                  value={albumDescription}
                  onChange={(event) =>
                    setAlbumDescription(
                      event.target.value
                    )
                  }
                  disabled={creating}
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={creating}
                >
                  {creating ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      />
                      Creating...
                    </>
                  ) : (
                    "Create Album"
                  )}
                </button>

                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowCreateForm(false);
                    setAlbumName("");
                    setAlbumDescription("");
                    setCreateError("");
                  }}
                  disabled={creating}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ALBUM LIST */}

      {albums.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="display-6 mb-3">
              📷
            </div>

            <h2 className="h5 fw-bold">
              No albums yet
            </h2>

            <p className="text-secondary mb-3">
              Create your first album to start
              organizing your photos.
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                setShowCreateForm(true)
              }
            >
              Create Your First Album
            </button>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {albums.map((album) => {
            const albumId =
              album.albumId || album._id;

            const sharedUsers =
              Array.isArray(album.sharedUsers)
                ? album.sharedUsers
                : [];

            return (
              <div
                className="col-12 col-md-6 col-lg-4"
                key={albumId}
              >
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body d-flex flex-column">
                    <div className="mb-3">
                      <h2 className="h5 fw-bold mb-2">
                        {album.name}
                      </h2>

                      <p className="text-secondary mb-0">
                        {album.description ||
                          "No description added."}
                      </p>
                    </div>

                    {/* ALBUM METADATA */}

                    <div className="small text-secondary mb-3">
                      <div>
                        <strong>Album ID:</strong>{" "}
                        <span className="text-break">
                          {album.albumId}
                        </span>
                      </div>

                      <div>
                        <strong>Shared:</strong>{" "}
                        {sharedUsers.length} user
                        {sharedUsers.length !== 1
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

                    {/* ACTIONS */}

                    <div className="mt-auto d-flex flex-wrap gap-2">
                      <Link
                        to={`/albums/${albumId}`}
                        className="btn btn-outline-primary btn-sm"
                      >
                        Open Album
                      </Link>

                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                          handleOpenEdit(album)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm"
                        onClick={() =>
                          handleDeleteAlbum(album)
                        }
                        disabled={
                          deletingAlbumId ===
                          albumId
                        }
                      >
                        {deletingAlbumId ===
                        albumId
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT ALBUM MODAL */}

      {editingAlbum && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow">
              <div className="modal-header">
                <h2 className="modal-title h5 fw-bold">
                  Edit Album
                </h2>

                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseEdit}
                  disabled={updating}
                  aria-label="Close"
                />
              </div>

              <form onSubmit={handleUpdateAlbum}>
                <div className="modal-body">
                  {editError && (
                    <div
                      className="alert alert-danger"
                      role="alert"
                    >
                      {editError}
                    </div>
                  )}

                  <div className="mb-3">
                    <label
                      htmlFor="editAlbumName"
                      className="form-label fw-semibold"
                    >
                      Album Name
                    </label>

                    <input
                      id="editAlbumName"
                      type="text"
                      className="form-control"
                      value={editName}
                      onChange={(event) =>
                        setEditName(
                          event.target.value
                        )
                      }
                      disabled={updating}
                    />
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="editAlbumDescription"
                      className="form-label fw-semibold"
                    >
                      Description
                    </label>

                    <textarea
                      id="editAlbumDescription"
                      className="form-control"
                      rows="3"
                      value={editDescription}
                      onChange={(event) =>
                        setEditDescription(
                          event.target.value
                        )
                      }
                      disabled={updating}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseEdit}
                    disabled={updating}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={updating}
                  >
                    {updating
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BACKDROP */}

      {editingAlbum && (
        <div className="modal-backdrop fade show" />
      )}
    </div>
  );
}

export default Dashboard;


 