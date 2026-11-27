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
  personRecordApiConfig: {
    url: personRecordApiUrl,
    timeout: { response: 5000, deadline: 5000 },
    agent: new AgentConfig(5000),
  },
  eSupervisionApiConfig: {
    url: eSupervisionApiUrl,
    timeout: { response: 10000, deadline: 10000 },
    agent: new AgentConfig(10000),
  },
}

const mpopComponents = new MPoPComponents(authenticationClient, config, logger)
```

Set the `url` (and any other connection details) for each of these in your app's local config, pointing at the Tier, MAS, Supervision Package, Prisoner Search, Person Record and eSupervision APIs for the environment you're running in.

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
  dob: "1995-11-18",
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
| `name`, `crn`, `dob` | Shown in the banner. `dob` is an ISO date, e.g. `1995-11-18`, and is shown as `18 November 1995`. |
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
| `personRiskFlags` | `{ headerBadges: [{ id, text, badgeClass }], remainingCount }`, as returned by `getRiskBadges`. The older `{ groups: [{ badges: [...] }], remainingCount }` format is deprecated but still works, and is used when both are given. |
| `collapsibleRiskFlags` | Adds a show/hide toggle for the NDelius risk flags. Needs `initAll()` from `dist/js/all.js`. |
| `riskHrefBase` | Base URL for the risk flag links. Defaults to `/case/{crn}/risk`. |
| `showRisks` | Set to `false` to hide the grey section. Defaults to `true`. |
| `errors` | Optional. Shows the [person header errors](#person-header-errors) above the header. |

`personHeaderBanner` takes the banner params and `personHeaderRisks` takes the risk params, with the same names.

`toPersonHeaderParams` builds these params from the API responses. `mpopNunjucksSetup` registers it as a Nunjucks global, so you can call it in a template or in your code:

```ts
import { toPersonHeaderParams, toPersonRiskDetails } from '@ministryofjustice/hmpps-mpop-frontend-components-lib'

const { personRiskFlags } = await mpopComponents.getPersonRiskFlags(authOptions, crn)
const { professionalContact } = await mpopComponents.getContacts(authOptions, crn)
const { supervisionPackage, unavailable } = await mpopComponents.getSupervisionPackageContext(authOptions, crn)
const { personStatusTag, statusUnavailable } = await mpopComponents.getPersonHeaderStatus(authOptions, {
  personalDetails,
  supervisionPackage,
  supervisionPackageUnavailable: unavailable,
})
const { photo, photoUnavailable } = await mpopComponents.getPersonHeaderPhoto(authOptions, { crn, noms })

const { riskBadgeData, rosh } = toPersonRiskDetails(personRiskFlags)

const personHeaderParams = toPersonHeaderParams({
  crn,
  name: personalDetails.name,
  dateOfBirth: personalDetails.dateOfBirth,
  tier: calculation,
  tierUrl,
  professionalContact,
  riskBadgeData,
  personStatusTag,
  photo,
  riskData,
  roshLevel: rosh.level,
  useNDeliusRosh: true,
  errors: { statusUnavailable, photoUnavailable },
})
```

`getSupervisionPackageContext` returns `unavailable: true` when the Supervision Package API fails or returns an error. A person with no supervision package isn't treated as unavailable.

`getPersonHeaderStatus` gets the prisoner from Prisoner Search when `personalDetails.noms` is set, then works out the status tag with `getStatusTag`. It also returns `prisoner`, and `prisonerUnavailable` when Prisoner Search fails. `statusUnavailable` is `true` when there's no status and the supervision package is unavailable.

`getStatusTag` shows `Deceased` from `personalDetails.dateOfDeath`. The `getPersonalDetails` summary doesn't include it, so pass your app's own personal details.

`photo` is the online check-in photo if there is one, otherwise the prison photo from a route in your app. `getPersonHeaderPhoto` gets it in that order and tells you when it is unavailable:

```ts
const { photo, photoUnavailable, hasPrisonPhoto } = await mpopComponents.getPersonHeaderPhoto(authOptions, {
  crn,
  noms,
  hasPrisonPhoto: cachedHasPrisonPhoto,
})
```

| Option | Description |
| --- | --- |
| `crn`, `noms` | The check-in photo is looked up by CRN, and the prison photo by NOMS number. |
| `prisonPhotoHref` | Builds the path of your app's prison photo route. Defaults to `personPhotoHref`, which gives `/person-photo/{noms}`. |
| `includeCheckInPhoto` | `false` skips the check-in photo. Defaults to `true`. |
| `checkInPhoto` | A `checkInPhoto` returned earlier in the same request, so it isn't looked up again. The URL expires, so don't keep it between requests. |
| `hasPrisonPhoto` | A `hasPrisonPhoto` you cached earlier, so the prison photo isn't checked again. |

`photoUnavailable` is `true` when there is no photo and either lookup failed. `hasPrisonPhoto` is only returned when the prison photo was checked successfully, so cache it when it is set.

To build the src yourself, `toPersonPhotoSrc` applies the same order, using `getCheckInPhotoUrl` and `hasPersonPhoto`.

Add the prison photo route at `PERSON_PHOTO_PATH` (`/person-photo/:nomsNumber`). `sendPersonPhoto` streams the image, cached for a day, or returns a 404 when there's no photo:

```ts
import { PERSON_PHOTO_PATH } from '@ministryofjustice/hmpps-mpop-frontend-components-lib'

router.get(PERSON_PHOTO_PATH, async (req, res) => {
  await mpopComponents.sendPersonPhoto(authOptions, req.params.nomsNumber, res)
})
```

To handle the image yourself, `getPersonPhoto` returns `photo` as a stream, or `null` when there's no photo or the API returns 403.

`toPersonRiskDetails` also returns `personRisks` (with "RoSH" renamed to "ROSH"), `riskToStaff` and `riskToProbationStaff`. Pass `riskFlags` instead of `riskBadgeData` to have the badges built for you.

`tierUrl` is the Tier service's base URL. The tier links to `tierUrlV3(tierUrl, crn)`, which is `{tierUrl}/v3/case/{crn}`. Pass `historyHref` instead to set the link yourself.

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

### Person header errors

`personHeaderErrors` shows a "There is a problem" alert listing what couldn't be loaded. It needs the MoJ Frontend templates on your Nunjucks path. Nothing is shown when nothing is unavailable. Pass these params as `errors` to `personHeader` to show the alert above the header, or call it on its own:

```njk
{% from "mpop/components/person-header-errors/macro.njk" import personHeaderErrors %}

{{ personHeaderErrors({
  statusUnavailable: true,
  photoUnavailable: true,
  throughcareUnavailable: 'some',
  arnsUnavailable: false
}) }}
```

| Param | Message |
| --- | --- |
| `arnsUnavailable` | Risk information from the ARNS service is currently unavailable. |
| `photoUnavailable` | Photo is currently unavailable. |
| `statusUnavailable` | Status information is currently unavailable. |
| `throughcareUnavailable: 'some'` | Some throughcare information is currently unavailable. |
| `throughcareUnavailable: 'all'` | Throughcare information is currently unavailable. |

The messages are shown in this order.


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
