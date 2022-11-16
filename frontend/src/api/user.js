import axios from 'axios';

const PREFIX_URL = '/api/user'

export function login(params) {
    return axios.post(`${PREFIX_URL}/login`, params);
}

export function checkLogin() {
    return axios.get(`${PREFIX_URL}/login`);
}