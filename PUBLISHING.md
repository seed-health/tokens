# Publishing to NPM

## Setup (one time)

1. Generate an NPM automation token at https://www.npmjs.com/settings/tokens with access to `@seed-health` org
2. Add it to GitHub secrets at https://github.com/seed-health/tokens/settings/secrets/actions
   - Name: `NPM_TOKEN`
   - Value: your token

## Publishing

1. Commit and push your changes to `main`
2. Go to https://github.com/seed-health/tokens/actions
3. Click "Publish to NPM" → "Run workflow"

The workflow will:
- Auto-increment patch version (1.0.0 → 1.0.1)
- Build tokens
- Publish to NPM
- Create a GitHub release

## Versioning

By default, the workflow bumps the patch version. For minor or major releases, manually edit the version in `package.json` before running the workflow:

- Minor (new features): `1.0.0` → `1.1.0`
- Major (breaking changes): `1.0.0` → `2.0.0`

The workflow will still increment the patch, so set it to `.0` (e.g., `1.1.0` becomes `1.1.1`).

## What gets published

Only the `build/` directory, `package.json`, and `README.md`. Everything else is excluded via `.npmignore`.
