# Milestones: Invoice Refinements & Layout Optimization

## Milestone 1: Form Streamlining & Line Items Entry Optimization
- **Recommended Model:** Gemini 3.8 Flash (High) — fast, accurate frontend refactoring for input layout scaling and responsive design.
- **Files Table:**
  | File | Action |
  |---|---|
  | `src/components/InvoiceForm/MetaSection.jsx` | MODIFY |
  | `src/components/InvoiceForm/ItemsSection.jsx` | MODIFY |
  | `src/components/InvoiceForm/TaxSection.jsx` | MODIFY |

- **Key Implementation Details:**
  - In `MetaSection.jsx`, remove PO No and PO Date inputs; keep Invoice No and Invoice Date in a balanced 2-column grid.
  - In `ItemsSection.jsx`, adjust table column widths: widen `Cols/DBs` to 85px, `UOM` to 75px, `Rate` to 125px, and `Amount` to 145px. Remove inline text truncations so 5–6 digit numbers are comfortably typed and visible.
  - Redesign the delete row button with a bright, high-contrast red styling (`bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-600 hover:text-white p-2 rounded-lg`).
  - In `TaxSection.jsx`, remove `COMMON_SAC_CODES` pills/buttons; leave the clean input field.

- **Gate ✅:**
  - [x] PO inputs are removed from the form.
  - [x] SAC suggestion pills are removed.
  - [x] 5-digit rate (e.g. 28,000) and 6-digit amount (e.g. 1,50,000) are entered with zero character clipping.
  - [x] Delete button is clearly visible and deletes rows properly.

---

## Milestone 2: Client Presets (Bill To Only), +1 Invoice Numbering & Collapsible Sections
- **Recommended Model:** Gemini 3.8 Flash (High) — reactive state handling, local storage persistence, and modal interaction.
- **Files Table:**
  | File | Action |
  |---|---|
  | `src/utils/clientStorage.js` | CREATE |
  | `src/components/InvoiceForm/ClientSection.jsx` | MODIFY |
  | `src/components/InvoiceForm/MetaSection.jsx` | MODIFY |
  | `src/App.jsx` | MODIFY |
  | `src/components/InvoiceForm/ItemsSection.jsx` | MODIFY |
  | `src/components/InvoiceForm/TaxSection.jsx` | MODIFY |

- **Key Implementation Details:**
  - **Client Presets (Bill To Only):**
    - Create `src/utils/clientStorage.js` to manage client presets in `localStorage` (`vedant_saved_clients`), storing preset name and `billTo` address text. Pre-populated with *Marine Electricals (Verna)*.
    - In `ClientSection.jsx`, add a `<select>` dropdown and `+` button. Selecting a preset **only populates `billTo`** (company name & address). The remaining fields (`placeOfService`, `kindAttention`) remain manually entered by the owner.
    - Modal or inline prompt to add a new client preset (Name & Bill To address) and persist in `localStorage`.
  - **Invoice Number +1 Increment:**
    - In `MetaSection.jsx`, replace the `Auto` random generator with a `+1` button.
    - When clicked, it finds the last number in `invoice.invoiceNo` and increments it by 1 (e.g., `VE 26/27 A-5` becomes `VE 26/27 A-6`, `VE 26/27 A-9` becomes `VE 26/27 A-10`).
  - **Collapsible Sections:**
    - Add collapse/expand functionality to all form sections (`CompanySection`, `MetaSection`, `ClientSection`, `ItemsSection`, `TaxSection`).
    - Provide a top-level **"Collapse All / Expand All"** toggle in the Invoice Editor header.

- **Gate ✅:**
  - [x] Dropdown lists saved clients and selecting a preset populates *only* `billTo`, leaving other fields intact.
  - [x] Clicking `+` allows adding a new client preset (storing Bill To address) and persists to localStorage.
  - [x] Invoice number generation button says `+1` and increments the last number in the invoice string.
  - [x] Each section can be collapsed/expanded individually, and top-level Collapse All / Expand All works smoothly.
  - [x] Taxes, SAC Code & Totals (last section) fully restored, visible, and functional.
  - [x] Professional website footer added with official tax identifiers, contact info, and quick actions.

---

## Milestone 3: Outer Black Border Enclosure & Visual PDF/Image Export
- **Recommended Model:** Gemini 3.8 Flash (High) — pixel-perfect CSS styling and canvas/PDF layout tuning.
- **Files Table:**
  | File | Action |
  |---|---|
  | `src/components/InvoicePreview/InvoicePad.jsx` | MODIFY |
  | `src/utils/pdfGenerator.js` | MODIFY |
  | `src/utils/imageHelper.js` | MODIFY |

- **Key Implementation Details:**
  - In `InvoicePad.jsx`, ensure the outer wrapper has an unbroken, continuous black perimeter border: `border-2 border-black` with `box-border` enclosing all 4 sides.
  - Ensure PO No and PO Date continue to be displayed on the preview as `PO No. -` and `PO Date. -`.
  - Ensure the bottom edge is cleanly closed with an outer border so that both rendered preview, PDF download, and PNG image export have an unmistakable, crisp perimeter enclosing the entire invoice document.

- **Gate ✅:**
  - [x] Invoice preview has a closed, crisp outer black border framing the entire sheet.
  - [x] PO lines remain present on the preview.
  - [x] Generated PDF and PNG image exports show the full outer black border on all 4 sides including the bottom.

---

## Summary Status Table

| # | Milestone | Status | Model | New Files | Modified Files |
|---|---|---|---|---|---|
| 1 | Form Streamlining & Items Entry Optimization | ✅ Done | Gemini 3.8 Flash (High) | 0 | 3 |
| 2 | Client Presets (Bill To), +1 Numbering & Collapsible Sections | ✅ Done | Gemini 3.8 Flash (High) | 2 | 5 |
| 3 | Outer Black Border Enclosure & Export Polish | ✅ Done | Gemini 3.8 Flash (High) | 0 | 3 |
