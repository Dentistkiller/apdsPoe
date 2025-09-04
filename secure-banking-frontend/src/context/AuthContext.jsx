import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import api from '../api/client'


const AuthContext = createContext(null)


export function AuthProvider({ children }) {
const [user, setUser] = useState(() => {
const raw = localStorage.getItem('user')
return raw ? JSON.parse(raw) : null
})


const [token, setToken] = useState(() => localStorage.getItem('token'))


useEffect(() => {
if (user) localStorage.setItem('user', JSON.stringify(user))
else localStorage.removeItem('user')
}, [user])


useEffect(() => {
if (token) localStorage.setItem('token', token)
else localStorage.removeItem('token')
}, [token])


const loginCustomer = async ({ username, accountNumber, password }) => {
const { data } = await api.post('/customers/login', { username, accountNumber, password })
setUser(data.user)
setToken(data.token)
}


const registerCustomer = async (payload) => {
await api.post('/customers/register', payload)
}


const loginEmployee = async ({ email, password }) => {
const { data } = await api.post('/employees/login', { email, password })
setUser(data.user)
setToken(data.token)
}


const logout = () => {
setUser(null)
setToken(null)
}


const value = useMemo(() => ({ user, token, loginCustomer, registerCustomer, loginEmployee, logout }), [user, token])
return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


export const useAuth = () => useContext(AuthContext)