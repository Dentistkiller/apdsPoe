import React, { useEffect, useState } from 'react'
import api from '../api/client'


function centsToMoney(cents) { return (cents / 100).toFixed(2) }


export default function EmployeePortal() {
const [items, setItems] = useState([])
const [statusFilter, setStatusFilter] = useState('PENDING_REVIEW')
const [error, setError] = useState('')
const [loading, setLoading] = useState(false)


const load = async () => {
setLoading(true); setError('')
try {
const { data } = await api.get('/admin/payments', { params: { status: statusFilter } })
setItems(data.payments)
} catch (err) { setError(err.message) } finally { setLoading(false) }
}


useEffect(() => { load() }, [statusFilter])


const verify = async (id) => {
try { await api.patch(`/admin/payments/${id}/verify`); load() } catch (e) { setError(e.message) }
}
const submit = async (id) => {
try { await api.patch(`/admin/payments/${id}/submit`); load() } catch (e) { setError(e.message) }
}



return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
    <div className="card flex items-center justify-between gap-3">
    <h1 className="text-2xl font-bold">International Payments Portal</h1>
    <div className="flex items-center gap-2">
    <label className="label">Status:</label>
    <select className="input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
    {['PENDING_REVIEW','VERIFIED','SUBMITTED'].map(s => <option key={s} value={s}>{s}</option>)}
    </select>
    </div>
    </div>
    
    
    <div className="card">
    {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
    <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
    <thead>
    <tr className="text-left text-gray-600">
    <th className="py-2 pr-4">Created</th>
    <th className="py-2 pr-4">Customer</th>
    <th className="py-2 pr-4">Beneficiary</th>
    <th className="py-2 pr-4">Account</th>
    <th className="py-2 pr-4">SWIFT</th>
    <th className="py-2 pr-4">Amount</th>
    <th className="py-2 pr-4">Actions</th>
    </tr>
    </thead>
    <tbody>
    {items.map(p => (
    <tr key={p.id} className="border-t">
    <td className="py-2 pr-4">{new Date(p.createdAt).toLocaleString()}</td>
    <td className="py-2 pr-4">{p.customer?.username || '—'}</td>
    <td className="py-2 pr-4">{p.beneficiaryName}</td>
    <td className="py-2 pr-4 font-mono">{p.beneficiaryAccountNumber}</td>
    <td className="py-2 pr-4 font-mono">{p.beneficiarySwift}</td>
    <td className="py-2 pr-4">{p.currency} {centsToMoney(p.amountCents)}</td>
    <td className="py-2 pr-4 flex gap-2">
    {p.status === 'PENDING_REVIEW' && <button className="button" onClick={() => verify(p.id)}>Verify</button>}
    {p.status === 'VERIFIED' && <button className="button" onClick={() => submit(p.id)}>Submit to SWIFT</button>}
    {p.status === 'SUBMITTED' && <span className="text-green-700 text-xs font-semibold">Submitted</span>}
    </td>
    </tr>
    ))}
    </tbody>
    </table>
    {loading && <p className="text-sm text-gray-600 mt-2">Loading…</p>}
    </div>
    </div>
    </div>
    )}
    
    