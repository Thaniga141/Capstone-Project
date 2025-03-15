import axios from "axios";

const baseUrl = "http://localhost:4000";

export function getAllUsers() {
    return axios.get(`${baseUrl}/users`);
}

export function getUserByEmailAndPassword(email, password) {
    return axios.get(`${baseUrl}/users?email=${email}&password=${password}`);
}

export function addUser(userPayload) {
    return axios.post(`${baseUrl}/users`, userPayload);
}