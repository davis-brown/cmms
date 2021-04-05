import http from "../http-common";

class CommunicationService {

getAll(params) {
    return http.get("/communications", {params});
}

get(id) {
    return http.get(`communications/${id}`);
}

create(data) {
    return http.post("communications/", data);
}

update(id, data) {
    return http.put(`communications/${id}`, data);
}
delete(id) {
    return http.delete(`communications/${id}`);
  }

}

export default new CommunicationService(); 