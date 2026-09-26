import React, { useState } from 'react';
import { Building2, ChevronDown, ChevronUp, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { DEFAULT_COMPANY } from '../../types/invoice';
import {
  MAX_LENGTHS,
  isValidGSTIN,
  isValidUdyam,
  isValidPhone,
  isValidEmail,
} from '../../utils/validation';

export default function CompanySection({
  company,
  onChange,
  isCollapsed = true,
  onToggleCollapse,
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = onToggleCollapse ? !isCollapsed : internalOpen;

  const handleToggle = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      setInternalOpen(!internalOpen);
    }
  };

  const resetCompany = () => {
    onChange('company', { ...DEFAULT_COMPANY });
  };

  const handleFieldChange = (field, value) => {
    onChange('company', {
      ...company,
      [field]: value,
    });
  };

  const gstinValue = (company?.gstin || '').trim();
  const udyamValue = (company?.udyam || '').trim();
  const phoneValue = (company?.phone || '').trim();
  const emailValue = (company?.email || '').trim();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div
        onClick={handleToggle}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">
              {company?.name || 'VEDANT ENTERPRISES'}
            </h3>
            <p className="text-xs text-slate-500">
              GSTIN: {company?.gstin} | UDYAM: {company?.udyam}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-600 font-medium">
            {isOpen ? 'Close Settings' : 'Edit Company Info'}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50 space-y-3">
          <div className="flex justify-between items-center py-2">
            <span className="text-xs font-semibold text-slate-500 uppercase">
              Business Profile Header
            </span>
            <button
              type="button"
              onClick={resetCompany}
              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium transition"
            >
              <RotateCcw className="w-3 h-3" /> Reset to Official Pad Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Company Name */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-600">Company Name</label>
                <span className="text-[10px] text-slate-400 font-mono">max {MAX_LENGTHS.companyName}</span>
              </div>
              <input
                type="text"
                maxLength={MAX_LENGTHS.companyName}
                value={company?.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Contact Phone */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-600">Contact Phone</label>
                {phoneValue && (
                  isValidPhone(phoneValue) ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <Check className="w-3 h-3" /> Valid Phone
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700">
                      <AlertCircle className="w-3 h-3" /> 10-digit format
                    </span>
                  )
                )}
              </div>
              <input
                type="text"
                maxLength={MAX_LENGTHS.companyPhone}
                value={company?.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="7769011502 / 9284052061"
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Email ID */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-600">Email ID</label>
                {emailValue && (
                  isValidEmail(emailValue) ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                      <Check className="w-3 h-3" /> Valid Email
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700">
                      <AlertCircle className="w-3 h-3" /> Invalid email
                    </span>
                  )
                )}
              </div>
              <input
                type="email"
                maxLength={MAX_LENGTHS.companyEmail}
                value={company?.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="company@domain.com"
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* Address */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-600">Address</label>
                <span className="text-[10px] text-slate-400 font-mono">max {MAX_LENGTHS.companyAddress}</span>
              </div>
              <input
                type="text"
                maxLength={MAX_LENGTHS.companyAddress}
                value={company?.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* GSTIN */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-600">GSTIN Number</label>
                {gstinValue && (
                  isValidGSTIN(gstinValue) ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <Check className="w-3 h-3" /> Valid GSTIN
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      <AlertCircle className="w-3 h-3 text-amber-600" /> 15-char format
                    </span>
                  )
                )}
              </div>
              <input
                type="text"
                maxLength={MAX_LENGTHS.companyGstin}
                value={company?.gstin || ''}
                onChange={(e) => handleFieldChange('gstin', e.target.value.toUpperCase())}
                placeholder="30TCEPS9342N1ZP"
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 font-mono font-bold uppercase focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* UDYAM */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-slate-600">UDYAM Reg Number</label>
                {udyamValue && (
                  isValidUdyam(udyamValue) ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                      <Check className="w-3 h-3" /> Valid UDYAM
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                      <AlertCircle className="w-3 h-3 text-amber-600" /> UDYAM-XX-00-0000000
                    </span>
                  )
                )}
              </div>
              <input
                type="text"
                maxLength={MAX_LENGTHS.companyUdyam}
                value={company?.udyam || ''}
                onChange={(e) => handleFieldChange('udyam', e.target.value.toUpperCase())}
                placeholder="UDYAM-GA-02-0025499"
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 font-mono font-bold uppercase focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
