import nunjucks from 'nunjucks'
import { JSDOM } from 'jsdom'
import { tierTags } from '../../MPoPComponents'
import { gestPackageLength } from '../../utils/getPackageLength'

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], { autoescape: true })

env.addGlobal('gestPackageLength', gestPackageLength)

const renderComponent = (params = {}) => {
  const html = env.renderString(
    `{% from "supervision-package/macro.njk" import supervisionPackage %}
     {{ supervisionPackage(params) }}`,
    { params },
  )

  return new JSDOM(html).window.document
}

describe('supervision-package', () => {
  it.each`
    name             | tag                     | expectedTagText  | expectedTagClass       | expectedBodyText
    ${'provisional'} | ${tierTags.provisional} | ${'Provisional'} | ${'govuk-tag--orange'} | ${'We will calculate the supervision package once the tier is confirmed.'}
    ${'missing'}     | ${tierTags.missing}     | ${'Missing'}     | ${'govuk-tag--red'}    | ${null}
    ${'unavailable'} | ${tierTags.unavailable} | ${'Unavailable'} | ${'govuk-tag--grey'}   | ${'Tier information is currently unavailable.'}
    ${'none'}        | ${tierTags.none}        | ${null}          | ${null}                | ${null}
  `('renders the "$name" tag state', ({ tag, expectedTagText, expectedTagClass, expectedBodyText }) => {
    const document = renderComponent({ tierScore: 'C', tag, historyHref: '#' })

    expect(document.querySelector('.supervision-package')).not.toBeNull()
    expect(document.querySelector('h2')?.textContent?.trim()).toBe('Supervision package')
    expect(document.querySelector('h3')?.textContent?.trim()).toBe('Tier C')
    expect(document.querySelector('a')?.textContent?.trim()).toBe('View tier change history')

    const tagElement = document.querySelector('.govuk-tag')

    if (expectedTagText) {
      expect(tagElement?.textContent?.trim()).toBe(expectedTagText)
      expect(tagElement?.classList.contains(expectedTagClass)).toBe(true)
    } else {
      expect(tagElement).toBeNull()
    }

    if (expectedBodyText) {
      expect(document.body.textContent).toContain(expectedBodyText)
    }
  })

  // it('renders the progress bar width based on completed vs total appointments', () => {
  //   const document = renderComponent({
  //     tierScore: 'C',
  //     tag: tierTags.none,
  //     historyHref: '#',
  //     appointments: { allowance: 10, scheduled: 7, completed: 5 },
  //   })

  //   const bar = document.querySelector('.appointment-progress__bar') as HTMLElement
  //   expect(bar).not.toBeNull()
  //   expect(bar.style.width).toBe('50%')
  // })

  it('hides the tier score when tierScore is MISSING', () => {
    const document = renderComponent({ tierScore: 'MISSING', tag: tierTags.missing, historyHref: '#' })

    expect(document.querySelector('.supervision-package')).not.toBeNull()
    expect(document.querySelector('h2')?.textContent?.trim()).toBe('Supervision package')
    expect(document.querySelector('h3')?.textContent?.trim()).toBe('Tier')

    const tagElement = document.querySelector('.govuk-tag')
    expect(tagElement?.textContent?.trim()).toBe('Missing')
    expect(tagElement?.classList.contains('govuk-tag--red')).toBe(true)
  })
})
