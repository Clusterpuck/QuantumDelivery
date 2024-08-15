import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import PageLayout from './components/PageLayout';
import ViewRoutes from './pages/ViewRoutes';
import LiveTracking from './pages/LiveTracking';
import DailyReports from './pages/DailyReports';
import AddOrder from './pages/AddOrder';
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccountDetails from './pages/AccountDetails';
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
