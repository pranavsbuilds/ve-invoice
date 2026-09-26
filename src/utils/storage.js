import { createNewInvoice } from '../types/invoice';

const STORAGE_KEY_CURRENT = 'vedant_current_invoice';
const STORAGE_KEY_HISTORY = 'vedant_invoice_history';

export function loadCurrentInvoice() {
  // Always initialize in empty state (new blank invoice) on website load
  return createNewInvoice();
}

export function saveCurrentInvoice(invoice) {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(invoice));
  } catch (e) {
    console.error('Failed to save current invoice to storage', e);
  }
}

export function loadInvoiceHistory() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load invoice history', e);
  }
  return [];
}

export function saveInvoiceToHistory(invoice) {
  try {
    const history = loadInvoiceHistory();
    const existingIndex = history.findIndex((inv) => inv.id === invoice.id);
    const updatedInvoice = { ...invoice, updatedAt: new Date().toISOString() };

    let newHistory;
    if (existingIndex >= 0) {
      newHistory = [...history];
      newHistory[existingIndex] = updatedInvoice;
    } else {
      newHistory = [updatedInvoice, ...history];
    }

    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newHistory));
    return newHistory;
  } catch (e) {
    console.error('Failed to save invoice to history', e);
    return [];
  }
}

export function deleteInvoiceFromHistory(id) {
  try {
    const history = loadInvoiceHistory();
    const newHistory = history.filter((inv) => inv.id !== id);
    localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newHistory));
    return newHistory;
  } catch (e) {
    console.error('Failed to delete invoice from history', e);
    return [];
  }
}

export function exportAllInvoicesJSON() {
  const history = loadInvoiceHistory();
  const current = loadCurrentInvoice();
  const data = {
    exportedAt: new Date().toISOString(),
    current,
    history,
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `vedant_invoices_backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importInvoicesJSON(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    if (data.history && Array.isArray(data.history)) {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(data.history));
      if (data.current) {
        localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(data.current));
      }
      return true;
    }
  } catch (e) {
    console.error('Failed to import invoices', e);
  }
  return false;
}
