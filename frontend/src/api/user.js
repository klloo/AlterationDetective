import axios from 'axios';

const PREFIX_URL = '/api/user'

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