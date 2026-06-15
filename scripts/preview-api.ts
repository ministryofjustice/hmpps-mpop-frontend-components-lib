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

const tierApiUrl = tierApiUrlMap[environment as keyof typeof tierApiUrlMap]

if (!tierApiUrl) {
  throw new Error(`Unknown environment: ${environment}`)
}

const getAuthToken = () =>
  execFileSync('./scripts/get-auth-token.sh', [environment], {
    encoding: 'utf8',
  }).trim()

async function main() {
  const crn = process.env.CRN
  const authToken = getAuthToken()

  if (!crn) {
    throw new Error('Missing CRN in .env')
  }

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
  const { calculation } = result

  console.info(result)

  const params = calculation
    ? {
        tierScore: calculation.tierScore,
        provisional: calculation.provisional,
        changeReason: calculation.changeReason,
        historyHref: '#',
        historyText: 'View tier change history',
      }
    : {
        tierScore: 'Unavailable',
        provisional: false,
        changeReason: `Tier API returned status ${result.httpStatus}`,
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

      {{ supervisionPackage(params) }}
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
