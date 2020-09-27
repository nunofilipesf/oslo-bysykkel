import React, { useState, useEffect } from 'react';
import Loader from '../../components/Loader';
import Map from '../../components/Map';
import { getStations } from '../../services/stations';

export default function () {
    const [stations, setStations] = useState(null);

    useEffect(() => {
        if (stations == null)
            getStations().then(setStations);
    })

    return stations == null
        ? <Loader />
        : <Map markers={stations} />
}