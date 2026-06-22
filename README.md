# hmpps-mpop-frontend-components-lib
MPoP front-end library

## Releasing

This package is published to npm using GitHub Releases and npm Trusted Publishing.

### Release process

1. Update the package version:

   ```bash
   npm version patch --no-git-tag-version
   ```

   Alternatively:

   ```bash
   npm version minor --no-git-tag-version
   npm version major --no-git-tag-version
   ```

2. Commit the version change:

   ```bash
   git checkout main
   git pull
   git checkout -b chore/bump-package-version
   git add package.json package-lock.json
   git commit -m "Bump package version"
   git push -u origin HEAD
   ```

3. Raise a pull request and merge it into `main`.

4. Create a GitHub release for the version:

   ```bash
   VERSION=$(node -p "require('./package.json').version")

   gh release create "v$VERSION" \
     --target main \
     --title "v$VERSION" \
     --generate-notes
   ```

5. Publishing the GitHub release (i.e. not a draft) triggers the publish workflow and publishes the package to npm.

### Notes

- The GitHub release tag should be `v<version>`, where `<version>` matches the version in `package.json`.
- The package version must be greater than the latest version published to npm.
- Publishing uses npm Trusted Publishing via GitHub Actions and does not require an npm token.
- If the version already exists on npm, the publish workflow will skip publishing.
