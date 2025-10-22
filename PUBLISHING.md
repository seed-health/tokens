# Publishing @seed-health/tokens to NPM

**Package:** `@seed-health/tokens`
**Registry:** https://www.npmjs.com/package/@seed-health/tokens
**Automation:** GitHub Actions (manual trigger)

---

## One-Time Setup

### 1. Generate NPM Access Token

You need an NPM token with permission to publish to the `@seed-health` organization.

**Steps:**

1. Log in to NPM: https://www.npmjs.com/login
2. Click your profile → "Access Tokens"
3. Click "Generate New Token" → **"Automation"** type
4. **Scope:** Make sure it has access to `@seed-health` org
5. Copy the token (starts with `npm_...`)

### 2. Add Token to GitHub Secrets

1. Go to: https://github.com/seed-health/tokens/settings/secrets/actions
2. Click **"New repository secret"**
3. **Name:** `NPM_TOKEN`
4. **Value:** Paste your NPM token
5. Click **"Add secret"**

**That's it!** This is the only manual setup required.

---

## How to Publish

### Quick Steps

1. **Ensure changes are committed and pushed to `main`**
   ```bash
   git add .
   git commit -m "Update tokens"
   git push
   ```

2. **Go to GitHub Actions**
   - Navigate to: https://github.com/seed-health/tokens/actions
   - Click on **"Publish to NPM"** workflow (left sidebar)

3. **Run the workflow**
   - Click **"Run workflow"** dropdown (top right)
   - Leave branch as `main`
   - Click green **"Run workflow"** button

4. **Wait ~1 minute**
   - Workflow will auto-increment version (e.g., 1.0.0 → 1.0.1)
   - Builds tokens with Style Dictionary
   - Publishes to NPM
   - Creates GitHub Release

5. **Done!**
   - Package is live: `npm install @seed-health/tokens@[new-version]`

---

## What Happens During Publish

### Automatic Steps

1. ✅ **Checkout code** from `main` branch
2. ✅ **Read current version** from `package.json` (e.g., `1.0.0`)
3. ✅ **Auto-increment patch** version (e.g., `1.0.0` → `1.0.1`)
4. ✅ **Update `package.json`** with new version
5. ✅ **Build tokens** via `npm run build-tokens`
6. ✅ **Publish to NPM** as `@seed-health/tokens@1.0.1`
7. ✅ **Commit version bump** back to Git
8. ✅ **Create Git tag** `v1.0.1`
9. ✅ **Create GitHub Release** with changelog

### What Gets Published

Only these files are included in the NPM package:

```
@seed-health/tokens/
├── build/
│   ├── css/
│   ├── scss/
│   ├── js/
│   └── json/
├── package.json
└── README.md
```

**Excluded from package:**
- Source files (`tokens/`, `scripts/`)
- GitHub workflows (`.github/`)
- Documentation (all `.md` files except README)
- Environment files (`.env`)

See `.npmignore` for full exclusion list.

---

## Version Management

### Auto-Increment (Default)

The workflow **automatically increments the patch version**:

- `1.0.0` → `1.0.1` (first publish)
- `1.0.1` → `1.0.2` (second publish)
- `1.0.2` → `1.0.3` (third publish)

This is perfect for regular token updates.

### Manual Version Changes

For **major** or **minor** version bumps, manually edit `package.json` before publishing:

**Minor version (new features, no breaking changes):**
```json
{
  "version": "1.1.0"  // Changed from 1.0.x
}
```

**Major version (breaking changes):**
```json
{
  "version": "2.0.0"  // Changed from 1.x.x
}
```

Then commit, push, and run the workflow. It will increment the patch: `1.1.0` → `1.1.1` or `2.0.0` → `2.0.1`.

---

## Typical Workflow

### Regular Token Updates

```bash
# 1. Update tokens in Figma
# 2. Sync tokens locally or via GitHub Action
npm run sync

# 3. Test the changes
npm run validate

# 4. Commit and push
git add .
git commit -m "Update color tokens for new brand palette"
git push

# 5. Publish via GitHub Actions
# Go to Actions → Publish to NPM → Run workflow
```

### After Publishing

**Consumers update:**
```bash
npm install @seed-health/tokens@latest
```

**Or pin to specific version:**
```bash
npm install @seed-health/tokens@1.0.5
```

---

## Troubleshooting

### "npm ERR! 403 Forbidden"

**Problem:** NPM token doesn't have permission to publish to `@seed-health` org.

**Fix:**
1. Verify you're a member of `@seed-health` org on NPM
2. Generate a new token with org access
3. Update `NPM_TOKEN` secret in GitHub

### "Error: Version 1.0.1 already published"

**Problem:** Trying to publish a version that already exists on NPM.

**Fix:** This shouldn't happen with auto-increment. If it does, manually bump version in `package.json` to skip ahead.

### "Build failed"

**Problem:** Style Dictionary build errors (likely broken token references).

**Fix:**
1. Run `npm run build-tokens` locally to see errors
2. Fix broken tokens
3. Commit and try again

### Workflow doesn't appear

**Problem:** Can't find "Publish to NPM" workflow in Actions.

**Fix:**
1. Ensure `.github/workflows/publish-npm.yml` exists
2. Push to `main` branch
3. Refresh GitHub Actions page

---

## Package Usage Examples

After publishing, consumers can use tokens like this:

### CSS

```css
@import '@seed-health/tokens/build/css/variables.css';

.button {
  background: var(--color-primary-seed-green);
  padding: var(--spacing-base);
  border-radius: var(--radius-medium);
}
```

### JavaScript/React

```javascript
import tokens from '@seed-health/tokens/build/json/tokens.json';

const Button = () => (
  <button style={{
    background: tokens.color.primary.seedGreen,
    padding: tokens.spacing.base,
  }}>
    Click me
  </button>
);
```

### SCSS

```scss
@import '@seed-health/tokens/build/scss/variables';
@import '@seed-health/tokens/build/scss/mixins';

.heading {
  @include text-fixed-title-large;
  color: $color-primary-seed-green;
}
```

### TypeScript

```typescript
import { ColorPrimarySeedGreen, SpacingBase } from '@seed-health/tokens/build/js/tokens';

const styles = {
  color: ColorPrimarySeedGreen,
  padding: SpacingBase,
};
```

---

## Security Notes

- ✅ **NPM_TOKEN** is stored as a GitHub secret (encrypted)
- ✅ **Manual trigger only** - can't accidentally publish
- ✅ **Builds fresh tokens** before publishing
- ✅ **No source code published** - only compiled outputs
- ✅ **Version bumps committed** - full audit trail

---

## Related Documentation

- **README.md** - Package usage guide
- **SYNC-OUTPUT-EXPLAINED.md** - Understanding sync process
- **TRANSFORM-PATCH-README.md** - JSON key cleaning

---

## Quick Reference

| Task | Command/Link |
|------|--------------|
| **Publish to NPM** | [Run workflow](https://github.com/seed-health/tokens/actions/workflows/publish-npm.yml) |
| **View package** | https://www.npmjs.com/package/@seed-health/tokens |
| **View releases** | https://github.com/seed-health/tokens/releases |
| **Update NPM token** | https://github.com/seed-health/tokens/settings/secrets/actions |

---

**Last Updated:** October 22, 2025
