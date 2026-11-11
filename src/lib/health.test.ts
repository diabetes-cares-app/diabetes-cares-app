import { describe, expect, it } from 'vitest'
import { buildHistory } from './fixtures'
import { classify, dailyScores, overdueCheck, trendOf } from './health'

const NOW = new Date(2026, 10, 9, 16, 0).getTime()

describe('classify', () => {
  it('flags urgent highs and lows', () => {
    expect(classify(260, 'random')).toBe('urgent-high')
    expect(classify(50, 'fasting')).toBe('urgent-low')
    expect(classify(65, 'fasting')).toBe('low')
  })
  it('uses context-specific targets', () => {
    expect(classify(150, 'fasting')).toBe('high')
    expect(classify(150, 'after-meal')).toBe('in-range')
  })
})

describe('sample scenarios', () => {
  it('steady trends up, struggling trends down', () => {
    for (const [scenario, status] of [
      ['steady', 'doing-well'],
      ['struggling', 'needs-attention'],
    ] as const) {
      const h = buildHistory(scenario, NOW)
      expect(trendOf(dailyScores(h.readings, h.doses, NOW)).status).toBe(status)
    }
  })
  it('leaves the latest check overdue so reminders show', () => {
    const h = buildHistory('steady', NOW)
    expect(overdueCheck(h.readings, NOW)?.slot.id).toBe('post')
  })
  it('clears the overdue check once a reading is logged', () => {
    const h = buildHistory('steady', NOW)
    const readings = [
      { id: 'x', value: 120, takenAt: NOW, context: 'after-meal' as const },
      ...h.readings,
    ]
    expect(overdueCheck(readings, NOW)).toBeNull()
  })
})
