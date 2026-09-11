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
      <h1 class="govuk-heading-l">Person Header</h1>
      <p class="govuk-body">Placeholder for the redesigned persistent person header (name, CRN, date of birth, tier, managed by). <code>riskBadges</code> is a layout slot for pre-rendered risk badge markup (e.g. from the ARNS component library's <code>predictorBadge</code>) rather than something this component renders itself.</p>

      {{ personHeader({
        name: "Andrew Langley",
        crn: "D004851",
        dob: "18 November 1995",
        tier: "B4",
        historyHref: "#",
        managedBy: "Jack Frost (Worksop Probation Office)",
        managedByHref: "#",
        riskBadges: '<span class="govuk-tag govuk-tag--green">OGRS <strong>LOW 5.67%</strong></span> <span class="govuk-tag govuk-tag--orange">Risk of serious harm <strong>MEDIUM</strong></span>'
      }) }}

      <h2 class="govuk-heading-m">Managed by: Unallocated (not clickable)</h2>
      <p class="govuk-body">When there's no responsible officer, or the managed by data failed to load, <code>managedByHref</code> is omitted and the field renders as plain text instead of a link.</p>
      {{ personHeader({
        name: "Andrew Langley",
        crn: "D004851",
        dob: "18 November 1995",
        tier: "B4",
        historyHref: "#",
        managedBy: "Unallocated"
      }) }}

      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
      <h1 class="govuk-heading-l">Supervision Package</h1>

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

      <h3 class="govuk-heading-s">Community</h3>
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

      <h3 class="govuk-heading-s">Woman</h3>
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

      <h3 class="govuk-heading-s">Custodial</h3>
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

      <h3 class="govuk-heading-s">Final Third eligible</h3>
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

      <h3 class="govuk-heading-s">Final Third ineligible</h3>
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

      <h3 class="govuk-heading-s">In Custody</h3>
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

      </div>

      <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="stage-supervision-conditional">

      <h3 class="govuk-heading-s">Lifer/IPP</h3>
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

      <h3 class="govuk-heading-s">End date</h3>
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

      <h3 class="govuk-heading-s">Reset Date</h3>
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

      <h3 class="govuk-heading-s">Final Third eligible</h3>
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

      <h3 class="govuk-heading-s">Final Third ineligible</h3>
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

      <h3 class="govuk-heading-s">OPD</h3>
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

      <h3 class="govuk-heading-s">End date</h3>
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

      <h3 class="govuk-heading-s">Reset Date</h3>
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

      <h3 class="govuk-heading-s">Final Third eligible</h3>
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

      <h3 class="govuk-heading-s">Final Third ineligible</h3>
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

      <h3 class="govuk-heading-s">Custodial Final third stage</h3>
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

      <h3 class="govuk-heading-s">Day 1</h3>
      <p class="govuk-body">Triggered by a missing <code>currentPhase</code> ("currentPhase": null), shown on day 1 before any phase has been calculated:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  <mark style="background:#ffdd00;">"currentPhase": null</mark>,
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
    "sentences": []
  }
}</code></pre>
      {{ supervisionPackage({
        tierScore: 'C',
        currentPhase: null,
        oasysReviewHref: '#',
        historyHref: '#',
        context: {
          name: { forename: 'Gracie', surname: 'Beatty' },
          gender: 'Male',
          finalThirdEligibility: { eligible: false },
          sentences: []
        },
        earlyEngagement: { weeks: 0, completed: 0 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 0, scheduled: 0, completed: 0 } }
      }) }}

      <h3 class="govuk-heading-s">Day 1 or shortly after</h3>
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
    "sentences": []
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
          sentences: []
        },
        earlyEngagement: { weeks: 0, completed: 0 },
        currentYear: { endDate: '2027-08-31', appointments: { allowance: 0, scheduled: 0, completed: 0 } }
      }) }}

      </div>



    <div class="govuk-radios__conditional govuk-radios__conditional--hidden" id="stage-provisional-conditional">

      <h3 class="govuk-heading-s">Provisional</h3>

      <p class="govuk-body">The provisional tier is displayed when the current phase code is SPNK (Not Yet Known) and the tier is provisional.</p>
      <p class="govuk-body">This is triggered by the following fields in the current phase supervision package api</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  currentPhase: {
    phase: {
      code: 'SPNK', description: 'Not yet known'
    },
    endDate: '2027-08-31'
    },
    oasysReviewHref: '#',
    historyHref: '#',
    tierScore: 'C',
    tag: {
      text: 'Provisional',
      color: 'blue'
    },
    context: {
      name: { forename: 'Gracie', surname: 'Beatty' },
      gender: 'Male',
      finalThirdEligibility: { eligible: false },
      sentences: []
    },
    earlyEngagement: { weeks: 0, completed: 0 },
    currentYear: {
      endDate: '2027-08-31',
      appointments: { allowance: 0, scheduled: 0, completed: 0 }
    }
  }
}</code></pre>

      {{ supervisionPackage({
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
      <h2 class="govuk-heading-m">Final third progress National Security Division cases</h2>
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

      <h2 class="govuk-heading-m">Sentence type heading</h2>
      <p class="govuk-body">The "Supervision package" heading is suffixed with a sentence type description, derived from <code>context</code> via the <code>sentenceType</code> filter.</p>

      <h3 class="govuk-heading-s">Custodial sentence</h3>
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

      <h3 class="govuk-heading-s">Community sentence</h3>
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

      <h3 class="govuk-heading-s">Life sentence</h3>
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

      <h3 class="govuk-heading-s">Imprisonment for Public Protection</h3>
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

      <h3 class="govuk-heading-s">Extended determinate sentence</h3>
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
      <h1 class="govuk-heading-l">Supervision Package Summary</h1>
       <h3 class="govuk-heading-s">Early engagement</h3>
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
  forename: 'Stuart',
  context: {
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

   <h3 class="govuk-heading-s">Supervision stage</h3>
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
  forename: 'Stuart',
  context: {
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

  <h3 class="govuk-heading-s">Supervision stage with breach warning</h3>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": {
    "phase": {
      "code": "STD"
    }
  },
  "context": {
    sentences: [
      {
        inBreach: true
      }
    ]
  }
}</code></pre>
 {{ supervisionPackageSummary({
  currentPhase: {
    phase: { code: 'STD' }
  },
  forename: 'Stuart',
  context: {
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

  <h3 class="govuk-heading-s">Supervision stage with recall warning</h3>
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
  forename: 'Stuart',
  context: {
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

  <h3 class="govuk-heading-s">Supervision stage with all appointments used</h3>
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
  forename: 'Stuart',
  context: {
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

  <h3 class="govuk-heading-s">Final third</h3>
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
  forename: 'Stuart',
  context: {
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
  </script>
</body>
</html>
`,
  { previewAge },
)

fs.mkdirSync('preview', { recursive: true })
fs.writeFileSync('preview/index.html', html)

console.info('Preview written to preview/index.html')
