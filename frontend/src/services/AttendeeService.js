import http from "../http-common";

class AttendeeService {
  getAttendee(id) {
    return http.get("/attendee?events=" +id);
  }

  get(id) {
    return http.get(`attendee/${id}`);
  }

  create(data) {
    return http.post("attendee/", data);
  }
}

export default new AttendeeService();