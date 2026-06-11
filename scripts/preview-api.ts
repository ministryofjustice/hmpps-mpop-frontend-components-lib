import fs from 'node:fs'
// eslint-disable-next-line import/no-extraneous-dependencies
import 'dotenv/config'
import nunjucks from 'nunjucks'
import { AgentConfig } from '@ministryofjustice/hmpps-rest-client'

import MPoPComponents from '../src/MPoPComponents'

const env = nunjucks.configure(['src/components'], {
  autoescape: true,
})

async function main() {
  const tierApiUrl = process.env.TIER_API_URL
  const authToken = process.env.AUTH_TOKEN
  const crn = process.env.CRN

  if (!tierApiUrl || !authToken || !crn) {
    throw new Error('Missing TIER_API_URL, AUTH_TOKEN or CRN in .env')
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

  console.info(calculation)

  const params = calculation
    ? {
        tierScore: calculation.tierScore,
        provisional: calculation.provisional,
        changeReason: calculation.changeReason,
        historyHref: '#',
        historyText: 'View tier change history',
      }
    : {
        tierScore: 'Tier unavailable',
        status: 'Unavailable',
        statusColour: 'grey',
        bodyText: `Tier API returned status ${result.httpStatus}`,
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

  console.log('Preview written to preview/index-api.html')
}

main().catch(error => {
  console.error(error)
  process.exit(1)
})
