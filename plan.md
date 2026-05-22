# Restoration of Application Form and Localization Fixes

The goal is to fully restore the high-fidelity application form on the "demand entry" page (`Application.tsx`) and ensure all languages are correctly adjusted and rendered.

## Phase 1: Application Form Implementation
1.  Update `src/pages/Application.tsx` to include a multi-step form.
2.  Use `react-hook-form` and `zod` for form management and validation.
3.  Integrate `shadcn/ui` components (Input, Select, Button, Label, Progress, etc.).
4.  Map all form labels, placeholders, and step titles to the `application` keys in `en.json` and `fr.json`.
5.  Implement step navigation (Next/Back) with progress indication.

## Phase 2: Localization Consistency
1.  Verify all translation keys in `src/locales/en.json` and `src/locales/fr.json` for the `application` section.
2.  Ensure the `<highlight>` tag is correctly used for the title.
3.  Add any missing translations for form validation messages or success states if necessary.

## Phase 3: Validation
1.  Run `validate_build` to ensure zero errors.
2.  Verify the form is fully functional and localized in both English and French.
