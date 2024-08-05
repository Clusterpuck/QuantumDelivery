import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import RandomFactGenerator from './components/Home';
import ViewRoutes from './components/ViewRoutes';
import LiveTracking from './components/LiveTracking';
import DailyReports from './components/DailyReports';
import UploadRunsheet from './components/UploadRunsheet';
import './index.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RandomFactGenerator />} />
                <Route path="/viewroutes" element={<ViewRoutes />} />
                <Route path="/livetracking" element={<LiveTracking />} />
                <Route path="/dailyreports" element={<DailyReports />} />
                <Route path="/uploadrunsheet" element={<UploadRunsheet />} />
            </Routes>
        </Router>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
