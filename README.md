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

### Notes

- The GitHub release tag should be `v<version>`, where `<version>` matches the version in `package.json`.
- The package version must be greater than the latest version published to npm.
- Publishing uses npm Trusted Publishing via GitHub Actions and does not require an npm token.
- If the version already exists on npm, the publish workflow will skip publishing.
