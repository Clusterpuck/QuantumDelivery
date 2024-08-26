import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    HashRouter as Router,
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
import DriverViewRoutes from './pages/DriverViewRoutes';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

//initializes the routes within the app
const App = () => {
    return (
        <ThemeProvider theme={theme}>
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
                        <Route path="/driverviewroutes" element={<DriverViewRoutes />} />
        
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
