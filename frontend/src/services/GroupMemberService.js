import http from "../http-common";

class GroupMemberService {
  getGroupMembers(id) {
    return http.get("/groupmember?group=" + id);
  }

  get(id) {
    return http.get(`groupmember/${id}`);
  }

  create(data) {
    return http.post("groupmember/", data);
  }

  update(id, data) {
    return http.put(`groupmember/${id}`, data);
  }

  delete(id) {
    return http.delete(`groupmember/${id}`);
  }
}

export default new GroupMemberService();