import React from 'react';
import Topbar from './components/Topbar';
import StationLocator from './pages/StationLocator';
import Footer from './components/Footer';
import './styles/app.css';

function App() {
    return (
        <div className="app">
            <Topbar />
            <div className="app-content">
                <StationLocator />
            </div>
            <Footer />
        </div>
    );
}

export default App;
