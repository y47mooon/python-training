import React from 'react';
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Login from './Login';
import ReservationTable from './Reservation';
import ReservationMessage from './ReservationMessage';
import ReservationForm from './ReservationForm';
import ReservationSummary from './ReservationSummary';
import Register from './Register';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/reservation" element={<ReservationTable />} />
                <Route path="/reservation-message" element={<ReservationMessage />} />
                <Route path="/reservation-form" element={<ReservationForm />} />
                <Route path="/reservation-summary" element={<ReservationSummary />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </Router>
    );
};

export default App;
