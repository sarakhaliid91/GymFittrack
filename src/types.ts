export type Equipment = 'machine' | 'dumbbell' | 'cable' | 'barbell' | 'bodyweight'

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  machine: '🏗️ آلة',
  dumbbell: '🏋️ دمبل',
  cable: '🔗 كيبل',
  barbell: '🏋️‍♂️ بار',
  bodyweight: '🤸 وزن الجسم',
}

export interface Exercise {
  id: string
  nameAr: string
  nameEn: string
  reps: string
  defaultEquipment: Equipment
}

export interface Split {
  id: string
  emoji: string
  titleAr: string
  titleEn: string
  exercises: Exercise[]
}

export interface WorkoutLog {
  id: string
  splitId: string
  exerciseId: string
  date: string // ISO yyyy-mm-dd
  weight: number
  equipment: Equipment
  note?: string
}

export interface Measurement {
  id: string
  date: string // ISO yyyy-mm-dd
  weight?: number
  chest?: number
  waist?: number
  lowerBelly?: number
  hips?: number
  thighR?: number
  thighL?: number
  calfR?: number
  calfL?: number
  wristR?: number
  wristL?: number
}
