# Workspace Rules & Learned Behaviors
# do not run browser automated tests unless asked 
## Invoice Generator Domain Rules
1. **Form vs. Preview Decoupling**: When the user requests removing specific form inputs (e.g., PO No and PO Date), retain the corresponding metadata rows on the physical invoice pad preview (rendered as `-` or blank) to preserve pad layout integrity.
2. **Numerical Column Dimensions**: Always provide generous column widths (`Rate >= 120px`, `Amount >= 140px`) and avoid narrow fixed constraints or aggressive truncation so 5–7 digit Indian currency amounts (e.g. ₹28,000, ₹1,50,000, ₹5,41,100) are fully visible during entry.
3. **High-Contrast Action Buttons**: Destructive and critical actions (such as delete row) must use high-contrast color palettes (e.g. bold rose/red borders and icons) rather than faint neutral grays so they are instantly discoverable on both laptop and mobile screens.
4. **Border Enclosure for PDF/Image**: The invoice sheet must always be bounded by a continuous, unbroken outer black perimeter border (`border-2 border-black` / `box-border`) enclosing all 4 sides with zero clipping at the bottom or margins in both PDF and image captures.
5. **Milestone Execution Discipline**: Do not chain milestones without explicit user permission. Once approval is granted, verify previous milestone completion through a build/run test, mark as achieved, and proceed methodically.
