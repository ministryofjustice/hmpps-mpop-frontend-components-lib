import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'
import sass from 'sass'
import { yearsSince } from '../src/utils/yearsSince'
import { gestPackageLength } from '../src/utils/getPackageLength'

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

const previewAge = yearsSince('1990-01-15')

const html = env.renderString(
  `
{% from "supervision-package/macro.njk" import supervisionPackage %}
{% from "pop-header/macro.njk" import popHeader %}

<!DOCTYPE html>
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

      {{ popHeader({
        crn: "X123456",
        dob: "1990-01-15",
        age: previewAge,
        tierScore: "C",
        historyHref: "#"
      }) }}

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
      <h1 class="govuk-heading-l">Supervision Package</h1>


      <h2 class="govuk-heading-m">Provisional tier</h2>
      <p class="govuk-body">A tier score has been calculated but is still provisional, so it is shown with an orange "Provisional" tag.</p>
      {{ supervisionPackage({
        heading: "type sentence",
        tierScore: "C",
        tag: { text: "Provisional", color: "orange" },
        historyHref: "#",
        createdOn: "1 January 2026",
        nextAppointment: "Planned office visit (NS): Friday 30 June 2026 at 5pm",
        nextAppointmentHref: "#",
        supervisionPhase: "Early engagement",
        popName: "Stuart",
        appointments: { allowance: 4, scheduled: 6, completed: 3 },
        phase: {
          startDate: "1 January 2025",
          endDate: "1 January 2026",
          phaseName: "Early engagement",
          earlyEngagementWeeks: 8
        }
      }) }}

      <h2 class="govuk-heading-m">Missing tier</h2>
      <p class="govuk-body">No tier score is available for this case, so it is shown with a red "Missing" tag.</p>
      {{ supervisionPackage({
        heading: "type sentence",
        tierScore: "",
        tag: { text: "Missing", color: "red" },
        historyHref: "#"
      }) }}

      <h2 class="govuk-heading-m">Unavailable tier</h2>
      <p class="govuk-body">The tier could not be retrieved (for example the Tier API errored), so it is shown with a grey "Unavailable" tag.</p>
      {{ supervisionPackage({
        heading: "type sentence",
        tierScore: "",
        tag: { text: "Unavailable", color: "grey" },
        historyHref: "#"
      }) }}

      <h2 class="govuk-heading-m">Confirmed tier with history link</h2>
      <p class="govuk-body">A confirmed tier score with no tag, including a link to view the tier change history.</p>
      {{ supervisionPackage({
        heading: "type sentence",
        tierScore: "A",
        tag: { text: null, color: null },
        historyHref: "#",
        historyText: "View tier change history"
      }) }}
    </div>
  </main>
</body>
</html>
`,
  { previewAge },
)

fs.mkdirSync('preview', { recursive: true })
fs.writeFileSync('preview/index.html', html)
