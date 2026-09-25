import React from 'react';
import { Building2, Phone, Mail, MapPin, ShieldCheck, Heart, FileText, Download, RotateCcw } from 'lucide-react';

export default function Footer({ onNewInvoice, onLoadSample, onOpenHistory, onDownloadPdf }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 mt-12 border-t border-slate-800 no-print">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Col 1: Business Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-extrabold text-base tracking-wide">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                VE
              </div>
              <span>VEDANT ENTERPRISES</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Tax Invoice Generator matching the physical preprinted invoice pad with 100% visual layout fidelity.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 rounded-lg px-2.5 py-1.5 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Offline & Private (Saved in Local Storage)</span>
            </div>
          </div>

          {/* Col 2: Registration & Tax Identifiers */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              Tax Registration
            </h4>
            <ul className="text-xs space-y-1.5 font-mono">
              <li>
                <span className="text-slate-500">GSTIN:</span>{' '}
                <strong className="text-slate-200">30TCEPS9342N1ZP</strong>
              </li>
              <li>
                <span className="text-slate-500">UDYAM:</span>{' '}
                <strong className="text-slate-200">UDYAM-GA-02-0025499</strong>
              </li>
              <li>
                <span className="text-slate-500">State:</span>{' '}
                <span className="text-slate-300">Goa (State Code 30)</span>
              </li>
              <li>
                <span className="text-slate-500">Default SAC:</span>{' '}
                <span className="text-slate-300">998719</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Registered Office */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-400" />
              Office & Contact
            </h4>
            <div className="text-xs space-y-1.5">
              <p className="flex items-start gap-1.5 text-slate-300 leading-snug">
                <span>H No 271/1, Zuarinagar, Sancoal, Goa - 403726</span>
              </p>
              <p className="flex items-center gap-1.5 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <a href="tel:7769011502" className="hover:text-white transition">
                  7769011502
                </a>{' '}
                /{' '}
                <a href="tel:9284052061" className="hover:text-white transition">
                  9284052061
                </a>
              </p>
              <p className="flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <a href="mailto:baburaosapugade@gmail.com" className="hover:text-white transition truncate">
                  baburaosapugade@gmail.com
                </a>
              </p>
            </div>
          </div>

          {/* Col 4: Quick Actions */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Quick Shortcuts
            </h4>
            <div className="flex flex-col gap-1.5 text-xs">
              <button
                type="button"
                onClick={onNewInvoice}
                className="text-left text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5"
              >
                <FileText className="w-3.5 h-3.5 text-blue-400" /> Create Blank Invoice
              </button>
              <button
                type="button"
                onClick={onLoadSample}
                className="text-left text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5"
              >
                <RotateCcw className="w-3.5 h-3.5 text-amber-400" /> Load Sample Invoice
              </button>
              <button
                type="button"
                onClick={onOpenHistory}
                className="text-left text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" /> View Invoice History
              </button>
              <button
                type="button"
                onClick={onDownloadPdf}
                className="text-left text-slate-400 hover:text-white transition flex items-center gap-1.5 py-0.5"
              >
                <Download className="w-3.5 h-3.5 text-indigo-400" /> Download PDF Document
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {currentYear} Vedant Enterprises, Goa. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Engineered for precision billing & physical invoice pad fidelity
          </p>
        </div>
      </div>
    </footer>
  );
}
