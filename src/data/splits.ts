import { Split } from '../types'

export const SPLITS: Split[] = [
  {
    id: 'legs-glutes-hamstring',
    emoji: '🍑',
    titleAr: 'علوي/سفلي 1 — أرجل (مؤخرة + خلف الفخذ)',
    titleEn: 'Legs (Glutes + Hamstring)',
    exercises: [
      { id: 'straddle-lift', nameAr: 'Straddle Lift', nameEn: 'Straddle lift', reps: '8,8,10', defaultEquipment: 'dumbbell' },
      { id: 'db-glutes-bridge', nameAr: 'DB Glutes Bridge', nameEn: 'DB glutes bridge', reps: '8,10,10', defaultEquipment: 'dumbbell' },
      { id: 'leg-press-high-wide', nameAr: 'Leg Press (وضع عريض)', nameEn: 'Leg press high wide feet', reps: '8', defaultEquipment: 'machine' },
      { id: 'leg-curl', nameAr: 'Leg Curl', nameEn: 'Leg curl', reps: '8,8,10', defaultEquipment: 'machine' },
    ],
  },
  {
    id: 'legs-glutes-quads',
    emoji: '🦵',
    titleAr: 'علوي/سفلي 2 — أرجل (مؤخرة + أمام الفخذ)',
    titleEn: 'Legs (Glutes + Quads)',
    exercises: [
      { id: 'hip-thrust', nameAr: 'Hip Thrust', nameEn: 'Hip thrust', reps: '8,10,10', defaultEquipment: 'barbell' },
      { id: 'goblet-sumo-squat', nameAr: 'Goblet Sumo Squat', nameEn: 'Goblet sumo quads squat', reps: '8', defaultEquipment: 'dumbbell' },
      { id: 'back-extension', nameAr: 'Back Extension (مؤخرة)', nameEn: 'Back extension (glutes)', reps: '8,10,10', defaultEquipment: 'bodyweight' },
      { id: 'leg-extension', nameAr: 'Leg Extension', nameEn: 'Leg extension', reps: '10', defaultEquipment: 'machine' },
    ],
  },
  {
    id: 'upper-pull',
    emoji: '🔙',
    titleAr: 'علوي Pull — ظهر + كتف خلفي + بايسبس + بطن',
    titleEn: 'Upper PULL (Back + Delts + Biceps + core)',
    exercises: [
      { id: 'reverse-grip-bent-over-bb', nameAr: 'Reverse Grip Bent Over BB', nameEn: 'Reverse grip bent over BB', reps: '8', defaultEquipment: 'barbell' },
      { id: 'assisted-pull-up', nameAr: 'Assisted Pull Up', nameEn: 'Assisted pull up', reps: '8,8,10', defaultEquipment: 'machine' },
      { id: 'straight-arm-pull-down', nameAr: 'Straight Arm Pull Down', nameEn: 'Straight arm pull down', reps: '8', defaultEquipment: 'cable' },
      { id: 'lateral-raises', nameAr: 'Lateral Raises', nameEn: 'Lateral raises', reps: '7', defaultEquipment: 'dumbbell' },
      { id: 'incline-cable-biceps-curl', nameAr: 'Incline/Cable Biceps Curl', nameEn: 'Incline OR cable biceps curl', reps: '8,8,10', defaultEquipment: 'cable' },
      { id: 'abdominal-crunch', nameAr: 'عضلات بطن (Crunch)', nameEn: 'Abdominal crunch', reps: '8 / 3 جولات', defaultEquipment: 'bodyweight' },
      { id: 'bicycle-crunches', nameAr: 'Bicycle Crunches', nameEn: 'Bicycle crunches', reps: '10 لكل جهة / 3 جولات', defaultEquipment: 'bodyweight' },
      { id: 'russian-twist', nameAr: 'Russian Twist', nameEn: 'Russian twist', reps: '12 لكل جهة / 3 جولات', defaultEquipment: 'bodyweight' },
    ],
  },
  {
    id: 'upper-push',
    emoji: '💪',
    titleAr: 'علوي Push — صدر + ترايسبس + بطن',
    titleEn: 'Upper PUSH (Chest + Triceps + core)',
    exercises: [
      { id: 'db-incline-bench-press', nameAr: 'DB Incline Bench Press', nameEn: 'DB incline bench press', reps: '8,8,10', defaultEquipment: 'dumbbell' },
      { id: 'db-military-press', nameAr: 'DB Military Press', nameEn: 'DB military press', reps: '8', defaultEquipment: 'dumbbell' },
      { id: 'chest-machine-flys', nameAr: 'Chest Machine Flys', nameEn: 'Chest machine flys', reps: '8,8,10', defaultEquipment: 'machine' },
      { id: 'seated-db-tricep-extension', nameAr: 'Seated DB Tricep Extension', nameEn: 'Seated DB tricep extension', reps: '8', defaultEquipment: 'dumbbell' },
      { id: 'tri-cable-pressdown', nameAr: 'Tri-Cable Pressdown', nameEn: 'Tri-cable pressdown', reps: '8,8,10', defaultEquipment: 'cable' },
      { id: 'mountain-climber', nameAr: 'Mountain Climber', nameEn: 'Mountain climber', reps: '12 لكل جهة', defaultEquipment: 'bodyweight' },
      { id: 'dead-bug', nameAr: 'Dead Bug', nameEn: 'Dead bug', reps: '10 لكل جهة', defaultEquipment: 'bodyweight' },
      { id: 'leg-raise', nameAr: 'Leg Raise', nameEn: 'Leg raise', reps: '12 لكل جهة', defaultEquipment: 'bodyweight' },
    ],
  },
]
