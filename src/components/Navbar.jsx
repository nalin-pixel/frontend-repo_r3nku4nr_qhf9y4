import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  return (
    <div className="w-full sticky top-0 z-20 backdrop-blur bg-slate-900/60 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/') }>
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <span className="text-white font-semibold">InfluenceConnect</span>
        </div>
        <div className="text-xs text-blue-200/80">
          Built with Flames Blue
        </div>
      </div>
    </div>
  )
}
