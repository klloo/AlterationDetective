import moment from 'moment';

export function distFormatter(dist) {
    const roundDist = Math.round(dist);
    if(roundDist < 1000) {
        return `${roundDist} m`;
    }
    const km = dist / 1000;
    return `${km.toFixed(1)} km`;
}
export function dateFormatter(datetime) {
    const dateformat = 'YYYY-MM-DD HH:mm';
    return moment(new Date(datetime)).format(dateformat);
}
export function starRateFormatter(starRate) {
    return Number(Number(starRate).toFixed(1));
}