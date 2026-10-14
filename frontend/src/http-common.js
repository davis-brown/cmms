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

export default http;
