# Milestones: Field Regex Verification, Dynamic Amount Editing & Mobile 3-Dots Menu

## Milestone 1: Dynamic Amount Recalculation & Auto-Custom Toggle Removal
- **Recommended Model:** `Gemini 3.7 Flash (High)`
  - *Rationale:* Core business calculation logic and reactive form state handling across multiple files (`ItemsSection.jsx`, `calculator.js`, `invoice.js`).
- **Files Table:**
  | File | Action |
  |---|---|
  | `src/types/invoice.js` | MODIFY |
  | `src/utils/calculator.js` | MODIFY |
  | `src/components/InvoiceForm/ItemsSection.jsx` | MODIFY |
- **Key Implementation Details:**
  - Remove `isManualAmount` property from `createEmptyItem` and `SAMPLE_INVOICE`.
  - In `ItemsSection.jsx`, remove the `toggleManualAmount` function and the `⚡ Auto` / `✏️ Custom` badge button.
  - In `ItemsSection.jsx`, make amount input non-readonly at all times with standard editable styling.
  - On `colsDbs` or `rate` input change, clean comma separators and auto-calculate `current.amount = (Math.round(qty * rate * 100) / 100).toString()`.
  - On direct `amount` input change, record the user's custom string directly.
  - In `calculator.js`, parse `item.amount` after stripping commas (`cleanNumericString`), falling back to `qty * rate` if empty.
- **Gate ✅:**
  - [x] Entering Qty `10` and Rate `5000` automatically updates Amount to `50000.00`.
  - [x] Entering Rate with comma `28,000` and Qty `2` updates Amount to `56000.00` without NaN.
  - [x] Amount input can be directly clicked and edited anytime (e.g. typing `60000`).
  - [x] Invoice Pad preview and Tax Totals immediately update to reflect custom amount.
  - [x] No `⚡ Auto` / `✏️ Custom` button is displayed anywhere in the line item row.
  - [x] Quantity, Rate, and Amount fields restrict input to digits, decimal/comma separators, or `-`.

---

## Milestone 2: Mobile 3-Dots Menu for Phone Viewport
- **Recommended Model:** `Gemini 3.7 Flash (High)`
  - *Rationale:* Responsive UI component design adhering to Tailwind CSS, touch accessibility, and event listeners.
- **Files Table:**
  | File | Action |
  |---|---|
  | `src/components/Header.jsx` | MODIFY |
- **Key Implementation Details:**
  - Add responsive breakpoint logic: full button bar visible on desktop (`hidden md:flex`), compact 3-dots button on phone/mobile (`md:hidden`).
  - Add state `isMenuOpen` and a click-outside ref handler to dismiss the dropdown.
  - Render an elevated dropdown menu containing all 6 core actions:
    1. New Invoice (`FilePlus` icon)
    2. Sample Invoice (`BookOpen` icon)
    3. Save Invoice (`Save` icon)
    4. Saved Invoices History (`History` icon)
    5. Share Image (`Share2` icon)
    6. Download PDF (`Download` icon)
  - Ensure menu items meet mobile touch guidelines (minimum 44px tap target height, high contrast).
  - Tapping any option triggers its handler and closes the menu automatically.
- **Gate ✅:**
  - [ ] On viewports < 768px, the 6 desktop buttons collapse into a single 3-dots button.
  - [ ] Tapping 3-dots opens a sleek dropdown with all 6 actions visible.
  - [ ] Tapping any option executes the corresponding action and closes the menu.
  - [ ] Clicking outside the dropdown or pressing Escape closes the menu.
  - [ ] On viewports >= 768px, the full horizontal action bar remains visible as before.

---

## Milestone 3: Field Regex Verification & Visual Feedback
- **Recommended Model:** `Gemini 3.5 Flash (Medium)` or `Gemini 3.7 Flash (High)`
  - *Rationale:* Pure utility regex functions, string normalization, and lightweight input border/badge styling.
- **Files Table:**
  | File | Action |
  |---|---|
  | `src/utils/validation.js` | CREATE |
  | `src/components/InvoiceForm/CompanySection.jsx` | MODIFY |
  | `src/components/InvoiceForm/TaxSection.jsx` | MODIFY |
- **Key Implementation Details:**
  - Create `src/utils/validation.js` with regex validators for GSTIN (`^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`), UDYAM (`^UDYAM-[A-Z]{2}-\d{2}-\d{7}$`), SAC (`^99\d{2,4}$`), Phone, Email, and Numbers.
  - In `CompanySection.jsx`, auto-uppercase GSTIN and UDYAM on input.
  - Display non-intrusive format feedback (e.g. green check indicator when valid, subtle amber warning badge when invalid).
  - In `TaxSection.jsx`, validate SAC code format.
- **Gate ✅:**
  - [ ] Typing valid GSTIN `30TCEPS9342N1ZP` shows valid indicator.
  - [ ] Typing malformed GSTIN `30ABC` displays gentle format warning without blocking typing.
  - [ ] Typing valid UDYAM `UDYAM-GA-02-0025499` validates successfully.
  - [ ] Typing invalid SAC code displays helpful format hint.

---

## Milestone 4: Integration Verification, Code Cleanup & Build Gate
- **Recommended Model:** `Gemini 3.7 Flash (High)`
  - *Rationale:* End-to-end integration testing, linter validation, and production build checks.
- **Files Table:**
  | File | Action |
  |---|---|
  | `src/App.jsx` | MODIFY (cleanup unused imports) |
  | `src/utils/imageHelper.js` | MODIFY (remove unused parameter warning) |
- **Key Implementation Details:**
  - Resolve existing oxlint warnings (`unused imports`, `reject` parameter in Promise).
  - Run full `npm run lint` and `npm run build`.
  - Verify complete workflow on mobile and desktop viewports.
- **Gate ✅:**
  - [ ] `npm run lint` passes with 0 errors.
  - [ ] `npm run build` generates production bundle cleanly.
  - [ ] PDF export and Image Share continue to work seamlessly with custom amounts and validated fields.

---

## Summary Execution Status

| # | Milestone | Status | Model | New Files | Modified Files |
|---|---|---|---|---|---|
| 1 | Dynamic Amount Recalculation & Auto-Custom Removal | ✅ Done | Gemini 3.7 Flash (High) | 0 | 4 |
| 2 | Mobile 3-Dots Menu for Phone Viewport | ⏳ Next | Gemini 3.7 Flash (High) | 0 | 1 |
| 3 | Field Regex Verification & Visual Feedback | — | Gemini 3.5 Flash (Medium) | 1 | 2 |
| 4 | Integration Verification & Build Gate | — | Gemini 3.7 Flash (High) | 0 | 2 |
