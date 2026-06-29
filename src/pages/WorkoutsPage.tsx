import { useMemo, useState } from 'react'
import { SPLITS } from '../data/splits'
import { Equipment, EQUIPMENT_LABELS } from '../types'
import { addWorkoutLog, deleteWorkoutLog, formatDateAr, getWorkoutLogs, todayIso } from '../store'

const EQUIPMENT_OPTIONS: Equipment[] = ['machine', 'dumbbell', 'cable', 'barbell', 'bodyweight']

export default function WorkoutsPage() {
  const [splitId, setSplitId] = useState(SPLITS[0].id)
  const [date, setDate] = useState(todayIso())
  const [inputs, setInputs] = useState<Record<string, { weight: string; equipment: Equipment }>>({})
  const [logs, setLogs] = useState(getWorkoutLogs())
  const [savedMsg, setSavedMsg] = useState('')

  const split = SPLITS.find((s) => s.id === splitId)!

  const setInput = (exId: string, weight: string, equipment: Equipment) => {
    setInputs((prev) => ({ ...prev, [exId]: { weight, equipment } }))
  }

  const saveAll = () => {
    let count = 0
    split.exercises.forEach((ex) => {
      const val = inputs[ex.id]
      if (val && val.weight.trim() !== '') {
        addWorkoutLog({
          splitId: split.id,
          exerciseId: ex.id,
          date,
          weight: parseFloat(val.weight),
          equipment: val.equipment ?? ex.defaultEquipment,
        })
        count++
      }
    })
    if (count > 0) {
      setLogs(getWorkoutLogs())
      setInputs({})
      setSavedMsg(`✅ تم حفظ ${count} تمرين بتاريخ ${date}`)
      setTimeout(() => setSavedMsg(''), 3000)
    }
  }

  const splitLogs = useMemo(
    () =>
      logs
        .filter((l) => l.splitId === splitId)
        .sort((a, b) => (a.date < b.date ? 1 : -1))
        .slice(0, 15),
    [logs, splitId],
  )

  const handleDelete = (id: string) => {
    deleteWorkoutLog(id)
    setLogs(getWorkoutLogs())
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {SPLITS.map((s) => (
          <button
            key={s.id}
            onClick={() => setSplitId(s.id)}
            className={`rounded-xl p-3 text-sm font-bold text-right transition-colors ${
              splitId === s.id
                ? 'bg-lavender-500 text-white shadow'
                : 'bg-lavender-100 text-lavender-700 hover:bg-lavender-200'
            }`}
          >
            <div className="text-2xl mb-1">{s.emoji}</div>
            {s.titleAr}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between gap-3">
        <label className="font-bold text-lavender-700 text-sm">📅 تاريخ التمرين</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-lavender-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-3">
        {split.exercises.map((ex) => {
          const val = inputs[ex.id] ?? { weight: '', equipment: ex.defaultEquipment }
          return (
            <div key={ex.id} className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-gray-800">{ex.nameAr}</h3>
                <span className="text-xs text-gray-400">{ex.nameEn} • {ex.reps}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="number"
                  step="0.5"
                  placeholder="⚖️ الوزن (kg)"
                  value={val.weight}
                  onChange={(e) => setInput(ex.id, e.target.value, val.equipment)}
                  className="flex-1 min-w-[120px] border border-lavender-300 rounded-lg px-3 py-2 text-sm"
                />
                <select
                  value={val.equipment}
                  onChange={(e) => setInput(ex.id, val.weight, e.target.value as Equipment)}
                  className="border border-lavender-300 rounded-lg px-3 py-2 text-sm bg-lavender-50"
                >
                  {EQUIPMENT_OPTIONS.map((eq) => (
                    <option key={eq} value={eq}>
                      {EQUIPMENT_LABELS[eq]}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )
        })}
      </div>

      <button
        onClick={saveAll}
        className="w-full bg-lavender-600 hover:bg-lavender-700 text-white font-bold py-3 rounded-xl shadow transition-colors"
      >
        💾 حفظ التمرين
      </button>

      {savedMsg && (
        <div className="bg-green-100 text-green-700 rounded-lg p-3 text-center text-sm font-bold">
          {savedMsg}
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-lavender-700 mb-3">📊 سجل {split.titleAr}</h3>
        {splitLogs.length === 0 ? (
          <p className="text-sm text-gray-400">لا يوجد سجل بعد، سجلي أول تمرين! 💪</p>
        ) : (
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {splitLogs.map((log) => {
              const ex = split.exercises.find((e) => e.id === log.exerciseId)
              return (
                <div
                  key={log.id}
                  className="flex items-center justify-between text-sm bg-lavender-50 rounded-lg px-3 py-2"
                >
                  <div>
                    <span className="font-bold">{ex?.nameAr}</span>{' '}
                    <span className="text-gray-500">— {log.weight}kg • {EQUIPMENT_LABELS[log.equipment]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{formatDateAr(log.date)}</span>
                    <button
                      onClick={() => handleDelete(log.id)}
                      className="text-red-400 hover:text-red-600"
                      aria-label="حذف"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
