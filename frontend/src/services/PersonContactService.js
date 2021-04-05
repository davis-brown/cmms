import http from "../http-common";

class PersonContactService {
  getAll(id) {
    return http.get("/personcontact?person=" + id);
  }

  get(id) {
    return http.get(`personcontact/${id}`);
  }

  create(data) {
    return http.post("personcontact/", data);
  }

  update(id, data) {
    return http.put(`personcontact/${id}`, data);
  }

  delete(id) {
    return http.delete(`personcontact/${id}`);
  }

  deleteAll(id) {
    return http.delete(`/personcontact?person=` + id);
  }
}

export default new PersonContactService();
