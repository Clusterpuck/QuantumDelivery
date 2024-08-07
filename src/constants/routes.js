import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RandomFactGenerator from './components/Home';
import ViewRoutes from './components/ViewRoutes';
import LiveTracking from './components/LiveTracking';
import DailyReports from './components/DailyReports';
import AddOrder from './components/AddOrder';
import './index.css';

// Initializes the routes within the app
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RandomFactGenerator />} />
                <Route path="/viewroutes" element={<ViewRoutes />} />
                <Route path="/livetracking" element={<LiveTracking />} />
                <Route path="/dailyreports" element={<DailyReports />} />
                <Route path="/addorder" element={<AddOrder />} />
            </Routes>
        </Router>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
