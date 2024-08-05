import React from 'react';
import ReactDOM from 'react-dom/client';
import {
    BrowserRouter as Router,
    Routes,
    Route,
} from 'react-router-dom';
import RandomFactGenerator from './FactGenerator';
import TestPage from './components/ViewRoutes';
import './index.css';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RandomFactGenerator />} />
                <Route path="/testpage" element={<TestPage />} />
            </Routes>
        </Router>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
