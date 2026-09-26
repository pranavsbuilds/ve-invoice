import React from 'react';
import { Calculator, Percent, Tag, ChevronDown, ChevronUp, Check, AlertCircle } from 'lucide-react';
import { calculateInvoiceTotals } from '../../utils/calculator';
import { formatIndianCurrency } from '../../utils/numberToWords';
import { MAX_LENGTHS, isValidSAC } from '../../utils/validation';

export default function TaxSection({ invoice, onChange, isCollapsed = false, onToggleCollapse }) {
  const totals = calculateInvoiceTotals(invoice);
  const sacValue = (invoice.sacCode || '').trim();

  const taxSummary = `${formatIndianCurrency(totals.grossTotal, true)} • ${
    invoice.taxMode === 'IGST'
      ? `IGST (${invoice.igstRate}%)`
      : `CGST/SGST (${invoice.cgstRate}% + ${invoice.sgstRate}%)`
  }`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Section Header (Clickable for Collapse/Expand) */}
      <div
        onClick={onToggleCollapse}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition border-b border-slate-100"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <Calculator className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Taxes, SAC Code & Totals
            </h3>
            {isCollapsed && (
              <p className="text-xs text-blue-600 font-bold truncate max-w-[240px] sm:max-w-md font-mono">
                Gross: {taxSummary}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {isCollapsed ? 'Click to expand' : 'GST & Calculations'}
          </span>
          <button
            type="button"
            className="p-1 text-slate-400 hover:text-slate-600 rounded transition"
            aria-label={isCollapsed ? 'Expand section' : 'Collapse section'}
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left Side: SAC Code & Tax Selection */}
        <div className="space-y-4">
          {/* SAC Code */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                SAC Code
              </label>
              {sacValue && (
                isValidSAC(sacValue) ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    <Check className="w-3 h-3" /> Valid SAC
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                    <AlertCircle className="w-3 h-3 text-amber-600" /> 4-6 digits (e.g. 998719)
                  </span>
                )
              )}
            </div>
            <input
              type="text"
              maxLength={MAX_LENGTHS.sacCode}
              value={invoice.sacCode || ''}
              onChange={(e) => onChange('sacCode', e.target.value.replace(/[^0-9]/g, ''))}
              placeholder="e.g. 998719"
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Tax Mode Toggles */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-slate-400" />
              GST Tax Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onChange('taxMode', 'CGST_SGST')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition text-center ${
                  invoice.taxMode !== 'IGST'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Intra-State (CGST + SGST)
                <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                  Standard Goa Billing
                </span>
              </button>

              <button
                type="button"
                onClick={() => onChange('taxMode', 'IGST')}
                className={`py-2 px-3 rounded-lg text-xs font-bold border transition text-center ${
                  invoice.taxMode === 'IGST'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                Inter-State (IGST)
                <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                  Outside Goa Billing
                </span>
              </button>
            </div>
          </div>

          {/* Tax Rates Inputs */}
          {invoice.taxMode === 'IGST' ? (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                IGST Rate (%)
              </label>
              <input
                type="number"
                step="0.5"
                value={invoice.igstRate ?? 18}
                onChange={(e) => onChange('igstRate', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 text-sm rounded border border-slate-300 font-mono"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  CGST Rate (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={invoice.cgstRate ?? 9}
                  onChange={(e) => onChange('cgstRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm rounded border border-slate-300 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  SGST Rate (%)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={invoice.sgstRate ?? 9}
                  onChange={(e) => onChange('sgstRate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-sm rounded border border-slate-300 font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Totals Summary & Words */}
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-col justify-between space-y-3">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Calculated Breakdown
            </span>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Value:</span>
                <span className="font-mono font-semibold">
                  {formatIndianCurrency(totals.taxableValue, true)}
                </span>
              </div>

              {invoice.taxMode === 'IGST' ? (
                <div className="flex justify-between text-slate-600">
                  <span>IGST ({invoice.igstRate}%):</span>
                  <span className="font-mono font-semibold">
                    {formatIndianCurrency(totals.igstAmount, true)}
                  </span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-slate-600">
                    <span>Add CGST ({invoice.cgstRate}%):</span>
                    <span className="font-mono font-semibold">
                      {formatIndianCurrency(totals.cgstAmount, true)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Add SGST ({invoice.sgstRate}%):</span>
                    <span className="font-mono font-semibold">
                      {formatIndianCurrency(totals.sgstAmount, true)}
                    </span>
                  </div>
                </>
              )}

              <div className="pt-2 border-t border-slate-300 flex justify-between items-baseline">
                <span className="font-black text-slate-900 text-sm">Gross Total:</span>
                <span className="font-mono font-black text-base text-blue-700">
                  {formatIndianCurrency(totals.grossTotal, true)}
                </span>
              </div>
            </div>
          </div>

          {/* Amount in words */}
          <div className="pt-2 border-t border-slate-200">
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Amount In Words (Auto-Generated)
            </label>
            <div className="p-2 bg-white rounded border border-slate-200 text-xs font-semibold text-slate-800 leading-snug">
              {totals.amountInWords}
            </div>
            {/* Optional Custom override */}
            <details className="mt-1 text-[11px] text-slate-500 cursor-pointer">
              <summary className="hover:text-blue-600">Edit words manually</summary>
              <input
                type="text"
                maxLength={MAX_LENGTHS.customAmountInWords}
                value={invoice.customAmountInWords || ''}
                onChange={(e) => onChange('customAmountInWords', e.target.value)}
                placeholder="Leave blank for automatic conversion"
                className="w-full mt-1 px-2 py-1 bg-white border border-slate-300 rounded text-xs"
              />
            </details>
          </div>
        </div>
      </div>
    </div>
  )}
</div>
);
}
