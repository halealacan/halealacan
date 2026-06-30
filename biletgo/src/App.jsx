import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Filter from './pages/Filter';
import Detail from './pages/Detail';
import Payment from './pages/Payment';
import PaymentResult from './pages/PaymentResult';
import Corporate from './pages/Corporate';
import MyBookings from './pages/MyBookings';
import AddTicket from './pages/AddTicket';
import Profile from './pages/Profile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        {/* Navigation Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/filter" element={<Filter />} />
            <Route path="/detail" element={<Detail />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-result" element={<PaymentResult />} />
            <Route path="/corporate" element={<Corporate />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/add-ticket" element={<AddTicket />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        {/* Page Footer */}
        <Footer />
      </div>
    </Router>
  );
}

export default App;
