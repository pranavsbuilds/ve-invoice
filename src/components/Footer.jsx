import React from 'react';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400 mt-12 border-t border-slate-800 no-print">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Business Identity */}
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2 text-white font-extrabold text-base tracking-wide">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                VE
              </div>
              <span>VEDANT ENTERPRISES</span>
            </div>
            <span className="hidden sm:inline text-slate-700">|</span>
            <p className="text-xs text-slate-400">
              Official Tax Invoice Generator matching the physical preprinted invoice pad with 100% visual layout fidelity.
            </p>
          </div>

          {/* Privacy Badge */}
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/60 border border-emerald-800/60 rounded-lg px-3 py-1.5 shrink-0">
            <ShieldCheck className="w-4 h-4" />
            <span>Offline & Private (Saved in Local Storage)</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {currentYear} Vedant Enterprises, Goa. All rights reserved.</p>
          <p className="flex items-center gap-1 text-slate-400">
            Engineered for precision billing & physical invoice pad fidelity
          </p>
        </div>
      </div>
    </footer>
  );
}
