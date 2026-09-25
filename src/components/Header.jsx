import React from 'react';
import {
  FilePlus,
  Save,
  History,
  Share2,
  Download,
  BookOpen,
  Eye,
  Edit3,
} from 'lucide-react';

export default function Header({
  onNewInvoice,
  onLoadSample,
  onSaveInvoice,
  onOpenHistory,
  onOpenShare,
  onDownloadPdf,
  isDownloading,
  activeMobileTab,
  setActiveMobileTab,
}) {
  return (
    <header className="bg-slate-900 text-white sticky top-0 z-40 shadow-md no-print">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        {/* Left: Branding */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-inner overflow-hidden">
              <img src="/ve-logo.jpg" alt="VE Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-wide text-white font-serif">
                  VEDANT ENTERPRISES
                </h1>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white">
                  Tax Invoice
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Goa GST & UDYAM Compliant Generator
              </p>
            </div>
          </div>

          {/* Mobile Tab Switcher */}
          <div className="flex md:hidden bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              type="button"
              onClick={() => setActiveMobileTab('form')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                activeMobileTab === 'form'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit
            </button>
            <button
              type="button"
              onClick={() => setActiveMobileTab('preview')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                activeMobileTab === 'preview'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Presets & Management */}
          <button
            type="button"
            onClick={onNewInvoice}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title="Create blank invoice"
          >
            <FilePlus className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden lg:inline">New</span>
          </button>

          <button
            type="button"
            onClick={onLoadSample}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-medium border border-slate-700 transition"
            title="Load the real Marine Electricals invoice from sample pad photo"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sample Invoice</span>
          </button>

          <button
            type="button"
            onClick={onSaveInvoice}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-medium border border-slate-700 transition"
            title="Save invoice to local history"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save</span>
          </button>

          <button
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            title="View saved invoices history"
          >
            <History className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">History</span>
          </button>

          <div className="h-5 w-[1px] bg-slate-700 mx-1 hidden sm:block"></div>

          {/* Primary Operations: Share & Download */}
          <button
            type="button"
            onClick={onOpenShare}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition"
            title="Share invoice image via WhatsApp or device"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Image</span>
          </button>

          <button
            type="button"
            onClick={onDownloadPdf}
            disabled={isDownloading}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white text-xs font-bold shadow-md transition ${
              isDownloading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
            title="Download PDF directly"
          >
            <Download className={`w-3.5 h-3.5 ${isDownloading ? 'animate-bounce' : ''}`} />
            <span>{isDownloading ? 'Generating...' : 'Download PDF'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
