import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    HashRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PageLayout from './components/PageLayout';
import ViewRoutes from './pages/ViewRoutes';
import LiveTracking from './pages/LiveTracking';
import DailyReports from './pages/DailyReports';
import AddOrder from './pages/AddOrder';
import Login from "./pages/Login";
import Register from "./pages/Register";
import AccountDetails from './pages/AccountDetails';
import PrivateRoute from './constants/PrivateRoute';
import Unauthorized from './pages/Unauthorized';
import './index.css';
import './App.css';
import DriverViewRoutes from '../pages/DriverViewRoutes';

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
                <PageLayout>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} /> {/* TO DO: move to admin controls page */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/unauthorized" element={<Unauthorized />} /> {/* Unauthorized page */}

                        {/* Protected routes (Admin only) */}
                        <Route path="/viewroutes" element={
                            <PrivateRoute role="ADMIN">
                                <ViewRoutes />
                            </PrivateRoute>
                        } />
                        <Route path="/livetracking" element={
                            <PrivateRoute role="ADMIN">
                                <LiveTracking />
                            </PrivateRoute>
                        } />
                        <Route path="/dailyreports" element={
                            <PrivateRoute role="ADMIN">
                                <DailyReports />
                            </PrivateRoute>
                        } />
                        <Route path="/addorder" element={
                            <PrivateRoute role="ADMIN">
                                <AddOrder />
                            </PrivateRoute>
                        } />
                        <Route path="/accountdetails" element={
                            <PrivateRoute role="ADMIN">
                                <AccountDetails />
                            </PrivateRoute>
                        } />
                        <Route path="/home" element={
                            <PrivateRoute role="ADMIN">
                                <AddOrder />
                            </PrivateRoute>
                        } />

                        {/* Protected routes (Admin and Driver) */}
                        <Route path="/driverviewroutes" element={
                            <PrivateRoute>
                                <DriverViewRoutes />
                            </PrivateRoute>
                        } />
                    </Routes>
                </PageLayout>
            </Router>
        </ThemeProvider>
    );
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
