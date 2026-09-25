import React from 'react';
import { Plus, Trash2, ListChecks, ChevronDown, ChevronUp } from 'lucide-react';
import { COMMON_UOM, createEmptyItem } from '../../types/invoice';

export default function ItemsSection({ invoice, onChange, isCollapsed = false, onToggleCollapse }) {
  const items = invoice.items || [];

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };

    // Auto calculate amount if not manual
    if (field === 'colsDbs' || field === 'rate') {
      const qty = parseFloat(field === 'colsDbs' ? value : current.colsDbs);
      const rate = parseFloat(field === 'rate' ? value : current.rate);

      if (!current.isManualAmount && !isNaN(qty) && !isNaN(rate)) {
        current.amount = (Math.round(qty * rate * 100) / 100).toString();
      }
    }

    updated[index] = current;
    onChange('items', updated);
  };

  const toggleManualAmount = (index) => {
    const updated = [...items];
    const current = { ...updated[index] };
    current.isManualAmount = !current.isManualAmount;
    if (!current.isManualAmount) {
      const qty = parseFloat(current.colsDbs);
      const rate = parseFloat(current.rate);
      if (!isNaN(qty) && !isNaN(rate)) {
        current.amount = (Math.round(qty * rate * 100) / 100).toString();
      }
    }
    updated[index] = current;
    onChange('items', updated);
  };

  const addItem = () => {
    const newItem = createEmptyItem(items.length + 1);
    onChange('items', [...items, newItem]);
  };

  const removeItem = (index) => {
    if (items.length <= 1) {
      onChange('items', [createEmptyItem(1)]);
      return;
    }
    const filtered = items.filter((_, i) => i !== index);
    const reindexed = filtered.map((item, i) => ({ ...item, srNo: i + 1 }));
    onChange('items', reindexed);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Section Header (Clickable for Collapse/Expand) */}
      <div
        onClick={onToggleCollapse}
        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between cursor-pointer hover:bg-slate-50 transition border-b border-slate-100 gap-2"
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
            <ListChecks className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">
              Line Items ({items.length})
            </h3>
            {isCollapsed && (
              <p className="text-xs text-slate-400">
                {items.length} item{items.length === 1 ? '' : 's'} entered • Click to expand
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3" onClick={(e) => e.stopPropagation()}>
          <label className="flex items-center gap-1.5 text-xs text-slate-600 font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={invoice.fillPadRows ?? true}
              onChange={(e) => onChange('fillPadRows', e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span className="hidden md:inline">Pad Style</span>
          </label>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Row
          </button>
          <button
            type="button"
            onClick={onToggleCollapse}
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
          <div className="space-y-3">
        {items.map((item, index) => {
          const qty = parseFloat(item.colsDbs);
          const rate = parseFloat(item.rate);
          const isAuto = !item.isManualAmount && !isNaN(qty) && !isNaN(rate);

          return (
            <div
              key={item.id || index}
              className="bg-slate-50 hover:bg-slate-100/70 p-3.5 rounded-xl border border-slate-200 transition space-y-2.5"
            >
              {/* Row 1: Sr.No + Description + High-contrast Delete Button */}
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                  #{index + 1}
                </span>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                  placeholder="Item description or code (e.g. 10030.40, RPP busbar)"
                  className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 shadow-sm transition flex-shrink-0"
                  title="Delete this row"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Row 2: Spacious columns for Cols/DBs, UOM, Rate (₹), Amount (₹) */}
              <div className="grid grid-cols-12 gap-2 pt-0.5">
                {/* Cols/DBs */}
                <div className="col-span-3 sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                    Cols/DBs
                  </label>
                  <input
                    type="text"
                    value={item.colsDbs}
                    onChange={(e) => handleItemChange(index, 'colsDbs', e.target.value)}
                    placeholder="20"
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-center text-xs font-semibold focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* UOM */}
                <div className="col-span-3 sm:col-span-2">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                    UOM
                  </label>
                  <input
                    list="uom-options"
                    value={item.uom}
                    onChange={(e) => handleItemChange(index, 'uom', e.target.value.toUpperCase())}
                    className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-lg text-center text-xs font-bold uppercase focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <datalist id="uom-options">
                    {COMMON_UOM.map((u) => (
                      <option key={u} value={u} />
                    ))}
                  </datalist>
                </div>

                {/* Rate (₹) - Generous width for 5-6 digit numbers */}
                <div className="col-span-3 sm:col-span-4">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">
                    Rate (₹)
                  </label>
                  <input
                    type="text"
                    value={item.rate}
                    onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                    placeholder="28,000"
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-right text-xs font-mono font-bold focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Amount (₹) - Generous width for 6-7 digit amounts */}
                <div className="col-span-3 sm:col-span-4">
                  <div className="flex items-center justify-between mb-0.5">
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Amount (₹)
                    </label>
                    <button
                      type="button"
                      onClick={() => toggleManualAmount(index)}
                      title={item.isManualAmount ? 'Auto: Rate × Qty' : 'Set custom amount'}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      {item.isManualAmount ? '✏️ Custom' : '⚡ Auto'}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.amount}
                    readOnly={isAuto}
                    onChange={(e) => handleItemChange(index, 'amount', e.target.value)}
                    placeholder="0.00"
                    className={`w-full px-2.5 py-1.5 border rounded-lg text-right text-xs font-mono font-extrabold outline-none ${
                      isAuto
                        ? 'bg-slate-100 border-slate-300 text-slate-900'
                        : 'bg-amber-50 border-amber-300 text-amber-900 focus:ring-1 focus:ring-amber-500'
                    }`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Add Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={addItem}
          className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50 text-slate-600 hover:text-blue-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-4 h-4" /> Add Next Item Row
        </button>
      </div>
        </div>
      )}
    </div>
  );
}
