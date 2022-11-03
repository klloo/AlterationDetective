import axios from 'axios';

export function getServerData() {
    return axios.get('/api/home/server-data');
}