 import api from "./api";

export const getAlbums = async () => {
  const response = await api.get("/albums");
  return response.data;
};

// export const getAlbumById = async (albumId) => {
//   const response = await api.get(`/albums/${albumId}`);
//   return response.data;
// };

export const createAlbum = async (albumData) => {
  const response = await api.post("/albums", albumData);
  return response.data;
};

export const updateAlbum = async (
  albumId,
  albumData
) => {
  const response = await api.put(
    `/albums/${albumId}`,
    albumData
  );

  return response.data;
};

export const deleteAlbum = async (albumId) => {
  const response = await api.delete(
    `/albums/${albumId}`
  );

  return response.data;
};

export const shareAlbum = async (
  albumId,
  emails
) => {
  const response = await api.post(
    `/albums/${albumId}/share`,
    { emails }
  );

  return response.data;
};
export const revokeAlbumAccess = async (albumId, email) => {
  const response = await api.delete(
    `/albums/${albumId}/share`,
    {
      data: {
        email,
      },
    }
  );

  return response.data;
};