// Validation and formatting utilities for statutory and business fields

export const GSTIN_REGEX = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
export const UDYAM_REGEX = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;
export const SAC_REGEX = /^99\d{2,4}$|^\d{4,6}$/;
export const PHONE_REGEX = /^(?:(?:\+91[\s-]?)?[6-9]\d{9})(?:\s*[/,]\s*(?:(?:\+91[\s-]?)?[6-9]\d{9}))*$/;
export const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const INVOICE_NO_REGEX = /^[A-Za-z0-9][A-Za-z0-9\s/\-_]{1,30}$/;

export const MAX_LENGTHS = {
  invoiceNo: 30,
  invoiceDate: 10,
  companyName: 80,
  companyPhone: 35,
  companyEmail: 60,
  companyAddress: 200,
  companyGstin: 15,
  companyUdyam: 24,
  billTo: 300,
  placeOfService: 50,
  kindAttention: 100,
  description: 120,
  colsDbs: 10,
  uom: 8,
  rate: 15,
  amount: 18,
  sacCode: 8,
  taxRate: 5,
  customAmountInWords: 200,
};

export function isValidGSTIN(val) {
  if (!val || typeof val !== 'string') return false;
  return GSTIN_REGEX.test(val.trim().toUpperCase());
}

export function isValidUdyam(val) {
  if (!val || typeof val !== 'string') return false;
  return UDYAM_REGEX.test(val.trim().toUpperCase());
}

export function isValidSAC(val) {
  if (!val || typeof val !== 'string') return false;
  return SAC_REGEX.test(val.trim());
}

export function isValidPhone(val) {
  if (!val || typeof val !== 'string') return false;
  return PHONE_REGEX.test(val.trim());
}

export function isValidEmail(val) {
  if (!val || typeof val !== 'string') return false;
  return EMAIL_REGEX.test(val.trim());
}

export function isValidInvoiceNo(val) {
  if (!val || typeof val !== 'string') return false;
  return INVOICE_NO_REGEX.test(val.trim());
}

export function cleanNumericString(val) {
  if (!val) return '';
  return val.toString().replace(/,/g, '').trim();
}
