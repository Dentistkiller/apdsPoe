import React, { useState } from 'react'
import api from '../api/client'


const CURRENCIES = ['ZAR', 'USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CNY', 'JPY']


export default function PaymentForm({ onCreated }) {
const [form, setForm] = useState({
amount: '', currency: 'ZAR', provider: 'SWIFT',
beneficiaryName: '', beneficiaryAccountNumber: '', beneficiarySwift: '', beneficiaryBankName: '', note: ''
})
const [loading, setLoading] = useState(false)
const [error, setError] = useState('')


const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })


const onSubmit = async (e) => {
e.preventDefault(); setLoading(true); setError('')
try {
const payload = { ...form, amount: Number(form.amount) }
const { data } = await api.post('/payments', payload)
onCreated?.(data.payment)
setForm({ amount: '', currency: 'ZAR', provider: 'SWIFT', beneficiaryName: '', beneficiaryAccountNumber: '', beneficiarySwift: '', beneficiaryBankName: '', note: '' })
} catch (err) { setError(err.message) } finally { setLoading(false) }
}



return (
    <form className="card space-y-4" onSubmit={onSubmit}>
    <h2 className="text-xl font-semibold">New International Payment</h2>
    <div className="grid md:grid-cols-2 gap-4">
    <div>
    <label className="label">Amount</label>
    <input className="input" name="amount" value={form.amount} onChange={onChange} placeholder="1000.00" required />
    </div>
    <div>
    <label className="label">Currency</label>
    <select className="input" name="currency" value={form.currency} onChange={onChange}>
    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
    </select>
    </div>
    <div>
    <label className="label">Provider</label>
    <input className="input" name="provider" value={form.provider} disabled />
    </div>
    <div>
    <label className="label">Beneficiary Name</label>
    <input className="input" name="beneficiaryName" value={form.beneficiaryName} onChange={onChange} required />
    </div>
    <div>
    <label className="label">Beneficiary Account Number</label>
    <input className="input" name="beneficiaryAccountNumber" value={form.beneficiaryAccountNumber} onChange={onChange} required />
    </div>
    <div>
    <label className="label">SWIFT/BIC</label>
    <input className="input uppercase" name="beneficiarySwift" value={form.beneficiarySwift} onChange={onChange} placeholder="ABCDZAJJXXX" required />
    </div>
    <div>
    <label className="label">Bank Name (optional)</label>
    <input className="input" name="beneficiaryBankName" value={form.beneficiaryBankName} onChange={onChange} />
    </div>
    <div className="md:col-span-2">
    <label className="label">Note (optional)</label>
    <input className="input" name="note" value={form.note} onChange={onChange} />
    </div>
    </div>
    {error && <p className="text-red-600 text-sm">{error}</p>}
    <button className="button" disabled={loading}>{loading ? 'Submitting…' : 'Pay Now'}</button>
    </form>
    )
    }