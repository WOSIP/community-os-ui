1.  **Modify `src/pages/Home.tsx`**:
    *   Locate the "Pourquoi nous rejoindre ?" section.
    *   Increase the visibility of the numbers (01, 02, etc.) for mobile views.
    *   Change the class `text-orange-500/20` to `text-orange-500/60` (or similar high visibility) for mobile, and maintain a more subtle `md:text-orange-500/20` for larger screens if appropriate.

2.  **Modify `src/pages/Why.tsx`**:
    *   Locate the numbered list of reasons.
    *   Apply a similar visibility improvement to the numbers.
    *   Change `opacity-20` to `opacity-60 md:opacity-20`.

3.  **Validate**:
    *   Run `validate_build` to ensure no syntax errors.