# Milestones: Mobile Invoice Preview & Footer Cleanup

## Milestone 1: Footer Cleanup & Streamlining
- **Recommended Model:** Gemini 3.5 Flash (Medium) or Claude 4.5 Haiku (Thinking)
  - *Rationale:* Focused, rapid component cleanup removing dead sections, unneeded props, and unused icons with zero latency.
- **Files table:**

| File | Action | Details |
|---|---|---|
| `src/components/Footer.jsx` | MODIFY | Remove Tax Registration, Office & Contact, and Quick Shortcuts columns. Modernize to a clean brand & copyright layout. |
| `src/App.jsx` | MODIFY | Remove obsolete footer callback props from `<Footer />` instantiation. |

- **Key implementation details:**
  - Strip `Building2`, `Phone`, `Mail`, `MapPin`, `RotateCcw`, `FileText`, `Download` icons.
  - Retain the brand identity column (VE logo badge, company tagline, offline privacy status badge) and bottom copyright bar.
- **Gate ✅:**
  - [x] Tax Registration column is completely gone from the footer.
  - [x] Quicklinks / Quick Shortcuts column is completely gone from the footer.
  - [x] Office & Contact column is completely gone from the footer.
  - [x] App builds with zero lint errors or missing prop warnings.

---

## Milestone 2: Mobile Responsive Auto-Fit & Preview Controls
- **Recommended Model:** Gemini 3.8 Flash (High)
  - *Rationale:* Masters responsive layout calculation, DOM dimension orchestration, CSS scaling transforms, and cross-device UI state management.
- **Files table:**

| File | Action | Details |
|---|---|---|
| `src/App.jsx` | MODIFY | Implement container-width measurement, auto-fit scale calculation, responsive sizing wrapper, mobile zoom controls, and bottom clearance padding. |

- **Key implementation details:**
  - Add container ref (`previewContainerRef`) and measure available width.
  - When in "Fit Screen" mode (default on mobile screens < 768px), auto-scale invoice sheet to fit screen width: `scale = Math.min(1, Math.max(0.3, (containerWidth - 24) / 794))`.
  - Outer wrapper dimensions explicitly set to `width: 794 * scale`, `height: invoiceHeight * scale` with `overflow: hidden`, wrapping the `transform: scale(scale)` element to eliminate extra whitespace or cutoff.
  - Unhide zoom controls on mobile and add quick toggle buttons: `[Fit Screen]` and `[100% Size]`.
  - Add `pb-28` to preview scroll container so bottom floating action bar does not cover the signature or bottom border.
- **Gate ✅:**
  - [x] Opening preview on mobile viewport (< 500px) displays the complete invoice from left border to right border without horizontal clipping.
  - [x] Switching between "Fit Screen" and "100%" smoothly toggles between full-view overview and 1:1 detail inspection.
  - [x] Floating bottom bar does not obscure the authorized signature or bottom border.

---

## Milestone 3: End-to-End Verification & High-Resolution Export Gate
- **Recommended Model:** Gemini 3.8 Flash (High)
  - *Rationale:* Verification, build validation, and high-fidelity testing of PDF and image exports.
- **Files table:**

| File | Action | Details |
|---|---|---|
| Project verification | RUN BUILD | Verify Vite build, test PDF generation, verify PNG generation on mobile & desktop. |

- **Gate ✅:**
  - [x] `npm run build` succeeds cleanly with zero errors.
  - [x] PDF generation produces a crisp 300 DPI A4 document enclosed within unbroken black perimeter borders.
  - [x] Share Image generates full-resolution PNG unaffected by mobile CSS scale.

---

## Summary of Milestones

| # | Milestone | Status | Model | New Files | Modified Files |
|---|---|---|---|---|---|
| 1 | Footer Cleanup & Streamlining | ✅ Done | Gemini 3.5 Flash | — | `Footer.jsx`, `App.jsx` |
| 2 | Mobile Responsive Auto-Fit & Preview Controls | ✅ Done | Gemini 3.8 Flash | — | `App.jsx`, `pdfGenerator.js`, `imageHelper.js` |
| 3 | End-to-End Verification & High-Res Export Gate | ✅ Done | Gemini 3.8 Flash | — | None |
