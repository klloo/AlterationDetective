import axios from 'axios';

const PREFIX_URL = '/api/alteration-shop'


export function getAlterationShopList(params) {
    return axios.post(`${PREFIX_URL}/get-alteration-shop-list`,params);
}

export function getAlterationShopDetail(params) {
    return axios.post(`${PREFIX_URL}/get-alteration-shop-detail`,params);
}

export function toggleShopLike(params) {
    return axios.post(`${PREFIX_URL}/toggle-shop-like`, params);
}

export function getLikeShopList(params) {
    return axios.post(`${PREFIX_URL}/get-like-shop-list`,params);
}