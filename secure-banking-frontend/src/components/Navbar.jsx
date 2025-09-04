import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function Navbar() {
const { user, logout } = useAuth()
const loc = useLocation()


return (
    <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="text-lg font-bold tracking-tight">SecurePay</Link>
                <nav className="flex items-center gap-3">
                        {!user && (
                        <>
                            <Link className="text-sm" to="/customer/login">Customer Login</Link>
                            <Link className="text-sm" to="/customer/register">Register</Link>
                            <Link className="text-sm" to="/employee/login">Employee Login</Link>
                        </>
                        )}
                        {user?.type === 'customer' && (
<>
<Link className={`text-sm ${loc.pathname.startsWith('/customer') ? 'font-semibold' : ''}`} to="/customer/payments">My Payments</Link>
<button className="button" onClick={logout}>Logout</button>
</>
)}
{user?.type === 'employee' && (
<>
<Link className={`text-sm ${loc.pathname.startsWith('/employee') ? 'font-semibold' : ''}`} to="/employee/portal">Portal</Link>
<button className="button" onClick={logout}>Logout</button>
</>
)}
</nav>
</div>
</header>
)
}