import { Measurement, WorkoutLog } from './types'

const WORKOUTS_KEY = 'gymfittrack_workout_logs'
const MEASUREMENTS_KEY = 'gymfittrack_measurements'

function load<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T[]) : []
  } catch {
    return []
  }
}

function save<T>(key: string, items: T[]) {
  localStorage.setItem(key, JSON.stringify(items))
}

export function getWorkoutLogs(): WorkoutLog[] {
  return load<WorkoutLog>(WORKOUTS_KEY)
}

export function addWorkoutLog(log: Omit<WorkoutLog, 'id'>): WorkoutLog {
  const logs = getWorkoutLogs()
  const newLog: WorkoutLog = { ...log, id: crypto.randomUUID() }
  logs.push(newLog)
  save(WORKOUTS_KEY, logs)
  return newLog
}

export function deleteWorkoutLog(id: string) {
  save(WORKOUTS_KEY, getWorkoutLogs().filter((l) => l.id !== id))
}

export function getMeasurements(): Measurement[] {
  return load<Measurement>(MEASUREMENTS_KEY)
}

export function addMeasurement(m: Omit<Measurement, 'id'>): Measurement {
  const items = getMeasurements()
  const newItem: Measurement = { ...m, id: crypto.randomUUID() }
  items.push(newItem)
  save(MEASUREMENTS_KEY, items)
  return newItem
}

export function deleteMeasurement(id: string) {
  save(MEASUREMENTS_KEY, getMeasurements().filter((m) => m.id !== id))
}

export function todayIso(): string {
  const d = new Date()
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60 * 1000)
  return local.toISOString().slice(0, 10)
}

const WEEKDAYS_AR = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

export function weekdayAr(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  return WEEKDAYS_AR[d.getDay()]
}

export function formatDateAr(iso: string): string {
  return `${weekdayAr(iso)} - ${iso}`
}

export function computeStreak(dates: string[]): number {
  const uniqueDates = Array.from(new Set(dates)).sort().reverse()
  if (uniqueDates.length === 0) return 0

  const todayDate = new Date(todayIso() + 'T00:00:00')
  const mostRecent = uniqueDates[0]
  const diffFromToday = Math.round(
    (todayDate.getTime() - new Date(mostRecent + 'T00:00:00').getTime()) / 86400000,
  )
  if (diffFromToday > 1) return 0

  let streak = 1
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const cur = new Date(uniqueDates[i] + 'T00:00:00')
    const next = new Date(uniqueDates[i + 1] + 'T00:00:00')
    const diff = Math.round((cur.getTime() - next.getTime()) / 86400000)
    if (diff === 1) {
      streak++
    } else {
      break
    }
  }
  return streak
}
