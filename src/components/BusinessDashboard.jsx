import { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'

export default function BusinessDashboard() {
  const { user, token, baseUrl } = useAuth()
  const [data, setData] = useState(null)

  useEffect(() => {
    const load = async () => {
      if (!token) return
      const res = await fetch(`${baseUrl}/dashboard/business`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) setData(await res.json())
    }
    load()
  }, [token])

  if (!user) return <div className="text-white p-6">Please login as business.</div>
  if (user.role !== 'business') return <div className="text-white p-6">This dashboard is for businesses.</div>
  if (!data) return <div className="text-white p-6">Loading...</div>

  const { profile, bookings, messages } = data

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Business Dashboard</h1>
      {!profile ? (
        <div className="bg-yellow-500/10 border border-yellow-400/30 text-yellow-200 p-4 rounded">
          Create your business profile to start booking influencers.
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          <Card title="Business">
            <div className="text-slate-300">{profile.business_name}</div>
          </Card>
          <Card title="Bookings">
            <div className="text-3xl font-bold">{bookings.length}</div>
          </Card>
          <Card title="Messages">
            <div className="text-3xl font-bold">{messages.length}</div>
          </Card>
        </div>
      )}

      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <Card title="Recent Messages">
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {messages?.slice(0,10).map((m,i)=> (
              <div key={i} className="text-sm text-slate-300">{m.text}</div>
            ))}
          </div>
        </Card>
        <Card title="Bookings List">
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {bookings?.map((b,i)=> (
              <div key={i} className="text-sm text-slate-300 flex justify-between">
                <span>{b.campaign_brief || 'Campaign'} - ${b.budget_offer || 'N/A'}</span>
                <span className="uppercase text-xs px-2 py-0.5 rounded bg-slate-700">{b.status}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

function Card({ title, children }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded p-4">
      <div className="text-slate-200 font-semibold mb-2">{title}</div>
      {children}
    </div>
  )
}
