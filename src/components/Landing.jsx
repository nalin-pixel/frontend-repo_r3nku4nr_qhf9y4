import { useEffect, useState } from 'react'

export default function Landing() {
  const [influencers, setInfluencers] = useState([])
  const [filters, setFilters] = useState({ city: '', category: '', min_followers: '', min_budget: '', max_budget: '' })
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const fetchInfluencers = async () => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== '' && v != null) params.append(k, v)
    })
    const res = await fetch(`${baseUrl}/influencers?${params.toString()}`)
    const data = await res.json()
    setInfluencers(data)
  }

  useEffect(() => { fetchInfluencers() }, [])

  const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value })

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6 grid grid-cols-1 md:grid-cols-5 gap-3">
        <input name="city" placeholder="City" value={filters.city} onChange={handleChange} className="px-3 py-2 rounded bg-slate-800/60 border border-slate-700 text-white placeholder-slate-400" />
        <input name="category" placeholder="Category" value={filters.category} onChange={handleChange} className="px-3 py-2 rounded bg-slate-800/60 border border-slate-700 text-white placeholder-slate-400" />
        <input name="min_followers" type="number" placeholder="Min Followers" value={filters.min_followers} onChange={handleChange} className="px-3 py-2 rounded bg-slate-800/60 border border-slate-700 text-white placeholder-slate-400" />
        <input name="min_budget" type="number" placeholder="Min Budget" value={filters.min_budget} onChange={handleChange} className="px-3 py-2 rounded bg-slate-800/60 border border-slate-700 text-white placeholder-slate-400" />
        <input name="max_budget" type="number" placeholder="Max Budget" value={filters.max_budget} onChange={handleChange} className="px-3 py-2 rounded bg-slate-800/60 border border-slate-700 text-white placeholder-slate-400" />
      </div>
      <div className="flex gap-3 mb-8">
        <button onClick={fetchInfluencers} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded">Search</button>
        <button onClick={() => { setFilters({ city: '', category: '', min_followers: '', min_budget: '', max_budget: '' }); fetchInfluencers(); }} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded">Reset</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {influencers.map((inf) => (
          <a key={inf.id} href={`/influencer/${inf.id}`} className="group bg-slate-800/50 border border-slate-700 rounded-xl p-4 hover:border-blue-500/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 border border-slate-700"></div>
              <div>
                <div className="text-white font-semibold group-hover:text-blue-200">{inf.display_name}</div>
                <div className="text-xs text-slate-400">{inf.city} • {inf.categories?.slice(0,2).join(', ')}</div>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 text-center text-slate-300 text-sm">
              <div><div className="font-bold">{inf.metrics_summary.instagram}</div><div className="text-xs text-slate-400">IG</div></div>
              <div><div className="font-bold">{inf.metrics_summary.youtube}</div><div className="text-xs text-slate-400">YT</div></div>
              <div><div className="font-bold">{inf.metrics_summary.facebook}</div><div className="text-xs text-slate-400">FB</div></div>
            </div>
            <div className="mt-3 text-slate-400 text-sm">Budget: ${inf.budget_min} - ${inf.budget_max}</div>
          </a>
        ))}
      </div>
    </div>
  )
}
