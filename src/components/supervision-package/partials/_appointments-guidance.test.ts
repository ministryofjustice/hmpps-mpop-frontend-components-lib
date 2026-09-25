import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { mpopNunjucksSetup } from '../../../utils/nunjucksFilters'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })
mpopNunjucksSetup(env)

const renderPartial = (params: Record<string, unknown> = {}, forename = 'Alex') => {
  const mergedParams = {
    context: { sentences: [] },
    currentYear: { endDate: '2026-12-01', appointments: { completed: 2, allowance: 10 } },
    ...params,
  }
  const html = env.render('supervision-package/partials/_appointments-guidance.njk', {
    params: mergedParams,
    forename,
  })
  return new JSDOM(html).window.document
}

const paragraphsOf = (document: Document) => Array.from(document.querySelectorAll('p.govuk-body'))

describe('_appointments-guidance partial', () => {
  it('shows the used-all-appointments paragraph when the allowance has been used', () => {
    const document = renderPartial({
      currentYear: { endDate: '2026-12-01', appointments: { completed: 10, allowance: 10 } },
    })

    expect(paragraphsOf(document)[0].textContent).toContain(
      'Alex has used all the supervision package appointments. If new risks emerge or there are exceptional circumstances, you can arrange contingency appointments.',
    )

    expect(paragraphsOf(document).some(p => p.textContent?.includes('appointments remaining'))).toBe(false)
  })

  it('does not show the used-all-appointments paragraph without a forename', () => {
    const document = renderPartial(
      { currentYear: { endDate: '2026-12-01', appointments: { completed: 10, allowance: 10 } } },
      '',
    )

    const paragraph = paragraphsOf(document).find(p => p.textContent?.includes('has used all the supervision'))

    expect(paragraph).toBeUndefined()
  })

  it('shows the package-resets message when all appointments are used and the package resets before the sentence ends', () => {
    const document = renderPartial({
      context: { sentences: [{ supervisionPackage: { code: 'CUR' }, endDate: '2027-06-01' }] },
      currentYear: { endDate: '2026-12-01', appointments: { completed: 10, allowance: 10 } },
    })

    const paragraphs = paragraphsOf(document)
    expect(paragraphs).toHaveLength(2)
    expect(paragraphs[0].textContent).toContain('Alex has used all the supervision package appointments.')
    expect(paragraphs[1].textContent).toBe('The supervision package resets on 1 December 2026.')
    expect(paragraphs.some(p => p.textContent?.includes('stage ends'))).toBe(false)
  })

  it('shows the stage-ends message when all appointments are used and the sentence ends before the reset', () => {
    const document = renderPartial({
      context: { sentences: [{ supervisionPackage: { code: 'CUR' }, endDate: '2026-06-01' }] },
      currentYear: { endDate: '2026-12-01', appointments: { completed: 10, allowance: 10 } },
    })

    const paragraphs = paragraphsOf(document)
    expect(paragraphs).toHaveLength(2)
    expect(paragraphs[0].textContent).toContain('Alex has used all the supervision package appointments.')
    expect(paragraphs[1].textContent).toBe('The supervision stage ends on 1 December 2026.')
    expect(paragraphs.some(p => p.textContent?.includes('package resets'))).toBe(false)
  })

  it('shows the remaining-appointments-until-reset paragraph when the package resets before the sentence ends', () => {
    const document = renderPartial({
      context: { sentences: [{ supervisionPackage: { code: 'CUR' }, endDate: '2027-06-01' }] },
      currentYear: { endDate: '2026-12-01', appointments: { completed: 2, allowance: 10 } },
    })

    expect(paragraphsOf(document)[0].textContent).toContain(
      'Alex has 8 supervision appointments remaining until the supervision package resets on 1 December 2026.',
    )
  })

  it('shows the remaining-appointments-until-stage-ends paragraph when the sentence ends before the reset', () => {
    const document = renderPartial({
      context: { sentences: [{ supervisionPackage: { code: 'CUR' }, endDate: '2026-06-01' }] },
      currentYear: { endDate: '2026-12-01', appointments: { completed: 2, allowance: 10 } },
    })

    expect(paragraphsOf(document)[0].textContent).toContain(
      'Alex has 8 supervision appointments remaining until the supervision stage ends on 1 December 2026.',
    )
  })
})
