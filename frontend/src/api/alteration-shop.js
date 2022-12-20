import axios from 'axios';

const PREFIX_URL = '/api/alteration-shop'

export function getTagList() {
    return axios.get(`${PREFIX_URL}/get-tag-list`);
}

export function getAlterationShopList() {
    return axios.get(`${PREFIX_URL}/get-alteration-shop-list`);
}

export function getAlterationShopDetail(alterationShopId) {
    return axios.get(`${PREFIX_URL}/get-alteration-shop-detail`,{
        params: {
            alterationShopId,
        },
    });
}

export function toggleShopLike(params) {
    return axios.post(`${PREFIX_URL}/toggle-shop-like`, params);
}