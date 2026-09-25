import React, { useState } from 'react';
import { Building2, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { DEFAULT_COMPANY } from '../../types/invoice';

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
              className="text-xs text-rose-600 hover:text-rose-800 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3 h-3" /> Reset to Official Pad Defaults
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Company Name</label>
              <input
                type="text"
                value={company?.name || ''}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Contact Phone</label>
              <input
                type="text"
                value={company?.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Email ID</label>
              <input
                type="email"
                value={company?.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Address</label>
              <input
                type="text"
                value={company?.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={company?.gstin || ''}
                onChange={(e) => handleFieldChange('gstin', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">UDYAM Reg Number</label>
              <input
                type="text"
                value={company?.udyam || ''}
                onChange={(e) => handleFieldChange('udyam', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-slate-300 focus:ring-1 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
