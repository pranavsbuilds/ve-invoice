# Implementation Plan: Field Regex Verification, Dynamic Amount Editing & Mobile 3-Dots Menu

## 1. Background
The Vedant Enterprises Tax Invoice Generator currently has three key functional and usability opportunities identified by the user:

1. **Lack of Format Validation on Critical Entry Fields**:
   Statutory and business identity fields (such as GSTIN, UDYAM Registration, SAC codes, phone numbers, and emails) accept arbitrary text without format checks. Invalid formats can lead to rejected GST filings or uncompliant invoices.
2. **Clunky "Auto / Custom" Amount Toggle**:
   In `src/components/InvoiceForm/ItemsSection.jsx`, line item amounts are locked into a rigid binary state (`isManualAmount` toggle). Users must click an "⚡ Auto" badge to unlock manual editing as "✏️ Custom". If locked, the amount is completely read-only. The user requested removing this manual/auto generator toggle entirely so that the amount updates dynamically when quantity or rate changes, yet remains freely editable at any time.
3. **Crowded Header on Mobile Phones**:
   As highlighted in the user's reference screenshot (`media_1790349240705.png`), the desktop header houses 6 action buttons (`[New]`, `[Sample Invoice]`, `[Save]`, `[History]`, `[Share Image]`, `[Download PDF]`). On mobile viewports, these buttons cause clutter and awkward wrapping. On phone screens, these options should be accessible via a clean, touch-friendly 3-dots (kebab) menu.

---

## 2. Core Model

```
+-----------------------------------------------------------------------------------+
| DESKTOP VIEWPORT (>= 768px): FULL BUTTON BAR RETAINED                             |
| [ VE Logo ] Vedant Enterprises  [New] [Sample] [Save] [History] [Share] [Download]|
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
| MOBILE VIEWPORT (< 768px): STREAMLINED HEADER WITH 3-DOTS KEBAB MENU              |
| [VE Logo] Vedant  [ Edit | Preview ]  [ : (3 Dots) ]                              |
|                                            |                                      |
|                                            v (Dropdown on Tap)                    |
|                                  +-----------------------+                        |
|                                  | 📄 New Invoice        |                        |
|                                  | 📖 Sample Invoice     |                        |
|                                  | 💾 Save to History    |                        |
|                                  | 🕒 Saved History      |                        |
|                                  | --------------------- |                        |
|                                  | 📤 Share Image        |                        |
|                                  | 📥 Download PDF       |                        |
|                                  +-----------------------+                        |
+-----------------------------------------------------------------------------------+

+-----------------------------------------------------------------------------------+
| LINE ITEM AMOUNT FLOW: NO TOGGLE BUTTON, ALWAYS EDITABLE & DYNAMICALLY SYNCED      |
|                                                                                   |
|  [ Cols/DBs: 20 ] x [ Rate (₹): 28,000 ]                                          |
|                          |                                                        |
|                          v (Auto-multiplies on input change)                      |
|                 [ Amount (₹): 560000.00 ] <--- Always directly editable           |
|                          |                    (User can override anytime)         |
|                          v                                                        |
|                 Taxable & Gross Total Calculator                                  |
+-----------------------------------------------------------------------------------+
```

---

## 3. What Is Being Removed

| Component | What Is Removed | Rationale |
|---|---|---|
| `src/components/InvoiceForm/ItemsSection.jsx` | `toggleManualAmount` function | Eliminates rigid mode toggle |
| `src/components/InvoiceForm/ItemsSection.jsx` | `⚡ Auto` / `✏️ Custom` button | Unlocks amount input for direct editing anytime |
| `src/components/InvoiceForm/ItemsSection.jsx` | `readOnly={isAuto}` attribute on amount input | Amount field can be edited at any time directly |
| `src/components/InvoiceForm/ItemsSection.jsx` | Amber background / conditional styling differentiating auto vs custom | Provides a uniform, clean, editable field appearance |
| `src/types/invoice.js` | `isManualAmount: false` default property on item objects | No longer needed for calculation or state tracking |
| `src/utils/calculator.js` | `item.isManualAmount` branch condition | Calculations read directly from `item.amount` with fallback to `qty * rate` |

---

## 4. Entry Fields Regex Verification Plan

A dedicated utility module `src/utils/validation.js` will encapsulate regex definitions and validation functions. Each field will provide non-intrusive visual feedback (e.g. subtle green check when valid, amber outline or gentle helper badge when format is malformed) without locking or preventing the user from typing.

### Field Inventory & Regex Specifications

| # | Field Name | Location | Required Format / Standard | Exact Regular Expression | Example Valid Value | Example Invalid Value |
|---|---|---|---|---|---|---|
| **1** | **GSTIN** (Company & Client) | `company.gstin`<br>`kindAttention` | Indian 15-character statutory GST format (2-digit state code + 10-char PAN + 1 entity + 'Z' + 1 checksum) | `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$` | `30TCEPS9342N1ZP` | `30TCEPS9342` (too short), `301234567890123` |
| **2** | **UDYAM Registration** | `company.udyam` | Indian MSME UDYAM registration format (`UDYAM-XX-00-0000000`) | `^UDYAM-[A-Z]{2}-\d{2}-\d{7}$` | `UDYAM-GA-02-0025499` | `UDYAM1234`, `UDYAM-GA-02-2549` |
| **3** | **SAC Code** | `invoice.sacCode` | Services Accounting Code (4 to 6 digits, standard services start with 99) | `^99\d{2,4}$` (general fallback: `^\d{4,6}$`) | `998719`, `9954` | `99A87`, `12` |
| **4** | **Phone Number** | `company.phone` | Indian 10-digit mobile number, allowing multiple numbers delimited by `/` or `,` and optional `+91` | `^(?:(?:\+91[\s-]?)?[6-9]\d{9})(?:\s*[/,]\s*(?:(?:\+91[\s-]?)?[6-9]\d{9}))*$` | `7769011502 / 9284052061` | `12345`, `abcdefghij` |
| **5** | **Email ID** | `company.email` | Standard RFC email structure | `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$` | `baburaosapugade@gmail.com` | `baburao@`, `user@domain` |
| **6** | **Invoice No.** | `invoice.invoiceNo` | Standard Indian alphanumeric numbering pattern with slashes, hyphens, and spaces | `^[A-Za-z0-9][A-Za-z0-9\s\/\-_]{1,30}$` | `VE 26/27 A-5`, `INV-2026-001` | `?#*` |
| **7** | **Invoice / PO Date** | `invoice.invoiceDate`<br>`invoice.poDate` | ISO 8601 standard date format | `^\d{4}-\d{2}-\d{2}$` | `2026-09-25` | `25-09-2026` |
| **8** | **Quantity (Cols/DBs)** | `item.colsDbs` | Digits (integer or decimal) or `-` only | `^(?:\d+(?:\.\d+)?\|-)$` | `20`, `2.5`, `-` | `abc`, `?` |
| **9** | **Rate (₹)** | `item.rate` | Digits (with optional commas/decimals) or `-` only | `^(?:(?:\d{1,3}(?:,\d{3})*\|\d+)(?:\.\d{1,2})?\|-)$` | `28,000`, `7500`, `-` | `abc`, `rate` |
| **10** | **Amount (₹)** | `item.amount` | Digits (with optional commas/decimals) or `-` only | `^(?:(?:\d{1,3}(?:,\d{3})*\|\d+)(?:\.\d{1,2})?\|-)$` | `560000`, `1,50,000.00`, `-` | `text`, `Free` |
### Rate Limiting & Character Length Constraints Plan (Milestone 3)
To prevent buffer overflows, UI layout breaks, print canvas distortion, and high-frequency storage thrashing, strict entry constraints and rate limiting will be enforced across every entry field:

| Section | Field | Max Length (`maxLength`) | Entry Filter / Allowed Characters | Purpose |
|---|---|---|---|---|
| **Invoice Details** | `invoiceNo` | `30` | Alphanumeric, spaces, `/`, `-`, `.` | Standard invoice identifier bounds |
| **Invoice Details** | `invoiceDate` | `10` | `YYYY-MM-DD` date | Strict standard date string length |
| **Company Info** | `name` | `80` | Alphanumeric, spaces, `&`, `,`, `-`, `.` | Prevents title overflow on pad header |
| **Company Info** | `phone` | `35` | Digits, `+`, `/`, `,`, spaces, `-` | Prevents phone field inflation |
| **Company Info** | `email` | `60` | Email RFC characters | Prevents email string overflow |
| **Company Info** | `address` | `200` | Multiline / text | Prevents address distortion on invoice header |
| **Company Info** | `gstin` | `15` | Exactly 15 statutory characters | Enforces Indian GST format limit |
| **Company Info** | `udyam` | `24` | Up to 24 statutory characters | Enforces UDYAM format limit |
| **Client Info** | `billTo` | `300` | Multiline client details | Protects pad client box height |
| **Client Info** | `placeOfService` | `50` | Alphanumeric, commas, spaces | Prevents location overflow |
| **Client Info** | `kindAttention` | `100` | Alphanumeric, spaces, punctuation | Protects Kind Attention line height |
| **Line Items** | `description` | `120` | Printable text | Ensures pad line height consistency |
| **Line Items** | `colsDbs` (Qty) | `10` | Digits, decimal, or `-` | Prevents quantity column clipping |
| **Line Items** | `uom` | `8` | Uppercase letters | Compact UOM bounds (`NOS`, etc.) |
| **Line Items** | `rate` | `15` | Digits, commas, decimal, or `-` | Full visibility for 5-7 digit rates |
| **Line Items** | `amount` | `18` | Digits, commas, decimal, or `-` | Full visibility for 6-8 digit amounts |
| **Taxes & SAC** | `sacCode` | `8` | Digits only (`4-6` standard) | Restricts SAC to statutory digit bounds |
| **Taxes & SAC** | `cgstRate`, `sgstRate`, `igstRate` | `5` | Numbers up to 100% | Prevents invalid tax rate strings |
| **Taxes & SAC** | `customAmountInWords` | `200` | Text | Bounds manual words override |

#### Storage & Processing Rate Limiting:
- **Debounced LocalStorage Synchronization**: Replace keystroke-level synchronous `localStorage` updates with a 300ms debounce buffer in `App.jsx`, rate-limiting I/O writes during rapid fluid typing.
- **Throttled Regex Validation**: Format validations run non-blocking on change with memoized regex instances.

---

## 5. Proposed Changes

### Component 1: `src/utils/validation.js` [NEW]
- Define pure validation functions and patterns:
  - `isValidGSTIN(str)`
  - `isValidUdyam(str)`
  - `isValidSAC(str)`
  - `isValidPhone(str)`
  - `isValidEmail(str)`
  - `isValidInvoiceNo(str)`
  - `cleanNumericString(str)`: safely strips commas and whitespace.

### Component 2: `src/components/InvoiceForm/ItemsSection.jsx` [MODIFY]
- **Remove Auto/Custom Toggle Button**:
  - Remove `toggleManualAmount` and the `⚡ Auto` / `✏️ Custom` badge button.
- **Dynamic Amount Recalculation**:
  - In `handleItemChange`:
    - When `colsDbs` or `rate` is edited, compute `qty * rate` (stripping commas using `cleanNumericString`).
    - If both are valid numbers, dynamically update `amount` to `(Math.round(qty * rate * 100) / 100).toString()`.
    - When `amount` itself is edited, update `amount` directly with the user's input.
- **Always-Editable Amount Input**:
  - Remove `readOnly={isAuto}`.
  - Apply clean standard editable input styling with blue focus ring.

### Component 3: `src/utils/calculator.js` [MODIFY]
- Simplify line item total calculation:
  - Extract `cleanAmt = cleanNumericString(item.amount)`.
  - If `cleanAmt` is a valid positive number, use `parseFloat(cleanAmt)`.
  - If `cleanAmt` is empty or NaN, fall back to `cleanQty * cleanRate`.
  - Remove all references to `item.isManualAmount`.

### Component 4: `src/components/Header.jsx` [MODIFY]
- **Add Mobile 3-Dots Menu**:
  - Import `MoreVertical`, `X` from `lucide-react`.
  - Add state `isMenuOpen` (boolean).
  - Add ref for dropdown with outside-click listener.
  - On desktop (`hidden md:flex`), keep the full action button bar unchanged.
  - On mobile (`md:hidden`):
    - Render a 3-dots button next to the Edit/Preview switcher.
    - When clicked, display an elevated dropdown menu with all 6 options:
      1. New Invoice
      2. Sample Invoice
      3. Save
      4. History
      5. Share Image
      6. Download PDF
    - Each menu item has an icon, title, description, and high-contrast styling.
    - Selecting an option triggers the action and closes the menu.

### Component 5: `src/components/InvoiceForm/CompanySection.jsx` & `TaxSection.jsx` [MODIFY]
- Integrate validation feedback for GSTIN, UDYAM, SAC code, Phone, and Email.
- Auto-uppercase GSTIN and UDYAM inputs.
- Add subtle validation badges/rings when fields have content but fail regex.

---

## 6. File Change Summary

| File | Action | Summary of Changes |
|---|---|---|
| `src/utils/validation.js` | **NEW** | Centralized regex validators and numeric cleaners for all invoice fields |
| `src/components/InvoiceForm/ItemsSection.jsx` | **MODIFY** | Remove auto-custom toggle button; make amount always editable; calculate dynamically on qty/rate change |
| `src/utils/calculator.js` | **MODIFY** | Support direct editable amounts with comma cleaning and qty*rate fallback; remove `isManualAmount` |
| `src/types/invoice.js` | **MODIFY** | Clean up `isManualAmount` from default and sample templates |
| `src/components/Header.jsx` | **MODIFY** | Add touch-friendly 3-dots mobile menu containing all 6 header actions |
| `src/components/InvoiceForm/CompanySection.jsx` | **MODIFY** | Add regex validation hints and auto-uppercase for GSTIN, UDYAM, phone, and email |
| `src/components/InvoiceForm/TaxSection.jsx` | **MODIFY** | Add regex validation for SAC code |

---

## 7. Verification Checklist

1. [ ] **Dynamic Amount Calculation**: Change Cols/DBs to `15` and Rate to `2000`. Verify Amount automatically populates `30000`.
2. [ ] **Comma-Separated Rate Handling**: Type `28,000` into Rate and `5` into Cols/DBs. Verify Amount updates to `140000` without NaN or truncation.
3. [ ] **Direct Amount Override**: Type `145000` directly into the Amount field. Verify it accepts the custom amount without any toggle button.
4. [ ] **Pad Preview & Totals**: Verify that custom amounts reflect accurately on the preview pad, taxable value, and gross total.
5. [ ] **Mobile 3-Dots Menu Visibility**: Resize viewport to mobile (< 768px). Verify the 3-dots button appears and desktop buttons are neatly collapsed into the menu.
6. [ ] **Mobile Menu Actions**: Tap 3-dots menu on phone. Verify clicking "Sample Invoice", "Save", "History", "Share Image", and "Download PDF" execute properly.
7. [ ] **Dropdown Dismissal**: Verify menu closes on option click, outside tap, or pressing Escape.
8. [ ] **Regex Validation Verification**: Enter an invalid GSTIN (e.g. `30ABC`), verify warning hint. Enter valid `30TCEPS9342N1ZP`, verify green valid state.
9. [ ] **Build Integrity**: Run `npm run build` and `npm run lint` to guarantee zero syntax or compilation errors.
