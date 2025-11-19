import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export default function InfluencerProfile() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [tab, setTab] = useState('instagram')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const loadProfile = async () => {
    const res = await fetch(`${baseUrl}/influencers/${id}`)
    if (res.ok) setProfile(await res.json())
  }

  useEffect(() => { loadProfile() }, [id])

  if (!profile) return <div className="text-white p-6">Loading...</div>

  const metrics = profile.metrics || {}
  const current = metrics[tab] || {}

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-white">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-slate-700"></div>
        <div>
          <div className="text-2xl font-bold">{profile.display_name}</div>
          <div className="text-slate-400 text-sm">{profile.city} • {profile.categories?.join(', ')}</div>
          <div className="text-slate-400 text-sm">Budget: ${profile.budget_min} - ${profile.budget_max}</div>
          <div className="text-slate-400 text-sm">Visits: {profile.visits}</div>
        </div>
      </div>

      <div className="mt-6 border-b border-slate-700 flex gap-6">
        {['instagram','youtube','facebook'].map(p => (
          <button key={p} onClick={() => setTab(p)} className={`pb-3 -mb-px ${tab===p? 'border-b-2 border-blue-500 text-blue-300':'text-slate-400'}`}>{p.toUpperCase()}</button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="bg-slate-800/50 border border-slate-700 rounded p-4">
          <div className="text-2xl font-bold">{current.followers || 0}</div>
          <div className="text-xs text-slate-400">Followers</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded p-4">
          <div className="text-2xl font-bold">{current.avg_likes || 0}</div>
          <div className="text-xs text-slate-400">Avg Likes</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded p-4">
          <div className="text-2xl font-bold">{current.avg_comments || 0}</div>
          <div className="text-xs text-slate-400">Avg Comments</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700 rounded p-4">
          <div className="text-2xl font-bold">{current.engagement_rate || 0}%</div>
          <div className="text-xs text-slate-400">Engagement</div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Connect & Book</h3>
        <ChatBox influencerId={id} />
        <BookingBox influencerId={id} />
      </div>
    </div>
  )
}

function ChatBox({ influencerId }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const conversation_id = `demo-business:${influencerId}`

  const load = async () => {
    const res = await fetch(`${baseUrl}/conversations/${conversation_id}/messages`)
    const data = await res.json()
    setMessages(data)
  }

  useEffect(() => { load() }, [influencerId])

  const send = async () => {
    if (!text.trim()) return
    await fetch(`${baseUrl}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversation_id,
        sender_id: 'demo-business',
        receiver_id: influencerId,
        text
      })
    })
    setText('')
    load()
  }

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded p-4">
      <div className="h-40 overflow-y-auto space-y-2 mb-3">
        {messages.map((m,i) => (
          <div key={i} className={`text-sm ${m.sender_id==='demo-business'?'text-blue-300':'text-slate-300'}`}>{m.text}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input value={text} onChange={e=>setText(e.target.value)} placeholder="Write a message" className="flex-1 px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white placeholder-slate-500" />
        <button onClick={send} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded">Send</button>
      </div>
    </div>
  )
}

function BookingBox({ influencerId }) {
  const [offer, setOffer] = useState('')
  const [brief, setBrief] = useState('')
  const [status, setStatus] = useState(null)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const book = async () => {
    const res = await fetch(`${baseUrl}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        influencer_id: influencerId,
        business_id: 'demo-business',
        budget_offer: offer ? parseInt(offer) : undefined,
        campaign_brief: brief
      })
    })
    if (res.ok) {
      setStatus('Booking request sent!')
      setOffer('')
      setBrief('')
    } else {
      setStatus('Failed to send booking')
    }
  }

  return (
    <div className="mt-4 bg-slate-800/50 border border-slate-700 rounded p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input value={offer} onChange={e=>setOffer(e.target.value)} type="number" placeholder="Budget Offer" className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white placeholder-slate-500" />
        <input value={brief} onChange={e=>setBrief(e.target.value)} placeholder="Campaign brief" className="px-3 py-2 rounded bg-slate-900 border border-slate-700 text-white placeholder-slate-500" />
        <button onClick={book} className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded">Book Influencer</button>
      </div>
      {status && <div className="mt-2 text-sm text-slate-300">{status}</div>}
    </div>
  )
}
