import axios from 'axios';

export function getServerData() {
    return axios.get('/api/test/server-data');
}