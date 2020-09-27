import React from 'react';
import { Map, Popup, Marker } from 'mapbox-gl';
import './style.css';

const VISUALIZATION_TYPES = {
    ALL: 'all',
    BIKES: 'bikes',
    DOCKS: 'docks'
}

export default class extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            // Oslo coordinates
            lng: 10.74609,
            lat: 59.91273,
            zoom: 13,
            visualizationType: VISUALIZATION_TYPES.BIKES
        };
    }

    componentDidMount() {
        const map = new Map({
            container: this.mapContainer,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [this.state.lng, this.state.lat],
            zoom: this.state.zoom
        });

        map.on('load', onMapLoad(map, this.props.markers))
    }

    onChangeVisualizationType(type) {
        return () => this.setState({ visualizationType: type });
    }

    render() {
        return <div className={`map map-${this.state.visualizationType}`}>
            <div className="map-container" ref={el => this.mapContainer = el} />
            <div className="map-controls">
                <button
                    className={this.state.visualizationType === VISUALIZATION_TYPES.ALL ? 'selected' : ''}
                    onClick={this.onChangeVisualizationType(VISUALIZATION_TYPES.ALL)}>
                    All
                </button>

                <button
                    className={this.state.visualizationType === VISUALIZATION_TYPES.BIKES ? 'selected' : ''}
                    onClick={this.onChangeVisualizationType(VISUALIZATION_TYPES.BIKES)}>
                    Bikes
                </button>

                <button
                    className={this.state.visualizationType === VISUALIZATION_TYPES.DOCKS ? 'selected' : ''}
                    onClick={this.onChangeVisualizationType(VISUALIZATION_TYPES.DOCKS)}>
                    Docks
                </button>
            </div>
        </div>
    }
}

function onMapLoad(map, markers) {
    return function () {
        // From: https://docs.mapbox.com/help/tutorials/custom-markers-gl-js
        const geojsonData = {
            type: 'FeatureCollection',
            features: markers.map(stationMarkerToGeoJsonPointMapper)
        };

        for (const marker of geojsonData.features) {
            // create a HTML element for each feature
            const markerElement = document.createElement('div');
            markerElement.className = 'marker';

            if (marker.properties.bikes === 0)
                markerElement.classList.add('marker-no-bikes');

            if (marker.properties.docks === 0)
                markerElement.classList.add('marker-no-docks');

            // make a marker for each feature and add to the map
            new Marker(markerElement)
                .setLngLat(marker.geometry.coordinates)
                .setPopup(
                    new Popup({ offset: 5 })
                        .setHTML(getPopupHtml(marker.properties))
                )
                .addTo(map);
        }
    }
}

function stationMarkerToGeoJsonPointMapper(marker) {
    return {
        type: 'Feature',
        properties: {
            name: marker.name,
            address: marker.address,
            bikes: marker.num_bikes_available,
            docks: marker.num_docks_available
        },
        geometry: {
            type: 'Point',
            coordinates: [marker.lon, marker.lat]
        }
    }
}

function getPopupHtml({ name, bikes, docks }) {
    return `
        <h3 class="title">${name}</h3>
        <p class="info-entry">🚲 ${bikes} available bikes</p>
        <p class="info-entry">🅿️ ${docks} available docks</p>
    `;
}