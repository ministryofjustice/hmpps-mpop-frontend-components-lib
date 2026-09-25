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
}

const mpopComponents = new MPoPComponents(authenticationClient, config, logger)
```

Set the `url` (and any other connection details) for each of these in your app's local config, pointing at the Tier, MAS and Supervision Package APIs for the environment you're running in.

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

### preview-api

`preview-api` renders the components using real data fetched from the upstream APIs (tier, MAS, supervision packages) for the CRN you provide, so it's useful for checking how components look with real-world data.

Before running it, copy `.env.example` to `.env` and set:

- `CRN` - the CRN of the PoP to fetch data for

You also need an auth token to call these APIs - this is fetched for you automatically via `scripts/get-auth-token.sh` (not set in `.env`), which requires `kubectl` access to the relevant namespace and `jq` to be installed locally.

Run:

```bash
npm run preview:api
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
