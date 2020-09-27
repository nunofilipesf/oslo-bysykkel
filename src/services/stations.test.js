import { getStations } from './stations';

global.fetch = jest.fn(() => mockFetchResult());

function mockFetchResult(data = { data: { stations: [] } }) {
    return Promise.resolve({
        json: () => Promise.resolve(data)
    });
}

beforeEach(() => {
    fetch.mockClear();
});

it('has no stations', async() => {
    const stationsData = await getStations();

    expect(stationsData).toEqual([]);
    expect(fetch).toHaveBeenCalledTimes(2);
});

it('has stations without status', async() => {
    const stationsInfo = {
        "last_updated": 1,
        "data": {
            "stations": [{
                "station_id": "1",
                "name": "Stasjon",
                "address": "Stasjon",
                "lat": 10,
                "lon": 20,
                "capacity": 1
            }]
        }
    };

    const stationsStatus = {
        "last_updated": 1,
        "data": {
            "stations": []
        }
    };

    fetch.mockReturnValueOnce(mockFetchResult(stationsInfo));
    fetch.mockReturnValueOnce(mockFetchResult(stationsStatus));

    const stationsData = await getStations();

    expect(stationsData).toEqual(stationsInfo.data.stations);
});

it('has status without station info', async() => {
    const stationsInfo = {
        "last_updated": 1,
        "data": {
            "stations": []
        }
    };

    const stationsStatus = {
        "last_updated": 1,
        "data": {
            "stations": [{
                "is_installed": 1,
                "is_renting": 1,
                "num_bikes_available": 10,
                "num_docks_available": 10,
                "last_reported": 1,
                "is_returning": 1,
                "station_id": "1"
            }]
        }
    };

    fetch.mockReturnValueOnce(mockFetchResult(stationsInfo));
    fetch.mockReturnValueOnce(mockFetchResult(stationsStatus));

    const stationsData = await getStations();

    expect(stationsData).toEqual([]);
});

it('has stations with status', async() => {
    const stationsInfo = {
        "last_updated": 1,
        "data": {
            "stations": [{
                "station_id": "1",
                "name": "Stasjon",
                "address": "Stasjon",
                "lat": 10,
                "lon": 20,
                "capacity": 20
            }]
        }
    };

    const stationsStatus = {
        "last_updated": 1,
        "data": {
            "stations": [{
                "is_installed": 1,
                "is_renting": 1,
                "num_bikes_available": 10,
                "num_docks_available": 10,
                "last_reported": 1,
                "is_returning": 1,
                "station_id": "1"
            }]
        }
    };

    fetch.mockReturnValueOnce(mockFetchResult(stationsInfo));
    fetch.mockReturnValueOnce(mockFetchResult(stationsStatus));

    const stationsData = await getStations();

    expect(stationsData).toEqual([{
        ...stationsInfo.data.stations[0],
        ...stationsStatus.data.stations[0]
    }]);
});