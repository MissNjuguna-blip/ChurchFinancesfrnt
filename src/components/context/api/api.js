// import axios from "axios";

import axios from "axios";

const api = axios.create({
//   baseURL: "http://127.0.0.1:8000/api/",
baseURL:"https://dcfinances.alwaysdata.net/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const access_token =
    localStorage.getItem("access_token");
  const publicEndpoints = [
    "core/login/",
    "core/register/",
  ];

  const isPublicEndpoint =
    publicEndpoints.includes(config.url);

  if (
    access_token &&
    !isPublicEndpoint
  ) {
    config.headers.Authorization =
      `Bearer ${access_token}`;
  }

  return config;
});

export default api;