import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })

const renderPartial = (params = {}) => {
  const html = env.render('supervision-package/partials/_progress-bar.njk', { params })
  return new JSDOM(html).window.document
}

describe('_progress-bar partial', () => {
  describe('progress bar width percentage', () => {
    it.each`
      appointmentsEarlyEngagementCompleted | earlyEngagementWeeks | expectedPercent
      ${2}                                 | ${4}                 | ${50}
      ${3}                                 | ${4}                 | ${75}
      ${4}                                 | ${4}                 | ${100}
      ${1}                                 | ${3}                 | ${33}
      ${0}                                 | ${5}                 | ${0}
    `(
      'sets width to $expectedPercent% when $appointmentsEarlyEngagementCompleted of $earlyEngagementWeeks appointments completed (Early engagement)',
      ({ appointmentsEarlyEngagementCompleted, earlyEngagementWeeks, expectedPercent }) => {
        const document = renderPartial({
          phaseName: 'Early engagement',
          appointmentsEarlyEngagementCompleted,
          earlyEngagementWeeks,
          appointmentsScheduled: 0,
        })

        const bar = document.querySelector(
          '.appointment-progress__bar, .appointment-progress__bar-maximum',
        ) as HTMLElement
        expect(bar).not.toBeNull()
        expect(bar.style.width).toBe(`${expectedPercent}%`)
      },
    )

    it('uses the bar-maximum class when progress reaches 100%', () => {
      const document = renderPartial({
        phaseName: 'Early engagement',
        appointmentsEarlyEngagementCompleted: 5,
        earlyEngagementWeeks: 5,
        appointmentsScheduled: 0,
      })

      expect(document.querySelector('.appointment-progress__bar-maximum')).not.toBeNull()
      expect(document.querySelector('.appointment-progress__bar')).toBeNull()
    })

    it('uses the standard bar class when progress is below 100%', () => {
      const document = renderPartial({
        phaseName: 'Early engagement',
        appointmentsEarlyEngagementCompleted: 3,
        earlyEngagementWeeks: 5,
        appointmentsScheduled: 0,
      })

      expect(document.querySelector('.appointment-progress__bar')).not.toBeNull()
      expect(document.querySelector('.appointment-progress__bar-maximum')).toBeNull()
    })
  })

  describe('Early engagement phase', () => {
    it.each`
      appointmentsEarlyEngagementCompleted | earlyEngagementWeeks | expectedRemaining
      ${0}                                 | ${5}                 | ${5}
      ${2}                                 | ${5}                 | ${3}
      ${5}                                 | ${5}                 | ${0}
      ${1}                                 | ${4}                 | ${3}
    `(
      'shows $expectedRemaining remaining when $appointmentsEarlyEngagementCompleted of $earlyEngagementWeeks completed',
      ({ appointmentsEarlyEngagementCompleted, earlyEngagementWeeks, expectedRemaining }) => {
        const document = renderPartial({
          phaseName: 'Early engagement',
          appointmentsEarlyEngagementCompleted,
          earlyEngagementWeeks,
          appointmentsScheduled: 0,
        })

        const paragraphs = Array.from(document.querySelectorAll('p.govuk-body-l'))
        const remainingText = paragraphs[1]?.textContent?.trim()
        expect(remainingText).toBe(String(expectedRemaining))
      },
    )

    it('shows earlyEngagementWeeks as the Maximum allowance', () => {
      const document = renderPartial({
        phaseName: 'Early engagement',
        appointmentsEarlyEngagementCompleted: 2,
        earlyEngagementWeeks: 8,
        appointmentsScheduled: 0,
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body-l'))
      expect(paragraphs[0]?.textContent?.trim()).toBe('8')
    })
  })

  describe('non-Early engagement phase', () => {
    it.each`
      appointmentsAllowance | earlyEngagementWeeks | appointmentsCompleted | expectedAllowance | expectedRemaining
      ${20}                 | ${5}                 | ${3}                  | ${15}             | ${12}
      ${10}                 | ${2}                 | ${1}                  | ${8}              | ${7}
      ${15}                 | ${5}                 | ${5}                  | ${10}             | ${5}
    `(
      'shows allowance $expectedAllowance and remaining $expectedRemaining (appointmentsAllowance=$appointmentsAllowance, earlyEngagementWeeks=$earlyEngagementWeeks, completed=$appointmentsCompleted)',
      ({
        appointmentsAllowance,
        earlyEngagementWeeks,
        appointmentsCompleted,
        expectedAllowance,
        expectedRemaining,
      }) => {
        const document = renderPartial({
          phaseName: 'Standard',
          appointmentsAllowance,
          earlyEngagementWeeks,
          appointmentsCompleted,
          appointmentsScheduled: 0,
        })

        const paragraphs = Array.from(document.querySelectorAll('p.govuk-body-l'))
        expect(paragraphs[0]?.textContent?.trim()).toBe(String(expectedAllowance))
        expect(paragraphs[1]?.textContent?.trim()).toBe(String(expectedRemaining))
      },
    )
  })

  describe('upcoming appointments', () => {
    it('displays the scheduled appointments count', () => {
      const document = renderPartial({
        phaseName: 'Early engagement',
        appointmentsCompleted: 1,
        earlyEngagementWeeks: 5,
        appointmentsScheduled: 3,
      })

      const paragraphs = Array.from(document.querySelectorAll('p.govuk-body-l'))
      expect(paragraphs[2]?.textContent?.trim()).toBe('3')
    })
  })

  describe('zero-denominator guard', () => {
    it('renders 0% width when earlyEngagementWeeks is 0 (Early engagement)', () => {
      const document = renderPartial({
        phaseName: 'Early engagement',
        appointmentsEarlyEngagementCompleted: 3,
        earlyEngagementWeeks: 0,
        appointmentsScheduled: 0,
      })

      const bar = document.querySelector(
        '.appointment-progress__bar, .appointment-progress__bar-maximum',
      ) as HTMLElement
      expect(bar).not.toBeNull()
      expect(bar.style.width).toBe('0%')
    })

    it('renders 0% width when appointmentsAllowance equals earlyEngagementWeeks (non-early)', () => {
      const document = renderPartial({
        phaseName: 'Standard',
        appointmentsAllowance: 5,
        earlyEngagementWeeks: 5,
        appointmentsCompleted: 3,
        appointmentsScheduled: 0,
      })

      const bar = document.querySelector(
        '.appointment-progress__bar, .appointment-progress__bar-maximum',
      ) as HTMLElement
      expect(bar).not.toBeNull()
      expect(bar.style.width).toBe('0%')
    })
  })

  describe('width percent clamping', () => {
    it('clamps to 100% and uses bar-maximum class when completed exceeds allowance (Early engagement)', () => {
      const document = renderPartial({
        phaseName: 'Early engagement',
        appointmentsEarlyEngagementCompleted: 7,
        earlyEngagementWeeks: 5,
        appointmentsScheduled: 0,
      })

      const bar = document.querySelector(
        '.appointment-progress__bar, .appointment-progress__bar-maximum',
      ) as HTMLElement
      expect(bar.style.width).toBe('100%')
      expect(document.querySelector('.appointment-progress__bar-maximum')).not.toBeNull()
      expect(document.querySelector('.appointment-progress__bar')).toBeNull()
    })

    it('clamps to 100% and uses bar-maximum class when completed exceeds allowance (non-early)', () => {
      const document = renderPartial({
        phaseName: 'Standard',
        appointmentsAllowance: 10,
        earlyEngagementWeeks: 2,
        appointmentsCompleted: 9,
        appointmentsScheduled: 0,
      })

      // allowance = 10 - 2 = 8, completed = 9 → rawPercent = 113 → clamped to 100
      const bar = document.querySelector(
        '.appointment-progress__bar, .appointment-progress__bar-maximum',
      ) as HTMLElement
      expect(bar.style.width).toBe('100%')
      expect(document.querySelector('.appointment-progress__bar-maximum')).not.toBeNull()
      expect(document.querySelector('.appointment-progress__bar')).toBeNull()
    })
  })

  describe('missing value coercion', () => {
    it('treats undefined appointmentsEarlyEngagementCompleted as empty', () => {
      const document = renderPartial({
        phaseName: 'Early engagement',
        earlyEngagementWeeks: 5,
        appointmentsScheduled: 0,
      })

      const bar = document.querySelector(
        '.appointment-progress__bar, .appointment-progress__bar-maximum',
      ) as HTMLElement
      expect(bar).not.toBeNull()
      expect(bar.style.width).toBe('')
    })

    it('treats undefined earlyEngagementWeeks as 0 and renders 0% width', () => {
      const document = renderPartial({
        phaseName: 'Early engagement',
        appointmentsEarlyEngagementCompleted: 3,
        appointmentsScheduled: 0,
      })

      const bar = document.querySelector(
        '.appointment-progress__bar, .appointment-progress__bar-maximum',
      ) as HTMLElement
      expect(bar).not.toBeNull()
      expect(bar.style.width).toBe('0%')
    })

    it('treats undefined appointmentsCompleted as 0 (non-early)', () => {
      const document = renderPartial({
        phaseName: 'Standard',
        appointmentsAllowance: 10,
        earlyEngagementWeeks: 2,
        appointmentsScheduled: 0,
      })

      const bar = document.querySelector(
        '.appointment-progress__bar, .appointment-progress__bar-maximum',
      ) as HTMLElement
      expect(bar).not.toBeNull()
      expect(bar.style.width).toBe('0%')
    })
  })
})
