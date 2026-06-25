import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'
import sass from 'sass'
import { yearsSince } from '../src/utils/yearsSince'

const previewCss = sass.compile(fileURLToPath(new URL('./preview.scss', import.meta.url))).css

const env = nunjucks.configure(['src/components'], {
  autoescape: true,
})

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
        tierScore: "B2",
        historyHref: "#"
      }) }}

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
      <h1 class="govuk-heading-l">Supervision Package</h1>


      <h2 class="govuk-heading-m">Provisional tier</h2>
      <p class="govuk-body">A tier score has been calculated but is still provisional, so it is shown with an orange "Provisional" tag.</p>
      {{ supervisionPackage({
        tierScore: "C",
        tag: { text: "Provisional", color: "orange" },
        historyHref: "#"
      }) }}

      <h2 class="govuk-heading-m">Missing tier</h2>
      <p class="govuk-body">No tier score is available for this case, so it is shown with a red "Missing" tag.</p>
      {{ supervisionPackage({
        tierScore: "",
        tag: { text: "Missing", color: "red" },
        historyHref: "#"
      }) }}

      <h2 class="govuk-heading-m">Unavailable tier</h2>
      <p class="govuk-body">The tier could not be retrieved (for example the Tier API errored), so it is shown with a grey "Unavailable" tag.</p>
      {{ supervisionPackage({
        tierScore: "",
        tag: { text: "Unavailable", color: "grey" },
        historyHref: "#"
      }) }}

      <h2 class="govuk-heading-m">Confirmed tier with history link</h2>
      <p class="govuk-body">A confirmed tier score with no tag, including a link to view the tier change history.</p>
      {{ supervisionPackage({
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
