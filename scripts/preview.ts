/* eslint-disable no-console */

import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'
import sass from 'sass'
import { yearsSince } from '../src/utils/yearsSince'
import { mpopNunjucksSetup } from '../src/utils/nunjucksFilters'

const previewCss = sass.compile(fileURLToPath(new URL('./preview.scss', import.meta.url)), {
  loadPaths: [process.cwd(), 'node_modules'],
  // The library (and govuk-frontend itself) still uses the legacy @import syntax throughout,
  // so this is expected noise rather than something to fix here.
  silenceDeprecations: ['import'],
}).css

const env = nunjucks.configure(['src/components', 'node_modules/govuk-frontend/dist'], {
  autoescape: true,
})

mpopNunjucksSetup(env)

const previewAge = yearsSince('1990-01-15')

const html = env.renderString(
  `
{% from "supervision-package/macro.njk" import supervisionPackage %}
{% from "pop-header/macro.njk" import popHeader %}
{% from "supervision-package-summary/macro.njk" import supervisionPackageSummary %}
{% from "person-header/macro.njk" import personHeader %}

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
  <script>document.body.className += ' js-enabled' + ('noModule' in HTMLScriptElement.prototype ? ' govuk-frontend-supported' : '')</script>
  <main class="govuk-main-wrapper">
    <div class="govuk-width-container">
      <h1 class="govuk-heading-l">MPOP Component Preview</h1>

      <nav class="govuk-body" aria-label="Contents">
        <h2 class="govuk-heading-m">Contents</h2>
        <ul class="govuk-list govuk-list--bullet">
          <li><a class="govuk-link" href="#pop-header">PoP Header</a></li>
          <li><a class="govuk-link" href="#person-header">Person Header</a>
            <ul class="govuk-list govuk-list--bullet">
              <li><a class="govuk-link" href="#managed-by-unallocated-not-clickable-no-photo">Managed by: Unallocated (not clickable), no photo</a></li>
            </ul>
          </li>
          <li><a class="govuk-link" href="#supervision-package">Supervision Package</a>
            <ul class="govuk-list govuk-list--bullet">
              <li><a class="govuk-link" href="#glossary">Glossary: phase codes and enums</a></li>
              <li><a class="govuk-link" href="#community">Community</a></li>
              <li><a class="govuk-link" href="#woman">Woman</a></li>
              <li><a class="govuk-link" href="#custodial">Custodial</a></li>
              <li><a class="govuk-link" href="#final-third-eligible-early-engagement">Final Third eligible (early engagement)</a></li>
              <li><a class="govuk-link" href="#final-third-eligible-without-start-date">Final Third eligible without start date</a></li>
              <li><a class="govuk-link" href="#final-third-ineligible-early-engagement">Final Third ineligible (early engagement)</a></li>
              <li><a class="govuk-link" href="#in-custody">In Custody</a></li>
              <li><a class="govuk-link" href="#recalled">Recalled</a></li>
              <li><a class="govuk-link" href="#in-breach">In Breach</a></li>
              <li><a class="govuk-link" href="#unlawfully-at-large">Unlawfully at Large</a></li>
              <li><a class="govuk-link" href="#tier-missing">Tier Missing</a></li>
              <li><a class="govuk-link" href="#tier-service-unavailable">Tier service unavailable</a></li>
              <li><a class="govuk-link" href="#lifer-ipp">Lifer/IPP</a></li>
              <li><a class="govuk-link" href="#end-date-standard-supervision">End date (standard supervision)</a></li>
              <li><a class="govuk-link" href="#reset-date-standard-supervision">Reset Date (standard supervision)</a></li>
              <li><a class="govuk-link" href="#final-third-eligible-standard-supervision">Final Third eligible (standard supervision)</a></li>
              <li><a class="govuk-link" href="#final-third-ineligible-standard-supervision">Final Third ineligible (standard supervision)</a></li>
              <li><a class="govuk-link" href="#opd">OPD</a></li>
              <li><a class="govuk-link" href="#end-date-red-rated-iom">End date (red-rated IOM)</a></li>
              <li><a class="govuk-link" href="#reset-date-red-rated-iom">Reset Date (red-rated IOM)</a></li>
              <li><a class="govuk-link" href="#final-third-eligible-red-rated-iom">Final Third eligible (red-rated IOM)</a></li>
              <li><a class="govuk-link" href="#final-third-ineligible-red-rated-iom">Final Third ineligible (red-rated IOM)</a></li>
              <li><a class="govuk-link" href="#custodial-final-third-stage">Custodial Final third stage</a></li>
              <li><a class="govuk-link" href="#day-1">Day 1</a></li>
              <li><a class="govuk-link" href="#day-1-or-shortly-after">Day 1 or shortly after</a></li>
              <li><a class="govuk-link" href="#provisional">Provisional</a></li>
              <li><a class="govuk-link" href="#final-third-progress-national-security-division-cases">Final third progress National Security Division cases</a>
                <ul class="govuk-list govuk-list--bullet">
                  <li><a class="govuk-link" href="#final-third-progress-spna">Final third progress still renders when phase code is SPNA (Does not apply)</a></li>
                </ul>
              </li>
              <li><a class="govuk-link" href="#sentence-type-heading">Sentence type heading</a>
                <ul class="govuk-list govuk-list--bullet">
                  <li><a class="govuk-link" href="#custodial-sentence">Custodial sentence</a></li>
                  <li><a class="govuk-link" href="#community-sentence">Community sentence</a></li>
                  <li><a class="govuk-link" href="#life-sentence">Life sentence</a></li>
                  <li><a class="govuk-link" href="#imprisonment-for-public-protection">Imprisonment for Public Protection</a></li>
                  <li><a class="govuk-link" href="#extended-determinate-sentence">Extended determinate sentence</a></li>
                </ul>
              </li>
            </ul>
          </li>
          <li><a class="govuk-link" href="#supervision-package-summary">Supervision Package Summary</a>
            <ul class="govuk-list govuk-list--bullet">
              <li><a class="govuk-link" href="#early-engagement">Early engagement</a></li>
              <li><a class="govuk-link" href="#supervision-stage">Supervision stage</a></li>
              <li><a class="govuk-link" href="#supervision-stage-with-breach-warning">Supervision stage with breach warning</a></li>
              <li><a class="govuk-link" href="#supervision-stage-with-recall-warning">Supervision stage with recall warning</a></li>
              <li><a class="govuk-link" href="#supervision-stage-with-all-appointments-used">Supervision stage with all appointments used</a></li>
              <li><a class="govuk-link" href="#final-third">Final third</a></li>
            </ul>
          </li>
        </ul>
      </nav>

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
      <h1 class="govuk-heading-l" id="pop-header">PoP Header</h1>

      {{ popHeader({
        crn: "X123456",
        dob: "1990-01-15",
        age: previewAge,
        tierScore: "C",
        historyHref: "#"
      }) }}

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
      <h1 class="govuk-heading-l" id="person-header">Person Header</h1>
      <p class="govuk-body">Placeholder for the redesigned persistent person header (name, CRN, date of birth, tier, managed by). Pass <code>managedByName</code> (formatted with the <code>formatName</code> filter so the first letter of each name is uppercase) and an optional <code>managedByLocation</code>, or a pre-formatted <code>managedBy</code> string for values such as <code>Unallocated</code>. <code>riskBadges</code> is a layout slot for pre-rendered risk badge markup (e.g. from the ARNS component library's <code>predictorBadge</code>) rather than something this component renders itself. <code>photo</code> is only rendered when provided - there's no placeholder image when it's absent.</p>

      {{ personHeader({
        name: "Andrew Langley",
        crn: "D004851",
        dob: "18 November 1995",
        tier: "B4",
        historyHref: "#",
        managedByName: "jack frost",
        managedByLocation: "Worksop Probation Office",
        managedByHref: "#",
        photo: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='120' viewBox='0 0 90 120'%3E%3Crect width='90' height='120' fill='%23b1b4b6'/%3E%3Ccircle cx='45' cy='45' r='22' fill='%23ffffff'/%3E%3Cpath d='M10 110c5-25 25-35 35-35s30 10 35 35' fill='%23ffffff'/%3E%3C/svg%3E",
        riskBadges: '<span class="govuk-tag govuk-tag--green">OGRS <strong>LOW 5.67%</strong></span> <span class="govuk-tag govuk-tag--orange">Risk of serious harm <strong>MEDIUM</strong></span>'
      }) }}

      <h2 class="govuk-heading-m" id="managed-by-unallocated-not-clickable-no-photo">Managed by: Unallocated (not clickable), no photo</h2>
      <p class="govuk-body">When there's no responsible officer, or the managed by data failed to load, <code>managedByHref</code> is omitted and the field renders as plain text instead of a link. This variant also omits <code>photo</code>, to show the layout when no image is available - the header collapses to full-width text with no gap or placeholder left behind.</p>
      {{ personHeader({
        name: "Andrew Langley",
        crn: "D004851",
        dob: "18 November 1995",
        tier: "B4",
        historyHref: "#",
        managedBy: "Unallocated"
      }) }}

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
      <h1 class="govuk-heading-l" id="supervision-package">Supervision Package</h1>

      <h2 class="govuk-heading-m" id="glossary">Glossary: phase codes and enums</h2>
      <p class="govuk-body">Reference for the coded values used throughout <code>currentPhase.phase.code</code> and related fields in the scenarios below. Descriptions are taken from the supervision-packages-api reference data, not just this library's own logic.</p>

      <h3 class="govuk-heading-s">Phase codes (<code>currentPhase.phase.code</code>)</h3>
      <table class="govuk-table">
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th scope="col" class="govuk-table__header">Code</th>
            <th scope="col" class="govuk-table__header">Backend description</th>
            <th scope="col" class="govuk-table__header">Meaning in this component</th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <td class="govuk-table__cell"><code>INIT</code></td>
            <td class="govuk-table__cell">Early engagement</td>
            <td class="govuk-table__cell">Shows the <a class="govuk-link" href="#community">early engagement</a> section of the supervision package - the box that shows weeks/appointments progress for this stage.</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell"><code>STD</code></td>
            <td class="govuk-table__cell">Standard supervision / Licence supervision</td>
            <td class="govuk-table__cell">Shows the <a class="govuk-link" href="#end-date-standard-supervision">standard supervision</a> section of the supervision package - end date/reset date and appointments progress.</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell"><code>FTHRD</code></td>
            <td class="govuk-table__cell">Final third</td>
            <td class="govuk-table__cell">Shows the <a class="govuk-link" href="#custodial-final-third-stage">final third</a> section of the supervision package, and hides the "arrange appointment" button.</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell"><code>IOM</code></td>
            <td class="govuk-table__cell">Integrated Offender Management</td>
            <td class="govuk-table__cell">Makes this section of the supervision package visible, but the red-rated IOM display itself (<a class="govuk-link" href="#end-date-red-rated-iom">example</a>) only appears when a separate flag, <code>context.integratedOffenderManagementRedRated</code>, is also set to true.</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell"><code>OPD</code></td>
            <td class="govuk-table__cell">In OPD treatment</td>
            <td class="govuk-table__cell">Makes this section of the supervision package visible, but the <a class="govuk-link" href="#opd">OPD display</a> itself only appears when a separate flag, <code>context.offenderPersonalDisorderPathway</code>, is also set to true.</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell"><code>SPNS</code></td>
            <td class="govuk-table__cell">Not started</td>
            <td class="govuk-table__cell">"In flight" - a phase has been calculated but supervision hasn't started yet. Shows the <a class="govuk-link" href="#day-1-or-shortly-after">in-flight</a> version of the supervision package, and hides the action buttons/next appointment.</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell"><code>SPNK</code></td>
            <td class="govuk-table__cell">Not yet known</td>
            <td class="govuk-table__cell">Used alongside <code>provisional: true</code> (see <a class="govuk-link" href="#provisional">Provisional</a>) - the tier/phase calculation hasn't completed yet, so action buttons/appointments are suppressed.</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell"><code>SPNA</code></td>
            <td class="govuk-table__cell">Does not apply</td>
            <td class="govuk-table__cell">The person is not eligible for the standard supervision package - it doesn't render (<code>isSupervisionPackage</code> is false). <strong>Exception:</strong> if <code>context.nationalSecurityDivision</code> is true and <code>context.finalThirdEligibility.eligible</code>, a sentence's <code>type.isCustodial</code>, and <code>custody.finalThirdDate</code> are all set, the separate Final Third Progress component still renders instead (<a class="govuk-link" href="#final-third-progress-spna">example</a>).</td>
          </tr>
        </tbody>
      </table>

      <h3 class="govuk-heading-s">Status/tag enums</h3>
      <table class="govuk-table">
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th scope="col" class="govuk-table__header">Tag text</th>
            <th scope="col" class="govuk-table__header">Colour</th>
            <th scope="col" class="govuk-table__header">Triggered by</th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">No appointments remaining</td>
            <td class="govuk-table__cell"><code>govuk-tag--red</code></td>
            <td class="govuk-table__cell"><code>allowance &gt; 0</code> and <code>currentYear.appointments.completed &gt;= allowance</code> (and not OPD)</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">Unlawfully at large</td>
            <td class="govuk-table__cell"><code>govuk-tag--yellow</code></td>
            <td class="govuk-table__cell">a sentence's <code>custody.location.code</code> is <code>UATLRG</code></td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">In custody / on remand (title-cased)</td>
            <td class="govuk-table__cell"><code>govuk-tag--yellow</code></td>
            <td class="govuk-table__cell">a sentence's <code>custody.status</code> indicates custody (takes priority over "In breach")</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">In breach</td>
            <td class="govuk-table__cell"><code>govuk-tag--yellow</code></td>
            <td class="govuk-table__cell">a sentence has <code>inBreach: true</code></td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">Offender personality disorder</td>
            <td class="govuk-table__cell"><code>govuk-tag--purple</code></td>
            <td class="govuk-table__cell"><code>context.offenderPersonalDisorderPathway: true</code></td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">IOM (Integrated Offender Management): Red</td>
            <td class="govuk-table__cell"><code>govuk-tag--red</code></td>
            <td class="govuk-table__cell"><code>context.integratedOffenderManagementRedRated: true</code></td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell">Provisional</td>
            <td class="govuk-table__cell"><code>orange</code></td>
            <td class="govuk-table__cell"><code>params.provisional: true</code> (supplied by the tier API calculation)</td>
          </tr>
        </tbody>
      </table>

      <h3 class="govuk-heading-s">Other flags/fields</h3>
      <table class="govuk-table">
        <thead class="govuk-table__head">
          <tr class="govuk-table__row">
            <th scope="col" class="govuk-table__header">Field</th>
            <th scope="col" class="govuk-table__header">Meaning</th>
          </tr>
        </thead>
        <tbody class="govuk-table__body">
          <tr class="govuk-table__row">
            <td class="govuk-table__cell"><code>sentences[].type.isCustodial</code> / <code>isSuspendedSentence</code></td>
            <td class="govuk-table__cell">Booleans on a sentence's type. Note: the swagger-ui page for this API can render these without the <code>is</code> prefix (a Springdoc/Kotlin boolean-getter quirk) - the real JSON payload always includes it.</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell"><code>currentYear.isFirstYear</code></td>
            <td class="govuk-table__cell">A boolean on <code>currentYear</code> (not on a sentence) indicating whether this is the person's first year on this supervision package.</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell"><code>sentences[].custody.status</code> / <code>.location</code></td>
            <td class="govuk-table__cell"><code>status</code> is always present when <code>custody</code> is present (required by the API); <code>location</code> is optional. <code>UATLRG</code> is the location code used for "unlawfully at large".</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell"><code>sentences[].inBreach</code> and <code>custody</code></td>
            <td class="govuk-table__cell">Independent fields - a sentence can be in breach and in custody at the same time.</td>
          </tr>
          <tr class="govuk-table__row">
            <td class="govuk-table__cell"><code>tierScore</code></td>
            <td class="govuk-table__cell">A single-letter probation tier (A-G in practice). Discretionary appointment eligibility only applies for tiers <code>C</code>, <code>D</code>, <code>E</code>, <code>F</code> or <code>G</code> combined with <code>gender: 'Female'</code> and not IOM red-rated.</td>
          </tr>
        </tbody>
      </table>

      <div class="govuk-form-group">
        <fieldset class="govuk-fieldset">
          <legend class="govuk-fieldset__legend govuk-fieldset__legend--m">
            <h2 class="govuk-fieldset__heading">Select a stage</h2>
          </legend>
          <div class="govuk-radios" data-module="govuk-radios">
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="stage-early-engagement" name="stage" type="radio" value="early-engagement" data-aria-controls="stage-early-engagement-conditional">
              <label class="govuk-label govuk-radios__label" for="stage-early-engagement">Early engagement stage</label>
            </div>

            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="stage-supervision" name="stage" type="radio" value="supervision" data-aria-controls="stage-supervision-conditional">
              <label class="govuk-label govuk-radios__label" for="stage-supervision">Supervision stage</label>
            </div>

            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="stage-opd" name="stage" type="radio" value="opd" data-aria-controls="stage-opd-conditional">
              <label class="govuk-label govuk-radios__label" for="stage-opd">OPD</label>
            </div>

            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="stage-red-rated-iom" name="stage" type="radio" value="red-rated-iom" data-aria-controls="stage-red-rated-iom-conditional">
              <label class="govuk-label govuk-radios__label" for="stage-red-rated-iom">Red rated IOM</label>
            </div>

            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="stage-custodial-final-third" name="stage" type="radio" value="custodial-final-third" data-aria-controls="stage-custodial-final-third-conditional">
              <label class="govuk-label govuk-radios__label" for="stage-custodial-final-third">Custodial Final third stage</label>
            </div>

            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="stage-in-flight" name="stage" type="radio" value="in-flight" data-aria-controls="stage-in-flight-conditional">
              <label class="govuk-label govuk-radios__label" for="stage-in-flight">In Flight</label>
            </div>

            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="stage-provisional" name="stage" type="radio" value="provisional" data-aria-controls="stage-provisional-conditional">
              <label class="govuk-label govuk-radios__label" for="stage-provisional">Provisional</label>
            </div>
          </div>
        </fieldset>
      </div>

      <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="stage-early-engagement-conditional">

      <h3 class="govuk-heading-s" id="community">Community</h3>
      <p class="govuk-body">Triggered by <code>currentPhase.phase.code</code> of "INIT" (still in early engagement) and a non-custodial sentence, <code>context.sentences[].type.isCustodial: false</code>:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": {
      "code": <mark style="background:#ffdd00;">"INIT"</mark>,
      "description": "Early Engagement"
    },
    "endDate": "2026-09-28"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 0
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 0,
      "completed": 0
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": <mark style="background:#ffdd00;">false</mark> },
        "inBreach": false,
        "endDate": "2028-08-30"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: { phase: { code: 'INIT', description: 'Early Engagement' }, endDate: '2026-09-28' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: [{ type: { isCustodial: false }, inBreach: false, endDate: '2028-08-30' }]
        },
        earlyEngagement: { weeks: 3, completed: 0 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 0, completed: 0 } }
      }) }}

      <h3 class="govuk-heading-s" id="woman">Woman</h3>
      <p class="govuk-body">Triggered by <code>context.gender: "Female"</code> plus <code>integratedOffenderManagementRedRated: false</code>, and a <code>tierScore</code> macro param of "C"-"G", which together show the "discretionary appointments" text for women:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "INIT", "description": "Early Engagement" },
    "endDate": "2026-09-28"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 0
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 0,
      "completed": 0
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": <mark style="background:#ffdd00;">"Female"</mark>,
    "integratedOffenderManagementRedRated": <mark style="background:#ffdd00;">false</mark>,
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": false },
        "inBreach": false,
        "endDate": "2028-08-30"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        currentPhase: { phase: { code: 'INIT', description: 'Early Engagement' }, endDate: '2026-09-28' },
        tierScore: 'D',
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Female',
          integratedOffenderManagementRedRated: false,
          finalThirdEligibility: { eligible: false },
          sentences: [{ type: { isCustodial: false }, inBreach: false, endDate: '2028-08-30' }]
        },
        earlyEngagement: { weeks: 3, completed: 0 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 0, completed: 0 } }
      }) }}

      <h3 class="govuk-heading-s" id="custodial">Custodial</h3>
      <p class="govuk-body">Triggered by <code>context.sentences[].type.isCustodial: true</code> with <code>custody.status.code: "B"</code> (Released - On Licence), during early engagement:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "INIT", "description": "Early Engagement" },
    "endDate": "2026-09-28"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 1
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 0,
      "completed": 1
    }
  },
  "createdAt": "2026-09-12T11:37:12+01:00",
  "updatedAt": "2026-09-12T11:37:12+01:00",
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": <mark style="background:#ffdd00;">true</mark> },
        "custody": {
          "status": {
            "code": <mark style="background:#ffdd00;">"B"</mark>,
            "description": "Released - On Licence"
          },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": "2027-02-18"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: { phase: { code: 'INIT', description: 'Early Engagement' }, endDate: '2026-09-28' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        createdAt: '2026-09-12T11:37:12+01:00',
        updatedAt: '2026-09-12T11:37:12+01:00',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-02-18'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 1 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 0, completed: 1 } }
      }) }}

      <h3 class="govuk-heading-s" id="final-third-eligible-early-engagement">Final Third eligible (early engagement)</h3>
      <p class="govuk-body">Triggered by <code>context.finalThirdEligibility.eligible: true</code> on a custodial sentence with <code>custody.finalThirdDate</code> set, while still in early engagement:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "INIT", "description": "Early Engagement" },
    "endDate": "2026-09-28"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 1
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 0,
      "completed": 1
    }
  },
  "createdAt": "2026-09-12T11:37:12+01:00",
  "updatedAt": "2026-09-12T11:37:12+01:00",
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": <mark style="background:#ffdd00;">true</mark> },
    "sentences": [
      {
        "type": { "isCustodial": <mark style="background:#ffdd00;">true</mark> },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": <mark style="background:#ffdd00;">"2026-08-06"</mark>
        },
        "inBreach": false,
        "endDate": "2027-02-18"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        createdAt: "2026-09-12T11:37:12+01:00",
        updatedAt: "2026-09-12T11:37:12+01:00",
        tierScore: 'C',
        currentPhase: { phase: { code: 'INIT', description: 'Early Engagement' }, endDate: '2026-09-28' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: true },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-02-18'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 1 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 0, completed: 1 } }
      }) }}

      <h3 class="govuk-heading-s" id="final-third-eligible-without-start-date">Final Third eligible without start date</h3>
      <p class="govuk-body">Triggered by <code>context.finalThirdEligibility.eligible: true</code> on a custodial sentence with <code>custody.finalThirdDate</code> not set, while still in early engagement:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "INIT", "description": "Early Engagement" },
    "endDate": "2026-09-28"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 1
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 0,
      "completed": 1
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": <mark style="background:#ffdd00;">true</mark> },
    "sentences": [
      {
        "type": { "isCustodial": <mark style="background:#ffdd00;">true</mark> },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" }
        },
        "inBreach": false,
        "endDate": "2027-02-18"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        currentPhase: { phase: { code: 'INIT', description: 'Early Engagement' }, endDate: '2026-09-28' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: true },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' } },
            inBreach: false,
            endDate: '2027-02-18'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 1 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 0, completed: 1 } }
      }) }}

      <h3 class="govuk-heading-s" id="final-third-ineligible-early-engagement">Final Third ineligible (early engagement)</h3>
      <p class="govuk-body">Triggered by <code>context.finalThirdEligibility.eligible: false</code> despite still being on a custodial licence, during early engagement:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "INIT", "description": "Early Engagement" },
    "endDate": "2026-09-28"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 1
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 0,
      "completed": 1
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": <mark style="background:#ffdd00;">false</mark> },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": "2027-02-18"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: { phase: { code: 'INIT', description: 'Early Engagement' }, endDate: '2026-09-28' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-02-18'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 1 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 0, completed: 1 } }
      }) }}

      <h3 class="govuk-heading-s" id="in-custody">In Custody</h3>
      <p class="govuk-body">Triggered by <code>custody.status.code: "R"</code> (In Custody), which overrides the normal early engagement text with an in-custody/recalled tag:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "INIT", "description": "Early Engagement" },
    "endDate": "2026-09-28"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 1
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 0,
      "completed": 1
    }
  },
  "createdAt": "2026-09-12T11:37:12+01:00",
  "updatedAt": "2026-09-12T11:37:12+01:00",
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": {
            "code": <mark style="background:#ffdd00;">"R"</mark>,
            "description": <mark style="background:#ffdd00;">"In Custody"</mark>
          },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": "2027-02-18"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        createdAt: '2026-09-12T11:37:12+01:00',
        updatedAt: '2026-09-12T11:37:12+01:00',
        tierScore: 'C',
        currentPhase: { phase: { code: 'INIT', description: 'Early Engagement' }, endDate: '2026-09-28' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'R', description: 'In Custody' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-02-18'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 1 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 0, completed: 1 } }
      }) }}


      <h3 class="govuk-heading-s" id="recalled">Recalled</h3>
      <p class="govuk-body">Triggered by <code>custody.status.code: "C"</code> (Recalled), which overrides the normal early engagement text with an in-custody/recalled tag:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "INIT", "description": "Early Engagement" },
    "endDate": "2026-09-28"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 1
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 0,
      "completed": 1
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": {
            "code": <mark style="background:#ffdd00;">"C"</mark>,
            "description": <mark style="background:#ffdd00;">"Recalled"</mark>
          },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": "2027-02-18"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        createdAt: "2026-09-12T11:37:12+01:00",
        updatedAt: "2026-09-12T11:37:12+01:00",
        tierScore: 'C',
        currentPhase: { phase: { code: 'INIT', description: 'Early Engagement' }, endDate: '2026-09-28' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'C', description: 'Recalled' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-02-18'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 1 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 0, completed: 1 } }
      }) }}

      <h3 class="govuk-heading-s" id="in-breach">In Breach</h3>
      <p class="govuk-body">Triggered by <code>inBreach: true</code> (In Breach), which overrides the normal early engagement text with an In breach tag:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "INIT", "description": "Early Engagement" },
    "endDate": "2026-09-28"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 1
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 0,
      "completed": 1
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "location": { "code": "COMMUN", "description": "In the Community" }
        },
        "inBreach": true,
        "endDate": "2027-02-18"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        createdAt: '2026-09-12T11:37:12+01:00',
        updatedAt: '2026-09-12T11:37:12+01:00',
        tierScore: 'C',
        currentPhase: { phase: { code: 'INIT', description: 'Early Engagement' }, endDate: '2026-09-28' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, location: { code: 'COMMUN', description: 'In the Community' } },
            inBreach: true,
            endDate: '2027-02-18'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 1 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 0, completed: 1 } }
      }) }}

      <h3 class="govuk-heading-s" id="unlawfully-at-large">Unlawfully at Large</h3>
      <p class="govuk-body">Triggered by <code>custody.location.code == 'UATLRG'</code> (Unlawfully at Large), which overrides the normal early engagement text with an Unlawfully at Large tag:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "INIT", "description": "Early Engagement" },
    "endDate": "2026-09-28"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 1
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 0,
      "completed": 1
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "location": { "code": "UATLRG", "description": "Unlawfully at Large" }
        },
        "inBreach": false,
        "endDate": "2027-02-18"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        createdAt: '2026-09-12T11:37:12+01:00',
        updatedAt: '2026-09-12T11:37:12+01:00',
        tierScore: 'C',
        currentPhase: { phase: { code: 'INIT', description: 'Early Engagement' }, endDate: '2026-09-28' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            inBreach: false,
            endDate: '2027-02-18',
            custody: {
              status: { code: 'B', description: 'Released - On Licence' },
              location: { code: 'UATLRG', description: 'Unlawfully at Large' }
            }
          }]
        },
        earlyEngagement: { weeks: 3, completed: 1 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 0, completed: 1 } }
      }) }}

      <h3 class="govuk-heading-s" id="tier-missing">Tier Missing</h3>
      <p class="govuk-body">Triggered by <code>"Tier": "Missing"</code></p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "tag": { "text": "Missing", "color": "red" },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": "2027-02-18"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tag: { text: 'Missing', color: 'red' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            inBreach: false,
            endDate: '2027-02-18',
            custody: {
              status: { code: 'B', description: 'Released - On Licence' },
              finalThirdDate: '2026-08-06'
            }
          }]
        }
      }) }}

      <h3 class="govuk-heading-s" id="tier-service-unavailable">Tier service unavailable</h3>
      <p class="govuk-body">Triggered by <code>response from the tier API error</code></p>
  <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "tag": { "text": "Unavailable", "color": "grey" },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": "2027-02-18"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tag: { text: 'Unavailable', color: 'grey' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            inBreach: false,
            endDate: '2027-02-18',
            custody: {
              status: { code: 'B', description: 'Released - On Licence' },
              finalThirdDate: '2026-08-06'
            }
          }]
        }
      }) }}

      </div>

      <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="stage-supervision-conditional">

      <h3 class="govuk-heading-s" id="lifer-ipp">Lifer/IPP</h3>
      <p class="govuk-body">Triggered by <code>context.liferCategory.code: "LF01"</code>, which removes the end/reset date and shows "There is no supervision end date" instead:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "STD", "description": "Standard Supervision" },
    "endDate": "2027-08-31"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 3
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 1,
      "completed": 4
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "liferCategory": {
      <mark style="background:#ffdd00;">"code": "LF01"</mark>,
      "description": "Imprisonment for Public Protection"
    },
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": "2027-08-31"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: { phase: { code: 'STD', description: 'Standard Supervision' }, endDate: '2027-08-31' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          liferCategory: { code: 'LF01', description: 'Imprisonment for Public Protection' },
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-08-31'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 3 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 1, completed: 4 } }
      }) }}

      <h3 class="govuk-heading-s" id="end-date-standard-supervision">End date (standard supervision)</h3>
      <p class="govuk-body">Triggered when the sentence <code>endDate</code> ("2027-08-30") falls before <code>currentYear.endDate</code> ("2027-08-31"), so the sentence ends first and the package shows an "ends on" date:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "STD", "description": "Standard Supervision" },
    "endDate": "2027-08-31"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 3
  },
  "currentYear": {
    "endDate": <mark style="background:#ffdd00;">"2027-08-31"</mark>,
    "appointments": {
      "allowance": 12,
      "scheduled": 1,
      "completed": 4
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": <mark style="background:#ffdd00;">"2027-08-30"</mark>
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: { phase: { code: 'STD', description: 'Standard Supervision' }, endDate: '2027-08-31' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-08-30'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 3 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 1, completed: 4 } }
      }) }}

      <h3 class="govuk-heading-s" id="reset-date-standard-supervision">Reset Date (standard supervision)</h3>
      <p class="govuk-body">Triggered when the sentence <code>endDate</code> ("2028-08-30") falls after <code>currentYear.endDate</code> ("2027-08-31"), so the sentence year resets first and the package shows a "resets on" date:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "STD", "description": "Standard Supervision" },
    "endDate": "2027-08-31"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 3
  },
  "currentYear": {
    "endDate": <mark style="background:#ffdd00;">"2027-08-31"</mark>,
    "appointments": {
      "allowance": 12,
      "scheduled": 1,
      "completed": 4
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": <mark style="background:#ffdd00;">"2028-08-30"</mark>
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: { phase: { code: 'STD', description: 'Standard Supervision' }, endDate: '2027-08-31' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2028-08-30'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 3 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 1, completed: 4 } }
      }) }}

      <h3 class="govuk-heading-s" id="final-third-eligible-standard-supervision">Final Third eligible (standard supervision)</h3>
      <p class="govuk-body">Triggered by <code>context.finalThirdEligibility.eligible: true</code> on a custodial sentence with <code>custody.finalThirdDate</code> set, during standard supervision (<code>currentPhase.phase.code: "STD"</code>):</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": {
      "code": "STD",
      "description": "Standard Supervision"
    },
    "endDate": "2027-08-31"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 3
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 1,
      "completed": 4
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": <mark style="background:#ffdd00;">true</mark> },
    "sentences": [
      {
        "type": { "isCustodial": <mark style="background:#ffdd00;">true</mark> },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": <mark style="background:#ffdd00;">"2026-08-06"</mark>
        },
        "inBreach": false,
        "endDate": "2027-08-30"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: { phase: { code: 'STD', description: 'Standard Supervision' }, endDate: '2027-08-31' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: true },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-08-30'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 3 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 1, completed: 4 } }
      }) }}

      <h3 class="govuk-heading-s" id="final-third-ineligible-standard-supervision">Final Third ineligible (standard supervision)</h3>
      <p class="govuk-body">Triggered by <code>context.finalThirdEligibility.eligible: false</code> despite being on a custodial licence, during standard supervision:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "STD", "description": "Standard Supervision" },
    "endDate": "2027-08-31"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 3
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 1,
      "completed": 4
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": <mark style="background:#ffdd00;">"Female"</mark>,
    "integratedOffenderManagementRedRated": <mark style="background:#ffdd00;">false</mark>,
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": "2027-08-30"
      }
    ]
  }
}</code></pre>
      <p class="govuk-body">Triggered by <code>context.gender: "Female"</code> plus <code>integratedOffenderManagementRedRated: false</code> and a <code>tierScore</code> macro param of "C"-"G", shown here as <mark style="background:#ffdd00;">tierScore: "D"</mark> (any of C-G).</p>
      {{ supervisionPackage({
        currentPhase: { phase: { code: 'STD', description: 'Standard Supervision' }, endDate: '2027-08-31' },
        tierScore: 'D',
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Female',
          integratedOffenderManagementRedRated: false,
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-08-30'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 3 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 1, completed: 4 } }
      }) }}

      </div>

      <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="stage-opd-conditional">

      <h3 class="govuk-heading-s" id="opd">OPD</h3>
      <p class="govuk-body">Triggered by <code>context.offenderPersonalDisorderPathway: true</code>, which shows OPD treatment text instead of the normal stage text:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "STD", "description": "Standard Supervision" },
    "endDate": "2027-08-31"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 3
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 1,
      "completed": 4
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "offenderPersonalDisorderPathway": <mark style="background:#ffdd00;">true</mark>,
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": false },
        "inBreach": false,
        "endDate": "2027-08-30"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: { phase: { code: 'STD', description: 'Standard Supervision' }, endDate: '2027-08-31' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          offenderPersonalDisorderPathway: true,
          finalThirdEligibility: { eligible: false },
          sentences: [{ type: { isCustodial: false }, inBreach: false, endDate: '2027-08-30' }]
        },
        earlyEngagement: { weeks: 3, completed: 3 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 1, completed: 4 } }
      }) }}

      </div>

      <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="stage-red-rated-iom-conditional">

      <h3 class="govuk-heading-s" id="end-date-red-rated-iom">End date (red-rated IOM)</h3>
      <p class="govuk-body">Triggered by <code>context.integratedOffenderManagementRedRated: true</code> with <code>currentPhase.phase.code: "IOM"</code>, and a sentence <code>endDate</code> ("2027-08-30") before <code>currentYear.endDate</code> ("2027-08-31") so it shows an "ends on" date:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": {
      "code": <mark style="background:#ffdd00;">"IOM"</mark>,
      "description": "Red Rated IOM"
    },
    "endDate": "2027-08-31"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 3
  },
  "currentYear": {
    "endDate": <mark style="background:#ffdd00;">"2027-08-31"</mark>,
    "appointments": {
      "allowance": 12,
      "scheduled": 1,
      "completed": 4
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "integratedOffenderManagementRedRated": <mark style="background:#ffdd00;">true</mark>,
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": <mark style="background:#ffdd00;">"2027-08-30"</mark>
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: { phase: { code: 'IOM', description: 'Red Rated IOM' }, endDate: '2027-08-31' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          integratedOffenderManagementRedRated: true,
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-08-30'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 3 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 1, completed: 4 } }
      }) }}

      <h3 class="govuk-heading-s" id="reset-date-red-rated-iom">Reset Date (red-rated IOM)</h3>
      <p class="govuk-body">Triggered by a sentence <code>endDate</code> ("2028-08-30") after <code>currentYear.endDate</code> ("2027-08-31") while red-rated IOM, so the sentence year resets first and shows a "resets on" date:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "IOM", "description": "Red Rated IOM" },
    "endDate": "2027-08-31"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 3
  },
  "currentYear": {
    "endDate": <mark style="background:#ffdd00;">"2027-08-31"</mark>,
    "appointments": {
      "allowance": 12,
      "scheduled": 1,
      "completed": 4
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "integratedOffenderManagementRedRated": true,
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": <mark style="background:#ffdd00;">"2028-08-30"</mark>
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: { phase: { code: 'IOM', description: 'Red Rated IOM' }, endDate: '2027-08-31' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          integratedOffenderManagementRedRated: true,
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2028-08-30'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 3 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 1, completed: 4 } }
      }) }}

      <h3 class="govuk-heading-s" id="final-third-eligible-red-rated-iom">Final Third eligible (red-rated IOM)</h3>
      <p class="govuk-body">Triggered by <code>context.integratedOffenderManagementRedRated: true</code> plus <code>context.finalThirdEligibility.eligible: true</code> on a custodial sentence with <code>custody.finalThirdDate</code> set, while red-rated IOM:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "IOM", "description": "Red Rated IOM" },
    "endDate": "2027-08-31"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 3
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 1,
      "completed": 4
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "integratedOffenderManagementRedRated": <mark style="background:#ffdd00;">true</mark>,
    "finalThirdEligibility": { "eligible": <mark style="background:#ffdd00;">true</mark> },
    "sentences": [
      {
        "type": { "isCustodial": <mark style="background:#ffdd00;">true</mark> },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": <mark style="background:#ffdd00;">"2026-08-06"</mark>
        },
        "inBreach": false,
        "endDate": "2027-08-30"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: { phase: { code: 'IOM', description: 'Red Rated IOM' }, endDate: '2027-08-31' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          integratedOffenderManagementRedRated: true,
          finalThirdEligibility: { eligible: true },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-08-30'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 3 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 1, completed: 4 } }
      }) }}

      <h3 class="govuk-heading-s" id="final-third-ineligible-red-rated-iom">Final Third ineligible (red-rated IOM)</h3>
      <p class="govuk-body">Triggered by <code>context.finalThirdEligibility.eligible: false</code> despite being on a custodial licence, while red-rated IOM:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": { "code": "IOM", "description": "Red Rated IOM" },
    "endDate": "2027-08-31"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 3
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 1,
      "completed": 4
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "integratedOffenderManagementRedRated": true,
    "finalThirdEligibility": { "eligible": <mark style="background:#ffdd00;">false</mark> },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": "2027-08-30"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: { phase: { code: 'IOM', description: 'Red Rated IOM' }, endDate: '2027-08-31' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          integratedOffenderManagementRedRated: true,
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-08-30'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 3 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 1, completed: 4 } }
      }) }}

      </div>

      <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="stage-custodial-final-third-conditional">

      <h3 class="govuk-heading-s" id="custodial-final-third-stage">Custodial Final third stage</h3>
      <p class="govuk-body">Triggered by <code>currentPhase.phase.code: "FTHRD"</code> on a custodial sentence that is eligible for the final third (not a National Security Division case, so it uses the normal supervision package view rather than the final third progress table):</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": {
      "code": <mark style="background:#ffdd00;">"FTHRD"</mark>,
      "description": "Final Third"
    },
    "endDate": "2027-08-31"
  },
  "earlyEngagement": {
    "weeks": 3,
    "completed": 3
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 12,
      "scheduled": 1,
      "completed": 4
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": true },
    "sentences": [
      {
        "type": { "isCustodial": <mark style="background:#ffdd00;">true</mark> },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": "2027-08-30"
      }
    ]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: { phase: { code: 'FTHRD', description: 'Final Third' }, endDate: '2027-08-31' },
        historyHref: '#',
        arrangeAppointmentHref: '#',
        allAppointmentsHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: true },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-08-30'
          }]
        },
        earlyEngagement: { weeks: 3, completed: 3 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 12, scheduled: 1, completed: 4 } }
      }) }}

      </div>

      <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="stage-in-flight-conditional">

      <h3 class="govuk-heading-s" id="day-1">Day 1</h3>
      <p class="govuk-body">Triggered by a missing <code>currentPhase</code> ("currentPhase" object will not be returned from the API), shown on day 1 before any phase has been calculated:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "earlyEngagement": {
    "weeks": 0,
    "completed": 0
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 0,
      "scheduled": 0,
      "completed": 0
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": false },
    "sentences": [{
      "type": { "isCustodial": true },
      "custody": { "status": { "code": "B", "description": "Released - On Licence" }, "finalThirdDate": "2026-08-06" },
      "inBreach": false,
      "endDate": "2027-08-30"
    },
    {
      "type": { "isCustodial": true },
      "custody": { "status": { "code": "B", "description": "Released - On Licence" }, "finalThirdDate": "2026-08-06" },
      "inBreach": false,
      "endDate": "2027-08-30"
    }
  ]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        oasysReviewHref: '#',
        historyHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-08-30'
          },
          {
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-08-30'
          }]
        },
        earlyEngagement: { weeks: 0, completed: 0 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 0, scheduled: 0, completed: 0 } }
      }) }}

      <h3 class="govuk-heading-s" id="day-1-or-shortly-after">Day 1 or shortly after</h3>
      <p class="govuk-body">Triggered by <code>currentPhase.phase.code: "SPNS"</code> (not yet started), shown on day 1 or shortly after once a phase has been calculated but supervision hasn't started:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": {
      "code": <mark style="background:#ffdd00;">"SPNS"</mark>,
      "description": "Not yet started"
    },
    "endDate": "2027-08-31"
  },
  "earlyEngagement": {
    "weeks": 0,
    "completed": 0
  },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": {
      "allowance": 0,
      "scheduled": 0,
      "completed": 0
    }
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": false },
    "sentences": [ {
      "type": { "isCustodial": true },
      "custody": { "status": { "code": "B", "description": "Released - On Licence" }, "finalThirdDate": "2026-08-06" },
      "inBreach": false,
      "endDate": "2027-08-30"
    },
    {
      "type": { "isCustodial": true },
      "custody": { "status": { "code": "B", "description": "Released - On Licence" }, "finalThirdDate": "2026-08-06" },
      "inBreach": false,
      "endDate": "2027-08-30"
    }]
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: { phase: { code: 'SPNS', description: 'Not yet started' }, endDate: '2027-08-31' },
        oasysReviewHref: '#',
        historyHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-08-30'
          },
          {
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-08-30'
          }]
        },
        earlyEngagement: { weeks: 0, completed: 0 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 0, scheduled: 0, completed: 0 } }
      }) }}

      </div>



    <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="stage-provisional-conditional">

      <h3 class="govuk-heading-s" id="provisional">Provisional</h3>

      <p class="govuk-body">The provisional tier is displayed when <code>provisional: true</code>.</p>
      <p class="govuk-body">The provisional flag is supplied by the tier API calculation.</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "provisional": true,
  "currentPhase": {
    "phase": {
      "code": "SPNK", "description": "Not yet known"
    },
    "endDate": "2027-08-31"
  },
  "oasysReviewHref": "#",
  "historyHref": "#",
  "tierScore": "C",
  "tag": {
    "text": "Provisional",
    "color": "orange"
  },
  "context": {
    "name": { "forename": "Gracie", "surname": "Beatty" },
    "gender": "Male",
    "finalThirdEligibility": { "eligible": false },
    "sentences": [
      {
        "type": { "isCustodial": true },
        "custody": {
          "status": { "code": "B", "description": "Released - On Licence" },
          "finalThirdDate": "2026-08-06"
        },
        "inBreach": false,
        "endDate": "2027-08-30"
      }
    ]
  },
  "earlyEngagement": { "weeks": 0, "completed": 0 },
  "currentYear": {
    "endDate": "2027-08-31",
    "appointments": { "allowance": 0, "scheduled": 0, "completed": 0 }
  }
}</code></pre>

      {{ supervisionPackage({
        provisional: true,
        currentPhase: { phase: { code: 'SPNK', description: 'Not yet known' }, endDate: '2027-08-31' },
        oasysReviewHref: '#',
        historyHref: '#',
        tierScore: 'C',
        tag: { text: 'Provisional', color: 'orange' },
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: [{
            type: { isCustodial: true },
            custody: { status: { code: 'B', description: 'Released - On Licence' }, finalThirdDate: '2026-08-06' },
            inBreach: false,
            endDate: '2027-08-30'
          }]
        },
        earlyEngagement: { weeks: 0, completed: 0 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 0, scheduled: 0, completed: 0 } }
      }) }}

    </div>

    <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
      <h2 class="govuk-heading-m" id="final-third-progress-national-security-division-cases">Final third progress National Security Division cases</h2>
      <p class="govuk-body">Displays the final third progress card.</p>
      <p class="govuk-body">The status is "In progress" when the final third date is before today's date</p>
      <p class="govuk-body">This is triggered by the following fields in the current phase supervision package api</p>

      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
        "context": {
          "nationalSecurityDivision": true,
          "finalThirdEligibility": {
            "eligible": true,
            "since": "2026-07-10"
          },
          "sentences": [
            {
              "endDate": "2027-01-07",
              "type": {
                "isCustodial": true
              },
              "custody": {
                "finalThirdDate": "2025-11-07"
              }
            }
          ]
        }
      }</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        context: {
          date: '2026-07-15T10:02:47.256918704+01:00',
          gender: 'Male',
          integratedOffenderManagementRedRated: true,
          offenderPersonalDisorderPathway: false,
          intensiveSupervisionCourt: false,
          nationalSecurityDivision: true,
          finalThirdEligibility: { eligible: true, since: '2026-07-10' },
          sentences: [
            {
              eventNumber: '1',
              startDate: '2026-07-08',
              endDate: '2027-01-07',
              supervisionPackage: { code: 'SPA', description: 'A' },
              type: {
                code: '307',
                description: 'Adult Custody < 12m',
                isCustodial: true
              },
              custody: {
                status: { code: 'B', description: 'Released - On Licence' },
                finalThirdDate: '2025-11-07',
                releases: [ { releaseDate: '2026-07-10' } ]
              }
            }
          ]
        }
      }) }}

      <p class="govuk-body">The status is "Not started" when the final third date is after today's date</p>
      <p class="govuk-body">This is triggered by the following fields in the current phase supervision package api</p>

      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
        "context": {
          "nationalSecurityDivision": true,
          "finalThirdEligibility": {
            "eligible": true,
            "since": "2026-07-10"
          },
          "sentences": [
            {
              "endDate": "2027-01-07",
              "type": {
                "isCustodial": true
              },
              "custody": {
                "finalThirdDate": "2027-11-07"
              }
            }
          ]
        }
      }</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        context: {
          name: {
            forename: 'Stuart',
            surname: 'Morris'
          },
          date: '2026-07-15T10:02:47.256918704+01:00',
          gender: 'Male',
          integratedOffenderManagementRedRated: true,
          offenderPersonalDisorderPathway: false,
          intensiveSupervisionCourt: false,
          nationalSecurityDivision: true,
          finalThirdEligibility: { eligible: true, since: '2026-07-10' },
          sentences: [
            {
              eventNumber: '1',
              startDate: '2026-07-08',
              endDate: '2027-01-07',
              supervisionPackage: { code: 'SPA', description: 'A' },
              type: {
                code: '307',
                description: 'Adult Custody < 12m',
                isCustodial: true
              },
              custody: {
                status: { code: 'B', description: 'Released - On Licence' },
                finalThirdDate: '2027-11-07',
                releases: [ { releaseDate: '2026-07-10' } ]
              }
            }
          ]
        }
      }) }}

      <p class="govuk-body">The status is "Ended" when the sentence end date is before today's date</p>
      <p class="govuk-body">This is triggered by the following fields in the current phase supervision package api</p>

      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
        "context": {
          "nationalSecurityDivision": true,
          "finalThirdEligibility": {
            "eligible": true,
            "since": "2026-07-10"
          },
          "sentences": [
            {
              "endDate": "2024-01-07",
              "type": {
                "isCustodial": true
              },
              "custody": {
                "finalThirdDate": "2025-11-07"
              }
            }
          ]
        }
      }</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        context: {
          date: '2026-07-15T10:02:47.256918704+01:00',
          gender: 'Male',
          integratedOffenderManagementRedRated: true,
          offenderPersonalDisorderPathway: false,
          intensiveSupervisionCourt: false,
          nationalSecurityDivision: true,
          finalThirdEligibility: { eligible: true, since: '2026-07-10' },
          sentences: [
            {
              eventNumber: '1',
              startDate: '2024-01-07',
              endDate: '2024-01-07',
              supervisionPackage: { code: 'SPA', description: 'A' },
              type: {
                code: '307',
                description: 'Adult Custody < 12m',
                isCustodial: true
              },
              custody: {
                status: { code: 'B', description: 'Released - On Licence' },
                finalThirdDate: '2025-11-07',
                releases: [ { releaseDate: '2026-07-10' } ]
              }
            }
          ]
        }
      }) }}

      <h3 class="govuk-heading-s" id="final-third-progress-spna">Final third progress still renders when phase code is SPNA (Does not apply)</h3>
      <p class="govuk-body">Even when <code>currentPhase.phase.code</code> is <code>SPNA</code> ("Does not apply" - normally meaning no supervision package renders at all), the final third progress card still renders if <code>context.nationalSecurityDivision</code> is <code>true</code> and the person is eligible for the final third with a custodial sentence. This check happens before the standard supervision package eligibility check.</p>
      <p class="govuk-body">This is triggered by the following fields in the current phase supervision package api</p>

      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
        "currentPhase": { "phase": { "code": "SPNA", "description": "Does not apply" } },
        "context": {
          "nationalSecurityDivision": true,
          "finalThirdEligibility": {
            "eligible": true,
            "since": "2026-07-10"
          },
          "sentences": [
            {
              "endDate": "2027-01-07",
              "type": {
                "isCustodial": true
              },
              "custody": {
                "finalThirdDate": "2025-11-07"
              }
            }
          ]
        }
      }</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        currentPhase: {
          phase: { code: 'SPNA', description: 'Does not apply' }
        },
        context: {
          name: {
            forename: 'Stuart',
            surname: 'Morris'
          },
          date: '2026-07-15T10:02:47.256918704+01:00',
          gender: 'Male',
          integratedOffenderManagementRedRated: false,
          offenderPersonalDisorderPathway: false,
          intensiveSupervisionCourt: false,
          nationalSecurityDivision: true,
          finalThirdEligibility: { eligible: true, since: '2026-07-10' },
          sentences: [
            {
              eventNumber: '1',
              startDate: '2026-07-08',
              endDate: '2027-01-07',
              supervisionPackage: { code: 'SPA', description: 'A' },
              type: {
                code: '307',
                description: 'Adult Custody < 12m',
                isCustodial: true
              },
              custody: {
                status: { code: 'B', description: 'Released - On Licence' },
                finalThirdDate: '2025-11-07',
                releases: [ { releaseDate: '2026-07-10' } ]
              }
            }
          ]
        }
      }) }}

      <p class="govuk-body">The final third progress card is only shown when <code>context.nationalSecurityDivision</code> is <code>true</code>. When it is <code>false</code>, the standard supervision package is shown instead, with the "Final third" stage panel.</p>
      <p class="govuk-body">This is triggered by the following fields in the current phase supervision package api</p>

      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
        "currentPhase": { "phase": { "code": "FTHRD" } },
        "context": {
          "nationalSecurityDivision": false,
          "finalThirdEligibility": {
            "eligible": true,
            "since": "2026-07-10"
          },
          "sentences": [
            {
              "endDate": "2027-01-07",
              "type": {
                "isCustodial": true
              },
              "custody": {
                "finalThirdDate": "2025-11-07"
              }
            }
          ]
        }
      }</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        deliusBaseURL: 'https://ndelius.test.probation.service.justice.gov.uk',
        crn: 'X991651',
        nextAppointment: {
          date: '2026-08-19T15:15:00+01:00',
          description: 'Planned Telephone Contact (NS)',
          href: '#'
        },
        currentPhase: {
          phase: { code: 'FTHRD', description: 'Final Third' },
          supervisionPackage: { code: 'SPA', description: 'A' },
          eventNumber: '1',
          startDate: '2026-01-01',
          endDate: '2026-04-01'
        },
        earlyEngagement: {
          startDate: '2026-07-10T00:00:00Z',
          endDate: '2026-10-31T00:00:00Z',
          weeks: 12,
          completed: 12
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 2, completed: 20 }
        },
        context: {
          name: {
            forename: 'Stuart',
            surname: 'Morris'
          },
          date: '2026-07-15T10:02:47.256918704+01:00',
          gender: 'Male',
          integratedOffenderManagementRedRated: false,
          offenderPersonalDisorderPathway: false,
          intensiveSupervisionCourt: false,
          nationalSecurityDivision: false,
          finalThirdEligibility: { eligible: true, since: '2026-07-10' },
          sentences: [
            {
              eventNumber: '1',
              startDate: '2026-07-08',
              endDate: '2027-01-07',
              supervisionPackage: { code: 'SPA', description: 'A' },
              type: {
                code: '307',
                description: 'Adult Custody < 12m',
                isCustodial: true
              },
              custody: {
                status: { code: 'B', description: 'Released - On Licence' },
                finalThirdDate: '2025-11-07',
                releases: [ { releaseDate: '2026-07-10' } ]
              },
              inBreach: false
            }
          ]
        }
      }) }}

      <p class="govuk-body">The stage panel is driven by <code>currentPhase.phase.code</code>, not by <code>context.finalThirdEligibility</code>. So a PoP can be eligible for the final third while <code>currentPhase.phase.code</code> is still <code>'STD'</code>, in which case the "Standard supervision" stage panel is shown rather than the "Final third" one.</p>
      <p class="govuk-body">This is triggered by the following fields in the current phase supervision package api</p>

      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
        "currentPhase": { "phase": { "code": "STD" } },
        "context": {
          "nationalSecurityDivision": false,
          "finalThirdEligibility": {
            "eligible": true,
            "since": "2026-07-10"
          },
          "sentences": [
            {
              "endDate": "2027-01-07",
              "type": {
                "isCustodial": true
              },
              "custody": {
                "finalThirdDate": "2025-11-07"
              }
            }
          ]
        }
      }</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        deliusBaseURL: 'https://ndelius.test.probation.service.justice.gov.uk',
        crn: 'X991651',
        nextAppointmentHref: '#',
        nextAppointment: {
          id: '2511051671',
          date: "2026-08-25",
          startTime: "12:00:00",
          type: {
            code: "COAP",
            description: "Planned Office Visit (NS)"
          }
        },
        currentPhase: {
          phase: { code: 'STD', description: 'Standard Supervision' },
          supervisionPackage: { code: 'SPA', description: 'A' },
          eventNumber: '1',
          startDate: '2026-01-01',
          endDate: '2026-04-01'
        },
        earlyEngagement: {
          startDate: '2026-07-10T00:00:00Z',
          endDate: '2026-10-31T00:00:00Z',
          weeks: 12,
          completed: 12
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 2, completed: 20 }
        },
        context: {
          name: {
            forename: 'Stuart',
            surname: 'Morris'
          },
          date: '2026-07-15T10:02:47.256918704+01:00',
          gender: 'Male',
          integratedOffenderManagementRedRated: false,
          offenderPersonalDisorderPathway: false,
          intensiveSupervisionCourt: false,
          nationalSecurityDivision: false,
          finalThirdEligibility: { eligible: true, since: '2026-07-10' },
          sentences: [
            {
              eventNumber: '1',
              startDate: '2026-07-08',
              endDate: '2027-01-07',
              supervisionPackage: { code: 'SPA', description: 'A' },
              type: {
                code: '307',
                description: 'Adult Custody < 12m',
                isCustodial: true
              },
              custody: {
                status: { code: 'B', description: 'Released - On Licence' },
                finalThirdDate: '2025-11-07',
                releases: [ { releaseDate: '2026-07-10' } ]
              },
              inBreach: false
            }
          ]
        }
      }) }}

      <h2 class="govuk-heading-m" id="sentence-type-heading">Sentence type heading</h2>
      <p class="govuk-body">The "Supervision package" heading is suffixed with a sentence type description, derived from <code>context</code> via the <code>sentenceType</code> filter.</p>

      <h3 class="govuk-heading-s" id="custodial-sentence">Custodial sentence</h3>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "context": {
    "sentences": [
      { "supervisionPackage": { "code": "SPA" }, "type": { "isCustodial": true } }
    ]
  }
}</code></pre>
      <p class="govuk-body">This is triggered when at least one non-<code>SPX</code> sentence has <code>type.isCustodial === true</code>.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        context: {
                  name: {
            forename: 'Stuart',
            surname: 'Morris'
          },
          sentences: [
            { supervisionPackage: { code: 'SPA' }, type: { isCustodial: true } }
          ]
        }
      }) }}

      <h3 class="govuk-heading-s" id="community-sentence">Community sentence</h3>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "context": {
    "sentences": [
      { "supervisionPackage": { "code": "SPA" }, "type": { "isCustodial": false } }
    ]
  }
}</code></pre>
      <p class="govuk-body">This is triggered when every primary sentence has <code>type.isCustodial === false</code>.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        context: {
                  name: {
            forename: 'Stuart',
            surname: 'Morris'
          },
          sentences: [
            { supervisionPackage: { code: 'SPA' }, type: { isCustodial: false } }
          ]
        }
      }) }}

      <h3 class="govuk-heading-s" id="life-sentence">Life sentence</h3>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "context": {
    "liferCategory": { "code": "LF03" }
  }
}</code></pre>
      <p class="govuk-body">This is triggered by <code>context.liferCategory</code> being present with a code other than <code>'LF01'</code> or <code>'LF02'</code>.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        context: {
                  name: {
            forename: 'Stuart',
            surname: 'Morris'
          },
          liferCategory: { code: 'LF03' },
          sentences: [
            { supervisionPackage: { code: 'SPA' }, type: { isCustodial: true } }
          ]
        }
      }) }}

      <h3 class="govuk-heading-s" id="imprisonment-for-public-protection">Imprisonment for Public Protection</h3>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "context": {
    "liferCategory": { "code": "LF01" }
  }
}</code></pre>
      <p class="govuk-body">This is triggered by <code>context.liferCategory.code === 'LF01'</code>.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        context: {
                  name: {
            forename: 'Stuart',
            surname: 'Morris'
          },
          liferCategory: { code: 'LF01' },
          sentences: [
            { supervisionPackage: { code: 'SPA' }, type: { isCustodial: true } }
          ]
        }
      }) }}

      <h3 class="govuk-heading-s" id="extended-determinate-sentence">Extended determinate sentence</h3>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "context": {
    "liferCategory": { "code": "LF02" }
  }
}</code></pre>
      <p class="govuk-body">This is triggered by <code>context.liferCategory.code === 'LF02'</code>.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        context: {
                  name: {
            forename: 'Stuart',
            surname: 'Morris'
          },
          liferCategory: { code: 'LF02' },
          sentences: [
            { supervisionPackage: { code: 'SPA' }, type: { isCustodial: true } }
          ]
        }
      }) }}

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
      <h1 class="govuk-heading-l" id="supervision-package-summary">Supervision Package Summary</h1>
      <h3 class="govuk-heading-s" id="early-engagement">Early engagement</h3>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": {
      "code": "INIT"
    }
  }
}</code></pre>
      {{ supervisionPackageSummary({
        currentPhase: {
          phase: { code: 'INIT' }
        },
        context: {
          name: { forename: 'Stuart' },
          finalThirdEligibility: {
            eligible: false
          }
        },
        earlyEngagement: {
          startDate: '2026-08-06T13:46:16.916Z',
          endDate: '2026-08-06T13:46:16.916Z',
          weeks: 4,
          completed: 2
        },
        currentYear: {
          startDate: '2026-08-06',
          endDate: '2026-08-06',
          appointments: {
            allowance: 0,
            scheduled: 1,
            completed: 0
          }
        }
      }) }}

      <h3 class="govuk-heading-s" id="supervision-stage">Supervision stage</h3>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": {
      "code": "STD"
    }
  }
}</code></pre>
      {{ supervisionPackageSummary({
        currentPhase: {
          phase: { code: 'STD' }
        },
        context: {
          name: { forename: 'Stuart' },
          finalThirdEligibility: {
            eligible: false
          }
        },
        earlyEngagement: {
          startDate: '2026-08-06T13:46:16.916Z',
          endDate: '2026-08-06T13:46:16.916Z',
          weeks: 0,
          completed: 0
        },
        currentYear: {
          startDate: '2026-08-06',
          endDate: '2026-08-06',
          appointments: {
            allowance: 4,
            scheduled: 1,
            completed: 2
          }
        }
      }) }}

      <h3 class="govuk-heading-s" id="supervision-stage-with-breach-warning">Supervision stage with breach warning</h3>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": {
      "code": "STD"
    }
  },
  "context": {
    "sentences": [
      {
        "inBreach": true
      }
    ]
  }
}</code></pre>
      {{ supervisionPackageSummary({
        currentPhase: {
          phase: { code: 'STD' }
        },
        context: {
          name: { forename: 'Stuart' },
          finalThirdEligibility: {
            eligible: false
          },
          sentences: [
            {
              inBreach: true
            }
          ]
        },
        earlyEngagement: {
          startDate: '2026-08-06T13:46:16.916Z',
          endDate: '2026-08-06T13:46:16.916Z',
          weeks: 0,
          completed: 0
        },
        currentYear: {
          startDate: '2026-08-06',
          endDate: '2026-08-06',
          appointments: {
            allowance: 4,
            scheduled: 1,
            completed: 2
          }
        }
      }) }}

      <h3 class="govuk-heading-s" id="supervision-stage-with-recall-warning">Supervision stage with recall warning</h3>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": {
      "code": "STD"
    }
  },
  "context": {
    "recallStatus": {
      "code": "R",
      "description": "Recall"
    }
  }
}</code></pre>
      {{ supervisionPackageSummary({
        currentPhase: {
          phase: { code: 'STD' }
        },
        context: {
          name: { forename: 'Stuart' },
          finalThirdEligibility: {
            eligible: false
          },
          recallStatus: {
            code: 'R',
            description: 'Recall'
          }
        },
        earlyEngagement: {
          startDate: '2026-08-06T13:46:16.916Z',
          endDate: '2026-08-06T13:46:16.916Z',
          weeks: 0,
          completed: 0
        },
        currentYear: {
          startDate: '2026-08-06',
          endDate: '2026-08-06',
          appointments: {
            allowance: 4,
            scheduled: 1,
            completed: 2
          }
        }
      }) }}

      <h3 class="govuk-heading-s" id="supervision-stage-with-all-appointments-used">Supervision stage with all appointments used</h3>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": {
      "code": "STD"
    }
  },
  "earlyEngagement": {
    "weeks": 0,
    "completed": 0
  },
  "currentYear": {
    "appointments": {
      "allowance": 4,
      "scheduled": 1,
      "completed": 4
    }
  }
}</code></pre>
      {{ supervisionPackageSummary({
        currentPhase: {
          phase: { code: 'STD' }
        },
        context: {
          name: { forename: 'Stuart' },
          finalThirdEligibility: {
            eligible: false
          }
        },
        earlyEngagement: {
          startDate: '2026-08-06T13:46:16.916Z',
          endDate: '2026-08-06T13:46:16.916Z',
          weeks: 0,
          completed: 0
        },
        currentYear: {
          startDate: '2026-08-06',
          endDate: '2026-08-06',
          appointments: {
            allowance: 4,
            scheduled: 1,
            completed: 4
          }
        }
      }) }}

      <h3 class="govuk-heading-s" id="final-third">Final third</h3>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "context": {
    "finalThirdEligibility": {
      "eligible": true
    },
    "nationalSecurityDivision": true,
    "sentences": [
      {
        "type": {
          "isCustodial": true
        },
        "custody": {
          "finalThirdDate": "2026-08-06"
        }
      }
    ]
  }
}</code></pre>
      {{ supervisionPackageSummary({
        currentPhase: {
          phase: { code: 'STD' }
        },
        context: {
          name: { forename: 'Stuart' },
          nationalSecurityDivision: true,
          finalThirdEligibility: {
            eligible: true
          },
          sentences: [
            {
              type: { isCustodial: true },
              custody: { finalThirdDate: '2026-08-06' }
            }
          ]
        },
        earlyEngagement: {
          startDate: '2026-08-06T13:46:16.916Z',
          endDate: '2026-08-06T13:46:16.916Z',
          weeks: 0,
          completed: 0
        },
        currentYear: {
          startDate: '2026-08-06',
          endDate: '2026-08-06',
          appointments: {
            allowance: 4,
            scheduled: 1,
            completed: 2
          }
        }
      }) }}
    </div>
  </main>

  <script type="module">
    import { initAll } from 'https://cdn.jsdelivr.net/npm/govuk-frontend@6.2.0/dist/govuk/govuk-frontend.min.js'
    initAll()

    // Contents links can point inside a hidden radio "conditional reveal" panel
    // (e.g. the Supervision Package scenarios). Select the matching radio first,
    // so govuk-frontend's own radios script reveals the panel before we scroll to it.
    function revealAndScrollToHash() {
      const hash = window.location.hash
      if (!hash || hash.length < 2) return
      const target = document.getElementById(hash.slice(1))
      if (!target) return
      const conditional = target.closest('.govuk-radios__conditional')
      if (conditional && conditional.id) {
        const radio = document.getElementById(conditional.id.replace(/-conditional$/, ''))
        if (radio) radio.click()
      }
      target.scrollIntoView()
    }

    revealAndScrollToHash()
    window.addEventListener('hashchange', revealAndScrollToHash)
  </script>
</body>
</html>
`,
  { previewAge },
)

fs.mkdirSync('preview', { recursive: true })
fs.writeFileSync('preview/index.html', html)

console.info('Preview written to preview/index.html')
