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
import Cookies from 'js-cookie';
import './index.css';
import './App.css';

const theme = createTheme({
    palette: {
        primary: {
            main: '#582c4d',                        // Action color
            light: '#F1E4EE',                       // Light action color
            accent: '#7390BF',                      // Accent color
            lightaccent: '#D4DEED',                 // Light accent color
            mediumaccent: '#B7C8E1',                // Medium accent color
            darkaccent: '#243856',                  // Dark accent color
        },
        secondary: {
            main: '#D4DEED',                        // Highlight color
            accent: '#e6e8ef',                      // Secondary color
        },
        tertiary:{
            main: 'red'
        },
        background: {
            default: '#D4DEED',                     // Background color
            paper: '#F1F4F9',                       // Paper color (background for cards, etc.)
        },
        text: {
            primary: '#2f2f2f',                     // Primary text color
        },
    },
});

const HomePage = () => {
    const userRole = Cookies.get('userRole'); // Retrieve the role from the cookie
    if(userRole)
    {//userrole defined
        if(userRole === "ADMIN")
        {
            return(
            <PrivateRoute role="ADMIN">
                <LandingPage />
            </PrivateRoute>
            );
        }
        else if( userRole === "DRIVER")
        {
            return (
                <PrivateRoute>
                    <DriverViewRoutes />
                </PrivateRoute>
            );
        }
        
    }
    else
    {//unmatched role just returns back to login page for now. 
        return(
            <Login/>
        );

    }
    
}

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            <Router>
                <PageLayout>
                    <Routes>
                        <Route path="/" element={
                          <HomePage/>
                        } />
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

