interface Props {
  values: number[]
  width?: number
  height?: number
  color?: string
}

export default function Sparkline({ values, width = 280, height = 60, color = '#6E6EE8' }: Props) {
  if (values.length === 0) return null
  if (values.length === 1) {
    return (
      <svg width={width} height={height}>
        <circle cx={width / 2} cy={height / 2} r={4} fill={color} />
      </svg>
    )
  }

  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1
  const step = width / (values.length - 1)

  const points = values.map((v, i) => {
    const x = i * step
    const y = height - ((v - min) / range) * (height - 10) - 5
    return `${x},${y}`
  })

  return (
    <svg width={width} height={height}>
      <polyline points={points.join(' ')} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {values.map((v, i) => {
        const [x, y] = points[i].split(',').map(Number)
        return (
          <circle key={i} cx={x} cy={y} r={3} fill={color}>
            <title>{v}</title>
          </circle>
        )
      })}
    </svg>
  )
}
