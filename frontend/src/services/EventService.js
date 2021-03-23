import http from "../http-common";

class EventService {
  getEvents(params) {
    return http.get("/events", {params});
  }

  get(id) {
    return http.get(`events/${id}`);
  }

  create(data) {
    return http.post("events/", data);
  }

  update(id, data) {
    return http.put(`events/${id}`, data);
  }

  delete(id) {
    return http.delete(`events/${id}`);
  }

  //deleteAll() {
  //  return http.delete(`courses`);
  //}
}

export default new EventService();