import { useState } from 'react'
import WorkoutsPage from './pages/WorkoutsPage'
import MeasurementsPage from './pages/MeasurementsPage'
import SummaryPage from './pages/SummaryPage'

type Tab = 'workouts' | 'measurements' | 'summary'

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: 'workouts', label: 'تماريني', emoji: '🏋️' },
  { id: 'measurements', label: 'قياساتي', emoji: '📏' },
  { id: 'summary', label: 'تطوري', emoji: '🔥' },
]

function App() {
  const [tab, setTab] = useState<Tab>('workouts')

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-lavender-500 text-white shadow-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-extrabold">🏋️‍♀️ GymFittrack</h1>
          <span className="text-sm opacity-90">متابعة تماريني وقياساتي 💪</span>
        </div>
        <nav className="max-w-3xl mx-auto flex gap-2 px-4 pb-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${
                tab === t.id
                  ? 'bg-white text-lavender-700 shadow'
                  : 'bg-lavender-600/60 text-white hover:bg-lavender-600'
              }`}
            >
              {t.emoji} {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6">
        {tab === 'workouts' && <WorkoutsPage />}
        {tab === 'measurements' && <MeasurementsPage />}
        {tab === 'summary' && <SummaryPage />}
      </main>

      <footer className="text-center text-xs text-lavender-700/70 py-4">
        استمري… كل تمرين خطوة نحو هدفك 🌟
      </footer>
    </div>
  )
}

export default App
