/* eslint-disable no-console */

import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import nunjucks from 'nunjucks'
import sass from 'sass'
import { yearsSince } from '../src/utils/yearsSince'
import { mpopNunjucksSetup } from '../src/utils/nunjucksFilters'
import { previewClientScript } from './previewScript'

const previewCss = sass.compile(fileURLToPath(new URL('./preview.scss', import.meta.url)), {
  loadPaths: [process.cwd(), 'node_modules'],
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
  <style>
    [data-tag-selector].govuk-radios--small .govuk-radios__item:not([hidden]) {
      display: flex;
      align-items: center;
      min-height: 40px;
    }
  </style>
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

      <h2 class="govuk-heading-m">Supervision stages</h2>
      <p class="govuk-body">Select a stage to preview the corresponding supervision package component and the API fields that trigger it.</p>

      <div class="govuk-form-group">
        <fieldset class="govuk-fieldset">
          <legend class="govuk-fieldset__legend govuk-visually-hidden">Supervision stage</legend>
          <div class="govuk-radios govuk-radios--inline" data-stage-selector>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="stage-early-engagement" type="radio" name="stage" value="early-engagement" checked>
              <label class="govuk-label govuk-radios__label" for="stage-early-engagement">Early engagement</label>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="stage-standard-supervision" type="radio" name="stage" value="standard-supervision">
              <label class="govuk-label govuk-radios__label" for="stage-standard-supervision">Standard supervision</label>
            </div>
            <div class="govuk-radios__item">
              <input class="govuk-radios__input" id="stage-final-third" type="radio" name="stage" value="final-third">
              <label class="govuk-label govuk-radios__label" for="stage-final-third">Final third</label>
            </div>
          </div>
        </fieldset>
      </div>



      <div class="stage-panel" data-stage="early-engagement">
        <p class="govuk-body">Display the supervision package when the PoP is in the Early engagement phase of the supervision package</p>
        <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
        <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": { 
    "phase": { "code": "INIT", "description": "Early engagement" }
  }
}</code></pre>
        <p class="govuk-body">This variant is triggered purely by <code>currentPhase.phase.code === 'INIT'</code></p>
        <div class="default-example">
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
            phase: { code: 'INIT', description: 'Early Engagement' },
            supervisionPackage: { code: 'SPA', description: 'A' },
            eventNumber: '1',
            startDate: '2026-01-01',
            endDate: '2026-04-01'
          },
          earlyEngagement: {
            startDate: '2026-07-10T00:00:00Z',
            endDate: '2026-10-31T00:00:00Z',
            weeks: 12,
            completed: 2
          },
          currentYear: {
            startDate: '2026-07-08',
            endDate: '2027-01-07',
            isFirstYear: true,
            appointments: { allowance: 46, scheduled: 2, completed: 2 }
          },
          context: {
            date: '2026-07-15T10:02:47.256918704+01:00',
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
                endDate: '2027-01-07',
                supervisionPackage: { code: 'SPA', description: 'A' },
                type: {
                  code: '307',
                  description: 'Adult Custody < 12m',
                  isCustodial: true
                },
                custody: {
                  status: { code: 'B', description: 'Released - On Licence' },
                  finalThirdDate: '2026-11-07',
                  releases: [ { releaseDate: '2026-07-10' } ]
                },
                inBreach: false
              }
            ]
          }
        }) }}
        </div>
      </div>

      <div class="stage-panel" data-stage="standard-supervision" hidden>
        <p class="govuk-body">Display the supervision package when the PoP is in the Standard Supervision phase of the supervision package</p>
        <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
        <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": { 
    "phase": { "code": "STD", "description": "Standard Supervision" } 
  }
}</code></pre>
        <p class="govuk-body">This variant is triggered purely by <code>currentPhase.phase.code === 'STD'</code></p>
        <div class="default-example">
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
            completed: 2
          },
          currentYear: {
            startDate: '2026-07-08',
            endDate: '2027-01-07',
            isFirstYear: true,
            appointments: { allowance: 46, scheduled: 2, completed: 2 }
          },
          context: {
            date: '2026-07-15T10:02:47.256918704+01:00',
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
                endDate: '2027-01-07',
                supervisionPackage: { code: 'SPA', description: 'A' },
                type: {
                  code: '307',
                  description: 'Adult Custody < 12m',
                  isCustodial: true
                },
                custody: {
                  status: { code: 'B', description: 'Released - On Licence' },
                  finalThirdDate: '2026-11-07',
                  releases: [ { releaseDate: '2026-07-10' } ]
                },
                inBreach: false
              }
            ]
          }
        }) }}
        </div>
      </div>
      <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

      <div class="stage-panel" data-stage="final-third" hidden>
        <p class="govuk-body">Display the supervision package when the PoP is in the Final third phase of the supervision package</p>
        <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
        <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": { 
    "phase": { "code": "FTHRD", "description": "Final Third" } 
  },
  "sentences": [{
    "type": { "isCustodial": true }
  }]
}</code></pre>
        <p class="govuk-body">This variant is triggered purely by <code>currentPhase.phase.code === 'FTHRD'</code> and sentence type <code>isCustodial === true</code> </p>
        <div class="default-example">
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
                  finalThirdDate: '2026-11-07',
                  releases: [ { releaseDate: '2026-07-10' } ]
                },
                inBreach: false
              }
            ]
          }
        }) }}
        </div>
      </div>

      <h2 class="govuk-heading-m">Tags combinations</h2>
      <p class="govuk-body">Select any tags to preview the supervision package variants they trigger. Multiple tags can be selected at once.</p>

      <div class="govuk-form-group">
        <fieldset class="govuk-fieldset">
          <legend class="govuk-fieldset__legend govuk-visually-hidden">Tags</legend>
          <div class="govuk-radios govuk-radios--small" data-tag-selector style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); column-gap: 20px; row-gap: 10px;">
            <div class="govuk-radios__item" data-stages="early-engagement standard-supervision final-third">
              <input class="govuk-radios__input" id="tag-none" type="radio" name="tag" value="" checked>
              <label class="govuk-label govuk-radios__label" for="tag-none">None</label>
            </div>
            <div class="govuk-radios__item" data-stages="early-engagement">
              <input class="govuk-radios__input" id="tag-max-appointments-reached" type="radio" name="tag" value="max-appointments-reached">
              <label class="govuk-label govuk-radios__label" for="tag-max-appointments-reached">Max appointments reached</label>
            </div>
            <div class="govuk-radios__item" data-stages="early-engagement standard-supervision final-third">
              <input class="govuk-radios__input" id="tag-ipp-or-life" type="radio" name="tag" value="ipp-or-life">
              <label class="govuk-label govuk-radios__label" for="tag-ipp-or-life">IPP or life imprisonment</label>
            </div>
            <div class="govuk-radios__item" data-stages="early-engagement">
              <input class="govuk-radios__input" id="tag-in-breach" type="radio" name="tag" value="in-breach">
              <label class="govuk-label govuk-radios__label" for="tag-in-breach">In breach</label>
            </div>
            <div class="govuk-radios__item" data-stages="early-engagement standard-supervision final-third">
              <input class="govuk-radios__input" id="tag-opd" type="radio" name="tag" value="opd">
              <label class="govuk-label govuk-radios__label" for="tag-opd">OPD</label>
            </div>
            <div class="govuk-radios__item" data-stages="standard-supervision final-third">
              <input class="govuk-radios__input" id="tag-no-appointments-remaining" type="radio" name="tag" value="no-appointments-remaining">
              <label class="govuk-label govuk-radios__label" for="tag-no-appointments-remaining">No appointments remaining</label>
            </div>
            <div class="govuk-radios__item" data-stages="early-engagement standard-supervision final-third">
              <input class="govuk-radios__input" id="tag-unlawfully-at-large" type="radio" name="tag" value="unlawfully-at-large">
              <label class="govuk-label govuk-radios__label" for="tag-unlawfully-at-large">Unlawfully at large</label>
            </div>
            <div class="govuk-radios__item" data-stages="early-engagement standard-supervision final-third">
              <input class="govuk-radios__input" id="tag-in-custody" type="radio" name="tag" value="in-custody">
              <label class="govuk-label govuk-radios__label" for="tag-in-custody">In custody</label>
            </div>
            <div class="govuk-radios__item" data-stages="early-engagement standard-supervision final-third">
              <input class="govuk-radios__input" id="tag-iom-red" type="radio" name="tag" value="iom-red">
              <label class="govuk-label govuk-radios__label" for="tag-iom-red">IOM red rated</label>
            </div>
            <div class="govuk-radios__item" data-stages="early-engagement standard-supervision final-third">
              <input class="govuk-radios__input" id="tag-custody-status" type="radio" name="tag" value="custody-status">
              <label class="govuk-label govuk-radios__label" for="tag-custody-status">Custody status badge</label>
            </div>
            <div class="govuk-radios__item" data-stages="final-third">
              <input class="govuk-radios__input" id="tag-final-third-progress" type="radio" name="tag" value="final-third-progress">
              <label class="govuk-label govuk-radios__label" for="tag-final-third-progress">Final third progress</label>
            </div>
          </div>
        </fieldset>
      </div>

      <div class="tags-panel" style="margin-top: 30px;">
        <h3 class="govuk-heading-s">Selected tag variations</h3>
        <div class="tag-example" data-tag="max-appointments-reached" data-stages="early-engagement" hidden>
      <p class="govuk-body">Display the supervision package when the PoP is in the Early engagement phase of the sentence and max number of appointments is reached</p>
      <p class="govuk-body">This is triggered when <code>earlyEngagement.completed</code> reaches <code>earlyEngagement.weeks</code> (i.e. <code>completed &gt;= weeks</code>) in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": { "phase": { "code": "INIT" } },
  "earlyEngagement": { "weeks": 12, "completed": 12 }
}</code></pre>
      <p class="govuk-body">This variant happens in early engagement (<code>currentPhase.phase.code === 'INIT'</code>) if <code>earlyEngagement.weeks</code> is the same as <code>earlyEngagement.completed</code>. If it's not early engagement, the equivalent "max reached" condition instead compares <code>currentYear.appointments.completed</code> against <code>currentYear.appointments.allowance</code> (completed &gt;= allowance).</p>
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
          phase: { code: 'INIT', description: 'Early Engagement' },
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
          appointments: { allowance: 46, scheduled: 0, completed: 12 }
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
          finalThirdEligibility: { eligible: false, since: '2026-07-10' },
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
                finalThirdDate: '2026-11-07',
                releases: [ { releaseDate: '2026-07-10' } ]
              },
              inBreach: false
            }
          ]
        }
      }) }}
        </div>

        <div class="tag-example" data-tag="ipp-or-life" data-stages="early-engagement standard-supervision final-third" hidden>
      <p class="govuk-body">Display the supervision package when the PoP is serving for IPP or life imprisonment</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "context": {
    "liferCategory": { "code": "LF01" }
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>context.liferCategory.code</code> being one of <code>'LF01'</code>, <code>'LF02'</code>, <code>'LF03'</code> or <code>'x9'</code>, regardless of what <code>currentPhase.phase.code</code> is set to (unless <code>context.offenderPersonalDisorderPathway</code> is also true, which takes priority).</p>
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
          phase: { code: 'INIT', description: 'Early Engagement' },
          supervisionPackage: { code: 'SPA', description: 'A' },
          eventNumber: '1',
          startDate: '2026-01-01',
          endDate: '2026-04-01'
        },
        earlyEngagement: {
          startDate: '2026-07-10T00:00:00Z',
          endDate: '2026-10-31T00:00:00Z',
          weeks: 12,
          completed: 5
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 0, completed: 12 }
        },
        context: {
                  name: {
            forename: 'Stuart',
            surname: 'Morris'
          },
          liferCategory: { code: 'LF01' },
          date: '2026-07-15T10:02:47.256918704+01:00',
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
              endDate: '2027-01-07',
              supervisionPackage: { code: 'SPA', description: 'A' },
              type: {
                code: '307',
                description: 'Adult Custody < 12m',
                isCustodial: true
              },
              custody: {
                status: { code: 'B', description: 'Released - On Licence' },
                finalThirdDate: '2026-11-07',
                releases: [ { releaseDate: '2026-07-10' } ]
              },
              inBreach: false
            }
          ]
        }
      }) }}
        </div>

        <div class="tag-example" data-tag="in-breach" data-stages="early-engagement" hidden>
      <h2 class="govuk-heading-m">In breach</h2>
      <p class="govuk-body">Display the supervision package when the PoP is in the Early engagement phase of the sentence and is in breach</p>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentPhase": { "phase": { "code": "INIT" } },
  "context": {
    "sentences": [
      { "supervisionPackage": { "code": "SPA" }, "inBreach": true }
    ]
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by any sentence in <code>context.sentences</code> having <code>inBreach === true</code> with a <code>supervisionPackage.code</code> other than <code>'SPX'</code>.</p>
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
          phase: { code: 'INIT', description: 'Early Engagement' },
          supervisionPackage: { code: 'SPA', description: 'A' },
          eventNumber: '1',
          startDate: '2026-01-01',
          endDate: '2026-04-01'
        },
        earlyEngagement: {
          startDate: '2026-07-10T00:00:00Z',
          endDate: '2026-10-31T00:00:00Z',
          weeks: 12,
          completed: 0
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 0, completed: 0 }
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
          finalThirdEligibility: { eligible: false, since: '2026-07-10' },
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
                finalThirdDate: '2026-11-07',
                releases: [ { releaseDate: '2026-07-10' } ]
              },
              inBreach: true
            }
          ]
        }
      }) }}
        </div>

        <div class="tag-example" data-tag="opd" data-stages="early-engagement standard-supervision final-third" hidden>
      <h2 class="govuk-heading-m">OPD</h2>
      <p class="govuk-body">Display the supervision package when the PoP is receiving Offender personality disorder (OPD) treatment</p>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "context": {
    "offenderPersonalDisorderPathway": true
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>context.offenderPersonalDisorderPathway === true</code>, regardless of <code>currentPhase.phase.code</code> or the IPP/life-sentence flags.</p>
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
          phase: { code: 'INIT', description: 'Early Engagement' },
          supervisionPackage: { code: 'SPA', description: 'A' },
          eventNumber: '1',
          startDate: '2026-01-01',
          endDate: '2026-04-01'
        },
        earlyEngagement: {
          startDate: '2026-07-10T00:00:00Z',
          endDate: '2026-10-31T00:00:00Z',
          weeks: 12,
          completed: 0
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 0, completed: 0 }
        },
        context: {
                  name: {
            forename: 'Stuart',
            surname: 'Morris'
          },
          date: '2026-07-15T10:02:47.256918704+01:00',
          gender: 'Male',
          integratedOffenderManagementRedRated: false,
          offenderPersonalDisorderPathway: true,
          intensiveSupervisionCourt: false,
          nationalSecurityDivision: false,
          finalThirdEligibility: { eligible: false, since: '2026-07-10' },
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
                finalThirdDate: '2026-11-07',
                releases: [ { releaseDate: '2026-07-10' } ]
              },
              inBreach: false
            }
          ]
        }
      }) }}
        </div>

        <div class="tag-example" data-tag="no-appointments-remaining" data-stages="standard-supervision" hidden>
      <h2 class="govuk-heading-m">No appointments remaining</h2>
      <p class="govuk-body">Display the supervision package when this year's appointment allowance has been used up</p>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentYear": {
    "appointments": { "allowance": 46, "completed": 46 }
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>currentYear.appointments.completed</code> being greater than or equal to <code>currentYear.appointments.allowance</code>, provided <code>context.offenderPersonalDisorderPathway</code> is not true.</p>
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
        phase: {
          name: { code: 'INIT', description: 'Early Engagement' },
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
          appointments: { allowance: 46, scheduled: 0, completed: 46 }
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
          finalThirdEligibility: { eligible: false, since: '2026-07-10' },
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
                finalThirdDate: '2026-11-07',
                releases: [ { releaseDate: '2026-07-10' } ]
              },
              inBreach: false
            }
          ]
        }
      }) }}
        </div>

        <div class="tag-example" data-tag="unlawfully-at-large" data-stages="early-engagement standard-supervision final-third" hidden>
      <h2 class="govuk-heading-m">Unlawfully at large</h2>
      <p class="govuk-body">Display the supervision package when the PoP is unlawfully at large</p>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "context": {
    "sentences": { "custody": { "location": { "code": "UATLRG" } } }
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>context.sentences.custody.location.code === 'UATLRG'</code>, and takes priority over the "In custody" badge.</p>
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
          phase: { code: 'INIT', description: 'Early Engagement' },
          supervisionPackage: { code: 'SPA', description: 'A' },
          eventNumber: '1',
          startDate: '2026-01-01',
          endDate: '2026-04-01'
        },
        earlyEngagement: {
          startDate: '2026-07-10T00:00:00Z',
          endDate: '2026-10-31T00:00:00Z',
          weeks: 12,
          completed: 2
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 2, completed: 2 }
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
          finalThirdEligibility: { eligible: false, since: '2026-07-10' },
          sentences: [
            {
              custody: { location: { code: 'UATLRG' } }
            }
          ]
        }
      }) }}
        </div>

        <div class="tag-example" data-tag="in-custody" data-stages="early-engagement standard-supervision final-third" hidden>
      <h2 class="govuk-heading-m">In custody</h2>
      <p class="govuk-body">Display the supervision package when the PoP is in custody</p>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "context": {
    "sentences": { "custody": { "status": { "code": "D", "description": "In Custody" } } }
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>context.sentences.custody.status.code</code> being one of <code>D</code> (In Custody), <code>I</code> (In Custody - IRC) or <code>R</code> (In Custody - RoTL), provided neither the "Unlawfully at large" condition is met.</p>
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
          phase: { code: 'INIT', description: 'Early Engagement' },
          supervisionPackage: { code: 'SPA', description: 'A' },
          eventNumber: '1',
          startDate: '2026-01-01',
          endDate: '2026-04-01'
        },
        earlyEngagement: {
          startDate: '2026-07-10T00:00:00Z',
          endDate: '2026-10-31T00:00:00Z',
          weeks: 12,
          completed: 2
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 2, completed: 2 }
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
          finalThirdEligibility: { eligible: false, since: '2026-07-10' },
          sentences: [
            {
              custody: { status: { code: 'D', description: 'In Custody' } }
            }
          ]
        }
      }) }}
        </div>

        <div class="tag-example" data-tag="iom-red" data-stages="early-engagement" hidden>
      <h2 class="govuk-heading-m">IOM: Red</h2>
      <p class="govuk-body">Display the supervision package when the PoP is rated red under Integrated Offender Management (IOM)</p>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "context": {
    "integratedOffenderManagementRedRated": true
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>context.integratedOffenderManagementRedRated === true</code>.</p>
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
          phase: { code: 'INIT', description: 'Early Engagement' },
          supervisionPackage: { code: 'SPA', description: 'A' },
          eventNumber: '1',
          startDate: '2026-01-01',
          endDate: '2026-04-01'
        },
        earlyEngagement: {
          startDate: '2026-07-10T00:00:00Z',
          endDate: '2026-10-31T00:00:00Z',
          weeks: 12,
          completed: 2
        },
        currentYear: {

          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 2, completed: 2 }
        },
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
          nationalSecurityDivision: false,
          finalThirdEligibility: { eligible: false, since: '2026-07-10' },
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
                finalThirdDate: '2026-11-07',
                releases: [ { releaseDate: '2026-07-10' } ]
              },
              inBreach: false
            }
          ]
        }
      }) }}
        </div>

        <div class="tag-example" data-tag="no-appointments-remaining" data-stages="final-third" hidden>
      <h2 class="govuk-heading-m">No appointments remaining</h2>
      <p class="govuk-body">Display the supervision package when the PoP has used all of their allowed appointments for the current year</p>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "currentYear": { "appointments": { "allowance": 46, "completed": 46 } }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>currentYear.appointments.completed</code> being greater than or equal to <code>currentYear.appointments.allowance</code>, provided <code>context.offenderPersonalDisorderPathway</code> is not <code>true</code> (OPD takes priority and suppresses this badge).</p>
      {{ supervisionPackage({
        tierScore: 'B',
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
          phase: { code: 'STD', description: 'Standard Supervision' },
          supervisionPackage: { code: 'SPA', description: 'A' },
          eventNumber: '1',
          startDate: '2026-01-01',
          endDate: '2027-01-07'
        },
        earlyEngagement: {
          startDate: '2026-01-01T00:00:00Z',
          endDate: '2026-03-26T00:00:00Z',
          weeks: 12,
          completed: 12
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 0, completed: 46 }
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
          finalThirdEligibility: { eligible: false, since: '2026-07-10' },
          sentences: [
            {
              eventNumber: '1',
              startDate: '2026-01-01',
              endDate: '2027-01-07',
              supervisionPackage: { code: 'SPA', description: 'A' },
              type: {
                code: '307',
                description: 'Adult Custody < 12m',
                isCustodial: true
              },
              custody: {
                status: { code: 'B', description: 'Released - On Licence' },
                finalThirdDate: '2026-11-07',
                releases: [ { releaseDate: '2026-01-01' } ]
              },
              inBreach: false
            }
          ]
        }
      }) }}
        </div>

        <div class="tag-example" data-tag="custody-status" data-stages="early-engagement standard-supervision final-third" hidden>
      <h2 class="govuk-heading-m">Custody status</h2>
      <p class="govuk-body">Displays a status badge derived from the PoP's custody location, recall status and custody status, in that priority order.</p>

      <h3 class="govuk-heading-s">Unlawfully at large</h3>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "context": { "sentences": { "custody": { "location": { "code": "UATLRG" } } } }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>context.sentences.custody.location.code === 'UATLRG'</code>, which takes priority over the recall and in-custody statuses below.</p>
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
          offenderPersonalDisorderPathway: false,
          integratedOffenderManagementRedRated: false,
          sentences: [
            {
              custody: { location: { code: 'UATLRG' } }
            }
          ]
        }
      }) }}

      <h3 class="govuk-heading-s">In custody</h3>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "context": { "sentences": { "custody": { "status": { "code": "D", "description": "In Custody" } } } }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>context.sentences.custody.status.code</code> being one of <code>'D'</code>, <code>'I'</code> or <code>'R'</code> (shown here as <code>'D'</code>, "In Custody"), provided the location and recall statuses above do not apply.</p>
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
          offenderPersonalDisorderPathway: false,
          integratedOffenderManagementRedRated: false,
          sentences: [
            {
              custody: { status: { code: 'D', description: 'In Custody' } }
            }
          ]
        }
      }) }}
        </div>

        <div class="tag-example" data-tag="iom-red" data-stages="standard-supervision final-third" hidden>
      <h2 class="govuk-heading-m">IOM (Integrated Offender Management) red rated</h2>
      <p class="govuk-body">Display the supervision package when the PoP has an IOM red RAG status</p>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;white-space:pre-wrap;word-break:break-word;"><code>{
  "context": { "integratedOffenderManagementRedRated": true }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>context.integratedOffenderManagementRedRated === true</code>. Note that when <code>context.nationalSecurityDivision</code> is also <code>true</code> alongside eligibility for the final third stage, the final third progress card is shown instead (see below) and this badge is not rendered.</p>
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
          phase: { code: 'STD', description: 'Standard Supervision' },
          supervisionPackage: { code: 'SPA', description: 'A' },
          eventNumber: '1',
          startDate: '2026-01-01',
          endDate: '2027-01-07'
        },
        earlyEngagement: {
          startDate: '2026-01-01T00:00:00Z',
          endDate: '2026-03-26T00:00:00Z',
          weeks: 12,
          completed: 12
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 0, completed: 14 }
        },
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
          nationalSecurityDivision: false,
          finalThirdEligibility: { eligible: false, since: '2026-07-10' },
          sentences: [
            {
              eventNumber: '1',
              startDate: '2026-01-01',
              endDate: '2027-01-07',
              supervisionPackage: { code: 'SPA', description: 'A' },
              type: {
                code: '307',
                description: 'Adult Custody < 12m',
                isCustodial: true
              },
              custody: {
                status: { code: 'B', description: 'Released - On Licence' },
                finalThirdDate: '2026-11-07',
                releases: [ { releaseDate: '2026-01-01' } ]
              },
              inBreach: false
            }
          ]
        }
      }) }}
        </div>

        <div class="tag-example" data-tag="final-third-progress" data-stages="final-third" hidden>
      <h2 class="govuk-heading-m">Final third progress</h2>
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
        </div>
      </div>

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

  <script>${previewClientScript}</script>
</body>
</html>
`,
  { previewAge },
)

fs.mkdirSync('preview', { recursive: true })
fs.writeFileSync('preview/index.html', html)

console.info('Preview written to preview/index.html')
