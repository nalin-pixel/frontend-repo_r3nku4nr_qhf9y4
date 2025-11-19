import { useState } from 'react'
import { useAuth } from './AuthContext'

export default function AuthUI() {
  const { user, login, signup, logout } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'business' })
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'login') {
        await login(form.email, form.password)
      } else {
        await signup(form.name, form.email, form.role, form.password)
      }
    } catch (err) {
      setError(err.message || 'Auth failed')
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-slate-200 text-sm">{user.name} ({user.role})</span>
        <a href={user.role==='influencer'?'/dashboard/influencer':'/dashboard/business'} className="px-3 py-1 text-xs rounded bg-blue-600 text-white">Dashboard</a>
        <button onClick={logout} className="px-3 py-1 text-xs rounded bg-slate-700 text-white">Logout</button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="flex items-center gap-2">
      {mode==='signup' && (
        <input value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})} placeholder="Name" className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-sm" />
      )}
      <input type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} placeholder="Email" className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-sm" />
      <input type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} placeholder="Password" className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-sm" />
      {mode==='signup' && (
        <select value={form.role} onChange={(e)=>setForm({...form, role:e.target.value})} className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white text-sm">
          <option value="business">Business</option>
          <option value="influencer">Influencer</option>
        </select>
      )}
      <button type="submit" className="px-3 py-1 rounded bg-blue-600 text-white text-sm">{mode==='login'?'Login':'Create account'}</button>
      <button type="button" onClick={()=>setMode(mode==='login'?'signup':'login')} className="px-3 py-1 rounded bg-slate-700 text-white text-sm">
        {mode==='login'?'Sign up':'Have an account? Login'}
      </button>
      {error && <span className="text-red-400 text-xs">{error}</span>}
    </form>
  )
}
