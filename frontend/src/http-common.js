import axios from "axios";
import authHeader from "./services/auth-header";

var baseurl;
if (process.env.NODE_ENV === "development") {
  baseurl = "http://localhost:8080/api/";
} else {
  baseurl = "/api/";
}
const http = axios.create({
  baseURL: baseurl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    crossDomain: true
  }
});

// Send the logged-in user's token with every API request
http.interceptors.request.use(config => {
  Object.assign(config.headers, authHeader());
  return config;
});

// A 401 means the saved login is no longer valid (it expires after 24 hours).
// Clear it and start over at the login page, which also resets the store.
http.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("user");
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

export default http;
