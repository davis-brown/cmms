import http from "../http-common";

class FamilyPersonService {
  getFamilyPersons(id) {
    return http.get("/familyperson?family=" + id);
  }

  get(id) {
    return http.get(`familyperson/${id}`);
  }

  create(data) {
    return http.post("familyperson/", data);
  }

  update(id, data) {
    return http.put(`familyperson/${id}`, data);
  }

  delete(id) {
    return http.delete(`familyperson/${id}`);
  }

  deleteAll() {
    return http.delete(`familyperson`);
  }
}

export default new FamilyPersonService();