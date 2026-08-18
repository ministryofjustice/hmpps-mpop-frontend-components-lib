import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params = {}, phaseCode?: string) => {
  const html = env.render('supervision-package/partials/_next-appointment.njk', { params, phaseCode })
  return new JSDOM(html).window.document
}

const nextAppointment = {
  date: '2026-08-13',
  startTime: '09:15:00',
  type: { description: 'home visit' },
}

describe('_next-appointment partial', () => {
  it('renders nothing when the current phase is final third', () => {
    const document = renderPartial({ nextAppointment }, 'FTHRD')

    expect(document.body.textContent?.trim()).toBe('')
  })

  describe('when there is a next appointment', () => {
    it('renders the heading and appointment details', () => {
      const document = renderPartial({ nextAppointment })

      const heading = document.querySelector('h4.govuk-heading-s')
      const paragraph = document.querySelector('p.govuk-body')

      expect(heading?.textContent?.trim()).toBe('Next appointment')
      expect(paragraph?.textContent?.trim()).toBe('Home visit: Thursday 13 Aug at 9:15am')
    })

    it('title-cases the appointment type description', () => {
      const document = renderPartial({
        nextAppointment: { ...nextAppointment, type: { description: 'planned office visit' } },
      })

      const paragraph = document.querySelector('p.govuk-body')

      expect(paragraph?.textContent?.trim()).toBe('Planned office visit: Thursday 13 Aug at 9:15am')
    })

    it('renders a link when nextAppointmentHref is provided', () => {
      const document = renderPartial({ nextAppointment, nextAppointmentHref: '/appointments/1' })

      const link = document.querySelector('a.govuk-link')

      expect(link?.getAttribute('href')).toBe('/appointments/1')
      expect(link?.textContent?.trim()).toBe('Home visit: Thursday 13 Aug at 9:15am')
    })

    it('does not render a link when nextAppointmentHref is missing', () => {
      const document = renderPartial({ nextAppointment })

      expect(document.querySelector('a.govuk-link')).toBeNull()
    })

    it('renders the partial for non-final-third phase codes', () => {
      const document = renderPartial({ nextAppointment }, 'STD')

      expect(document.querySelector('h4.govuk-heading-s')?.textContent?.trim()).toBe('Next appointment')
    })
  })

  describe('when there is no next appointment to show', () => {
    it('shows the heading with "No appointments scheduled" when nextAppointment is missing', () => {
      const document = renderPartial({})

      expect(document.querySelector('h4.govuk-heading-s')?.textContent?.trim()).toBe('Next appointment')
      expect(document.querySelector('p.govuk-body')?.textContent?.trim()).toBe('No appointments scheduled')
    })

    it('shows "No appointments scheduled" when the appointment date/time cannot be built', () => {
      const document = renderPartial({
        nextAppointment: { date: '', startTime: '', type: { description: 'home visit' } },
      })

      expect(document.querySelector('p.govuk-body')?.textContent?.trim()).toBe('No appointments scheduled')
    })

    it('shows "No appointments scheduled" when the appointment type description is missing', () => {
      const document = renderPartial({
        nextAppointment: { date: '2026-08-13', startTime: '09:15:00', type: {} },
      })

      expect(document.querySelector('p.govuk-body')?.textContent?.trim()).toBe('No appointments scheduled')
    })
  })
})
