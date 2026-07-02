import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'
import sass from 'sass'
import { yearsSince } from '../src/utils/yearsSince'
import { dateWithYear } from '../src/utils/dateWithYear'
import { gestPackageLength } from '../src/utils/getPackageLength'
import { tierTags } from '../src/MPoPComponents'
import type { PersonalDetailsSummary, SupervisionPackageResponse } from '../src/types/PersonalDetails'
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

// Mock API responses that mirror the shapes returned by MPoPComponents.getPersonalDetails,
// getSupervisionPackage and getTierDetails, so the preview exercises the same data flow as a
// real consumer of the library.
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

// Factory for a SupervisionPackageResponse in a given phase, so each phase preview
// exercises the same data flow as a real consumer of the library.
const makeResponse = (code: string, description: string): SupervisionPackageResponse => ({
  phase: {
    name: {
      code,
      description,
    },
    startDate: '2025-01-01',
    endDate: '2026-01-01',
    appointments: {
      allowance: 4,
      scheduled: 6,
      completed: 3,
    },
  },
  inputs: {
    date: '2026-01-01',
    gender: 'female',
    opd: false,
    iomRedRated: true,
    intensiveSupervisionCourt: false,
    nationalSecurityDivision: true,
    finalThirdEligible: false,
    finalThirdDate: '2026-06-01',
    contactSuspendedDate: '',
    sentences: [],
  },
})

// A single confirmed tier is used across the phase previews so the focus stays on the
// phase-specific content and its conditional props rather than the tier tag states.
const tier: LatestTier = {
  tierScore: 'A',
  calculationId: '7feffb1a-0000-0000-0000-000000000000',
  calculationDate: '2026-01-01T09:00:00Z',
  changeReason: 'Initial calculation',
  provisional: false,
  tag: { ...tierTags.none },
}

// The on/off state of each conditional prop that a preview can toggle.
type ToggleState = Partial<Record<string, boolean>>

// Map the API response onto the props consumed by supervision-package/template.njk,
// letting individual conditional props be overridden by the toggle state.
const buildSupervisionPackageParams = (
  latestTier: LatestTier,
  summary: PersonalDetailsSummary,
  supervisionPackage: SupervisionPackageResponse,
  toggles: ToggleState = {},
) => {
  const { name } = summary
  const { phase, inputs } = supervisionPackage
  const { appointments } = phase

  const primarySentence = inputs.sentences.find(sentence => sentence.supervisionPackage)
  const isCustody = toggles.isCustody ?? primarySentence?.type.isCustodial ?? false
  const finalThirdEligible = toggles.finalThirdEligible ?? inputs.finalThirdEligible
  const finalThirdStartDateOn = toggles.finalThirdStartDate ?? Boolean(inputs.finalThirdDate)

  // The person the supervision package is about.
  const person = {
    popName: `${name.forename} ${name.surname}`,
    forename: name.forename,
    gender: inputs.gender,
  }

  // The latest tier and its supporting metadata.
  const tierDetails = {
    tierScore: latestTier.tierScore,
    tag: latestTier.tag,
    createdOn: dateWithYear(inputs.date),
  }

  // The sentence and its supervision progress.
  const sentence = {
    isCustody,
    iomRedRated: inputs.iomRedRated,
    finalThirdEligible,
    finalThirdDate: finalThirdEligible ? dateWithYear(inputs.finalThirdDate) : '',
    finalThirdStartDate: finalThirdStartDateOn ? dateWithYear(inputs.finalThirdDate) : '',
    appointments,
    appointmentsRemaining: appointments.allowance - appointments.completed,
    appointmentsAttended: appointments.completed,
    appoitmentsTotal: appointments.allowance,
    supervisionPhaseEndDate: dateWithYear(phase.endDate),
  }

  return {
    heading: phase.name.description,
    historyHref: '#',
    historyText: 'View tier change history',
    nextAppointment: 'Planned office visit (NS): Friday 30 June 2026 at 5pm',
    nextAppointmentHref: '#',
    ...person,
    ...tierDetails,
    ...sentence,
    phase: {
      phaseName: phase.name.description,
      endDate: dateWithYear(phase.endDate),
      earlyEngagementWeeks: 8,
    },
    // Raw ISO dates the supervision-stage partial needs to derive the phase length.
    phaseDates: {
      startDate: phase.startDate,
      endDate: phase.endDate,
    },
  }
}

// A named preview state for a phase: a radio option with the conditional-prop overrides it applies.
type PhaseOption = { label: string; state: ToggleState }

// Each phase, an optional explanation, and the mutually-exclusive states it can be previewed in.
const phases: Array<{
  id: string
  label: string
  description?: string
  response: SupervisionPackageResponse
  options: PhaseOption[]
}> = [
  {
    id: 'early-engagement',
    label: 'Early engagement',
    description:
      'Final third eligibility is only relevant while the person is in custody, so it is not an independent flag: it only changes what is shown within the in-custody states. When the person is not in custody, no final third message is shown at all.',
    response: makeResponse('EARLY_ENGAGEMENT', 'Early engagement'),
    options: [
      { label: 'In custody and eligible for final third', state: { isCustody: true, finalThirdEligible: true } },
      { label: 'In custody and not eligible for final third', state: { isCustody: true, finalThirdEligible: false } },
      { label: 'Not in custody', state: { isCustody: false } },
    ],
  },
  {
    id: 'supervision-engagement',
    label: 'Supervision engagement',
    response: makeResponse('SUPERVISION_ENGAGEMENT', 'Supervision engagement'),
    options: [
      { label: 'Final third start date set', state: { finalThirdStartDate: true } },
      { label: 'No final third start date', state: { finalThirdStartDate: false } },
    ],
  },
  {
    id: 'final-third',
    label: 'Final third',
    response: makeResponse('FINAL_THIRD', 'Final third'),
    options: [],
  },
]

const renderComponent = (params: object): string =>
  env.renderString(
    '{% from "supervision-package/macro.njk" import supervisionPackage %}{{ supervisionPackage(params) }}',
    { params },
  )

const renderPopHeader = (params: object): string =>
  env.renderString('{% from "pop-header/macro.njk" import popHeader %}{{ popHeader(params) }}', { params })

// Mutually-exclusive radio buttons, one per named preview state.
const optionControls = (phaseId: string, options: PhaseOption[]): string => {
  const items = options
    .map((option, index) => {
      const inputId = `${phaseId}__${index}`
      return `
              <div class="govuk-radios__item">
                <input class="govuk-radios__input" id="${inputId}" name="${phaseId}" type="radio" value="${index}"${index === 0 ? ' checked' : ''}>
                <label class="govuk-label govuk-radios__label" for="${inputId}">${option.label}</label>
              </div>`
    })
    .join('')
  return `
        <form class="phase-preview__controls">
          <fieldset class="govuk-fieldset">
            <legend class="govuk-fieldset__legend govuk-fieldset__legend--s">Preview state</legend>
            <div class="govuk-radios govuk-radios--small">${items}
            </div>
          </fieldset>
        </form>`
}

// For each phase, pre-render a component variant per named state and expose the states as
// mutually-exclusive radio buttons; the client script below swaps which variant is visible.
const phaseSections = phases
  .map(phase => {
    const variantsHtml = phase.options.length
      ? phase.options
          .map((option, index) => {
            const params = buildSupervisionPackageParams(tier, personalDetails, phase.response, option.state)
            return `<div class="phase-preview__variant" data-variant="${index}"${index === 0 ? '' : ' hidden'}>${renderComponent(params)}</div>`
          })
          .join('\n')
      : `<div class="phase-preview__variant">${renderComponent(buildSupervisionPackageParams(tier, personalDetails, phase.response))}</div>`

    const descriptionHtml = phase.description ? `<p class="govuk-body">${phase.description}</p>` : ''
    const controlsHtml = phase.options.length ? optionControls(phase.id, phase.options) : ''

    return `
      <section class="phase-preview" data-phase="${phase.id}">
        <h2 class="govuk-heading-m">${phase.label}</h2>
        ${descriptionHtml}
        <div class="phase-preview__variants">${variantsHtml}</div>
        ${controlsHtml}
      </section>`
  })
  .join('\n      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">\n')

const popHeaderParams = {
  crn: personalDetails.crn,
  dob: dateWithYear(personalDetails.dateOfBirth),
  age: personalDetails.age,
  tierScore: tier.tierScore,
  historyHref: '#',
}

// Shows the pre-rendered variant matching the selected preview-state radio per phase.
const toggleScript = [
  "document.querySelectorAll('[data-phase]').forEach(function (section) {",
  "  var radios = section.querySelectorAll('input[type=radio]')",
  '  if (!radios.length) return',
  "  var variants = Array.prototype.slice.call(section.querySelectorAll('.phase-preview__variant'))",
  '  function update() {',
  "    var checked = section.querySelector('input[type=radio]:checked')",
  "    var value = checked ? checked.value : '0'",
  '    variants.forEach(function (variant) {',
  '      variant.hidden = variant.dataset.variant !== value',
  '    })',
  '  }',
  '  radios.forEach(function (radio) {',
  "    radio.addEventListener('change', update)",
  '  })',
  '  update()',
  '})',
].join('\n')

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

      ${renderPopHeader(popHeaderParams)}

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
      <h1 class="govuk-heading-l">Supervision Package</h1>
      <p class="govuk-body">One preview per phase. Use the radio buttons under each component to toggle its conditional props on or off.</p>
${phaseSections}
    </div>
  </main>
  <script>${toggleScript}</script>
</body>
</html>
`

fs.mkdirSync('preview', { recursive: true })
fs.writeFileSync('preview/index.html', html)
