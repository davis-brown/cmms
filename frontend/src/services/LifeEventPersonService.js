import http from "../http-common";

class LifeEventPersonService {
  getLifeEventPerson(id) {
    return http.get("/lifeventperson?person=" + id);
  }

  get(id) {
    return http.get(`lifeventperson/${id}`);
  }

  create(data) {
    return http.post("lifeventperson/", data);
  }

  update(id, data) {
    return http.put(`lifeventperson/${id}`, data);
  }

  delete(id) {
    return http.delete(`lifeventperson/${id}`);
  }

  deleteAll(id) {
    return http.delete("/lifeventperson?person=" + id);
  }
}

export default new LifeEventPersonService();