# Understanding `npm run sync` Output

**Last Updated:** October 22, 2025

---

## Command Structure

```bash
npm run sync
  ├─ npm run fetch-all
  │   ├─ npm run fetch-tokens    # Fetch Figma Variables
  │   └─ npm run fetch-styles    # Fetch Figma Styles
  └─ npm run build-tokens        # Build all output formats
```

---

## Output Walkthrough

### Phase 1: Fetch Variables

```
🚀 Starting Figma token sync...
🔄 Fetching variables from 1 Figma file(s)...
   ✅ Fetched: HRJIjk1pZtxRKlPabHqBaI

📦 Processing collection: [collection names]
```

This fetches all variables from Figma and processes each collection.

**Expected Warning:**
```
⚠️  Warning: Unresolved variable alias VariableID:...
```
This is the `spacing-06` token that references a deleted variable. It's automatically removed during build.

**Statistics:**
```
📊 Token Statistics:
   Total tokens: 232
   Colors: 137
   Dimensions: 88
   Strings: 7
   References: 81
```

### Phase 2: Fetch Styles

```
🚀 Starting Figma styles sync...
🔄 Fetching styles from 1 Figma file(s)...
   ✅ Fetched styles metadata: HRJIjk1pZtxRKlPabHqBaI

📦 Processing 22 styles...
   Text: 17
   Effect: 3
   Grid: 2
```

This fetches text styles, effects (shadows/blurs), and grid definitions.

### Phase 3: Build All Formats

```
> style-dictionary build --config style-dictionary.config.mjs
```

Style Dictionary processes tokens and outputs:
- JSON (nested and flat)
- JavaScript (ES6 and module)
- TypeScript definitions
- CSS variables
- CSS style classes
- SCSS variables and mixins

**Build Status:**
```
json
✔︎ build/json/tokens.json
✔︎ build/json/tokens-flat.json

js
✔︎ build/js/tokens.js
✔︎ build/js/tokens.module.js

ts
✔︎ build/js/tokens.d.ts

css
✔︎ build/css/variables.css
✔︎ build/css/styles.css

scss
✔︎ build/scss/_variables.scss
✔︎ build/scss/_mixins.scss
```

---

## Expected Warnings (Safe to Ignore)

### 1. Token Collisions (5)

```
Token collisions detected (5):
Use log.verbosity "verbose" or use CLI option --verbose for more details.
```

**What:** Metadata collisions from merging `figma-variables.json` and `figma-styles.json`
**Impact:** None - metadata is for documentation only
**Fix:** Not needed (harmless)

To see details:
```bash
npm run build-tokens -- --verbose
```

### 2. Broken Token Removed

```
⚠️  Removing broken token: spacing-06 (unresolved reference)
```

**What:** The `spacing-06` token references a deleted Figma variable
**Impact:** None - automatically excluded from build
**Fix:** Delete `spacing-06` variable in Figma (or ignore)

### 3. CSS Font Shorthand Properties (17 tokens)

```
Unknown CSS Font Shorthand properties found for 17 tokens
```

**What:** Typography tokens have more detail than CSS font shorthand supports
**Impact:** None - custom CSS formats output individual properties correctly
**Fix:** Not needed (custom formats work perfectly)

Example - this works fine:
```css
.text-fixed-body-medium {
  font-family: "Seed Sans";
  font-size: 16px;
  font-weight: 350;
  letter-spacing: -0.16px;  ← Not in CSS shorthand, but works!
  line-height: 140%;
}
```

---

## What Changed (October 22, 2025)

### Removed
- ❌ "Tips" sections from fetch scripts
- ❌ Token name collision warnings (radius duplicates filtered out)

### Added
- ✅ Filter for deprecated radius tokens (prevents collisions)
- ✅ Documentation: `DUPLICATE-TOKENS.md`
- ✅ This guide

---

## Common Issues

### "I see warnings but all builds succeeded"

✅ **This is normal.** The warnings are informational and don't affect functionality.

### "Should I fix the spacing-06 token?"

🔶 **Optional.** It's automatically excluded, so it doesn't break anything. You can delete it in Figma if you want to clean up the warning.

### "What about the CSS Font Shorthand warning?"

✅ **Ignore it.** Your custom CSS formats output all properties correctly. This warning just means Style Dictionary's built-in `font` shorthand can't represent all the properties.

### "I want to see what the metadata collisions are"

Run with verbose mode:
```bash
npm run build-tokens -- --verbose
```

---

## Quick Reference

**Full sync:**
```bash
npm run sync
```

**Just fetch from Figma (no build):**
```bash
npm run fetch-all
```

**Just build (no fetch):**
```bash
npm run build-tokens
```

**Verbose output:**
```bash
npm run build-tokens -- --verbose
```

**Validate tokens:**
```bash
npm run validate
```

**Check naming issues:**
```bash
node scripts/analyze-naming.js
```

---

## Related Documentation

- **DUPLICATE-TOKENS.md** - Explanation of radius token duplicates
- **NAMING-ISSUES-REPORT.md** - Full naming analysis
- **TRANSFORM-PATCH-README.md** - JSON key cleaning patch
- **SEED-NAMING-STANDARD.md** - Naming conventions
