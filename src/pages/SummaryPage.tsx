import { useMemo, useRef, useState } from 'react'
import { SPLITS } from '../data/splits'
import { computeStreak, exportBackup, getMeasurements, getWorkoutLogs, importBackup } from '../store'
import Sparkline from '../components/Sparkline'

const FIELD_LABELS: Record<string, string> = {
  weight: '⚖️ الوزن',
  chest: '📐 الصدر',
  waist: '📏 الخصر',
  lowerBelly: '📏 اسفل البطن',
  hips: '📏 محيط الارداف',
  thighR: '🦵 الفخذ R',
  thighL: '🦵 الفخذ L',
  calfR: '🦶 البطات R',
  calfL: '🦶 البطات L',
  wristR: '💪 الزند R',
  wristL: '💪 الزند L',
}

function streakBadge(streak: number) {
  if (streak === 0) return { emoji: '💤', msg: 'يلا نبدأ سلسلة جديدة اليوم!' }
  if (streak < 3) return { emoji: '🔥', msg: 'بداية قوية، استمري!' }
  if (streak < 7) return { emoji: '🔥🔥', msg: 'استمرارية رائعة!' }
  if (streak < 14) return { emoji: '🔥🔥🔥', msg: 'أسبوع كامل من الانضباط! 🎉' }
  return { emoji: '🏆🔥', msg: 'بطلة استمرارية حقيقية!' }
}

export default function SummaryPage() {
  const [logs, setLogs] = useState(getWorkoutLogs())
  const measurements = getMeasurements()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [backupMsg, setBackupMsg] = useState('')

  const [splitId, setSplitId] = useState(SPLITS[0].id)
  const [view, setView] = useState<'chart' | 'table'>('chart')

  const workoutDates = logs.map((l) => l.date)
  const streak = computeStreak(workoutDates)
  const badge = streakBadge(streak)

  const totalSessions = new Set(workoutDates).size
  const totalSets = logs.length

  const split = SPLITS.find((s) => s.id === splitId)!
  const splitLogs = useMemo(() => logs.filter((l) => l.splitId === splitId), [logs, splitId])
  const exercisesWithLogs = useMemo(
    () => split.exercises.filter((ex) => splitLogs.some((l) => l.exerciseId === ex.id)),
    [split, splitLogs],
  )
  const splitDates = useMemo(
    () => Array.from(new Set(splitLogs.map((l) => l.date))).sort(),
    [splitLogs],
  )

  const handleExport = () => {
    const blob = new Blob([exportBackup()], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gymfittrack-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importBackup(String(reader.result))
        setLogs(getWorkoutLogs())
        setBackupMsg('✅ تم استيراد النسخة الاحتياطية بنجاح')
      } catch {
        setBackupMsg('❌ الملف غير صالح')
      }
      setTimeout(() => setBackupMsg(''), 3000)
    }
    reader.readAsText(file)
  }

  const sortedMeasurements = [...measurements].sort((a, b) => (a.date > b.date ? 1 : -1))
  const first = sortedMeasurements[0]
  const last = sortedMeasurements[sortedMeasurements.length - 1]

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-br from-lavender-500 to-lavender-700 text-white rounded-xl p-6 shadow text-center">
        <div className="text-5xl mb-2">{badge.emoji}</div>
        <div className="text-3xl font-extrabold">{streak} يوم متتالي</div>
        <div className="text-sm opacity-90 mt-1">{badge.msg}</div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl">📅</div>
          <div className="text-2xl font-extrabold text-lavender-700">{totalSessions}</div>
          <div className="text-xs text-gray-500">أيام تمرين مسجلة</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm text-center">
          <div className="text-2xl">🏋️</div>
          <div className="text-2xl font-extrabold text-lavender-700">{totalSets}</div>
          <div className="text-xs text-gray-500">تمارين مسجلة</div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3 gap-2">
          <h3 className="font-bold text-lavender-700">📈 تطور الأوزان — يوم تمرين كامل</h3>
          <div className="flex gap-1 bg-lavender-50 rounded-lg p-1">
            <button
              onClick={() => setView('chart')}
              className={`px-2 py-1 rounded-md text-xs font-bold ${
                view === 'chart' ? 'bg-lavender-500 text-white' : 'text-lavender-700'
              }`}
            >
              📈 رسم
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-2 py-1 rounded-md text-xs font-bold ${
                view === 'table' ? 'bg-lavender-500 text-white' : 'text-lavender-700'
              }`}
            >
              📊 جدول
            </button>
          </div>
        </div>

        <select
          value={splitId}
          onChange={(e) => setSplitId(e.target.value)}
          className="w-full border border-lavender-300 rounded-lg px-3 py-2 text-sm mb-3 bg-lavender-50"
        >
          {SPLITS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.emoji} {s.titleAr}
            </option>
          ))}
        </select>

        {exercisesWithLogs.length === 0 ? (
          <p className="text-sm text-gray-400">لا يوجد سجل لهذا اليوم بعد.</p>
        ) : view === 'chart' ? (
          <div className="space-y-4">
            {exercisesWithLogs.map((ex) => {
              const exLogs = splitLogs
                .filter((l) => l.exerciseId === ex.id)
                .sort((a, b) => (a.date > b.date ? 1 : -1))
              return (
                <div key={ex.id} className="border-b border-lavender-100 pb-3 last:border-0 last:pb-0">
                  <div className="text-sm font-bold text-gray-700 mb-1">{ex.nameAr}</div>
                  <div className="flex justify-center mb-1">
                    <Sparkline values={exLogs.map((l) => l.weight)} />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>أول وزن: {exLogs[0].weight}kg</span>
                    <span className="font-bold text-lavender-700">
                      آخر وزن: {exLogs[exLogs.length - 1].weight}kg
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-lavender-50">
                  <th className="px-2 py-2 text-right font-bold text-lavender-700">📅 التاريخ</th>
                  {exercisesWithLogs.map((ex) => (
                    <th key={ex.id} className="px-2 py-2 font-bold text-lavender-700 whitespace-nowrap">
                      {ex.nameAr}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {splitDates.map((date) => (
                  <tr key={date} className="border-b border-lavender-100">
                    <td className="px-2 py-2 text-right text-gray-500 whitespace-nowrap">{date}</td>
                    {exercisesWithLogs.map((ex) => {
                      const log = splitLogs.find((l) => l.exerciseId === ex.id && l.date === date)
                      return (
                        <td key={ex.id} className="px-2 py-2 font-bold text-gray-700">
                          {log ? `${log.weight}kg` : '—'}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-lavender-700 mb-2">📦 نسخة احتياطية من بياناتي</h3>
        <p className="text-xs text-gray-500 mb-3">
          بياناتك محفوظة على هذا الجهاز فقط. حمّلي نسخة احتياطية بشكل دوري لتقدري ترجعيها لو غيرتي جوالك أو حذفتي بيانات المتصفح.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex-1 bg-lavender-500 hover:bg-lavender-600 text-white font-bold py-2 rounded-lg text-sm"
          >
            ⬇️ تصدير نسخة
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-lavender-100 hover:bg-lavender-200 text-lavender-700 font-bold py-2 rounded-lg text-sm"
          >
            ⬆️ استيراد نسخة
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleImportFile(file)
              e.target.value = ''
            }}
          />
        </div>
        {backupMsg && (
          <div className="mt-3 bg-green-100 text-green-700 rounded-lg p-2 text-center text-sm font-bold">
            {backupMsg}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm">
        <h3 className="font-bold text-lavender-700 mb-3">📏 تطور القياسات</h3>
        {!first || !last || first.id === last.id ? (
          <p className="text-sm text-gray-400">سجلي قياسين على الأقل لمشاهدة التطور.</p>
        ) : (
          <div className="space-y-2">
            {Object.keys(FIELD_LABELS).map((key) => {
              const a = (first as any)[key] as number | undefined
              const b = (last as any)[key] as number | undefined
              if (a === undefined || b === undefined) return null
              const diff = +(b - a).toFixed(1)
              const color = diff === 0 ? 'text-gray-400' : diff < 0 ? 'text-green-600' : 'text-orange-500'
              return (
                <div key={key} className="flex items-center justify-between text-sm bg-lavender-50 rounded-lg px-3 py-2">
                  <span>{FIELD_LABELS[key]}</span>
                  <span>
                    {a} ← {b} <b className={color}>({diff > 0 ? '+' : ''}{diff})</b>
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
