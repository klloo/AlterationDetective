export function distFormatter(dist) {
    const roundDist = Math.round(dist);
    if(roundDist < 1000) {
        return `${roundDist} m`;
    }
    const km = dist / 1000;
    return `${km.toFixed(1)} km`;
}