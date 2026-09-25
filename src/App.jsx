import React, { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import CompanySection from './components/InvoiceForm/CompanySection';
import ClientSection from './components/InvoiceForm/ClientSection';
import MetaSection from './components/InvoiceForm/MetaSection';
import ItemsSection from './components/InvoiceForm/ItemsSection';
import TaxSection from './components/InvoiceForm/TaxSection';
import InvoicePad from './components/InvoicePreview/InvoicePad';
import ShareModal from './components/ShareModal';
import HistoryModal from './components/HistoryModal';
import Footer from './components/Footer';
import {
  SAMPLE_INVOICE,
  createNewInvoice,
} from './types/invoice';
import {
  loadCurrentInvoice,
  saveCurrentInvoice,
  saveInvoiceToHistory,
} from './utils/storage';
import { downloadInvoicePDF } from './utils/pdfGenerator';
import { calculateInvoiceTotals } from './utils/calculator';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Share2,
  Download,
  Eye,
  Edit3,
  Layers,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function App() {
  const [invoice, setInvoice] = useState(() => loadCurrentInvoice());
  const [activeMobileTab, setActiveMobileTab] = useState('form'); // 'form' | 'preview'
  const [showShareModal, setShowShareModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toast, setToast] = useState('');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [fitMode, setFitMode] = useState(() => (typeof window !== 'undefined' && window.innerWidth < 768 ? 'fit' : 'manual'));
  const [containerWidth, setContainerWidth] = useState(800);
  const [sheetHeight, setSheetHeight] = useState(1123);
  const [monochromeLogo, setMonochromeLogo] = useState(false);
  const previewContainerRef = useRef(null);
  const BASE_PAD_WIDTH = 794; // approx 210mm at 96 DPI
  const [collapsedSections, setCollapsedSections] = useState({
    company: true, // company profile closed by default to save vertical height
    meta: false,
    client: false,
    items: false,
    tax: false,
  });

  const toggleSection = (key) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const areAllOpen = Object.values(collapsedSections).every((c) => !c);

  const toggleCollapseAll = () => {
    const targetState = areAllOpen; // If all open, collapse all (true). If any collapsed, expand all (false).
    setCollapsedSections({
      company: targetState,
      meta: targetState,
      client: targetState,
      items: targetState,
      tax: targetState,
    });
  };

  // Auto-save draft on every change
  useEffect(() => {
    saveCurrentInvoice(invoice);
  }, [invoice]);

  // Responsive auto-fit scaling for mobile viewports
  useEffect(() => {
    const updateDimensions = () => {
      if (previewContainerRef.current) {
        setContainerWidth(previewContainerRef.current.clientWidth);
      } else if (typeof window !== 'undefined') {
        setContainerWidth(window.innerWidth - 24);
      }
      const el = document.getElementById('invoice-pad-preview');
      if (el) {
        setSheetHeight(el.offsetHeight || 1123);
      }
    };

    updateDimensions();
    const timer = setTimeout(updateDimensions, 60);
    window.addEventListener('resize', updateDimensions);

    let ro = null;
    if (typeof ResizeObserver !== 'undefined' && previewContainerRef.current) {
      ro = new ResizeObserver(() => {
        updateDimensions();
      });
      ro.observe(previewContainerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateDimensions);
      if (ro) ro.disconnect();
    };
  }, [activeMobileTab, invoice]);

  const availableWidth = Math.max(280, containerWidth - 16);
  const autoFitScale = Math.min(1, Math.max(0.3, availableWidth / BASE_PAD_WIDTH));
  const effectiveScale = fitMode === 'fit' ? autoFitScale : zoomLevel;

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleFieldChange = (field, value) => {
    setInvoice((prev) => ({
      ...prev,
      [field]: value,
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleNewInvoice = () => {
    if (window.confirm('Create a new blank invoice? Any unsaved changes on current invoice will be cleared.')) {
      const fresh = createNewInvoice();
      setInvoice(fresh);
      showToast('New blank invoice created');
    }
  };

  const handleLoadSample = () => {
    setInvoice({ ...SAMPLE_INVOICE, id: `inv-${Date.now()}` });
    showToast('Loaded sample invoice');
  };

  const handleSaveInvoice = () => {
    saveInvoiceToHistory(invoice);
    showToast(`Invoice ${invoice.invoiceNo} saved to history!`);
  };

  const handleLoadFromHistory = (savedInvoice) => {
    setInvoice(savedInvoice);
    showToast(`Loaded invoice ${savedInvoice.invoiceNo}`);
  };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      // Auto-save invoice to history on download
      saveInvoiceToHistory(invoice);
      await downloadInvoicePDF('invoice-pad-preview', invoice.invoiceNo);
      showToast(`Invoice ${invoice.invoiceNo} downloaded & saved to history!`);
    } catch (err) {
      console.error(err);
      alert('Failed to generate PDF. Please try again or download as Image.');
    } finally {
      setIsDownloading(false);
    }
  };

  const totals = calculateInvoiceTotals(invoice);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-16 right-4 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {toast}
        </div>
      )}

      {/* Main Top Header Navigation */}
      <Header
        onNewInvoice={handleNewInvoice}
        onLoadSample={handleLoadSample}
        onSaveInvoice={handleSaveInvoice}
        onOpenHistory={() => setShowHistoryModal(true)}
        onOpenShare={() => setShowShareModal(true)}
        onDownloadPdf={handleDownloadPDF}
        isDownloading={isDownloading}
        activeMobileTab={activeMobileTab}
        setActiveMobileTab={setActiveMobileTab}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto p-2 sm:p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT PANE: INVOICE FORM (Visible on laptop, or when mobileTab === 'form') */}
          <section
            className={`lg:col-span-6 xl:col-span-5 space-y-4 ${
              activeMobileTab === 'form' ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-blue-600" />
                Invoice Editor
              </h2>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={toggleCollapseAll}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition active:scale-95"
                  title={areAllOpen ? 'Collapse all sections' : 'Expand all sections'}
                >
                  {areAllOpen ? (
                    <>
                      <ChevronUp className="w-3.5 h-3.5" /> Collapse All
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-3.5 h-3.5" /> Expand All
                    </>
                  )}
                </button>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  {invoice.items?.length || 0} items
                </span>
              </div>
            </div>

            {/* Form Sections */}
            <CompanySection
              company={invoice.company}
              onChange={handleFieldChange}
              isCollapsed={collapsedSections.company}
              onToggleCollapse={() => toggleSection('company')}
            />
            <MetaSection
              invoice={invoice}
              onChange={handleFieldChange}
              isCollapsed={collapsedSections.meta}
              onToggleCollapse={() => toggleSection('meta')}
            />
            <ClientSection
              invoice={invoice}
              onChange={handleFieldChange}
              isCollapsed={collapsedSections.client}
              onToggleCollapse={() => toggleSection('client')}
            />
            <ItemsSection
              invoice={invoice}
              onChange={handleFieldChange}
              isCollapsed={collapsedSections.items}
              onToggleCollapse={() => toggleSection('items')}
            />
            <TaxSection
              invoice={invoice}
              onChange={handleFieldChange}
              isCollapsed={collapsedSections.tax}
              onToggleCollapse={() => toggleSection('tax')}
            />

            {/* Mobile "Jump to Preview" Button */}
            <div className="block lg:hidden pt-4 pb-12">
              <button
                type="button"
                onClick={() => setActiveMobileTab('preview')}
                className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg"
              >
                <Eye className="w-4 h-4" /> View Live Invoice Preview
              </button>
            </div>
          </section>

          {/* RIGHT PANE: LIVE INVOICE PREVIEW (Visible on laptop, or when mobileTab === 'preview') */}
          <section
            className={`lg:col-span-6 xl:col-span-7 flex flex-col items-center w-full ${
              activeMobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
            }`}
          >
            {/* Live Preview Controls Header */}
            <div className="w-full max-w-[210mm] flex flex-wrap items-center justify-between gap-2 bg-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-sm border border-slate-200 mb-3 no-print">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-blue-600" /> Live Pad Replica
                </span>
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono font-medium hidden sm:inline">
                  A4 Print Format
                </span>
              </div>

              {/* View options */}
              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                {/* Mobile Fit vs 100% Quick Toggle */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setFitMode('fit')}
                    className={`px-2 py-1 rounded transition text-[11px] ${
                      fitMode === 'fit'
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Fit invoice to screen width"
                  >
                    Fit Screen
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFitMode('manual');
                      setZoomLevel(1);
                    }}
                    className={`px-2 py-1 rounded transition text-[11px] ${
                      fitMode === 'manual' && zoomLevel === 1
                        ? 'bg-blue-600 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="View 100% actual size"
                  >
                    100%
                  </button>
                </div>

                {/* Monochrome logo toggle */}
                <button
                  type="button"
                  onClick={() => setMonochromeLogo(!monochromeLogo)}
                  className={`text-[11px] px-2 py-1 rounded border font-medium transition ${
                    monochromeLogo
                      ? 'bg-slate-800 text-white border-slate-800'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Toggle black & white pad logo vs vibrant blue logo"
                >
                  {monochromeLogo ? 'Pad B&W Logo' : 'Color Logo'}
                </button>

                {/* Zoom Controls (Accessible on both mobile & desktop) */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-slate-700">
                  <button
                    type="button"
                    onClick={() => {
                      setFitMode('manual');
                      setZoomLevel((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))));
                    }}
                    className="p-1 hover:bg-white rounded transition text-slate-600 hover:text-slate-900"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono font-bold px-1 min-w-[38px] text-center">
                    {Math.round(effectiveScale * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFitMode('manual');
                      setZoomLevel((z) => Math.min(1.5, Number((z + 0.1).toFixed(2))));
                    }}
                    className="p-1 hover:bg-white rounded transition text-slate-600 hover:text-slate-900"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFitMode('fit')}
                    className="p-1 hover:bg-white rounded transition text-slate-600 hover:text-slate-900 hidden sm:inline-block"
                    title="Reset to Fit Screen"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Sheet Container with auto-fit and bottom clearance */}
            <div
              ref={previewContainerRef}
              className="w-full overflow-x-auto flex justify-center py-2 px-1 pb-28 sm:pb-8"
            >
              <div
                className="transition-all duration-150 shadow-2xl rounded-sm print-area-wrapper mx-auto"
                style={{
                  width: `${Math.round(BASE_PAD_WIDTH * effectiveScale)}px`,
                  height: `${Math.round(sheetHeight * effectiveScale)}px`,
                  minWidth: `${Math.round(BASE_PAD_WIDTH * effectiveScale)}px`,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${BASE_PAD_WIDTH}px`,
                    transform: `scale(${effectiveScale})`,
                    transformOrigin: 'top left',
                  }}
                >
                  <InvoicePad
                    invoice={invoice}
                    options={{
                      monochromeLogo,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Mobile Bottom Floating Action Bar */}
            <div className="block lg:hidden fixed bottom-4 left-4 right-4 z-40 no-print">
              <div className="bg-slate-900/95 backdrop-blur-md text-white p-2.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setActiveMobileTab('form')}
                  className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5 text-blue-400" /> Back to Edit
                </button>

                <button
                  type="button"
                  onClick={() => setShowShareModal(true)}
                  className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share Image
                </button>

                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isDownloading}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Website Footer */}
      <Footer />

      {/* Modals */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        invoice={invoice}
        onDownloadPdf={handleDownloadPDF}
      />

      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onLoadInvoice={handleLoadFromHistory}
      />
    </div>
  );
}
