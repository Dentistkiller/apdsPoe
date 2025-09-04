import React, { useEffect, useState } from 'react'
import api from '../api/client'
import PaymentForm from '../components/PaymentForm'


function centsToMoney(cents) { return (cents / 100).toFixed(2) }


export default function CustomerPayments() {
const [items, setItems] = useState([])
const [error, setError] = useState('')


const load = async () => {
try {
const { data } = await api.get('/payments/mine')
setItems(data.payments)
} catch (err) { setError(err.message) }
}


useEffect(() => { load() }, [])



return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
    <PaymentForm onCreated={() => load()} />
    
    
    <div className="card">
    <h2 className="text-xl font-semibold mb-3">My Payments</h2>
    {error && <p className="text-red-600 text-sm">{error}</p>}
    <div className="overflow-x-auto">
    <table className="min-w-full text-sm">
    <thead>
    <tr className="text-left text-gray-600">
    <th className="py-2 pr-4">Date</th>
    <th className="py-2 pr-4">Beneficiary</th>
    <th className="py-2 pr-4">Account</th>
    <th className="py-2 pr-4">SWIFT</th>
    <th className="py-2 pr-4">Amount</th>
    <th className="py-2 pr-4">Status</th>
    </tr>
    </thead>
    <tbody>
    {items.map(p => (
    <tr key={p.id} className="border-t">
    <td className="py-2 pr-4">{new Date(p.createdAt).toLocaleString()}</td>
    <td className="py-2 pr-4">{p.beneficiaryName}</td>
    <td className="py-2 pr-4 font-mono">{p.beneficiaryAccountNumber}</td>
    <td className="py-2 pr-4 font-mono">{p.beneficiarySwift}</td>
    <td className="py-2 pr-4">{p.currency} {centsToMoney(p.amountCents)}</td>
    <td className="py-2 pr-4">
    <span className={`px-2 py-1 rounded text-xs ${p.status === 'SUBMITTED' ? 'bg-green-100 text-green-700' : p.status === 'VERIFIED' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>{p.status}</span>
    </td>
    </tr>
    ))}
    </tbody>
    </table>
    </div>
    </div>
    </div>
    )
    }