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
import Orders from './pages/Orders';
import Login from "./pages/Login";
import AccountDetails from './pages/AccountDetails';
import DriverViewRoutes from './pages/DriverViewRoutes';
import PrivateRoute from './constants/PrivateRoute'; 
import Unauthorized from './pages/Unauthorized'; 
import AdminControls from './pages/AdminControls';
import AdminDriverNav from './pages/AdminDriverNav';
import LandingPage from './pages/LandingPage';
import './index.css';
import './App.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#582c4d',
            accent: '#7390BF',
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
                        <Route path="/orders" element={
                            <PrivateRoute role="ADMIN">
                                <Orders />
                            </PrivateRoute>
                        } />
                        <Route path="/accountdetails" element={
                            <PrivateRoute>
                                <AccountDetails />
                            </PrivateRoute>
                        } />
                        <Route path="/home" element={
                            <PrivateRoute role="ADMIN">
                                <LandingPage />
                            </PrivateRoute>
                        } />
                        <Route path="/admincontrols" element={
                            <PrivateRoute role="ADMIN">
                                <AdminControls />
                            </PrivateRoute>
                        } />

                        {/* Protected routes (Admin and Driver) */}
                        <Route path="/driverviewroutes" element={
                            <PrivateRoute>
                                <DriverViewRoutes />
                            </PrivateRoute>
                        } />

                        {/* Protected routes (Admin and Driver) */}
                        <Route path="/admindrivernav" element={
                        <PrivateRoute role="ADMIN">
                            <AdminDriverNav />
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

