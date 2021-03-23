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

  upload(data) {
    return http.post("families/upload", data);
  }

  update(id, data) {
    return http.put(`families/${id}`, data);
  }

  delete(id, fam_pic) {
    return http.delete(`families/${id}`, { data: {fam_pic: fam_pic}});
  }

}

export default new FamilyService();