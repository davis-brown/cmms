import http from "../http-common";

class PersonDataService {

getAll(params) {
    return http.get("/person", {params});
}

get(id) {
    return http.get(`person/${id}`);
}

create(data) {
    return http.post("person/", data);
}

update(id, data) {
    return http.put(`person/${id}`, data);
}
delete(id) {
    return http.delete(`person/${id}`);
  }

}

export default new PersonDataService(); 