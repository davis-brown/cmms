import http from "../http-common";

class LifeEventService {

getAll(params) {
    return http.get("/lifeevent", {params});
}

get(id) {
    return http.get(`lifeevent/${id}`);
}

create(data) {
    return http.post("lifeevent/", data);
}

update(id, data) {
    return http.put(`lifeevent/${id}`, data);
}
delete(id) {
    return http.delete(`lifeevent/${id}`);
  }

}

export default new LifeEventService(); 