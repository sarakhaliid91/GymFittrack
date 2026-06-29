import { useState } from 'react'
import { Measurement } from '../types'
import { addMeasurement, deleteMeasurement, formatDateAr, getMeasurements, todayIso } from '../store'

const FIELDS: { key: keyof Omit<Measurement, 'id' | 'date'>; label: string; emoji: string }[] = [
  { key: 'weight', label: 'الوزن (kg)', emoji: '⚖️' },
  { key: 'chest', label: 'الصدر (cm)', emoji: '📐' },
  { key: 'waist', label: 'الخصر (cm)', emoji: '📏' },
  { key: 'lowerBelly', label: 'اسفل البطن (cm)', emoji: '📏' },
  { key: 'hips', label: 'محيط الارداف (cm)', emoji: '📏' },
  { key: 'thighR', label: 'الفخذ R (cm)', emoji: '🦵' },
  { key: 'thighL', label: 'الفخذ L (cm)', emoji: '🦵' },
  { key: 'calfR', label: 'البطات R (cm)', emoji: '🦶' },
  { key: 'calfL', label: 'البطات L (cm)', emoji: '🦶' },
  { key: 'wristR', label: 'الزند R (cm)', emoji: '💪' },
  { key: 'wristL', label: 'الزند L (cm)', emoji: '💪' },
]

export default function MeasurementsPage() {
  const [date, setDate] = useState(todayIso())
  const [form, setForm] = useState<Record<string, string>>({})
  const [items, setItems] = useState(getMeasurements())
  const [savedMsg, setSavedMsg] = useState('')

  const setField = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }))

  const save = () => {
    const hasAny = Object.values(form).some((v) => v.trim() !== '')
    if (!hasAny) return
    const measurement: Omit<Measurement, 'id'> = { date }
    FIELDS.forEach(({ key }) => {
      const v = form[key]
      if (v && v.trim() !== '') {
        ;(measurement as any)[key] = parseFloat(v)
      }
    })
    addMeasurement(measurement)
    setItems(getMeasurements())
    setForm({})
    setSavedMsg(`✅ تم حفظ القياسات بتاريخ ${date}`)
    setTimeout(() => setSavedMsg(''), 3000)
  }

  const sorted = [...items].sort((a, b) => (a.date < b.date ? 1 : -1))

  const handleDelete = (id: string) => {
    deleteMeasurement(id)
    setItems(getMeasurements())
  }

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between gap-3">
        <label className="font-bold text-lavender-700 text-sm">📅 تاريخ القياس</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border border-lavender-300 rounded-lg px-3 py-2 text-sm"
        />
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-lavender-700 mb-3">📏 قياسات الجسم</h3>
        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="text-xs font-bold text-gray-500 block mb-1">
                {f.emoji} {f.label}
              </label>
              <input
                type="number"
                step="0.1"
                value={form[f.key] ?? ''}
                onChange={(e) => setField(f.key, e.target.value)}
                className="w-full border border-lavender-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={save}
        className="w-full bg-lavender-600 hover:bg-lavender-700 text-white font-bold py-3 rounded-xl shadow transition-colors"
      >
        💾 حفظ القياسات
      </button>

      {savedMsg && (
        <div className="bg-green-100 text-green-700 rounded-lg p-3 text-center text-sm font-bold">
          {savedMsg}
        </div>
      )}

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-lavender-700 mb-3">📊 سجل القياسات</h3>
        {sorted.length === 0 ? (
          <p className="text-sm text-gray-400">لا يوجد سجل بعد، سجلي أول قياس! 📏</p>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {sorted.map((m) => (
              <div key={m.id} className="bg-lavender-50 rounded-lg px-3 py-2 text-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-lavender-700">{formatDateAr(m.date)}</span>
                  <button onClick={() => handleDelete(m.id)} className="text-red-400 hover:text-red-600">
                    🗑️
                  </button>
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 text-gray-600 text-xs">
                  {FIELDS.map((f) =>
                    m[f.key] !== undefined ? (
                      <span key={f.key}>
                        {f.emoji} {f.label}: <b>{m[f.key]}</b>
                      </span>
                    ) : null,
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
