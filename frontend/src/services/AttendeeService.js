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

  // Cancels the logged-in user's RSVP to the event
  delete(evt_ID) {
    return http.delete("/attendee?events=" + evt_ID);
  }
}

export default new AttendeeService();