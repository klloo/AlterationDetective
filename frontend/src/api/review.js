import axios from 'axios';

const PREFIX_URL = '/api/review'

export function getAlterationShopReviewList(params) {
    return axios.post(`${PREFIX_URL}/get-alteration-shop-review-list`,params);
}

export function getAlterationShopUserReviewList() {
    return axios.get(`${PREFIX_URL}/get-alteration-shop-user-review-list`);
}

export function registerReview(params) {
    return axios.post(`${PREFIX_URL}/register-review`,params);
}

export function deleteReview(params) {
    return axios.post(`${PREFIX_URL}/delete-review`,params);
}