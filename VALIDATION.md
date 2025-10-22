# Token Validation

This repository uses multiple layers of validation to ensure token quality and consistency.

## Validation Tools

### 1. Terrazzo (DTCG Validation)
Validates tokens against the [W3C Design Tokens Community Group (DTCG) specification](https://tr.designtokens.org/).

```bash
npm run validate:dtcg
```

**What it checks:**
- ✅ Valid DTCG format (`$value`, `$type` fields)
- ✅ Correct token value types (colors, dimensions, typography)
- ✅ Proper unit formats (`px`, `rem`, `em`)
- ✅ Reference syntax (`{token.name}`)

### 2. Custom Token Validation
Our own validation script for project-specific rules.

```bash
npm run validate:tokens
```

**What it checks:**
- ✅ Files exist and are valid JSON
- ✅ Token structure integrity
- ✅ Broken references (tokens referencing non-existent tokens)
- ✅ Missing required fields

### 3. Build Verification
Ensures Style Dictionary can successfully transform tokens.

```bash
npm run validate:build
# or
npm run build-tokens
```

**What it checks:**
- ✅ Style Dictionary config is valid
- ✅ All transforms work correctly
- ✅ Output files generate successfully

## Running All Validations

```bash
npm test
```

This runs all three validation layers in sequence.

## CI/CD Integration

### Pull Request Checks
Every PR automatically runs:
1. Custom token validation
2. DTCG validation (Terrazzo)
3. Build verification
4. Check for uncommitted build output

See `.github/workflows/validate-pr.yml` for details.

### Figma Sync Validation
When tokens are synced from Figma, validation runs automatically:
- Catches malformed tokens before creating PR
- Displays validation warnings in PR description

See `.github/workflows/sync-figma-tokens.yml` for details.

## Common Validation Errors

### Invalid dimension format
```json
{
  "spacing-06": {
    "$value": "[object Object]px", // ❌ Invalid
    "$type": "dimension"
  }
}
```

**Fix:** Update Figma sync script to properly serialize values.

### Broken reference
```json
{
  "button": {
    "background": {
      "$value": "{color.nonexistent}", // ❌ References missing token
      "$type": "color"
    }
  }
}
```

**Fix:** Either create the referenced token or update the reference.

### Missing required field
```json
{
  "button": {
    "background": {
      "$value": "#ff0000"
      // ❌ Missing $type field
    }
  }
}
```

**Fix:** Add `"$type": "color"` to the token.

## Local Development

Before committing changes:

```bash
# Validate everything
npm test

# Or validate individually
npm run validate:tokens
npm run validate:dtcg
npm run build-tokens
```

## Configuration Files

- `terrazzo.config.mjs` - Terrazzo validator configuration
- `scripts/validate-tokens.js` - Custom validation logic
- `style-dictionary.config.mjs` - Build configuration
- `.github/workflows/validate-pr.yml` - CI validation workflow
