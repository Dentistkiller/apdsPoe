import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function Register() {
const nav = useNavigate()
const { registerCustomer } = useAuth()
const [form, setForm] = useState({
username: '', fullName: '', idNumber: '', accountNumber: '', password: ''
})
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })


const onSubmit = async (e) => {
e.preventDefault(); setLoading(true); setError('')
try {
await registerCustomer({ ...form })
nav('/customer/login')
} catch (err) { setError(err.message) } finally { setLoading(false) }
}


return (
<div className="max-w-xl mx-auto mt-8 p-4">
<div className="card">
<h1 className="text-2xl font-bold mb-4">Customer Registration</h1>
<form className="space-y-4" onSubmit={onSubmit}>
<div>
<label className="label">Username</label>
<input className="input" name="username" value={form.username} onChange={onChange} required />
</div>
<div>
<label className="label">Full name</label>
<input className="input" name="fullName" value={form.fullName} onChange={onChange} required />
</div>
<div>
<label className="label">ID Number</label>
<input className="input" name="idNumber" value={form.idNumber} onChange={onChange} required />
</div>
<div>
<label className="label">Account Number</label>
<input className="input" name="accountNumber" value={form.accountNumber} onChange={onChange} required />
</div>
<div>
<label className="label">Password</label>
<input className="input" name="password" type="password" value={form.password} onChange={onChange} required />
</div>
{error && <p className="text-red-600 text-sm">{error}</p>}
<button className="button w-full" disabled={loading}>{loading ? 'Submitting…' : 'Register'}</button>
</form>
</div>
</div>
)
}