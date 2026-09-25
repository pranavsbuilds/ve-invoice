import React, { useState } from 'react';
import { X, History, Trash2, FolderOpen, Copy, Download, Upload, CheckCircle2 } from 'lucide-react';
import {
  loadInvoiceHistory,
  deleteInvoiceFromHistory,
  exportAllInvoicesJSON,
  importInvoicesJSON,
  saveInvoiceToHistory,
} from '../utils/storage';
import { formatIndianCurrency } from '../utils/numberToWords';
import { calculateInvoiceTotals } from '../utils/calculator';

export default function HistoryModal({ isOpen, onClose, onLoadInvoice }) {
  const [history, setHistory] = useState(() => loadInvoiceHistory());
  const [msg, setMsg] = useState('');

  if (!isOpen) return null;

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this invoice from history?')) {
      const updated = deleteInvoiceFromHistory(id);
      setHistory(updated);
      setMsg('Invoice deleted from history');
      setTimeout(() => setMsg(''), 2500);
    }
  };

  const handleDuplicate = (inv) => {
    const currentYear = new Date().getFullYear().toString().slice(2);
    const nextYear = (parseInt(currentYear) + 1).toString();
    const duplicated = {
      ...inv,
      id: `inv-${Date.now()}`,
      invoiceNo: `VE ${currentYear}/${nextYear} A-${Math.floor(10 + Math.random() * 90)}`,
      invoiceDate: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString(),
    };
    saveInvoiceToHistory(duplicated);
    setHistory(loadInvoiceHistory());
    onLoadInvoice(duplicated);
    onClose();
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (typeof content === 'string') {
        const ok = importInvoicesJSON(content);
        if (ok) {
          setHistory(loadInvoiceHistory());
          setMsg('Invoices restored successfully from backup!');
        } else {
          alert('Invalid backup JSON file.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base">Invoice History & Ledger</h3>
              <p className="text-xs text-slate-400">
                {history.length} saved {history.length === 1 ? 'invoice' : 'invoices'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message Banner */}
        {msg && (
          <div className="bg-emerald-50 text-emerald-800 text-xs font-semibold px-4 py-2 border-b border-emerald-200 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {msg}
          </div>
        )}

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No saved invoices found.
            </div>
          ) : (
            history.map((inv) => {
              const totals = calculateInvoiceTotals(inv);
              const clientFirstLine = (inv.billTo || '').split('\n')[0] || 'Unspecified Client';

              return (
                <div
                  key={inv.id}
                  className="bg-slate-50 hover:bg-slate-100/80 p-3.5 rounded-xl border border-slate-200 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm font-mono">
                        {inv.invoiceNo}
                      </span>
                      <span className="text-xs text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {inv.invoiceDate}
                      </span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                        {inv.items?.length || 0} items
                      </span>
                    </div>

                    <div className="text-xs text-slate-700 font-semibold truncate max-w-sm">
                      {clientFirstLine}
                    </div>

                    <div className="text-xs text-slate-500">
                      Total:{' '}
                      <span className="font-mono font-bold text-slate-900">
                        {formatIndianCurrency(totals.grossTotal, true)}
                      </span>
                      {inv.placeOfService && ` • Service: ${inv.placeOfService}`}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        onLoadInvoice(inv);
                        onClose();
                      }}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition"
                      title="Load into Editor"
                    >
                      <FolderOpen className="w-3.5 h-3.5" /> Open
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDuplicate(inv)}
                      className="p-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-200 text-xs font-medium transition"
                      title="Duplicate as new invoice"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(inv.id)}
                      className="p-1.5 bg-white hover:bg-rose-50 text-rose-600 hover:text-rose-700 rounded-lg border border-slate-200 text-xs transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Backup Controls */}
        <div className="bg-slate-100 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportAllInvoicesJSON}
              className="text-xs font-semibold text-slate-700 hover:text-blue-700 flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 shadow-sm transition"
            >
              <Download className="w-3.5 h-3.5 text-blue-600" /> Export Backup (JSON)
            </button>

            <label className="text-xs font-semibold text-slate-700 hover:text-blue-700 flex items-center gap-1.5 px-2.5 py-1.5 bg-white rounded-lg border border-slate-300 shadow-sm cursor-pointer transition">
              <Upload className="w-3.5 h-3.5 text-blue-600" /> Restore Backup
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
