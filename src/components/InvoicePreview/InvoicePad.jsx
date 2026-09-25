import LogoVE from './LogoVE';
import { calculateInvoiceTotals } from '../../utils/calculator';
import { formatIndianCurrency } from '../../utils/numberToWords';

export default function InvoicePad({ invoice, options = {} }) {
  const totals = calculateInvoiceTotals(invoice);
  const {
    monochromeLogo = false,
    stampPosition = 'right', // 'right' (under company name) or 'left' (beside signature)
  } = options;

  // Format date as DD/MM/YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  const formattedInvoiceDate = formatDate(invoice.invoiceDate);
  const formattedPoDate = formatDate(invoice.poDate);

  // Compute rows to render
  const items = totals.processedItems || [];
  const targetRowCount = invoice.fillPadRows ? Math.max(invoice.targetRowCount || 16, items.length) : items.length;
  const blankRowsCount = Math.max(0, targetRowCount - items.length);

  return (
    <div
      id="invoice-pad-preview"
      className="invoice-pad-sheet bg-white text-black font-sans w-[210mm] min-h-[297mm] p-[6mm] mx-auto text-[12px] leading-tight select-text box-border"
      style={{ boxSizing: 'border-box', width: '210mm' }}
    >
      {/* Continuous, unbroken outer black perimeter border enclosing all 4 sides */}
      <div
        className={`w-full border-2 border-black box-border bg-white flex flex-col justify-between overflow-hidden ${
          invoice.fillPadRows ? 'min-h-[285mm]' : ''
        }`}
      >
        {/* 1. Header Section */}
        <div className="flex items-center justify-between p-2 pb-2.5 border-b border-black">
          <div className="w-[20%] flex items-center justify-start pl-1">
            <LogoVE className="w-20 h-20" monochrome={monochromeLogo} />
          </div>
          <div className="w-[80%] text-center pr-10">
            <h1 className="text-xl sm:text-2xl font-black tracking-wider uppercase font-serif text-slate-900">
              {invoice.company?.name || 'VEDANT ENTERPRISES'}
            </h1>
            <p className="font-bold text-[11px] mt-0.5 text-slate-900">
              {invoice.company?.address || 'H No 271/1, Zuarinagar, Sancoal, Goa - 403726'}
            </p>
            <p className="font-bold text-[11px] text-slate-900">
              Email ID :- <span className="font-semibold">{invoice.company?.email || 'baburaosapugade@gmail.com'}</span>
            </p>
            <p className="font-bold text-[11px] text-slate-900">
              Contact No. <span className="font-semibold">{invoice.company?.phone || '7769011502/9284052061'}</span>
            </p>
          </div>
        </div>

      {/* 2. TAX INVOICE Bar */}
      <div className="bg-[#cbd5e1] border-b border-black py-1 text-center font-black tracking-widest text-[13px] uppercase">
        TAX INVOICE
      </div>

      {/* 3. GSTIN & UDYAM Bar */}
      <div className="flex justify-between items-center px-3 py-1 border-b border-black font-bold text-[11px]">
        <div>
          <span>GSTIN NO: </span>
          <span className="font-extrabold">{invoice.company?.gstin || '30TCEPS9342N1ZP'}</span>
        </div>
        <div>
          <span>UDAYAM REG.NO: </span>
          <span className="font-extrabold">{invoice.company?.udyam || 'UDYAM-GA-02-0025499'}</span>
        </div>
      </div>

      {/* 4. Bill To & Invoice Meta Section */}
      <div className="border-b border-black flex">
        {/* Left Side: Bill To & Place Of Service */}
        <div className="w-[58%] border-r border-black flex flex-col justify-between">
          <div className="flex border-b border-black">
            <div className="w-1/2 p-1.5 border-r border-black font-bold text-[11px]">
              Bill To:
            </div>
            <div className="w-1/2 p-1.5 font-bold text-[11px] flex items-center">
              <span>Place Of Service:&nbsp;</span>
              <span className="font-semibold uppercase">{invoice.placeOfService || 'Goa'}</span>
            </div>
          </div>
          {/* Bill To multi-line content with pad lines */}
          <div className="p-1.5 min-h-[72px] font-semibold text-[11.5px] leading-snug whitespace-pre-line">
            {invoice.billTo || (
              <span className="text-gray-300 italic">Client Name, Address & GSTIN</span>
            )}
          </div>
        </div>

        {/* Right Side: Invoice Meta Rows */}
        <div className="w-[42%] flex flex-col">
          <div className="flex border-b border-black py-1 px-1.5">
            <div className="w-[42%] font-bold text-[11px]">Invoice no.</div>
            <div className="w-[58%] font-black text-[12px]">{invoice.invoiceNo}</div>
          </div>
          <div className="flex border-b border-black py-1 px-1.5">
            <div className="w-[42%] font-bold text-[11px]">Invoice Date.</div>
            <div className="w-[58%] font-bold text-[11px]">{formattedInvoiceDate}</div>
          </div>
          <div className="flex border-b border-black py-1 px-1.5">
            <div className="w-[42%] font-bold text-[11px]">PO No.</div>
            <div className="w-[58%] font-bold text-[11px]">{invoice.poNo || '-'}</div>
          </div>
          <div className="flex py-1 px-1.5">
            <div className="w-[42%] font-bold text-[11px]">PO Date.</div>
            <div className="w-[58%] font-bold text-[11px]">{formattedPoDate || '-'}</div>
          </div>
        </div>
      </div>

      {/* 5. Kind Attention Bar (Proper height & overflow-visible so text is 100% visible) */}
      <div className="border-b border-black px-2.5 py-1.5 min-h-[28px] flex items-center font-bold text-[11px] leading-normal bg-white overflow-visible">
        <span className="whitespace-nowrap font-extrabold">Kind Attention:&nbsp;</span>
        <span className="font-semibold text-[11.5px] text-slate-900 flex-1 break-words">{invoice.kindAttention || '-'}</span>
      </div>

      {/* 6. Items Table */}
      <div className="w-full">
        {/* Table Header */}
        <div className="flex bg-[#cbd5e1] border-b border-black font-extrabold text-[11px] text-center min-h-[24px] items-center">
          <div className="w-[8%] py-1 border-r border-black">Sr.No.</div>
          <div className="w-[42%] py-1 border-r border-black">Description</div>
          <div className="w-[12%] py-1 border-r border-black">Cols/DBs</div>
          <div className="w-[10%] py-1 border-r border-black">UOM</div>
          <div className="w-[13%] py-1 border-r border-black">Rate</div>
          <div className="w-[15%] py-1">Amount</div>
        </div>

        {/* Table Body - Active Items */}
        {items.map((item) => {
          const rateVal = parseFloat(item.rate);
          const rateDisplay = isNaN(rateVal) || item.rate === '' || item.rate === '-'
            ? (item.rate || '-')
            : formatIndianCurrency(rateVal);

          const amtDisplay = formatIndianCurrency(item.calculatedAmount);

          return (
            <div
              key={item.id}
              className="flex border-b border-black text-[11px] min-h-[22px] items-center"
            >
              <div className="w-[8%] text-center border-r border-black py-0.5 font-bold">
                {item.srNo}
              </div>
              <div className="w-[42%] px-2 text-left border-r border-black py-0.5 font-medium whitespace-pre-wrap">
                {item.description}
              </div>
              <div className="w-[12%] text-center border-r border-black py-0.5 font-medium">
                {item.colsDbs || '-'}
              </div>
              <div className="w-[10%] text-center border-r border-black py-0.5 font-bold">
                {item.uom || 'NOS'}
              </div>
              <div className="w-[13%] text-right pr-2 border-r border-black py-0.5 font-mono font-medium">
                {rateDisplay}
              </div>
              <div className="w-[15%] text-right pr-2 py-0.5 font-mono font-bold">
                {amtDisplay}
              </div>
            </div>
          );
        })}

        {/* Pad Empty Rows to replicate physical invoice pad */}
        {Array.from({ length: blankRowsCount }).map((_, idx) => (
          <div
            key={`blank-${idx}`}
            className="flex border-b border-black text-[11px] min-h-[21px] items-center"
          >
            <div className="w-[8%] text-center border-r border-black py-0.5">&nbsp;</div>
            <div className="w-[42%] border-r border-black py-0.5">&nbsp;</div>
            <div className="w-[12%] border-r border-black py-0.5">&nbsp;</div>
            <div className="w-[10%] border-r border-black py-0.5">&nbsp;</div>
            <div className="w-[13%] border-r border-black py-0.5">&nbsp;</div>
            <div className="w-[15%] py-0.5">&nbsp;</div>
          </div>
        ))}
      </div>

      {/* 7. Taxable Value & Tax Calculations Section */}
      <div className="flex border-b border-black">
        {/* Left Side: SAC Code and Gross Total Label */}
        <div className="w-[72%] border-r border-black flex flex-col justify-between">
          <div className="flex items-center justify-center p-3 text-center my-auto">
            <span className="font-extrabold text-[13px] tracking-wider">
              SAC CODE:&nbsp;
            </span>
            <span className="font-extrabold text-[14px] tracking-widest font-mono">
              {invoice.sacCode || '998719'}
            </span>
          </div>

          <div className="border-t border-black py-1.5 px-3 text-center font-black text-[12px] uppercase tracking-wide">
            Gross Total Value
          </div>
        </div>

        {/* Right Side: Tax Breakdown & Total */}
        <div className="w-[28%] flex flex-col">
          {/* Taxable value */}
          <div className="flex border-b border-black text-[11px]">
            <div className="w-[50%] p-1 font-bold border-r border-black text-left">
              Taxable value
            </div>
            <div className="w-[50%] p-1 text-right pr-2 font-mono font-bold">
              {formatIndianCurrency(totals.taxableValue)}
            </div>
          </div>

          {/* Tax Modes */}
          {invoice.taxMode === 'IGST' ? (
            <div className="flex border-b border-black text-[11px]">
              <div className="w-[50%] p-1 font-bold border-r border-black text-left">
                Add IGST {invoice.igstRate}%
              </div>
              <div className="w-[50%] p-1 text-right pr-2 font-mono font-medium">
                {formatIndianCurrency(totals.igstAmount)}
              </div>
            </div>
          ) : (
            <>
              {/* CGST */}
              <div className="flex border-b border-black text-[11px]">
                <div className="w-[50%] p-1 font-bold border-r border-black text-left whitespace-nowrap">
                  Add CGST {invoice.cgstRate}%
                </div>
                <div className="w-[50%] p-1 text-right pr-2 font-mono font-medium">
                  {formatIndianCurrency(totals.cgstAmount)}
                </div>
              </div>

              {/* SGST */}
              <div className="flex border-b border-black text-[11px]">
                <div className="w-[50%] p-1 font-bold border-r border-black text-left whitespace-nowrap">
                  Add SGST {invoice.sgstRate}%
                </div>
                <div className="w-[50%] p-1 text-right pr-2 font-mono font-medium">
                  {formatIndianCurrency(totals.sgstAmount)}
                </div>
              </div>
            </>
          )}

          {/* Gross Total Value Amount */}
          <div className="flex text-[12px] bg-slate-50 font-black">
            <div className="w-full p-1.5 text-right pr-2 font-mono text-[13px] text-slate-900">
              {formatIndianCurrency(totals.grossTotal)}
            </div>
          </div>
        </div>
      </div>

      {/* 8. Amount in Words */}
      <div className="border-b border-black px-2 py-1.5 flex flex-col sm:flex-row items-baseline gap-1 text-[11px]">
        <span className="font-black whitespace-nowrap tracking-wide">
          AMOUNT IN WORDS:
        </span>
        <span className="font-bold uppercase tracking-wider text-[11.5px] text-slate-900">
          {totals.amountInWords}
        </span>
      </div>

      {/* 9. Signatory Section with dedicated 4x4 cm Company Stamp area */}
      <div className="flex justify-between items-end min-h-[54mm] p-2.5 border-b border-black">
        {/* Left side: 4x4 cm Stamp Area when position is 'left' */}
        {stampPosition === 'left' ? (
          <div
            className="border border-dashed border-slate-400 rounded-sm"
            style={{ width: '40mm', height: '40mm', minWidth: '40mm', minHeight: '40mm' }}
            title="4cm x 4cm Company Stamp Area"
          />
        ) : (
          <div className="flex-1" />
        )}

        {/* Right side: Authorised Signature Block */}
        <div className="flex flex-col items-end">
          <div className="text-right font-black text-[11.5px] uppercase tracking-wider pr-1">
            For {invoice.company?.name || 'VEDANT ENTERPRISES'}
          </div>

          {/* 4x4 cm Stamp Area when position is 'right' (default) */}
          {stampPosition === 'right' ? (
            <div
              className="border border-dashed border-slate-400 rounded-sm my-1 mr-1"
              style={{ width: '40mm', height: '40mm', minWidth: '40mm', minHeight: '40mm' }}
              title="4cm x 4cm Company Stamp Area"
            />
          ) : (
            /* Open space for signature when stamp is on left */
            <div className="h-[36mm] w-[45mm]" />
          )}

          <div className="text-right font-bold text-[11px] pr-1 pb-0.5">
            Authorised Signature
          </div>
        </div>
      </div>

      {/* 10. Bottom Footer Strip (as present on the physical pad, enclosed by bottom outer border) */}
      <div className="h-3.5 w-full bg-white" />
      </div>
    </div>
  );
}
