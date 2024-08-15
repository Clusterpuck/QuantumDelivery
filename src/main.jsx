import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import PageLayout from './components/PageLayout';
import RandomFactGenerator from './components/Home';
import ViewRoutes from './components/ViewRoutes';
import LiveTracking from './components/LiveTracking';
import DailyReports from './components/DailyReports';
import AddOrder from './components/AddOrder';
import Login from "./components/Login";
import Register from "./components/Register";
import AccountDetails from './components/AccountDetails';
import './index.css';

// Initializes the routes within the app
const App = () => {
    return (
        <Router>
            <PageLayout>
                <Routes> 
                    <Route path="/" element={<Login />} />
                    <Route path="/viewroutes" element={<ViewRoutes />} />
                    <Route path="/livetracking" element={<LiveTracking />} />
                    <Route path="/dailyreports" element={<DailyReports />} />
                    <Route path="/addorder" element={<AddOrder />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/accountdetails" element={<AccountDetails />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<AddOrder />} />
                </Routes>
            </PageLayout>
        </Router>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
