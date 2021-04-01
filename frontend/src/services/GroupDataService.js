import http from "../http-common";

class GroupDataService {
    

getAll(params) {
    return http.get("/group", {params});
}

get(id) {
    return http.get(`group/${id}`);
}

create(data) {
    return http.post("group/", data);
}

update(id, data) {
    return http.put(`group/${id}`, data);
}
delete(id) {
    return http.delete(`group/${id}`);
  }

}

export default new GroupDataService(); 