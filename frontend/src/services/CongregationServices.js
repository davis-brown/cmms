import http from "../http-common";

class CongregationServices {
  getAll() {
    return http.get("/congregation");
  }

  get(congregation_id) {
    return http.get(`congregation/${congregation_id}`);
  }

  create(data) {
    return http.post("congregation/", data);
  }

  update(congregation_id, data) {
    return http.put(`congregation/${congregation_id}`, data);
  }

 
}

export default new CongregationServices();