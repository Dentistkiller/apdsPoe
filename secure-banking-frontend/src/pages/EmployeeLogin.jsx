import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function EmployeeLogin() {
const nav = useNavigate()
const { loginEmployee } = useAuth()
const [form, setForm] = useState({ email: '', password: '' })
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')
const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })


const onSubmit = async (e) => {
e.preventDefault(); setLoading(true); setError('')
try {
await loginEmployee(form)
nav('/employee/portal')
} catch (err) { setError(err.message) } finally { setLoading(false) }
}


return (
<div className="max-w-xl mx-auto mt-8 p-4">
<div className="card">
<h1 className="text-2xl font-bold mb-4">Employee Login</h1>
<form className="space-y-4" onSubmit={onSubmit}>
<div>
<label className="label">Email</label>
<input className="input" name="email" value={form.email} onChange={onChange} required />
</div>
<div>
<label className="label">Password</label>
<input className="input" type="password" name="password" value={form.password} onChange={onChange} required />
</div>
{error && <p className="text-red-600 text-sm">{error}</p>}
<button className="button w-full" disabled={loading}>{loading ? 'Logging in…' : 'Login'}</button>
</form>
</div>
</div>
)
}