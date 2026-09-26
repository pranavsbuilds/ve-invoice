import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Download,
  Check,
  Image as ImageIcon,
  Loader2,
  MessageCircle,
  FileText,
} from 'lucide-react';
import {
  shareInvoiceImage,
  copyInvoiceImageToClipboard,
  downloadInvoiceImage,
} from '../utils/imageHelper';
import { saveInvoiceToHistory } from '../utils/storage';

export default function ShareModal({
  isOpen,
  onClose,
  invoice,
  onDownloadPdf,
  onSharePdf,
  isSharingPdf = false,
}) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleShareImage = async () => {
    setSharing(true);
    setFeedback('');
    try {
      saveInvoiceToHistory(invoice);
      const res = await shareInvoiceImage('invoice-pad-preview', invoice.invoiceNo);
      if (res.success) {
        if (res.method === 'download_fallback') {
          setFeedback('Native sharing not supported here — invoice image downloaded & saved to history!');
        } else {
          setFeedback('Share sheet opened & invoice saved to history!');
        }
      } else if (!res.cancelled) {
        setFeedback('Could not open share menu. Try Copy Image or Download Image.');
      }
    } catch (err) {
      console.error(err);
      setFeedback('Error generating image for sharing.');
    } finally {
      setSharing(false);
      setTimeout(() => setFeedback(''), 4000);
    }
  };

  const handleCopyImage = async () => {
    setFeedback('');
    try {
      const ok = await copyInvoiceImageToClipboard('invoice-pad-preview');
      if (ok) {
        setCopied(true);
        setFeedback('Image copied to clipboard! You can paste (Ctrl+V) directly into WhatsApp Web or email.');
        setTimeout(() => setCopied(false), 3000);
      } else {
        setFeedback('Direct clipboard image copy not supported by this browser. Use "Download Image" instead.');
      }
    } catch (err) {
      console.error(err);
      setFeedback('Failed to copy image to clipboard.');
    }
  };

  const handleDownloadImage = async () => {
    setDownloading(true);
    setFeedback('');
    try {
      saveInvoiceToHistory(invoice);
      await downloadInvoiceImage('invoice-pad-preview', invoice.invoiceNo);
      setFeedback('Invoice image (PNG) downloaded & saved to history!');
    } catch (err) {
      console.error(err);
      setFeedback('Failed to download image.');
    } finally {
      setDownloading(false);
      setTimeout(() => setFeedback(''), 3500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="font-bold text-base">Share Invoice Image</h3>
              <p className="text-xs text-slate-400">Invoice {invoice.invoiceNo}</p>
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

        <div className="p-5 space-y-4">
          {feedback && (
            <div className="bg-blue-50 text-blue-900 text-xs font-semibold p-3 rounded-xl border border-blue-200 text-center leading-relaxed">
              {feedback}
            </div>
          )}

          {/* Primary Action: Direct Share Image (Mobile & Desktop) */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 text-center space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-emerald-900 font-extrabold text-xs uppercase tracking-wider">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              Direct Image Share (WhatsApp / Device)
            </div>
            <p className="text-xs text-emerald-800">
              Shares the high-resolution invoice image directly to WhatsApp, Telegram, or other apps on your device.
            </p>
            <button
              type="button"
              onClick={handleShareImage}
              disabled={sharing}
              className="w-full mt-1 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition"
            >
              {sharing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Generating Image...
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" /> Share Invoice Image
                </>
              )}
            </button>
          </div>

          {/* Secondary Actions: Copy Image & Download Image */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {/* Copy Image Button */}
            <button
              type="button"
              onClick={handleCopyImage}
              className="flex flex-col items-center justify-center text-center p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 text-slate-800 transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mb-1.5 group-hover:scale-110 transition">
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </div>
              <span className="font-bold text-xs">
                {copied ? 'Image Copied!' : 'Copy Image'}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                Paste (Ctrl+V) in WhatsApp Web
              </span>
            </button>

            {/* Download Image Button */}
            <button
              type="button"
              onClick={handleDownloadImage}
              disabled={downloading}
              className="flex flex-col items-center justify-center text-center p-3.5 rounded-xl border border-slate-200 hover:border-indigo-500 hover:bg-indigo-50/50 text-slate-800 transition group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 mb-1.5 group-hover:scale-110 transition">
                {downloading ? <Loader2 className="w-4 h-4 animate-spin text-indigo-600" /> : <Download className="w-4 h-4" />}
              </div>
              <span className="font-bold text-xs">
                {downloading ? 'Downloading...' : 'Save Image (PNG)'}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                High-DPI PNG download
              </span>
            </button>
          </div>

          {/* PDF Sharing & Downloading Options */}
          <div className="space-y-2 pt-1 border-t border-slate-100">
            {onSharePdf && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onSharePdf();
                }}
                disabled={isSharingPdf}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition active:scale-[0.98]"
              >
                <Share2 className="w-4 h-4" />
                {isSharingPdf ? 'Preparing PDF...' : 'Share Official A4 PDF Document'}
              </button>
            )}

            {onDownloadPdf && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onDownloadPdf();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-sm transition active:scale-[0.98]"
              >
                <FileText className="w-4 h-4 text-slate-600" />
                Download Official A4 PDF Document
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
