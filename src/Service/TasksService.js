import axios from "axios";

const baseUrl = "http://localhost:4000";

export function addTask(taskPayload) {
    return axios.post(`${baseUrl}/tasks`, taskPayload);
}

export function getTaskByScrumId(scrumId) {
    return axios.get(`${baseUrl}/tasks?scrumId=${scrumId}`);
}

export function patchTask(taskId, taskPayload) {
    return axios.patch(`${baseUrl}/tasks/${taskId}`, taskPayload);
}

export function getTasksByUserId(userId) {
    return axios.get(`${baseUrl}/tasks?assignedTo=${userId}`);
}