import React, { useState, useEffect, useRef } from 'react';
import { User, MapPin, AtSign, Plus, Trash2, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { loadSavedClients, saveClientPreset, deleteClientPreset } from '../../utils/clientStorage';
import { MAX_LENGTHS } from '../../utils/validation';

export default function ClientSection({ invoice, onChange, isCollapsed = false, onToggleCollapse }) {
  const [clients, setClients] = useState(() => loadSavedClients());
  const [selectedClientId, setSelectedClientId] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientBillTo, setNewClientBillTo] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const dropdownRef = useRef(null);

  const quickPlaces = ['Verna', 'Sancoal', 'Zuarinagar', 'Panaji', 'Margao', 'Mapusa', 'Goa'];

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenAddModal = () => {
    setNewClientName('');
    setNewClientBillTo(invoice.billTo || '');
    setErrorMsg('');
    setShowAddModal(true);
  };

  const handleSaveNewClient = (e) => {
    e.preventDefault();
    if (!newClientName.trim()) {
      setErrorMsg('Please enter a client name / label.');
      return;
    }
    if (!newClientBillTo.trim()) {
      setErrorMsg('Please enter the client address / Bill To details.');
      return;
    }

    const res = saveClientPreset({
      name: newClientName,
      billTo: newClientBillTo,
    });

    if (res.success) {
      setClients(res.clients);
      setSelectedClientId(res.newPreset.id);
      onChange('billTo', res.newPreset.billTo);
      setShowAddModal(false);
      setNewClientName('');
      setNewClientBillTo('');
    } else {
      setErrorMsg(res.error || 'Failed to save client');
    }
  };

  const handleDeleteClient = (id, e) => {
    if (e) e.stopPropagation();
    const updated = deleteClientPreset(id);
    setClients(updated);
    if (selectedClientId === id) {
      setSelectedClientId('');
    }
  };

  // Preview label for collapsed state
  const clientSummary = invoice.billTo
    ? invoice.billTo.split('\n')[0].substring(0, 30)
    : 'No client entered';

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Section Header (Clickable for Collapse/Expand) */}
      <div
        onClick={onToggleCollapse}
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition border-b border-slate-100"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <User className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Client & Service Details
            </h3>
            {isCollapsed && (
              <p className="text-xs text-slate-500 font-medium truncate max-w-[240px] sm:max-w-md">
                {clientSummary}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            {isCollapsed ? 'Click to expand' : 'Billed party details'}
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
          {/* Custom Client Presets Dropdown & Add Button Row */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                Saved Client Presets
              </label>
              <button
                type="button"
                onClick={handleOpenAddModal}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition active:scale-95"
                title="Add new client preset"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Client
              </button>
            </div>

            {/* Custom Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white hover:bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition text-left flex items-center justify-between font-sans text-slate-700 font-medium shadow-sm"
              >
                <span className={selectedClient ? 'text-slate-900 font-semibold truncate' : 'text-slate-500 truncate'}>
                  {selectedClient ? selectedClient.name : '-- Select a Saved Client (Fills Bill To) --'}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-150 flex-shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDropdownOpen && (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-30 max-h-64 overflow-y-auto py-1 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClientId('');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs font-semibold hover:bg-slate-100 transition flex items-center justify-between ${!selectedClientId ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}
                  >
                    <span>-- Select a Saved Client (Fills Bill To) --</span>
                    {!selectedClientId && <Check className="w-3.5 h-3.5 text-blue-600" />}
                  </button>

                  <div className="h-px bg-slate-100 my-1" />

                  {clients.length === 0 ? (
                    <div className="px-3 py-3 text-xs text-slate-400 text-center italic">
                      No saved client presets. Click "+ Add Client" to save one.
                    </div>
                  ) : (
                    clients.map((c) => {
                      const isSelected = c.id === selectedClientId;
                      return (
                        <div
                          key={c.id}
                          onClick={() => {
                            setSelectedClientId(c.id);
                            if (c.billTo) {
                              onChange('billTo', c.billTo);
                            }
                            setIsDropdownOpen(false);
                          }}
                          className={`group px-3 py-2 hover:bg-blue-50/70 cursor-pointer flex items-center justify-between transition border-b border-slate-50 last:border-none ${
                            isSelected ? 'bg-blue-50 text-blue-900' : 'text-slate-700'
                          }`}
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="font-semibold text-xs truncate flex items-center gap-1.5">
                              {c.name}
                              {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 inline flex-shrink-0" />}
                            </div>
                            {c.billTo && (
                              <div className="text-[11px] text-slate-400 truncate">
                                {c.billTo.split('\n')[0]}
                              </div>
                            )}
                          </div>

                          <button
                            type="button"
                            onClick={(e) => handleDeleteClient(c.id, e)}
                            className="p-1.5 text-rose-600 hover:bg-rose-100/80 hover:text-rose-700 border border-rose-200 bg-rose-50/50 rounded-md transition shadow-xs flex-shrink-0"
                            title={`Delete ${c.name} preset`}
                            aria-label={`Delete ${c.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bill To */}
            <div className="md:col-span-3">
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Bill To (Client Name, Address & GSTIN)
                </label>
                <span className="text-[10px] text-slate-400 font-mono">max {MAX_LENGTHS.billTo}</span>
              </div>
              <textarea
                rows="3"
                maxLength={MAX_LENGTHS.billTo}
                value={invoice.billTo || ''}
                onChange={(e) => onChange('billTo', e.target.value)}
                placeholder="e.g. APEX ENGINEERING WORKS&#10;Plot No. 45, Phase II, Industrial Area&#10;Goa - 403722"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-sans"
              />
            </div>

            {/* Place of Service (Location - 1/3 width) */}
            <div className="md:col-span-1">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                Place Of Service
              </label>
              <input
                type="text"
                maxLength={MAX_LENGTHS.placeOfService}
                value={invoice.placeOfService || ''}
                onChange={(e) => onChange('placeOfService', e.target.value.slice(0, MAX_LENGTHS.placeOfService))}
                placeholder="e.g. Verna, Goa"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
              {/* Quick chips */}
              <div className="flex flex-wrap gap-1 mt-1.5">
                {quickPlaces.map((place) => (
                  <button
                    key={place}
                    type="button"
                    onClick={() => onChange('placeOfService', place)}
                    className="px-1.5 py-0.5 text-[10px] rounded bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition"
                  >
                    {place}
                  </button>
                ))}
              </div>
            </div>

            {/* Kind Attention / Client GSTIN (@ - 2/3 width for long names & GSTIN) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1 flex items-center gap-1">
                <AtSign className="w-3.5 h-3.5 text-slate-400" />
                Kind Attention / Client GSTIN
              </label>
              <input
                type="text"
                maxLength={MAX_LENGTHS.kindAttention}
                value={invoice.kindAttention || ''}
                onChange={(e) => onChange('kindAttention', e.target.value.slice(0, MAX_LENGTHS.kindAttention))}
                placeholder="e.g. Kind Attention: Accounts Department / GSTIN: 30AAAAA0000A1Z5"
                className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Add New Client Preset
              </h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewClient} className="p-4 space-y-3.5">
              {errorMsg && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                  Client Name / Label *
                </label>
                <input
                  type="text"
                  maxLength={MAX_LENGTHS.companyName}
                  value={newClientName}
                  onChange={(e) => setNewClientName(e.target.value)}
                  placeholder="e.g. Apex Engineering Works"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
                  autoFocus
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                    Company Bill To Address *
                  </label>
                  {invoice.billTo && (
                    <button
                      type="button"
                      onClick={() => setNewClientBillTo(invoice.billTo)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-medium underline"
                    >
                      Use current Bill To
                    </button>
                  )}
                </div>
                <textarea
                  rows="4"
                  maxLength={MAX_LENGTHS.billTo}
                  value={newClientBillTo}
                  onChange={(e) => setNewClientBillTo(e.target.value)}
                  placeholder="e.g. APEX ENGINEERING WORKS&#10;Plot No. 45, Phase II, Industrial Area&#10;Goa - 403722"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-sans"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  Save Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
