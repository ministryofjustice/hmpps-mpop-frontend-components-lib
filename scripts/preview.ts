import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'
import sass from 'sass'
import { yearsSince } from '../src/utils/yearsSince'
import { dateWithYear } from '../src/utils/dateWithYear'
import { gestPackageLength } from '../src/utils/getPackageLength'
import { tierTags } from '../src/MPoPComponents'
import type { PersonalDetailsSummary } from '../src/types/PersonalDetails'
import type { LatestTier } from '../src/types/TierCalculation'

const previewCss = sass.compile(fileURLToPath(new URL('./preview.scss', import.meta.url)), {
  loadPaths: [
    fileURLToPath(new URL('..', import.meta.url)),
    fileURLToPath(new URL('../node_modules', import.meta.url)),
  ],
}).css

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], {
  autoescape: true,
})

env.addGlobal('gestPackageLength', gestPackageLength)

const personalDetails: PersonalDetailsSummary = {
  name: {
    forename: 'Stuart',
    middleName: '',
    surname: 'Smith',
  },
  crn: 'X123456',
  offenderId: 1234567,
  pnc: '2023/0123456A',
  noms: 'A1234BC',
  dateOfBirth: '1990-01-15',
  age: yearsSince('1990-01-15'),
}

const tier: LatestTier = {
  tierScore: 'A',
  calculationId: '7feffb1a-0000-0000-0000-000000000000',
  calculationDate: '2026-01-01T09:00:00Z',
  changeReason: 'Initial calculation',
  provisional: false,
  tag: { ...tierTags.none },
}

// Renders the supervision-package macro with the given props.
const supervisionPackage = (params: object): string =>
  env.renderString(
    '{% from "supervision-package/macro.njk" import supervisionPackage %}{{ supervisionPackage(params) }}',
    { params },
  )

// Renders the pop-header macro with the given props.
const popHeader = (params: object): string =>
  env.renderString('{% from "pop-header/macro.njk" import popHeader %}{{ popHeader(params) }}', { params })

const popHeaderParams = {
  crn: personalDetails.crn,
  dob: dateWithYear(personalDetails.dateOfBirth),
  age: personalDetails.age,
  tierScore: tier.tierScore,
  historyHref: '#',
}

const html = `<!DOCTYPE html>
<html lang="en" class="govuk-template">
<head>
  <meta charset="utf-8">
  <title>MPOP Component Preview</title>

  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/govuk-frontend@6.2.0/dist/govuk/govuk-frontend.min.css"
  >

  <style>${previewCss}</style>
</head>

<body class="govuk-template__body">
  <main class="govuk-main-wrapper">
    <div class="govuk-width-container">
      <h1 class="govuk-heading-l">MPOP Component Preview</h1>

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
      <h1 class="govuk-heading-l">PoP Header</h1>

      ${popHeader(popHeaderParams)}

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
      <h1 class="govuk-heading-l">Early engagement supervision package</h1>
      <p class="govuk-body">Three example cases of the Early engagement supervision package component.</p>

      <section class="phase-preview">
        <h2 class="govuk-heading-m">In custody, not eligible for final third (all optional fields off)</h2>
        ${supervisionPackage({
          heading: 'Early engagement',
          historyHref: '#',
          historyText: 'View tier change history',
          nextAppointment: 'Planned office visit (NS): Friday 30 June 2026 at 5pm',
          nextAppointmentHref: '#',
          forename: personalDetails.name.forename,
          surname: personalDetails.name.surname,
          tierScore: tier.tierScore,
          tag: tier.tag,
          createdOn: dateWithYear('2026-01-01'),
          supervisionPhaseEndDate: dateWithYear('2026-01-01'),
          phase: {
            phaseName: 'Early engagement',
            endDate: dateWithYear('2026-01-01'),
            earlyEngagementWeeks: 8,
          },
          phaseDates: {
            startDate: '2025-01-01',
            endDate: '2026-01-01',
          },
          gender: 'male',
          isCustody: true,
          iomRedRated: false,
          finalThirdEligible: false,
          finalThirdDate: '',
          finalThirdStartDate: dateWithYear('2026-06-01'),
          appointments: { allowance: 4, scheduled: 6, completed: 3 },
          appointmentsHref: '#',
        })}
      </section>

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

      <section class="phase-preview">
        <h2 class="govuk-heading-m">In custody, eligible for final third, female, all appointments attended</h2>
        ${supervisionPackage({
          heading: 'Early engagement',
          historyHref: '#',
          historyText: 'View tier change history',
          nextAppointment: 'Planned office visit (NS): Friday 30 June 2026 at 5pm',
          nextAppointmentHref: '#',
          forename: personalDetails.name.forename,
          surname: personalDetails.name.surname,
          tierScore: tier.tierScore,
          tag: tier.tag,
          createdOn: dateWithYear('2026-01-01'),
          supervisionPhaseEndDate: dateWithYear('2026-01-01'),
          phase: {
            phaseName: 'Early engagement',
            endDate: dateWithYear('2026-01-01'),
            earlyEngagementWeeks: 8,
          },
          phaseDates: {
            startDate: '2025-01-01',
            endDate: '2026-01-01',
          },
          gender: 'female',
          isCustody: true,
          iomRedRated: true,
          appointmentsHref: '#',
          finalThirdEligible: true,
          finalThirdDate: dateWithYear('2026-06-01'),
          finalThirdStartDate: dateWithYear('2026-06-01'),
          appointments: { allowance: 4, scheduled: 0, completed: 4 },
        })}
      </section>

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

      <section class="phase-preview">
        <h2 class="govuk-heading-m">Not in custody</h2>
        ${supervisionPackage({
          heading: 'Early engagement',
          historyHref: '#',
          historyText: 'View tier change history',
          nextAppointment: 'Planned office visit (NS): Friday 30 June 2026 at 5pm',
          nextAppointmentHref: '#',
          appointmentsHref: '#',
          forename: personalDetails.name.forename,
          surname: personalDetails.name.surname,
          tierScore: tier.tierScore,
          tag: tier.tag,
          createdOn: dateWithYear('2026-01-01'),
          supervisionPhaseEndDate: dateWithYear('2026-01-01'),
          phase: {
            phaseName: 'Early engagement',
            endDate: dateWithYear('2026-01-01'),
            earlyEngagementWeeks: 8,
          },
          phaseDates: {
            startDate: '2025-01-01',
            endDate: '2026-01-01',
          },
          gender: 'female',
          isCustody: false,
          iomRedRated: true,
          finalThirdEligible: false,
          finalThirdDate: '',
          finalThirdStartDate: dateWithYear('2026-06-01'),
          appointments: { allowance: 4, scheduled: 6, completed: 3 },
        })}
      </section>
    </div>
  </main>
</body>
</html>
`

fs.mkdirSync('preview', { recursive: true })
fs.writeFileSync('preview/index.html', html)
