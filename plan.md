# Implementation Plan - Multi-language Support (i18n) & Content Updates

This plan outlines the steps to add English language support and update content on the Helloopass web portal.

## 1. Environment Setup (COMPLETED)
- Install required packages: `i18next`, `react-i18next`, `i18next-browser-languagedetector`.

## 2. Configuration (COMPLETED)
- Create locale files: `src/locales/fr/translation.json` and `src/locales/en/translation.json`.
- Initialize i18next in `src/lib/i18n.ts`.
- Import `src/lib/i18n.ts` in `src/main.tsx`.

## 3. Content Updates
### Country Count Adjustment
- Update `src/locales/en/translation.json` and `src/locales/fr/translation.json`:
  - Change "238" to "183" in `stats.countries.value`.
  - Change "238" to "183" in `stats.countries.desc`.
  - Change "238" to "183" in `cta.stats_value`.

### Localization Fixes (Concept Page)
- Update `src/pages/Why.tsx`:
  - Ensure the hero title uses proper translation keys and safe React components.
  - Fix any potential "Minified React error #137" related to `<Trans>` component usage with void elements like `<br />`.
  - Ensure all sections use `t()` or `<Trans>` correctly.

## 4. UI Implementation
### Standardize Localization
- Ensure consistent use of `useTranslation` across all pages.
- Verify that language switching in `Navbar.tsx` updates all components immediately.

## 5. Verification
- Run `validate_build` to ensure no TypeScript or runtime errors.
- Test language switching functionality.
- Verify the country count is updated on the landing page in both languages.
