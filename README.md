# hmpps-mpop-frontend-components-lib
MPoP front-end library

## Usage

### Installation

```bash
npm install @ministryofjustice/hmpps-mpop-frontend-components-lib
```

### Nunjucks setup

The components in this library use custom Nunjucks filters. You must register them with your Nunjucks environment before rendering any components, otherwise you will see a `filter not found` error.

Call `mpopNunjucksSetup` once when configuring your application:

```ts
import nunjucks from 'nunjucks'
import { mpopNunjucksSetup } from '@ministryofjustice/hmpps-mpop-frontend-components-lib'

const env = nunjucks.configure([...])
mpopNunjucksSetup(env)
```

### SCSS

Import the component styles in your SCSS entry point:

```scss
@import '@ministryofjustice/hmpps-mpop-frontend-components-lib/dist/all';
```

## Importing this as an npm package in another project

The package is published to npm here: https://www.npmjs.com/package/@ministryofjustice/hmpps-mpop-frontend-components-lib

### 1. Install the package

Add the latest (or a specific) version to your project:

```bash
npm install @ministryofjustice/hmpps-mpop-frontend-components-lib@latest
```

### 2. Import the styles

Import the component styles into your global CSS/SCSS entry point (see [SCSS](#scss) above):

```scss
@import '@ministryofjustice/hmpps-mpop-frontend-components-lib/dist/all';
```

### 3. Register the Nunjucks filters

Call `mpopNunjucksSetup` when configuring your app's Nunjucks environment (see [Nunjucks setup](#nunjucks-setup) above). This is required before rendering any component - without it you'll see a `filter not found` error:

```ts
import nunjucks from 'nunjucks'
import { mpopNunjucksSetup } from '@ministryofjustice/hmpps-mpop-frontend-components-lib'

const env = nunjucks.configure([
  'node_modules/@ministryofjustice/hmpps-mpop-frontend-components-lib/dist/mpop/components',
  'node_modules/govuk-frontend/dist',
  'app/views', // your app's own template directories
])
mpopNunjucksSetup(env)
```

You'll also need to add the package's `components` directory to your Nunjucks search paths so the `.njk` macros/templates can be found - this is included in the `nunjucks.configure` call above (`dist/mpop/components`), since the templates are published under `dist/mpop`, not `dist/components`.

### 4. Configure the API clients

Components that fetch data (e.g. the supervision package summary) are driven by the `MPoPComponents` class, which needs an `AuthenticationClient` (from `@ministryofjustice/hmpps-auth-clients`) and an `MPoPComponentsConfig`. `MPoPComponentsConfig` extends the `ApiConfig` type from `@ministryofjustice/hmpps-rest-client`, so `url`, `timeout` and `agent` are required for each API you configure:

```ts
import { AgentConfig } from '@ministryofjustice/hmpps-rest-client'
import { MPoPComponents } from '@ministryofjustice/hmpps-mpop-frontend-components-lib'
import type { MPoPComponentsConfig } from '@ministryofjustice/hmpps-mpop-frontend-components-lib'

// authenticationClient: an AuthenticationClient instance for your app (e.g. from @ministryofjustice/hmpps-auth-clients)
// logger: a bunyan Logger, or omit to default to `console`

const config: MPoPComponentsConfig = {
  // base ApiConfig (url, timeout, agent, etc.) used for the Tier API by default
  url: tierApiUrl,
  timeout: { response: 5000, deadline: 5000 },
  agent: new AgentConfig(5000),
  // optional overrides - fall back to the base config above if omitted
  masApiConfig: {
    url: masApiUrl,
    timeout: { response: 5000, deadline: 5000 },
    agent: new AgentConfig(5000),
  },
  supervisionPackageApiConfig: {
    url: supervisionPackageApiUrl,
    timeout: { response: 5000, deadline: 5000 },
    agent: new AgentConfig(5000),
  },
  prisonerSearchApiConfig: {
    url: prisonerSearchApiUrl,
    timeout: { response: 5000, deadline: 5000 },
    agent: new AgentConfig(5000),
  },
}

const mpopComponents = new MPoPComponents(authenticationClient, config, logger)
```

Set the `url` (and any other connection details) for each of these in your app's local config, pointing at the Tier, MAS, Supervision Package and Prisoner Search APIs for the environment you're running in.

### 5. Render a component

Fetch the data via `MPoPComponents`, then flatten it into the params the macro expects. `supervisionPackage` needs both the tier `calculation` (for `tierScore`/`tag`, from `getTierDetails`) and the flattened frontend context (`currentPhase`, `context`, `currentYear`, etc., from `getSupervisionPackageFrontendContext`), plus any extra fields such as `crn`, `historyHref` and `oasysReviewHref`:

```ts
// authOptions/crn: the auth token (or AuthOptions) and CRN for the person being viewed
const { calculation } = await mpopComponents.getTierDetails(authOptions, crn)
const supervisionPackageFrontendContext = await mpopComponents.getSupervisionPackageFrontendContext(authOptions, crn)

const supervisionPackageData = {
  crn,
  historyHref: `${tierHistoryUrl}/v3/case/${crn}`,
  oasysReviewHref: oasysReviewLink,
  ...(calculation ?? {}),
  ...(supervisionPackageFrontendContext ?? {}),
}
```

```njk
{% from "supervision-package/macro.njk" import supervisionPackage %}

{{ supervisionPackage(supervisionPackageData) }}
```

See `scripts/preview-api.ts` for a fuller example of building these params from the API responses.

### Person header

`personHeader` is made of two components, which can also be used on their own:

- `personHeaderBanner`, the blue section: photo, name, status tag, CRN, date of birth, tier and managed by
- `personHeaderRisks`, the grey section: risk badges, NDelius risk flags and the optional show/hide toggle

```njk
{% from "mpop/components/person-header/macro.njk" import personHeader %}

{{ personHeader({
  name: "Andrew Langley",
  crn: "D004851",
  dob: "18 November 1995",
  tier: "B4",
  historyHref: tierHistoryUrl,
  managedByName: "jack frost",
  managedByLocation: "Worksop Probation Office",
  managedByHref: staffContactsUrl,
  photo: photoUrl,
  riskData: riskData,
  roshLevel: "HIGH",
  personRiskFlags: riskBadgeData
}) }}
```

| Param | Description |
| --- | --- |
| `name`, `crn`, `dob` | Shown in the banner. `dob` should already be formatted. |
| `personStatusTag` | Optional status shown next to the name, e.g. `In custody`. |
| `tier`, `provisional`, `historyHref` | Tier link. `provisional: true` adds "(provisional)". |
| `managedByName`, `managedByLocation` | Responsible officer's name, formatted with `formatName`, and their location in brackets. |
| `managedBy` | Plain text used when there's no `managedByName`, e.g. `Unallocated`. |
| `managedByHref` | Optional. Makes managed by a link. |
| `photo` | Optional image URL. Nothing is shown when it's missing. |
| `riskBadges` | Optional pre-rendered risk badge HTML. Used instead of `riskData` when both are given. |
| `riskData` | ARNS risk data (from `ArnsComponents.getRiskData`). Renders the ROSH, combined serious reoffending predictor and RSR badges. Needs the ARNS lib, see [ARNS risk badges](#arns-risk-badges). |
| `roshLevel` | ROSH level for the ROSH badge, e.g. `HIGH` or `VERY_HIGH`. `NOT_FOUND` shows no ROSH badge. |
| `useNDeliusRosh` | Set to `true` when `roshLevel` comes from NDelius. The ROSH badge then shows even when the combined predictor is `NOT APPLICABLE`. |
| `personRiskFlags` | `{ headerBadges: [{ id, text, badgeClass }], remainingCount }`, or the badges grouped by severity as `{ groups: [{ badges: [...] }], remainingCount }`. `groups` is used when both are given. |
| `collapsibleRiskFlags` | Adds a show/hide toggle for the NDelius risk flags. Needs `initAll()` from `dist/js/all.js`. |
| `riskHrefBase` | Base URL for the risk flag links. Defaults to `/case/{crn}/risk`. |
| `showRisks` | Set to `false` to hide the grey section. Defaults to `true`. |

`personHeaderBanner` takes the banner params and `personHeaderRisks` takes the risk params, with the same names.

`toPersonHeaderParams` builds these params from the API responses:

```ts
import {
  getStatusTag,
  toPersonHeaderParams,
  toPersonRiskDetails,
} from '@ministryofjustice/hmpps-mpop-frontend-components-lib'

const { personRiskFlags } = await mpopComponents.getPersonRiskFlags(authOptions, crn)
const { professionalContact } = await mpopComponents.getContacts(authOptions, crn)
const { prisoner } = await mpopComponents.getPrisonerDetails(authOptions, noms)

const { riskBadgeData, rosh } = toPersonRiskDetails(personRiskFlags)

const personHeaderParams = toPersonHeaderParams({
  crn,
  name: personalDetails.name,
  dateOfBirth: personalDetails.dateOfBirth,
  tier: calculation,
  historyHref: tierHistoryUrl,
  professionalContact,
  riskBadgeData,
  personStatusTag: await getStatusTag(personalDetails, supervisionPackage, prisoner ?? undefined),
  photo: photoUrl,
  riskData,
  roshLevel: rosh.level,
  useNDeliusRosh: true,
})
```

`toPersonRiskDetails` also returns `personRisks` (with "RoSH" renamed to "ROSH"), `riskToStaff` and `riskToProbationStaff`. Pass `riskFlags` instead of `riskBadgeData` to have the badges built for you.

The managed by link goes to `/case/{crn}/personal-details/staff-contacts`. Pass `managedByHref` to point it elsewhere, e.g. at MPoP from another service.

To use the ARNS ROSH level instead of the NDelius one, pass `roshLevel: toRoshWidget(roshSummary).overallRisk` and leave out `useNDeliusRosh`.

#### ARNS risk badges

`personHeaderRiskBadges` renders the ROSH, combined serious reoffending predictor and RSR badges from `riskData`, `roshLevel` and `useNDeliusRosh`. `personHeaderRisks` and `personHeader` use it when `riskData` or `roshLevel` is given, so most services won't need to call it directly.

It uses the `predictorBadge` macro from `@ministryofjustice/hmpps-arns-frontend-components-lib`, an optional peer dependency. It's only needed if you show these badges:

```bash
npm install @ministryofjustice/hmpps-arns-frontend-components-lib
```

Add its templates to your Nunjucks paths and register its setup, alongside GOV.UK Frontend:

```ts
import { arnsNunjucksSetup } from '@ministryofjustice/hmpps-arns-frontend-components-lib'

const env = nunjucks.configure([
  'node_modules/@ministryofjustice/hmpps-mpop-frontend-components-lib/dist/mpop/components',
  'node_modules/@ministryofjustice/hmpps-arns-frontend-components-lib/dist/',
  'node_modules/govuk-frontend/dist',
  'app/views',
])
mpopNunjucksSetup(env)
arnsNunjucksSetup(env)
```

Import its styles too:

```scss
@import '@ministryofjustice/hmpps-arns-frontend-components-lib/dist/all';
```


## Viewing your changes

These `preview` and `preview-api` scripts are for developing this library itself (they're not part of the published package) - use them to render the components as HTML so you can see your changes in a browser as you work on them.

### preview

`preview` renders each component with static, hard-coded example data - no CRN, auth token or API access required. This is the quickest way to check a component's markup and styles while you're developing it.

Run:

```bash
npm run preview
```

This generates `preview/index.html`. Open the file directly in your browser, e.g.:

```bash
open preview/index.html
```

By default `preview` renders every component. To only render specific sections, set `COMPONENT` (comma-separated) to one or more of `pop-header`, `person-header`, `supervision-package`, `supervision-package-summary`:

```bash
COMPONENT=supervision-package npm run preview
COMPONENT=pop-header,person-header npm run preview
```

### preview-api

`preview-api` renders the components using real data fetched from the upstream APIs (tier, MAS, supervision packages) for the CRN you provide, so it's useful for checking how components look with real-world data.

Before running it, copy `.env.example` to `.env` and set:

- `CRN` - the CRN of the PoP to fetch data for

You also need an auth token to call these APIs - this is fetched for you automatically via `scripts/get-auth-token.sh` (not set in `.env`), which requires `kubectl` access to the relevant namespace and `jq` to be installed locally.

Run:

```bash
npm run preview:api
```

You can also set `CRN` and `ENVIRONMENT` inline instead of (or as well as) using `.env` - `ENVIRONMENT` selects which environment's APIs to call (`dev`, `preprod` or `prod`; defaults to `dev`):

```bash
CRN={{CRN}} ENVIRONMENT=dev npm run preview:api
```

This generates `preview/index-api.html`. Open the file directly in your browser, e.g.:

```bash
open preview/index-api.html
```

## Releasing

This package is published to npm using GitHub Releases and npm Trusted Publishing.

You can view the npm page for this package here https://www.npmjs.com/package/@ministryofjustice/hmpps-mpop-frontend-components-lib

### Pre-requisites

- Ensure GitHub CLI (gh) is installed and authenticated

   ```bash
   gh auth status || gh auth login
   ```

### Release process

1. Create a unique branch name from the latest `main` and update the package version, such as:

   ```bash
   git checkout main
   git pull
   git checkout -b chore/bump-package-version-<version>

   npm version patch --no-git-tag-version
   ```

   Alternatively:

   ```bash
   npm version minor --no-git-tag-version
   npm version major --no-git-tag-version
   ```

2. Commit the version change:

   ```bash
   git add package.json package-lock.json
   git commit -m "Bump package version"
   git push -u origin HEAD
   ```
3. Raise a pull request and merge it into `main`.

4. Ensure your local `main` is up to date, then create a draft GitHub release for the version:

   ```bash
   git checkout main
   git pull

   VERSION=$(node -p "require('./package.json').version")

   gh release create "v$VERSION" \
     --target main \
     --title "v$VERSION" \
     --generate-notes \
     --draft
   ```

5. Publish the GitHub release (i.e. mark it as not a draft) to trigger the publish workflow and publish the package to npm.

   This can be done by navigating to the [releases page](https://github.com/ministryofjustice/hmpps-mpop-frontend-components-lib/releases),
   selecting the pencil icon in the top right corner of the release, and confirming the release by clicking "Publish release".

### Notes

- The GitHub release tag should be `v<version>`, where `<version>` matches the version in `package.json`.
- The package version must be greater than the latest version published to npm.
- Publishing uses npm Trusted Publishing via GitHub Actions and does not require an npm token.
- If the version already exists on npm, the publish workflow will skip publishing.
