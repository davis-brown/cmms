import http from '../http-common';

// Account management (admins only)
class UserService {
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
