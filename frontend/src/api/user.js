import axios from 'axios';

const PREFIX_URL = '/api/user'

export function registerUser(params) {
    return axios.post(`${PREFIX_URL}/register`, params);
}

export function updateUser(params) {
    return axios.post(`${PREFIX_URL}/update`, params);
}

export function checkLogin() {
    return axios.get(`${PREFIX_URL}/check`);
}

export function login(params) {
    return axios.post(`${PREFIX_URL}/login`, params);
}

export function logout() {
    return axios.get(`${PREFIX_URL}/logout`);
}

export function sendAuthMail(params) {
    return axios.post(`${PREFIX_URL}/send-auth-mail`, params);
}

export function checkDuplicatedEmail(params) {
    return axios.post(`${PREFIX_URL}/check-duplicated-email`, params);
}

export function getBookmarkPlace() {
    return axios.get(`${PREFIX_URL}/get-bookmark-place`);
}

export function getBookmarkPlaceMaxId() {
    return axios.get(`${PREFIX_URL}/get-bookmark-place-max-id`);
}

export function updateBookmarkPlace(params) {
    return axios.post(`${PREFIX_URL}/update-bookmark-place`, params);
}

export function checkPassword(params) {
    return axios.post(`${PREFIX_URL}/check-password`, params);
}

export function deleteUser() {
    return axios.delete(`${PREFIX_URL}/delete-user`);
}