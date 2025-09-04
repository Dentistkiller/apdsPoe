import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './pages/Register'
import CustomerLogin from './pages/CustomerLogin'
import EmployeeLogin from './pages/EmployeeLogin'
import CustomerPayments from './pages/CustomerPayments'
import EmployeePortal from './pages/EmployeePortal'



export default function App() {
  return (
  <AuthProvider>
  <Navbar />
  <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/customer/register" element={<Register />} />
  <Route path="/customer/login" element={<CustomerLogin />} />
  <Route path="/employee/login" element={<EmployeeLogin />} />
  
  
  <Route path="/customer/payments" element={
  <ProtectedRoute allowTypes={["customer"]}>
  <CustomerPayments />
  </ProtectedRoute>
  } />
  
  
  <Route path="/employee/portal" element={
  <ProtectedRoute allowTypes={["employee"]}>
  <EmployeePortal />
  </ProtectedRoute>
  } />
  
  
  <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
  </AuthProvider>
  )
  }
  
  function Home() {
    return (
    <div className="max-w-4xl mx-auto p-6">
    <div className="card">
    <h1 className="text-3xl font-bold">Welcome to SecurePay</h1>
    <p className="text-gray-600 mt-2">A simple demo portal for international payments with SWIFT verification.</p>
    <div className="mt-4 flex gap-3">
    <a className="button" href="/customer/login">Customer Login</a>
    <a className="button" href="/employee/login">Employee Login</a>
    </div>
    </div>
    </div>
    )
    }