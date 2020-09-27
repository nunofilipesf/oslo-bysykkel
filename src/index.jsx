import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import MapBoxGl from 'mapbox-gl';

MapBoxGl.accessToken = 'pk.eyJ1IjoibnVub2ZpbGlwZXNmIiwiYSI6ImNrZmgxeHhlbzAwbHUzOHMydm1nc2prajQifQ.ACx92OxlVSlqpgW6s4-_XA';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);