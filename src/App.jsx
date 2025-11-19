import Navbar from './components/Navbar'
import Landing from './components/Landing'
import { Routes, Route } from 'react-router-dom'
import InfluencerProfile from './components/InfluencerProfile'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/influencer/:id" element={<InfluencerProfile />} />
        </Routes>
      </div>
    </div>
  )
}

export default App