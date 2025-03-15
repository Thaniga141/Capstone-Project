import axios from 'axios';

const baseUrl = 'http://localhost:4000';

export function getAllScrums() {
    return axios.get(`${baseUrl}/scrums`);
}

export function getScrumsById(scrumId) {
    return axios.get(`${baseUrl}/scrums/${scrumId}`);
}

export function addScrum(scrumPayload) {
    return axios.post(`${baseUrl}/scrums`, scrumPayload);
}

