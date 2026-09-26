import React from 'react';
import { FileText, Calendar, Hash, Plus, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { MAX_LENGTHS, isValidInvoiceNo } from '../../utils/validation';

export default function MetaSection({ invoice, onChange, isCollapsed = false, onToggleCollapse }) {
  const incrementInvoiceNo = () => {
    const currentNo = invoice.invoiceNo || '';
    // Look for the last contiguous sequence of digits
    const match = currentNo.match(/^(.*?)(\d+)([^\d]*)$/);
    if (match) {
      const prefix = match[1];
      const digits = match[2];
      const suffix = match[3];
      const nextNum = parseInt(digits, 10) + 1;
      // Preserve zero padding if exists, e.g. 05 -> 06
      const padded = digits.startsWith('0') && digits.length > 1
        ? String(nextNum).padStart(digits.length, '0')
        : String(nextNum);
      onChange('invoiceNo', `${prefix}${padded}${suffix}`);
    } else {
      const currentYear = new Date().getFullYear().toString().slice(2);
      const nextYear = (parseInt(currentYear, 10) + 1).toString();
      onChange('invoiceNo', `VE ${currentYear}/${nextYear} A-1`);
    }
  };

  const metaSummary = `${invoice.invoiceNo || 'No Invoice #'}${
    invoice.invoiceDate ? ` • ${invoice.invoiceDate}` : ''
  }`;

  const invNoVal = (invoice.invoiceNo || '').trim();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Section Header (Clickable for Collapse/Expand) */}
      <div
        onClick={onToggleCollapse}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition border-b border-slate-100"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Invoice Details
            </h3>
            {isCollapsed && (
              <p className="text-xs text-slate-500 font-medium truncate max-w-[240px] sm:max-w-md">
                {metaSummary}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {isCollapsed ? 'Click to expand' : 'Number & Date'}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Invoice No */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5 text-slate-400" />
                  Invoice No.
                </label>
                <div className="flex items-center gap-2">
                  {invNoVal && isValidInvoiceNo(invNoVal) && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <Check className="w-3 h-3" /> Valid #
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={incrementInvoiceNo}
                    title="Increment last number (+1)"
                    className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition active:scale-95 shadow-2xs"
                  >
                    <Plus className="w-3 h-3 stroke-[2.5]" /> 1
                  </button>
                </div>
              </div>
              <input
                type="text"
                maxLength={MAX_LENGTHS.invoiceNo}
                value={invoice.invoiceNo || ''}
                onChange={(e) => onChange('invoiceNo', e.target.value)}
                placeholder="e.g. VE 26/27 A-5"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 font-semibold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Invoice Date */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Invoice Date
              </label>
              <input
                type="date"
                maxLength={MAX_LENGTHS.invoiceDate}
                value={invoice.invoiceDate || ''}
                onChange={(e) => onChange('invoiceDate', e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
