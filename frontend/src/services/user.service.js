import api from "./api";

export const searchUsersByEmail = async (email) => {
  const response = await api.get("/users/search", {
    params: {
      email,
    },
  });

  return response.data;
};