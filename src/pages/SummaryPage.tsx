import { useMemo, useState } from 'react'
import { SPLITS } from '../data/splits'
import { computeStreak, getMeasurements, getWorkoutLogs } from '../store'
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
  const logs = getWorkoutLogs()
  const measurements = getMeasurements()

  const allExercises = useMemo(
    () => SPLITS.flatMap((s) => s.exercises.map((e) => ({ ...e, splitTitle: s.titleAr }))),
    [],
  )
  const [exerciseId, setExerciseId] = useState(allExercises[0]?.id ?? '')

  const workoutDates = logs.map((l) => l.date)
  const streak = computeStreak(workoutDates)
  const badge = streakBadge(streak)

  const totalSessions = new Set(workoutDates).size
  const totalSets = logs.length

  const exerciseLogs = useMemo(
    () =>
      logs
        .filter((l) => l.exerciseId === exerciseId)
        .sort((a, b) => (a.date > b.date ? 1 : -1)),
    [logs, exerciseId],
  )

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
        <h3 className="font-bold text-lavender-700 mb-3">📈 تطور الأوزان لتمرين معين</h3>
        <select
          value={exerciseId}
          onChange={(e) => setExerciseId(e.target.value)}
          className="w-full border border-lavender-300 rounded-lg px-3 py-2 text-sm mb-3 bg-lavender-50"
        >
          {allExercises.map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.nameAr} ({ex.splitTitle})
            </option>
          ))}
        </select>

        {exerciseLogs.length === 0 ? (
          <p className="text-sm text-gray-400">لا يوجد سجل لهذا التمرين بعد.</p>
        ) : (
          <div>
            <div className="flex justify-center mb-2">
              <Sparkline values={exerciseLogs.map((l) => l.weight)} />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>أول وزن: {exerciseLogs[0].weight}kg</span>
              <span className="font-bold text-lavender-700">
                آخر وزن: {exerciseLogs[exerciseLogs.length - 1].weight}kg
              </span>
            </div>
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
