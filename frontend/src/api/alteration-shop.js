import axios from 'axios';

const PREFIX_URL = '/api/alteration-shop'

export function getAlterationShopList() {
    return axios.get(`${PREFIX_URL}/get-alteration-shop-list`);
}