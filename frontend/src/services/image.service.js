 import api from "./api";

export const getAlbumImages = async (
  albumId,
  tags
) => {
  const params = {};

  if (tags) {
    params.tags = tags;
  }

  const response = await api.get(
    `/albums/${albumId}/images`,
    { params }
  );

  return response.data;
};

export const getFavoriteImages = async (
  albumId
) => {
  const response = await api.get(
    `/albums/${albumId}/images/favorites`
  );

  return response.data;
};

export const uploadImage = async (
  albumId,
  formData
) => {
  const response = await api.post(
    `/albums/${albumId}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

export const updateFavorite = async (
  albumId,
  imageId,
  isFavorite
) => {
  const response = await api.put(
    `/albums/${albumId}/images/${imageId}/favorite`,
    {
      isFavorite,
    }
  );

  return response.data;
};

export const addComment = async (
  albumId,
  imageId,
  comment
) => {
  const response = await api.post(
    `/albums/${albumId}/images/${imageId}/comments`,
    {
      comment,
    }
  );

  return response.data;
};

export const deleteImage = async (
  albumId,
  imageId
) => {
  const response = await api.delete(
    `/albums/${albumId}/images/${imageId}`
  );

  return response.data;
};

export const getImageFile = async (
  albumId,
  imageId
) => {
  const response = await api.get(
    `/albums/${albumId}/images/${imageId}/file`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};