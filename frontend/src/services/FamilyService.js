import http from "../http-common";

class FamilyService {
  getFamilies(params) {
    return http.get("/families", {params});
  }

  get(id) {
    return http.get(`families/${id}`);
  }

  create(data) {
    return http.post("families/", data);
  }

  update(id, data) {
    return http.put(`families/${id}`, data);
  }

  delete(id) {
    return http.delete(`families/${id}`);
  }

  //deleteAll() {
  //  return http.delete(`courses`);
  //}
}

export default new FamilyService();