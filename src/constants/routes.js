import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    HashRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import RandomFactGenerator from './components/Home';
import ViewRoutes from './components/ViewRoutes';
import LiveTracking from './components/LiveTracking';
import DailyReports from './components/DailyReports';
import AddOrder from './components/AddOrder';
import Login from './components/Login';
import Register from '../components/Register';
import AccountDetails from '../components/AccountDetails';
import PrivateRoute from './constants/PrivateRoute'; 
import DriverViewRoutes from "../pages/DriverViewRoutes";
import './index.css';

import './App.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#582c4d',
        },
        secondary: {
            main: '#f7d1cd',
        },
        background: {
            default: '#819BC5',
            paper: '#e6e8ef'
        },
        text: {
            primary: '#2f2f2f',
        },
    },
});

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={
                        <PrivateRoute>
                            <AddOrder />
                        </PrivateRoute>
                    } />
                    <Route path="/viewroutes" element={
                        <PrivateRoute>
                            <ViewRoutes />
                        </PrivateRoute>
                    } />
                    <Route path="/livetracking" element={
                        <PrivateRoute>
                            <LiveTracking />
                        </PrivateRoute>
                    } />
                    <Route path="/dailyreports" element={
                        <PrivateRoute>
                            <DailyReports />
                        </PrivateRoute>
                    } />
                    <Route path="/accountdetails" element={
                        <PrivateRoute>
                            <AccountDetails />
                        </PrivateRoute>
                    } />
                    <Route path="/driverviewroutes" element={
                      <PrivateRoute>
                          <DriverViewRoutes />
                      </PrivateRoute>
                    } />
                </Routes>
            </Router>
        </ThemeProvider>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
