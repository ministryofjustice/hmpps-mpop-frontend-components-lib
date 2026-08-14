/* eslint-disable no-console */

import http from 'node:http'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'
import sass from 'sass'
import { yearsSince } from '../src/utils/yearsSince'
import { mpopNunjucksSetup } from '../src/utils/nunjucksFilters'

const previewCss = sass.compile(fileURLToPath(new URL('./preview.scss', import.meta.url)), {
  loadPaths: [process.cwd(), 'node_modules'],
}).css

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], {
  autoescape: true,
})

mpopNunjucksSetup(env)

const previewAge = yearsSince('1990-01-15')

const popHeaderParams = {
  crn: 'X123456',
  dob: '1990-01-15',
  age: previewAge,
  tierScore: 'C',
  historyHref: '#',
}

// Matches SupervisionPackageFrontendContextResponse (src/types/SupervisionPackage.ts)
const commonSupervisionPackageParams = {
  tierScore: 'C',
  tag: { text: null, color: null },
  historyHref: '#',
  historyText: 'View tier change history',
  allAppointmentsHref: '#',
  arrangeAppointmentHref: '#',
  deliusBaseURL: 'https://ndelius.test.probation.service.justice.gov.uk',
  crn: 'X991651',
  createdAt: '2026-07-08',
  updatedAt: '2026-07-08',
  nextAppointment: {
    date: '2026-08-19',
    startTime: '15:15:00',
    type: { code: 'COAP', description: 'Planned Telephone Contact (NS)' },
  },
  nextAppointmentHref: '#',
}

const supervisionPackagePresets = [
  {
    id: 'early-engagement',
    label: 'Early engagement',
    params: {
      ...commonSupervisionPackageParams,
      currentPhase: {
        phase: { code: 'INIT', description: 'Early Engagement' },
        supervisionPackage: { code: 'SPA', description: 'A' },
        eventNumber: '1',
        startDate: '2026-07-08',
        endDate: '2026-10-31',
      },
      earlyEngagement: {
        startDate: '2026-07-08T00:00:00Z',
        endDate: '2026-10-31T00:00:00Z',
        weeks: 12,
        completed: 2,
      },
      currentYear: {
        startDate: '2026-07-08',
        endDate: '2027-07-07',
        proRataFromDate: '2026-07-08',
        isFirstYear: true,
        appointments: { allowance: 46, scheduled: 2, completed: 2 },
      },
      context: {
        name: { forename: 'Stuart', middleNames: '', surname: 'Morris' },
        gender: 'Male',
        integratedOffenderManagementRedRated: false,
        offenderPersonalDisorderPathway: false,
        intensiveSupervisionCourt: false,
        nationalSecurityDivision: false,
        finalThirdEligibility: { eligible: false, since: '2026-07-10' },
        sentences: [
          {
            eventNumber: '1',
            startDate: '2026-07-08',
            endDate: '2027-07-07',
            supervisionPackage: { code: 'SPA', description: 'A' },
            type: { code: '307', description: 'Adult Custody < 12m', isCustodial: true },
            custody: {
              status: { code: 'B', description: 'Released - On Licence' },
              location: { code: '', description: '' },
              finalThirdDate: '2027-03-07',
              releases: [{ releaseDate: '2026-07-08' }],
            },
            inBreach: false,
          },
        ],
      },
    },
  },
  {
    id: 'standard-supervision',
    label: 'Standard supervision',
    params: {
      ...commonSupervisionPackageParams,
      currentPhase: {
        phase: { code: 'STD', description: 'Standard Supervision' },
        supervisionPackage: { code: 'SPA', description: 'A' },
        eventNumber: '1',
        startDate: '2026-01-01',
        endDate: '2027-01-07',
      },
      earlyEngagement: {
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-03-26T00:00:00Z',
        weeks: 12,
        completed: 12,
      },
      currentYear: {
        startDate: '2026-07-08',
        endDate: '2027-01-07',
        proRataFromDate: '2026-07-08',
        isFirstYear: true,
        appointments: { allowance: 46, scheduled: 2, completed: 14 },
      },
      context: {
        name: { forename: 'Stuart', middleNames: '', surname: 'Morris' },
        gender: 'Male',
        integratedOffenderManagementRedRated: false,
        offenderPersonalDisorderPathway: false,
        intensiveSupervisionCourt: false,
        nationalSecurityDivision: false,
        finalThirdEligibility: { eligible: false, since: '2026-07-10' },
        sentences: [
          {
            eventNumber: '1',
            startDate: '2026-01-01',
            endDate: '2027-01-07',
            supervisionPackage: { code: 'SPA', description: 'A' },
            type: { code: '307', description: 'Adult Custody < 12m', isCustodial: true },
            custody: {
              status: { code: 'B', description: 'Released - On Licence' },
              location: { code: '', description: '' },
              finalThirdDate: '2026-11-07',
              releases: [{ releaseDate: '2026-01-01' }],
            },
            inBreach: false,
          },
        ],
      },
    },
  },
  {
    id: 'final-third',
    label: 'Final third',
    params: {
      ...commonSupervisionPackageParams,
      currentPhase: {
        phase: { code: 'FTHRD', description: 'Final Third' },
        supervisionPackage: { code: 'SPA', description: 'A' },
        eventNumber: '1',
        startDate: '2026-01-01',
        endDate: '2027-01-07',
      },
      earlyEngagement: {
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-03-26T00:00:00Z',
        weeks: 12,
        completed: 12,
      },
      currentYear: {
        startDate: '2026-07-08',
        endDate: '2027-01-07',
        proRataFromDate: '2026-07-08',
        isFirstYear: true,
        appointments: { allowance: 46, scheduled: 2, completed: 20 },
      },
      context: {
        name: { forename: 'Stuart', middleNames: '', surname: 'Morris' },
        gender: 'Male',
        integratedOffenderManagementRedRated: false,
        offenderPersonalDisorderPathway: false,
        intensiveSupervisionCourt: false,
        nationalSecurityDivision: false,
        finalThirdEligibility: { eligible: true, since: '2026-07-10' },
        sentences: [
          {
            eventNumber: '1',
            startDate: '2026-01-01',
            endDate: '2027-01-07',
            supervisionPackage: { code: 'SPA', description: 'A' },
            type: { code: '307', description: 'Adult Custody < 12m', isCustodial: true },
            custody: {
              status: { code: 'B', description: 'Released - On Licence' },
              location: { code: '', description: '' },
              finalThirdDate: '2026-07-10',
              releases: [{ releaseDate: '2026-01-01' }],
            },
            inBreach: false,
          },
        ],
      },
    },
  },
  {
    id: 'final-third-nsd',
    label: 'Final third (National Security Division)',
    params: {
      ...commonSupervisionPackageParams,
      currentPhase: {
        phase: { code: 'FTHRD', description: 'Final Third' },
        supervisionPackage: { code: 'SPA', description: 'A' },
        eventNumber: '1',
        startDate: '2026-01-01',
        endDate: '2027-01-07',
      },
      earlyEngagement: {
        startDate: '2026-01-01T00:00:00Z',
        endDate: '2026-03-26T00:00:00Z',
        weeks: 12,
        completed: 12,
      },
      currentYear: {
        startDate: '2026-07-08',
        endDate: '2027-01-07',
        proRataFromDate: '2026-07-08',
        isFirstYear: true,
        appointments: { allowance: 46, scheduled: 2, completed: 20 },
      },
      context: {
        name: { forename: 'Stuart', middleNames: '', surname: 'Morris' },
        gender: 'Male',
        integratedOffenderManagementRedRated: false,
        offenderPersonalDisorderPathway: false,
        intensiveSupervisionCourt: false,
        nationalSecurityDivision: true,
        finalThirdEligibility: { eligible: true, since: '2026-07-10' },
        sentences: [
          {
            eventNumber: '1',
            startDate: '2026-01-01',
            endDate: '2027-01-07',
            supervisionPackage: { code: 'SPA', description: 'A' },
            type: { code: '307', description: 'Adult Custody < 12m', isCustodial: true },
            custody: {
              status: { code: 'B', description: 'Released - On Licence' },
              location: { code: '', description: '' },
              finalThirdDate: '2026-07-10',
              releases: [{ releaseDate: '2026-01-01' }],
            },
            inBreach: false,
          },
        ],
      },
    },
  },
]

const supervisionPackageSummaryExamples = [
  {
    title: 'Early engagement',
    params: {
      currentPhase: { phase: { code: 'INIT' } },
      forename: 'Stuart',
      context: { finalThirdEligibility: { eligible: false } },
      earlyEngagement: {
        startDate: '2026-08-06T13:46:16.916Z',
        endDate: '2026-08-06T13:46:16.916Z',
        weeks: 4,
        completed: 2,
      },
      currentYear: {
        startDate: '2026-08-06',
        endDate: '2026-08-06',
        appointments: { allowance: 0, scheduled: 1, completed: 0 },
      },
    },
  },
  {
    title: 'Supervision stage',
    params: {
      currentPhase: { phase: { code: 'STD' } },
      forename: 'Stuart',
      context: { finalThirdEligibility: { eligible: false } },
      earlyEngagement: {
        startDate: '2026-08-06T13:46:16.916Z',
        endDate: '2026-08-06T13:46:16.916Z',
        weeks: 0,
        completed: 0,
      },
      currentYear: {
        startDate: '2026-08-06',
        endDate: '2026-08-06',
        appointments: { allowance: 4, scheduled: 1, completed: 2 },
      },
    },
  },
  {
    title: 'Supervision stage with breach warning',
    params: {
      currentPhase: { phase: { code: 'STD' } },
      forename: 'Stuart',
      context: {
        finalThirdEligibility: { eligible: false },
        sentences: [{ inBreach: true }],
      },
      earlyEngagement: {
        startDate: '2026-08-06T13:46:16.916Z',
        endDate: '2026-08-06T13:46:16.916Z',
        weeks: 0,
        completed: 0,
      },
      currentYear: {
        startDate: '2026-08-06',
        endDate: '2026-08-06',
        appointments: { allowance: 4, scheduled: 1, completed: 2 },
      },
    },
  },
  {
    title: 'Supervision stage with recall warning',
    params: {
      currentPhase: { phase: { code: 'STD' } },
      forename: 'Stuart',
      context: {
        finalThirdEligibility: { eligible: false },
        recallStatus: { code: 'R', description: 'Recall' },
      },
      earlyEngagement: {
        startDate: '2026-08-06T13:46:16.916Z',
        endDate: '2026-08-06T13:46:16.916Z',
        weeks: 0,
        completed: 0,
      },
      currentYear: {
        startDate: '2026-08-06',
        endDate: '2026-08-06',
        appointments: { allowance: 4, scheduled: 1, completed: 2 },
      },
    },
  },
  {
    title: 'Supervision stage with all appointments used',
    params: {
      currentPhase: { phase: { code: 'STD' } },
      forename: 'Stuart',
      context: { finalThirdEligibility: { eligible: false } },
      earlyEngagement: {
        startDate: '2026-08-06T13:46:16.916Z',
        endDate: '2026-08-06T13:46:16.916Z',
        weeks: 0,
        completed: 0,
      },
      currentYear: {
        startDate: '2026-08-06',
        endDate: '2026-08-06',
        appointments: { allowance: 4, scheduled: 1, completed: 4 },
      },
    },
  },
  {
    title: 'Final third',
    params: {
      currentPhase: { phase: { code: 'STD' } },
      forename: 'Stuart',
      context: {
        nationalSecurityDivision: true,
        finalThirdEligibility: { eligible: true },
        sentences: [{ type: { isCustodial: true }, custody: { finalThirdDate: '2026-08-06' } }],
      },
      earlyEngagement: {
        startDate: '2026-08-06T13:46:16.916Z',
        endDate: '2026-08-06T13:46:16.916Z',
        weeks: 0,
        completed: 0,
      },
      currentYear: {
        startDate: '2026-08-06',
        endDate: '2026-08-06',
        appointments: { allowance: 4, scheduled: 1, completed: 2 },
      },
    },
  },
]

function renderSupervisionPackage(params: unknown): string {
  return env.renderString(
    `{% from "supervision-package/macro.njk" import supervisionPackage %}{{ supervisionPackage(params) }}`,
    { params },
  )
}

function renderSupervisionPackageSummary(params: unknown): string {
  return env.renderString(
    `{% from "supervision-package-summary/macro.njk" import supervisionPackageSummary %}{{ supervisionPackageSummary(params) }}`,
    { params },
  )
}

const supervisionPackageSummaryHtml = supervisionPackageSummaryExamples
  .map(example => `<h3 class="govuk-heading-s">${example.title}</h3>${renderSupervisionPackageSummary(example.params)}`)
  .join('\n')

// Kept as a plain string (not a template literal) so it can be embedded inside the page's
// outer template literal without any risk of backtick / ${} collisions.
const clientScript = [
  '(function () {',
  '  var textarea = document.getElementById("supervision-package-json");',
  '  var output = document.getElementById("supervision-package-output");',
  '  var errorEl = document.getElementById("supervision-package-error");',
  '  var applyBtn = document.getElementById("supervision-package-apply");',
  '  var resetBtn = document.getElementById("supervision-package-reset");',
  '  var presetRadios = document.querySelectorAll("[data-preset-selector] input[name=\\"preset\\"]");',
  '',
  '  function currentPresetJson() {',
  '    var checked = document.querySelector("[data-preset-selector] input[name=\\"preset\\"]:checked");',
  '    if (!checked) return null;',
  '    var presetTextarea = document.getElementById("preset-json-" + checked.value);',
  '    return presetTextarea ? presetTextarea.value : null;',
  '  }',
  '',
  '  function showError(message) {',
  '    errorEl.textContent = message;',
  '    errorEl.style.display = message ? "block" : "none";',
  '  }',
  '',
  '  function apply() {',
  '    var params;',
  '    try {',
  '      params = JSON.parse(textarea.value);',
  '    } catch (err) {',
  '      showError("Invalid JSON: " + err.message);',
  '      return;',
  '    }',
  '    showError("");',
  '    fetch("/render", {',
  '      method: "POST",',
  '      headers: { "Content-Type": "application/json" },',
  '      body: JSON.stringify({ params: params }),',
  '    })',
  '      .then(function (response) {',
  '        return response.text().then(function (text) {',
  '          if (!response.ok) {',
  '            showError(text);',
  '            return;',
  '          }',
  '          output.innerHTML = text;',
  '          if (!text.trim()) {',
  '            showError(',
  '              "The component rendered nothing. This is expected behaviour: currentPhase.phase.code must be INIT, STD or FTHRD " +',
  '                "(or context.nationalSecurityDivision must be true with an eligible, custodial final third sentence) for anything to display."',
  '            );',
  '          }',
  '        });',
  '      })',
  '      .catch(function (err) {',
  '        showError("Request failed: " + err.message);',
  '      });',
  '  }',
  '',
  '  applyBtn.addEventListener("click", apply);',
  '  resetBtn.addEventListener("click", function () {',
  '    var json = currentPresetJson();',
  '    if (json === null) return;',
  '    textarea.value = json;',
  '    apply();',
  '  });',
  '',
  '  presetRadios.forEach(function (radio) {',
  '    radio.addEventListener("change", function () {',
  '      var json = currentPresetJson();',
  '      if (json === null) return;',
  '      textarea.value = json;',
  '      apply();',
  '    });',
  '  });',
  '})();',
].join('\n')

function renderPage(selectedPresetId: string, jsonText: string, outputHtml: string): string {
  const presetRadiosHtml = supervisionPackagePresets
    .map(
      preset => `
        <div class="govuk-radios__item">
          <input class="govuk-radios__input" id="preset-${preset.id}" type="radio" name="preset" value="${preset.id}"${preset.id === selectedPresetId ? ' checked' : ''}>
          <label class="govuk-label govuk-radios__label" for="preset-${preset.id}">${preset.label}</label>
        </div>`,
    )
    .join('\n')

  const presetTextareasHtml = supervisionPackagePresets
    .map(
      preset => `<textarea id="preset-json-${preset.id}" hidden>${JSON.stringify(preset.params, null, 2)}</textarea>`,
    )
    .join('\n')

  return env.renderString(
    `
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

      {{ popHeader(popHeaderParams) }}

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
      <h1 class="govuk-heading-l">Supervision Package</h1>
      <p class="govuk-body">
        Pick a preset, then edit the JSON below (matches <code>SupervisionPackageFrontendContextResponse</code>) and
        press <strong>Apply</strong> to re-render the component with those values. Every field is editable.
      </p>
      <p class="govuk-body">
        Note: <code>currentPhase.phase.code</code> must be <code>INIT</code>, <code>STD</code> or <code>FTHRD</code>
        (unless <code>context.nationalSecurityDivision</code> is <code>true</code> with an eligible, custodial final
        third sentence) or the component intentionally renders nothing &mdash; this matches the real component's
        behaviour, not a limitation of this editor.
      </p>

      <div class="govuk-form-group">
        <fieldset class="govuk-fieldset">
          <legend class="govuk-fieldset__legend govuk-visually-hidden">Preset</legend>
          <div class="govuk-radios govuk-radios--inline" data-preset-selector>${presetRadiosHtml}
          </div>
        </fieldset>
      </div>

      <textarea
        id="supervision-package-json"
        rows="20"
        spellcheck="false"
        style="width: 100%; font-family: monospace; font-size: 13px; box-sizing: border-box;"
      >{{ jsonText }}</textarea>
      ${presetTextareasHtml}
      <div style="margin-top: 10px; margin-bottom: 20px; display: flex; gap: 10px;">
        <button id="supervision-package-apply" type="button" class="govuk-button" data-module="govuk-button">Apply</button>
        <button id="supervision-package-reset" type="button" class="govuk-button govuk-button--secondary" data-module="govuk-button">Reset to preset</button>
      </div>
      <p id="supervision-package-error" class="govuk-error-message" style="display: none;"></p>

      <div id="supervision-package-output">{{ outputHtml | safe }}</div>

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
      <h1 class="govuk-heading-l">Supervision Package Summary</h1>
      {{ supervisionPackageSummaryHtml | safe }}
    </div>
  </main>

  <script>${clientScript}</script>
</body>
</html>
`,
    { popHeaderParams, jsonText, outputHtml, supervisionPackageSummaryHtml },
  )
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && (req.url === '/' || req.url === '')) {
    const selectedPreset = supervisionPackagePresets[0]
    const jsonText = JSON.stringify(selectedPreset.params, null, 2)
    const outputHtml = renderSupervisionPackage(selectedPreset.params)
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(renderPage(selectedPreset.id, jsonText, outputHtml))
    return
  }

  if (req.method === 'POST' && req.url === '/render') {
    const maxBodyLength = 200_000
    let body = ''
    let tooLarge = false

    req.on('data', chunk => {
      if (tooLarge) return
      body += chunk
      if (body.length > maxBodyLength) {
        tooLarge = true
        res.writeHead(413, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('Request body too large')
        req.destroy()
      }
    })

    req.on('end', () => {
      if (tooLarge) return
      try {
        const { params } = JSON.parse(body) as { params: unknown }
        const html = renderSupervisionPackage(params)
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(html)
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end(error instanceof Error ? error.message : 'Failed to render component')
      }
    })
    return
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
  res.end('Not found')
})

const port = Number(process.env.PORT) || 3000

server.listen(port, '127.0.0.1', () => {
  console.info(`Preview server running at http://localhost:${port}`)
})
