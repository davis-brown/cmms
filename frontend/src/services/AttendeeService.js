import http from "../http-common";

class AttendeeService {
  getAttendee(id) {
    return http.get("/attendee?event=" + id);
  }

  get(id) {
    return http.get(`attendee/${id}`);
  }

  create(data) {
    return http.post("attendee/", data);
  }

  update(id, data) {
    return http.put(`attendee/${id}`, data);
  }

  delete(id) {
    return http.delete(`attendee/${id}`);
  }

  deleteAll(id) {
    return http.delete(`/attendee?event=` + id);
  }
}

export default new AttendeeService();