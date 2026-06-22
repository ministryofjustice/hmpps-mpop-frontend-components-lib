/* eslint-disable no-console */
import fs from 'node:fs'
import { execFileSync } from 'node:child_process'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'dotenv/config'

import nunjucks from 'nunjucks'
import { AgentConfig } from '@ministryofjustice/hmpps-rest-client'

import MPoPComponents from '../src/MPoPComponents'

const env = nunjucks.configure(['src/components'], {
  autoescape: true,
})

const environment = process.env.ENVIRONMENT ?? 'dev'

const tierApiUrlMap = {
  dev: 'https://hmpps-tier-dev.hmpps.service.justice.gov.uk',
  preprod: 'https://hmpps-tier-preprod.hmpps.service.justice.gov.uk',
  prod: 'https://hmpps-tier.hmpps.service.justice.gov.uk',
} as const

const tierHistoryUrlMap = {
  dev: 'https://tier-dev.hmpps.service.justice.gov.uk',
  preprod: 'https://tier-preprod.hmpps.service.justice.gov.uk',
  prod: 'https://tier.hmpps.service.justice.gov.uk',
} as const

const tierApiUrl = tierApiUrlMap[environment as keyof typeof tierApiUrlMap]

const tierHistoryUrl = tierHistoryUrlMap[environment as keyof typeof tierHistoryUrlMap]

if (!tierApiUrl) {
  throw new Error(`Unknown environment: ${environment}`)
}

const getAuthToken = () =>
  execFileSync('bash', ['./scripts/get-auth-token.sh', environment], {
    encoding: 'utf8',
  }).trim()

async function main() {
  const crn = process.env.CRN

  if (!crn) {
    throw new Error('Missing CRN in .env')
  }

  const authToken = getAuthToken()

  const mpopComponents = new MPoPComponents(
    null as any,
    {
      url: tierApiUrl,
      timeout: {
        response: 5000,
        deadline: 5000,
      },
      agent: new AgentConfig(5000),
    },
    console,
  )

  const result = await mpopComponents.getTierDetails(authToken, crn)
  const { changeReason, tierScore, tag } = result.calculation

  console.info(result)

  const params = {
    tierScore,
    tag,
    changeReason,
    historyHref: `${tierHistoryUrl}/v3/case/${crn}`,
    historyText: 'View tier change history',
  }

  const html = env.renderString(
    `
{% from "supervision-package/macro.njk" import supervisionPackage %}

<!DOCTYPE html>
<html lang="en" class="govuk-template">
<head>
  <meta charset="utf-8">
  <title>MPOP Component Preview</title>

  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/govuk-frontend@6.2.0/dist/govuk/govuk-frontend.min.css"
  >

  <style>
    .supervision-package {
      border-top: 5px solid #1d70b8;
      border-left: 1px solid #cecece;
      border-right: 1px solid #cecece;
      border-bottom: 1px solid #cecece;
      padding: 20px 20px 0;
      margin-bottom: 30px;
    }

    .app-tier-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 15px;
    }
  </style>
</head>

<body class="govuk-template__body">
  <main class="govuk-main-wrapper">
    <div class="govuk-width-container">
      <h1 class="govuk-heading-l">MPOP Component Preview</h1>

      <h2 class="govuk-heading-m">Live tier from the Tier API</h2>
      <p class="govuk-body">Rendered from the Tier API in the <strong>${environment}</strong> environment for CRN <strong>${crn}</strong>. If the tier could not be retrieved, the component falls back to an "Unavailable" state showing the returned HTTP status.</p>

      {{ supervisionPackage(params) }}

      <h2 class="govuk-heading-l">Example states</h2>
      <p class="govuk-body">Static examples showing each supervision package banner variant.</p>

      <h2 class="govuk-heading-m">Provisional tier</h2>
      <p class="govuk-body">A tier score has been calculated but is still provisional, so it is shown with an orange "Provisional" tag.</p>
      {{ supervisionPackage({
        tierScore: "C",
        tag: { text: "Provisional", color: "orange" },
        historyHref: ""
      }) }}

      <h2 class="govuk-heading-m">Missing tier</h2>
      <p class="govuk-body">No tier score is available for this case, so it is shown with a red "Missing" tag.</p>
      {{ supervisionPackage({
        tierScore: "",
        tag: { text: "Missing", color: "red" },
        historyHref: ""
      }) }}

      <h2 class="govuk-heading-m">Unavailable tier</h2>
      <p class="govuk-body">The tier could not be retrieved (for example the Tier API errored), so it is shown with a grey "Unavailable" tag.</p>
      {{ supervisionPackage({
        tierScore: "",
        tag: { text: "Unavailable", color: "grey" },
        historyHref: ""
      }) }}

      <h2 class="govuk-heading-m">Confirmed tier with history link</h2>
      <p class="govuk-body">A confirmed tier score with no tag, including a link to view the tier change history.</p>
      {{ supervisionPackage({
        tierScore: "A",
        tag: { text: null, color: null },
        historyHref: "",
        historyText: "View tier change history"
      }) }}
    </div>
  </main>
</body>
</html>
`,
    { params },
  )

  fs.mkdirSync('preview', { recursive: true })
  fs.writeFileSync('preview/index-api.html', html)

  console.info('Preview written to preview/index-api.html')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
