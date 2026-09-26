import React, { useState, useEffect, useRef } from 'react';
import {
  FilePlus,
  Save,
  History,
  Share2,
  Download,
  BookOpen,
  Eye,
  Edit3,
  MoreVertical,
  X,
} from 'lucide-react';

export default function Header({
  onNewInvoice,
  onLoadSample,
  onSaveInvoice,
  onOpenHistory,
  onOpenShare,
  onDownloadPdf,
  onSharePdf,
  isDownloading,
  isSharingPdf = false,
  activeMobileTab,
  setActiveMobileTab,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMenuOpen]);
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

          {/* Mobile Right Controls: Tab Switcher & 3-Dots Action Menu */}
          <div className="flex md:hidden items-center gap-1.5">
            {/* Mobile Tab Switcher */}
            <div className="flex bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                type="button"
                onClick={() => setActiveMobileTab('form')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition ${
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
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-semibold transition ${
                  activeMobileTab === 'preview'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
            </div>

            {/* 3-Dots Mobile Menu Toggle */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setIsMenuOpen((prev) => !prev)}
                className={`p-2 rounded-lg border transition flex items-center justify-center min-w-[38px] min-h-[38px] ${
                  isMenuOpen
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-400/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                }`}
                title="More Actions"
                aria-label="More options"
                aria-expanded={isMenuOpen}
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {/* Mobile Dropdown Menu with all 6 Header Actions */}
              {isMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs md:hidden"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3.5 py-2 border-b border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Invoice Actions
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-slate-400 hover:text-white p-1 rounded-md transition"
                        aria-label="Close menu"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="py-1">
                      {/* 1. New Invoice */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onNewInvoice();
                        }}
                        className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition active:bg-slate-700 min-h-[44px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <FilePlus className="w-4 h-4" />
                        </div>
                        <div>
                          <div>New Invoice</div>
                          <div className="text-[10px] text-slate-400 font-normal">Create blank invoice</div>
                        </div>
                      </button>

                      {/* 2. Sample Invoice */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onLoadSample();
                        }}
                        className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition active:bg-slate-700 min-h-[44px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-amber-300">Sample Invoice</div>
                          <div className="text-[10px] text-slate-400 font-normal">Load electrical maintenance demo</div>
                        </div>
                      </button>

                      {/* 3. Save Invoice */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onSaveInvoice();
                        }}
                        className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition active:bg-slate-700 min-h-[44px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                          <Save className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-emerald-300">Save Invoice</div>
                          <div className="text-[10px] text-slate-400 font-normal">Save to local browser history</div>
                        </div>
                      </button>

                      {/* 4. Saved Invoices History */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenHistory();
                        }}
                        className="w-full px-3.5 py-2.5 text-left text-xs font-semibold text-slate-200 hover:bg-slate-800 hover:text-white flex items-center gap-3 transition active:bg-slate-700 min-h-[44px]"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400">
                          <History className="w-4 h-4" />
                        </div>
                        <div>
                          <div>Invoice History</div>
                          <div className="text-[10px] text-slate-400 font-normal">View previously saved invoices</div>
                        </div>
                      </button>
                    </div>

                    {/* Primary Operations: Share & Download */}
                    <div className="border-t border-slate-800 p-2 space-y-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onOpenShare();
                        }}
                        className="w-full px-3 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98] min-h-[44px]"
                      >
                        <Share2 className="w-4 h-4" />
                        <span>Share Image</span>
                      </button>

                      {onSharePdf && (
                        <button
                          type="button"
                          onClick={() => {
                            setIsMenuOpen(false);
                            onSharePdf();
                          }}
                          disabled={isSharingPdf}
                          className="w-full px-3 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98] min-h-[44px]"
                        >
                          <Share2 className={`w-4 h-4 ${isSharingPdf ? 'animate-spin' : ''}`} />
                          <span>{isSharingPdf ? 'Sharing PDF...' : 'Share PDF'}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onDownloadPdf();
                        }}
                        disabled={isDownloading}
                        className={`w-full px-3 py-2.5 rounded-lg text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition active:scale-[0.98] min-h-[44px] ${
                          isDownloading
                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        <Download className={`w-4 h-4 ${isDownloading ? 'animate-bounce' : ''}`} />
                        <span>{isDownloading ? 'Generating PDF...' : 'Download PDF'}</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons (Desktop view: visible on md screens and wider) */}
        <div className="hidden md:flex items-center flex-wrap gap-2">
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
            title="Load sample invoice with standard line items"
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

          {onSharePdf && (
            <button
              type="button"
              onClick={onSharePdf}
              disabled={isSharingPdf}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-white text-xs font-bold shadow-sm transition ${
                isSharingPdf ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
              title="Share invoice PDF via device"
            >
              <Share2 className={`w-3.5 h-3.5 ${isSharingPdf ? 'animate-spin' : ''}`} />
              <span>{isSharingPdf ? 'Sharing PDF...' : 'Share PDF'}</span>
            </button>
          )}

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
