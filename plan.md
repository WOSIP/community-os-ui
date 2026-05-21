# Fix Localization Issues

The goal is to fix the language display issues across the application. There seems to be a redundancy or mismatch between `src/locales/*.json` and `src/locales/*/translation.json`.

## Phase 1: Audit and Cleanup
1. Inspect `src/lib/i18n.ts` to determine the current configuration and which translation files are being loaded.
2. Compare the content of `src/locales/en.json` vs `src/locales/en/translation.json` (and same for French).
3. Consolidate translations into a single structure (preferably `src/locales/{{lng}}/translation.json` if using common i18next patterns, or just `src/locales/{{lng}}.json`).

## Phase 2: Configuration Fixes
1. Standardize `src/lib/i18n.ts` to use the chosen structure.
2. Ensure `lng` is correctly initialized (e.g., from localStorage if available, otherwise default).
3. Verify that `useTranslation` is used correctly in components.

## Phase 3: Component Verification
1. Check `Navbar.tsx` to ensure the language switcher works and correctly updates the state/i18n instance.
2. Verify that all hardcoded strings in pages are actually replaced by `t()` calls.
3. Ensure that the language change persists or at least updates the entire UI immediately.

## Phase 4: Validation
1. Run `validate_build`.
2. Manual verification (mental check) of the language switcher logic.
