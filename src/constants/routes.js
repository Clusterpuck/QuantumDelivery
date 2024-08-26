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
import UploadRunsheet from '../pages/UploadRunsheet';
import AccountDetails from './pages/AccountDetails';
import PrivateRoute from './constants/PrivateRoute';
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
                <PageLayout>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        {/* protected routes */}
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
                        <Route path="/addorder" element={
                            <PrivateRoute>
                                <AddOrder />
                            </PrivateRoute>
                        } />
                        <Route path="/accountdetails" element={
                            <PrivateRoute>
                                <AccountDetails />
                            </PrivateRoute>
                        } />
                        <Route path="/home" element={
                            <PrivateRoute>
                                <AddOrder />
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
