import http from "../http-common";

class CongregationServices {
  getAll(params) {
    return http.get("/congregation", {params});
  }

  get(id) {
    return http.get(`congregation/${id}`);
  }

  create(data) {
    return http.post("congregation/", data);
  }

  update(id, data) {
    return http.put(`congregation/${id}`, data);
  }
  delete(id) {
    return http.delete(`congregation/${id}`);
  }

 
}

export default new CongregationServices();
