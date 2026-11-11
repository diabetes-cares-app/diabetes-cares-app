import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ScriptableContext,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import type { DayScore, Trend } from '../lib/health'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip)

const GOOD = '#1a8f4c'
const BAD = '#c9302c'

export function TrendChart({
  scores,
  trend,
  height = 260,
}: {
  scores: DayScore[]
  trend: Trend
  height?: number
}) {
  const color = trend.status === 'doing-well' ? GOOD : BAD
  const labels = scores.map((s) =>
    s.date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
  )
  const summary =
    trend.status === 'doing-well'
      ? `Care score trending up, averaging ${trend.weekAvg} this week.`
      : `Care score trending down, averaging ${trend.weekAvg} this week.`

  return (
    <figure className="m-0">
      <div className="relative w-full" style={{ height }}>
        <Line
          role="img"
          aria-label={`Daily care score chart for the last ${scores.length} days. ${summary}`}
          data={{
            labels,
            datasets: [
              {
                label: 'Care score',
                data: scores.map((s) => s.score),
                borderColor: color,
                borderWidth: 3,
                tension: 0.35,
                fill: true,
                pointRadius: scores.map((_, i) => (i === scores.length - 1 ? 5 : 0)),
                pointHoverRadius: 6,
                pointBackgroundColor: color,
                pointBorderColor: '#fffdf8',
                pointBorderWidth: 2,
                backgroundColor: (ctx: ScriptableContext<'line'>) => {
                  const { chart } = ctx
                  const area = chart.chartArea
                  if (!area) return 'transparent'
                  const g = chart.ctx.createLinearGradient(0, area.top, 0, area.bottom)
                  g.addColorStop(0, color + '55')
                  g.addColorStop(1, color + '00')
                  return g
                },
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 700 },
            interaction: { mode: 'index', intersect: false },
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#14231d',
                padding: 10,
                displayColors: false,
                callbacks: {
                  label: (item) => {
                    const s = scores[item.dataIndex]
                    return [
                      `Care score ${s.score}/100`,
                      `${s.checksDone}/${s.checksDue} checks · ${s.dosesTaken}/${s.dosesDue} doses`,
                      s.avg ? `Average ${s.avg} mg/dL` : 'No readings',
                    ]
                  },
                },
              },
            },
            scales: {
              y: {
                min: 0,
                max: 100,
                ticks: { stepSize: 25, color: '#4a5a52', font: { size: 11 } },
                grid: { color: '#e4dfd3' },
                border: { display: false },
              },
              x: {
                ticks: {
                  color: '#4a5a52',
                  font: { size: 11 },
                  maxRotation: 0,
                  autoSkip: true,
                  maxTicksLimit: 7,
                },
                grid: { display: false },
                border: { display: false },
              },
            },
          }}
        />
      </div>
      <figcaption className="sr-only">{summary}</figcaption>
      <details className="mt-3 text-sm">
        <summary className="cursor-pointer text-ink-soft underline underline-offset-2">
          View daily scores
        </summary>
        <table className="mt-2 w-full text-left">
          <thead>
            <tr className="text-ink-soft">
              <th className="py-1 font-medium">Day</th>
              <th className="py-1 font-medium text-right">Score</th>
              <th className="py-1 font-medium text-right">Checks</th>
              <th className="py-1 font-medium text-right">Doses</th>
              <th className="py-1 font-medium text-right">Avg mg/dL</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((s, i) => (
              <tr key={s.key} className="border-t border-line">
                <th className="py-1 font-normal">{labels[i]}</th>
                <td className="py-1 text-right tabular-nums">{s.score}</td>
                <td className="py-1 text-right tabular-nums">
                  {s.checksDone}/{s.checksDue}
                </td>
                <td className="py-1 text-right tabular-nums">
                  {s.dosesTaken}/{s.dosesDue}
                </td>
                <td className="py-1 text-right tabular-nums">{s.avg ?? '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}
