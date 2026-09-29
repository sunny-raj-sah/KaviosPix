import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getAlbums } from "../services/album.service";
import {
  getFavoriteImages,
  getImageFile,
} from "../services/image.service";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [imageUrls, setImageUrls] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError("");

      const albumResponse = await getAlbums();

      let albums = [];

      if (Array.isArray(albumResponse)) {
        albums = albumResponse;
      } else if (
        Array.isArray(albumResponse?.albums)
      ) {
        albums = albumResponse.albums;
      } else if (
        Array.isArray(albumResponse?.data)
      ) {
        albums = albumResponse.data;
      }

      if (albums.length === 0) {
        setFavorites([]);
        setImageUrls({});
        return;
      }

      const favoriteResults =
        await Promise.all(
          albums.map(async (album) => {
            const albumId =
              album.albumId || album._id;

            if (!albumId) {
              return [];
            }

            try {
              const response =
                await getFavoriteImages(
                  albumId
                );

              let images = [];

              if (Array.isArray(response)) {
                images = response;
              } else if (
                Array.isArray(response?.images)
              ) {
                images = response.images;
              } else if (
                Array.isArray(response?.data)
              ) {
                images = response.data;
              }

              return images.map((image) => ({
                ...image,
                albumName: album.name,
                albumId,
              }));
            } catch (albumError) {
              console.warn(
                `Failed to load favorites for album ${albumId}:`,
                albumError
              );

              return [];
            }
          })
        );

      const favoriteImages =
        favoriteResults.flat();

      setFavorites(favoriteImages);

      await loadImageFiles(
        favoriteImages
      );
    } catch (err) {
      console.error(
        "Failed to load favorites:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Failed to load favorites."
      );
    } finally {
      setLoading(false);
    }
  };

  const loadImageFiles = async (
    images
  ) => {
    const results = await Promise.all(
      images.map(async (image) => {
        const imageId =
          image.imageId || image._id;

        if (!imageId || !image.albumId) {
          return null;
        }

        try {
          const blob = await getImageFile(
            image.albumId,
            imageId
          );

          const objectUrl =
            URL.createObjectURL(blob);

          return {
            imageId,
            objectUrl,
          };
        } catch (err) {
          console.warn(
            `Failed to load image ${imageId}:`,
            err
          );

          return null;
        }
      })
    );

    const urlMap = {};

    results.forEach((result) => {
      if (!result) {
        return;
      }

      urlMap[result.imageId] =
        result.objectUrl;
    });

    setImageUrls(urlMap);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadFavorites();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      Object.values(imageUrls).forEach(
        (url) => {
          URL.revokeObjectURL(url);
        }
      );
    };
  }, [imageUrls]);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center py-5">
          <div
            className="spinner-border"
            role="status"
          >
            <span className="visually-hidden">
              Loading favorites...
            </span>
          </div>

          <p className="text-secondary mt-3 mb-0">
            Loading your favorite photos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5">
        <div
          className="alert alert-danger"
          role="alert"
        >
          {error}
        </div>

        <button
          type="button"
          className="btn btn-primary"
          onClick={loadFavorites}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container py-4 py-md-5">
      <div className="mb-4">
        <Link
          to="/dashboard"
          className="btn btn-outline-secondary btn-sm"
        >
          ← Back to Albums
        </Link>
      </div>

      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">
          Favorite Photos
        </h1>

        <p className="text-secondary mb-0">
          Photos you've marked as favorites
          across your albums.
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="display-4 mb-3">
              ☆
            </div>

            <h2 className="h5 fw-bold">
              No favorite photos yet
            </h2>

            <p className="text-secondary mb-4">
              Mark photos as favorites and
              they'll appear here.
            </p>

            <Link
              to="/dashboard"
              className="btn btn-primary"
            >
              Browse Albums
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="text-secondary small">
              {favorites.length} favorite{" "}
              {favorites.length === 1
                ? "photo"
                : "photos"}
            </span>
          </div>

          <div className="row g-3">
            {favorites.map((image) => {
              const imageId =
                image.imageId || image._id;

              return (
                <div
                  className="col-6 col-md-4 col-lg-3"
                  key={`${image.albumId}-${imageId}`}
                >
                  <div className="card border-0 shadow-sm h-100 overflow-hidden">
                    {imageUrls[imageId] ? (
                      <img
                        src={imageUrls[imageId]}
                        alt={
                          image.name ||
                          "Favorite image"
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
                        <h2 className="h6 fw-semibold text-truncate mb-2">
                          {image.name ||
                            "Image"}
                        </h2>

                        <span className="text-warning fs-5">
                          ★
                        </span>
                      </div>

                      <div className="small text-secondary text-truncate mb-2">
                        Album:{" "}
                        {image.albumName ||
                          "Unknown album"}
                      </div>

                      {image.tags?.length >
                        0 && (
                        <div className="d-flex flex-wrap gap-1">
                          {image.tags.map(
                            (tag) => (
                              <span
                                key={tag}
                                className="badge text-bg-light border text-dark"
                              >
                                #{tag}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>

                    <div className="card-footer bg-white border-0 px-3 pb-3">
                      <Link
                        to={`/albums/${image.albumId}`}
                        className="btn btn-outline-primary btn-sm w-100"
                      >
                        Open Album
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default Favorites;