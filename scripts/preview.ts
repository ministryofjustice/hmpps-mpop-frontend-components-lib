/* eslint-disable no-console */

import fs from 'node:fs'
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

      <h2 class="govuk-heading-m">Early engagement</h2>
      <p class="govuk-body">Display the supervision package when the PoP is in the Early engagement phase of the sentence</p>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "phase": { "name": { "code": "INIT" } },
}</code></pre>
      <p class="govuk-body">This variant is triggered purely by <code>phase.name.code === 'INIT'</code>, with <code>earlyEngagement.completed &lt; earlyEngagement.weeks</code> (still in progress, not yet at the required number of weekly appointments).</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        forename: 'Stuart',
        surname: 'Morris',
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
          completed: 2
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 2, completed: 2 }
        },
        inputs: {
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

      <p class="govuk-body">Display the supervision package when the PoP is in the Early engagement phase of the sentence and max number of appointments is reached</p>
      <p class="govuk-body">This is triggered when <code>earlyEngagement.completed</code> reaches <code>earlyEngagement.weeks</code> (i.e. <code>completed &gt;= weeks</code>) in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "phase": { "name": { "code": "INIT" } },
  "earlyEngagement": { "weeks": 12, "completed": 12 }
}</code></pre>
      <p class="govuk-body">This variant happens in early engagement (<code>phase.name.code === 'INIT'</code>) if <code>earlyEngagement.weeks</code> is the same as <code>earlyEngagement.completed</code>. If it's not early engagement, the equivalent "max reached" condition instead compares <code>currentYear.appointments.completed</code> against <code>currentYear.appointments.allowance</code> (completed &gt;= allowance).</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        forename: 'Stuart',
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
          appointments: { allowance: 46, scheduled: 0, completed: 12 }
        },
        inputs: {
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


      <p class="govuk-body">Display the supervision package when the PoP is serving for IPP or life imprisonment</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "inputs": {
    "liferCategory": { "code": "LF01" }
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>inputs.liferCategory.code</code> being one of <code>'LF01'</code>, <code>'LF02'</code>, <code>'LF03'</code> or <code>'x9'</code>, regardless of what <code>phase.name.code</code> is set to (unless <code>inputs.offenderPersonalDisorderPathway</code> is also true, which takes priority).</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        forename: 'Stuart',
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
          completed: 5
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 0, completed: 12 }
        },
        inputs: {
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

      <p class="govuk-body">Display the supervision package when the PoP is in the Early engagement phase of the sentence and is a woman</p>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response, alongside a tier score of C:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "phase": { "name": { "code": "INIT" } },
  "inputs": {
    "gender": "Female",
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>inputs.gender === 'Female'</code>, <code>tierScore</code> being one of <code>C</code>/<code>D</code>/<code>E</code>/<code>F</code>/<code>G</code>, and <code>inputs.integratedOffenderManagementRedRated === false</code>.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        forename: 'Maria',
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
          completed: 0
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 0, completed: 0 }
        },
        inputs: {
          date: '2026-07-15T10:02:47.256918704+01:00',
          gender: 'Female',
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

      <h2 class="govuk-heading-m">In breach</h2>
      <p class="govuk-body">Display the supervision package when the PoP is in the Early engagement phase of the sentence and is in breach</p>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "phase": { "name": { "code": "INIT" } },
  "inputs": {
    "sentences": [
      { "supervisionPackage": { "code": "SPA" }, "inBreach": true }
    ]
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by any sentence in <code>inputs.sentences</code> having <code>inBreach === true</code> with a <code>supervisionPackage.code</code> other than <code>'SPX'</code>.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        forename: 'Stuart',
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
          completed: 0
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 0, completed: 0 }
        },
        inputs: {
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

      <h2 class="govuk-heading-m">OPD</h2>
      <p class="govuk-body">Display the supervision package when the PoP is receiving Offender personality disorder (OPD) treatment</p>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "inputs": {
    "offenderPersonalDisorderPathway": true
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>inputs.offenderPersonalDisorderPathway === true</code>, regardless of <code>phase.name.code</code> or the IPP/life-sentence flags.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        forename: 'Stuart',
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
          completed: 0
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 0, completed: 0 }
        },
        inputs: {
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

      <h2 class="govuk-heading-m">No appointments remaining</h2>
      <p class="govuk-body">Display the supervision package when this year's appointment allowance has been used up</p>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "currentYear": {
    "appointments": { "allowance": 46, "completed": 46 }
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>currentYear.appointments.completed</code> being greater than or equal to <code>currentYear.appointments.allowance</code>, provided <code>inputs.offenderPersonalDisorderPathway</code> is not true.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        forename: 'Stuart',
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
        inputs: {
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

      <h2 class="govuk-heading-m">Unlawfully at large</h2>
      <p class="govuk-body">Display the supervision package when the PoP is unlawfully at large</p>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "inputs": {
    "sentences": { "custody": { "location": { "code": "UATLRG" } } }
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>inputs.sentences.custody.location.code === 'UATLRG'</code>, and takes priority over the "In custody" badge.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        forename: 'Chris',
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
          completed: 2
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 2, completed: 2 }
        },
        inputs: {
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

      <h2 class="govuk-heading-m">In custody</h2>
      <p class="govuk-body">Display the supervision package when the PoP is in custody</p>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "inputs": {
    "sentences": { "custody": { "status": { "code": "D", "description": "In Custody" } } }
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>inputs.sentences.custody.status.code</code> being one of <code>D</code> (In Custody), <code>I</code> (In Custody - IRC) or <code>R</code> (In Custody - RoTL), provided neither the "Unlawfully at large" condition is met.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        forename: 'Jordan',
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
          completed: 2
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 2, completed: 2 }
        },
        inputs: {
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

      <h2 class="govuk-heading-m">IOM: Red</h2>
      <p class="govuk-body">Display the supervision package when the PoP is rated red under Integrated Offender Management (IOM)</p>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "inputs": {
    "integratedOffenderManagementRedRated": true
  }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>inputs.integratedOffenderManagementRedRated === true</code>.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        forename: 'Stuart',
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
          completed: 2
        },
        currentYear: {
          startDate: '2026-07-08',
          endDate: '2027-01-07',
          isFirstYear: true,
          appointments: { allowance: 46, scheduled: 2, completed: 2 }
        },
        inputs: {
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

      <h2 class="govuk-heading-m">No appointments remaining</h2>
      <p class="govuk-body">Display the supervision package when the PoP has used all of their allowed appointments for the current year</p>
      <p class="govuk-body">This is triggered by the following fields in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "currentYear": { "appointments": { "allowance": 46, "completed": 46 } }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>currentYear.appointments.completed</code> being greater than or equal to <code>currentYear.appointments.allowance</code>, provided <code>inputs.offenderPersonalDisorderPathway</code> is not <code>true</code> (OPD takes priority and suppresses this badge).</p>
      {{ supervisionPackage({
        tierScore: 'B',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        forename: 'Stuart',
        deliusBaseURL: 'https://ndelius.test.probation.service.justice.gov.uk',
        crn: 'X991651',
        nextAppointment: {
          date: '2026-08-19T15:15:00+01:00',
          description: 'Planned Telephone Contact (NS)',
          href: '#'
        },
        phase: {
          name: { code: 'STD', description: 'Standard Supervision' },
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
        inputs: {
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

      <h2 class="govuk-heading-m">Custody status</h2>
      <p class="govuk-body">Displays a status badge derived from the PoP's custody location, recall status and custody status, in that priority order.</p>

      <h3 class="govuk-heading-s">Unlawfully at large</h3>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "inputs": { "sentences": { "custody": { "location": { "code": "UATLRG" } } } }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>inputs.sentences.custody.location.code === 'UATLRG'</code>, which takes priority over the recall and in-custody statuses below.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        forename: 'Stuart',
        inputs: {
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
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "inputs": { "sentences": { "custody": { "status": { "code": "D", "description": "In Custody" } } } }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>inputs.sentences.custody.status.code</code> being one of <code>'D'</code>, <code>'I'</code> or <code>'R'</code> (shown here as <code>'D'</code>, "In Custody"), provided the location and recall statuses above do not apply.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        forename: 'Stuart',
        inputs: {
          offenderPersonalDisorderPathway: false,
          integratedOffenderManagementRedRated: false,
          sentences: [
            {
              custody: { status: { code: 'D', description: 'In Custody' } }
            }
          ]
        }
      }) }}

      <h2 class="govuk-heading-m">IOM (Integrated Offender Management) red rated</h2>
      <p class="govuk-body">Display the supervision package when the PoP has an IOM red RAG status</p>
      <p class="govuk-body">This is triggered by the following field in the supervision package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "inputs": { "integratedOffenderManagementRedRated": true }
}</code></pre>
      <p class="govuk-body">This variant is triggered by <code>inputs.integratedOffenderManagementRedRated === true</code>. Note that when <code>inputs.nationalSecurityDivision</code> is also <code>true</code> alongside eligibility for the final third stage, the final third progress card is shown instead (see below) and this badge is not rendered.</p>
      {{ supervisionPackage({
        tierScore: 'C',
        tag: { text: null, color: null },
        historyHref: '#',
        historyText: 'View tier change history',
        allAppointmentsHref: '#',
        arrangeAppointmentHref: '#',
        forename: 'Stuart',
        deliusBaseURL: 'https://ndelius.test.probation.service.justice.gov.uk',
        crn: 'X991651',
        nextAppointment: {
          date: '2026-08-19T15:15:00+01:00',
          description: 'Planned Telephone Contact (NS)',
          href: '#'
        },
        phase: {
          name: { code: 'STD', description: 'Standard Supervision' },
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
          appointments: { allowance: 46, scheduled: 0, completed: 10 }
        },
        inputs: {
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

      <h2 class="govuk-heading-m">Provisional tier</h2>
      <p class="govuk-body">A tier score has been calculated but is still provisional, so it is shown with an orange "Provisional" tag and has a phase</p>
      <p class="govuk-body">This is triggered by the <code>provisional</code> field on the Tier API's <code>GET /v3/crn/{crn}/tier</code> response, and the <code>phase</code> field on the Supervision Package API response:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "tierScore": "D2",
  "calculationId": "123e4567-e89b-12d3-a456-426614174000",
  "calculationDate": "2021-04-23T18:25:43.511Z",
  "changeReason": "A registration was added",
  "provisional": true
}</code></pre>
      <p class="govuk-body">This variant is triggered by the Tier API's <code>provisional === true</code>, reflected here as <code>tag: { text: "Provisional" }</code>.</p>
      {{ supervisionPackage({
        tierScore: "C",
        tag: { text: "Provisional", color: "orange" },
        historyHref: "#",
        forename: 'Stuart',
        surname: 'Morris'
      }) }}

      <h2 class="govuk-heading-m">Missing tier</h2>
      <p class="govuk-body">No tier score is available for this case, so it is shown with a red "Missing" tag.</p>
      <p class="govuk-body">This is triggered when the Tier API's <code>GET /v3/crn/{crn}/tier</code> response has a <code>tierScore</code> of <code>"MISSING"</code>:</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "tierScore": "MISSING",
  "calculationId": "123e4567-e89b-12d3-a456-426614174000",
  "calculationDate": "2021-04-23T18:25:43.511Z",
  "changeReason": "A registration was added",
  "provisional": false
}</code></pre>
      <p class="govuk-body">This variant is triggered by the Tier API's <code>tierScore === 'MISSING'</code>, reflected here as <code>tag: { text: "Missing" }</code>.</p>
      {{ supervisionPackage({
        tierScore: "",
        tag: { text: "Missing", color: "red" },
        historyHref: "#"
      }) }}

      <h2 class="govuk-heading-m">Unavailable tier</h2>
      <p class="govuk-body">The tier could not be retrieved, so it is shown with a grey "Unavailable" tag. This is not something the Tier API returns directly &mdash; it is what <code>getTierDetails</code> in <code>MPoPComponents.ts</code> falls back to when the <code>GET /v3/crn/{crn}/tier</code> call errors or resolves to no data (for example a 404 or 500 response).</p>
      <p class="govuk-body">This variant is triggered when the Tier API call errors or resolves to no data (404/500), which <code>getTierDetails</code> maps to <code>tag: { text: "Unavailable" }</code>.</p>
      {{ supervisionPackage({
        tierScore: "",
        tag: { text: "Unavailable", color: "grey" },
        historyHref: "#"
      }) }}

      <h2 class="govuk-heading-m">Confirmed tier with history link</h2>
      <p class="govuk-body">A confirmed tier score with no tag, including a link to view the tier change history.</p>
      <p class="govuk-body">This is the standard shape returned by the Tier API's <code>GET /v3/crn/{crn}/tier</code> when a tier has been confirmed (not missing or provisional):</p>
      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
  "tierScore": "C",
  "calculationId": "123e4567-e89b-12d3-a456-426614174000",
  "calculationDate": "2021-04-23T18:25:43.511Z",
  "changeReason": "A registration was added",
  "provisional": false
}</code></pre>
      <p class="govuk-body">This variant is triggered by the Tier API returning a <code>tierScore</code> with <code>provisional === false</code> (and not <code>'MISSING'</code>), reflected here as <code>tag: { text: null }</code>.</p>
      {{ supervisionPackage({
        tierScore: "C",
        tag: { text: null, color: null },
        historyHref: "#",
        historyText: "View tier change history"
      }) }}

      <h2 class="govuk-heading-m">Final third progress</h2>
      <p class="govuk-body">Displays the final third progress card.</p>
      <p class="govuk-body">The status is "In progress" when the final third date is before today's date</p>
      <p class="govuk-body">This is triggered by the following fields in the current phase supervision package api</p>

      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
        "inputs": {
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
        inputs: {
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

      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
        "inputs": {
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
        inputs: {
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

      <pre class="govuk-body" style="background:#f3f2f1;padding:10px;overflow:auto;"><code>{
        "inputs": {
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
        inputs: {
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
  </main>
</body>
</html>
`,
  { previewAge },
)

fs.mkdirSync('preview', { recursive: true })
fs.writeFileSync('preview/index.html', html)

console.info('Preview written to preview/index.html')
