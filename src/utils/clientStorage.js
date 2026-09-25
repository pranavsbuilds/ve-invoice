const STORAGE_KEY_CLIENTS = 'vedant_saved_clients';

export const DEFAULT_CLIENT_PRESETS = [
  {
    id: 'preset-marine-electricals',
    name: 'Marine Electricals (Verna)',
    billTo: 'MARINE ELECTRICALS\nIndustrial Estate Verna\n403722 GOA',
    isDefault: true,
  },
];

export function loadSavedClients() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_CLIENTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load saved clients from storage', e);
  }
  return [...DEFAULT_CLIENT_PRESETS];
}

export function saveClientPreset(preset) {
  try {
    const clients = loadSavedClients();
    const newPreset = {
      id: `client-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: preset.name.trim(),
      billTo: preset.billTo.trim(),
      isDefault: false,
      createdAt: new Date().toISOString(),
    };
    const updated = [newPreset, ...clients];
    localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(updated));
    return { success: true, clients: updated, newPreset };
  } catch (e) {
    console.error('Failed to save client preset', e);
    return { success: false, error: e.message };
  }
}

export function deleteClientPreset(id) {
  try {
    const clients = loadSavedClients();
    const updated = clients.filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEY_CLIENTS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete client preset', e);
    return [];
  }
}
