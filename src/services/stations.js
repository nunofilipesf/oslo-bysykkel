export function getStations() {
    return Promise.all([
            executeRequest('https://gbfs.urbansharing.com/oslobysykkel.no/station_information.json'),
            executeRequest('https://gbfs.urbansharing.com/oslobysykkel.no/station_status.json')
        ])
        .then(([info, status]) => mergeData(info, status));
}

function executeRequest(url) {
    return fetch(url)
        .then(response => response.json())
        .then(response => response.data);
}

function mergeData(info, status) {
    const infoData = info.stations;
    const statusData = status.stations;

    const mergedData = [];
    for (const station of infoData) {
        const stationStatus = statusData.find(stationFilter(station.station_id)) || {};

        mergedData.push({
            ...station,
            ...stationStatus
        });
    }

    return mergedData;
}

function stationFilter(stationId) {
    return (station) => station.station_id === stationId;
}