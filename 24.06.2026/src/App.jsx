import React from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Auth from './pages/Auth'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Stock from './pages/Stock'
import Products from './pages/Products'
import Reports from './pages/Reports'
import Messaging from './pages/Messaging'

export default function App() {
  return (
    <div className="app-container">
      <input type="radio" id="tab-login" name="crm-tab" defaultChecked className="tab-radio" />
      <input type="radio" id="tab-dashboard" name="crm-tab" className="tab-radio" />
      <input type="radio" id="tab-customers" name="crm-tab" className="tab-radio" />
      <input type="radio" id="tab-stock" name="crm-tab" className="tab-radio" />
      <input type="radio" id="tab-products" name="crm-tab" className="tab-radio" />
      <input type="radio" id="tab-reports" name="crm-tab" className="tab-radio" />
      <input type="radio" id="tab-messages" name="crm-tab" className="tab-radio" />

      <main className="login-screen">
        <Auth />
      </main>

      <div className="app-frame">
        <Sidebar />
        
        <div className="main-content">
          <Header />
          
          <Dashboard />
          <Customers />
          <Stock />
          <Products />
          <Reports />
          <Messaging />
        </div>
      </div>
    </div>
  )
}
