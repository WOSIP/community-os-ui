## Plan for Multi-Language Support

**Objective:** Implement multi-language support for the web portal, starting with English and French.

**Key Libraries:**
- `react-i18next`
- `i18next`

**Implementation Steps:**

1.  **Install Dependencies:**
    *   Add `i18next` and `react-i18next` to `package.json`.

2.  **Configure i18n:**
    *   Create a new file `src/lib/i18n.ts`.
    *   Initialize `i18next` with the following configurations:
        *   `fallbackLng: 'fr'` (or a default French if applicable).
        *   `lng: 'fr'` (initial language).
        *   `resources`: Load translations from JSON files.
        *   `interpolation: { escapeValue: false }` to prevent needing to escape values.
        *   `supportedLngs: ['en', 'fr']`.

3.  **Create Translation Files:**
    *   Create a `src/locales/` directory.
    *   Inside `src/locales/`, create:
        *   `en.json`: English translations.
        *   `fr.json`: French translations.
    *   Populate these files with key-value pairs for all user-facing text from existing components. This will require careful review of all `.tsx` files.

4.  **Integrate i18n Provider:**
    *   Modify `src/App.tsx`.
    *   Wrap the main application content with `I18nextProvider` from `react-i18next`.
    *   Pass the initialized `i18n` instance to the provider.

5.  **Update Components:**
    *   For each component with user-facing text:
        *   Import `useTranslation` from `react-i18next`.
        *   Call `const { t } = useTranslation();` at the beginning of the component function.
        *   Replace all hardcoded strings with `t('translation.key')`. For example, replace `"Welcome"` with `{t('welcomeMessage')}`.
        *   Ensure all text in `src/pages/Home.tsx`, `src/components/layout/Navbar.tsx`, and other relevant pages/components are translated.

6.  **Add Language Switcher:**
    *   Modify `src/components/layout/Navbar.tsx` (or another suitable location).
    *   Implement a UI element (e.g., a dropdown or buttons) that allows users to change the language.
    *   Use the `i18n.changeLanguage('en')` or `i18n.changeLanguage('fr')` functions to update the current language.

7.  **Preserve Existing Functionality:**
    *   Ensure no changes are made to the backend logic, Supabase functions, or existing API integrations.
    *   Maintain all existing styling and component structures.

**Verification:**
- Test language switching thoroughly.
- Verify all text elements display correctly in both English and French.
- Ensure no UI breaks or functionality issues are introduced.
