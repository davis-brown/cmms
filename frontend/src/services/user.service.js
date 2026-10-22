import axios from 'axios';
import authHeader from './auth-header';
import http from '../http-common';

var API_URL;
if (process.env.NODE_ENV === "development") {
  API_URL = "http://localhost:8080/api/test/";
} else {
  API_URL = "/api/test/";
}


class UserService {
  getPublicContent() {
    return axios.get(API_URL + 'all');
  }

  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

  getModeratorBoard() {
    return axios.get(API_URL + 'mod', { headers: authHeader() });
  }

  getAdminBoard() {
    return axios.get(API_URL + 'admin', { headers: authHeader() });
  }

  // Account management (admins only)
  getUsers() {
    return http.get('/users');
  }

  updateUser(id, changes) {
    return http.put(`/users/${id}`, changes);
  }

  deleteUser(id) {
    return http.delete(`/users/${id}`);
  }
}

export default new UserService();