import http from "../http-common";

class PersonDataService {

getAll() {
    return http.get("/person");
}

get(per_ID) {
    return http.get(`person/${per_ID}`);
}

create(data) {
    return http.post("person/", data);
}

update(per_ID, data) {
    return http.put(`person/${per_ID}`, data);
}

}

export default new PersonDataService(); 