import React, { useState, useEffect } from 'react';
import { User, MapPin, AtSign, Plus, Trash2, ChevronDown, ChevronUp, X, Check } from 'lucide-react';
import { loadSavedClients, saveClientPreset, deleteClientPreset } from '../../utils/clientStorage';

export default function ClientSection({ invoice, onChange, isCollapsed = false, onToggleCollapse }) {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newClientName, setNewClientName] = useState('');
  const [newClientBillTo, setNewClientBillTo] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const quickPlaces = ['Verna', 'Sancoal', 'Zuarinagar', 'Panaji', 'Margao', 'Mapusa', 'Goa'];

  useEffect(() => {
    setClients(loadSavedClients());
  }, []);

  const handleSelectClient = (e) => {
    const id = e.target.value;
    setSelectedClientId(id);
    if (!id) return;

    const chosen = clients.find((c) => c.id === id);
    if (chosen && chosen.billTo) {
      // Per user instruction: only Bill To is populated; rest are entered manually
      onChange('billTo', chosen.billTo);
    }
  };

  const handleOpenAddModal = () => {
    setNewClientName('');
    // Pre-populate with current Bill To if available for quick saving
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

  const handleDeleteClient = (id) => {
    if (window.confirm('Delete this client preset from saved list?')) {
      const updated = deleteClientPreset(id);
      setClients(updated);
      if (selectedClientId === id) {
        setSelectedClientId('');
      }
    }
  };

  // Preview label for collapsed state
  const clientSummary = invoice.billTo
    ? invoice.billTo.split('\n')[0].substring(0, 30)
    : 'No client entered';

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
          {/* Client Presets Dropdown & Add Button Row */}
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

            <div className="flex items-center gap-2">
              <select
                value={selectedClientId}
                onChange={handleSelectClient}
                className="flex-1 px-3 py-2 text-sm rounded-lg border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition font-sans text-slate-700 font-medium"
              >
                <option value="">-- Select a Saved Client (Fills Bill To) --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {/* Delete custom client button */}
              {selectedClientId && !clients.find((c) => c.id === selectedClientId)?.isDefault && (
                <button
                  type="button"
                  onClick={() => handleDeleteClient(selectedClientId)}
                  className="p-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition"
                  title="Delete this saved client"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Bill To */}
            <div className="md:col-span-3">
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1">
                Bill To (Client Name, Address & GSTIN)
              </label>
              <textarea
                rows="3"
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
                value={invoice.placeOfService || ''}
                onChange={(e) => onChange('placeOfService', e.target.value)}
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
                value={invoice.kindAttention || ''}
                onChange={(e) => onChange('kindAttention', e.target.value)}
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
