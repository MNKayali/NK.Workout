import { Routes, Route, useLocation } from 'react-router-dom'
import BottomNav from './components/BottomNav.jsx'
import Home from './screens/Home.jsx'
import Workout from './screens/Workout.jsx'
import Progress from './screens/Progress.jsx'
import Muscles from './screens/Muscles.jsx'
import Equipment from './screens/Equipment.jsx'
import SessionDetail from './screens/SessionDetail.jsx'

export default function App() {
  const { pathname } = useLocation()
  const hideNav = pathname.startsWith('/workout')

  return (
    <div className="mx-auto min-h-full max-w-md bg-canvas">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/workout/:type" element={<Workout />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/muscles" element={<Muscles />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/session/:id" element={<SessionDetail />} />
        <Route path="*" element={<Home />} />
      </Routes>
      {!hideNav && <div className="h-20" aria-hidden />}
      {!hideNav && <BottomNav />}
    </div>
  )
}
