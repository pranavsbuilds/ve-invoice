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
  placeOfService: 12, // Exactly 12 characters max
  kindAttention: 100,
  description: 120,
  colsDbs: 7, // 7 digits (no decimal point)
  uom: 8,
  rate: 15, // max 7 digits before decimal point
  amount: 18, // max 9 digits before decimal point
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

// Rate limiting: 7 digits (no decimal point) or '-'
export function filterQuantity(val) {
  if (!val && val !== 0) return '';
  const str = val.toString();
  if (str === '-') return '-';
  return str.replace(/[^0-9]/g, '').slice(0, 7);
}

// Rate limiting: max 7 digits before decimal point, optional commas & up to 2 decimal places, or '-'
export function filterRate(val) {
  if (!val && val !== 0) return '';
  const str = val.toString();
  if (str === '-') return '-';
  const cleaned = str.replace(/[^0-9.,]/g, '');
  const parts = cleaned.split('.');
  let intPart = parts[0];
  const intDigits = intPart.replace(/,/g, '');
  if (intDigits.length > 7) {
    let count = 0;
    let truncated = '';
    for (const ch of intPart) {
      if (ch >= '0' && ch <= '9') {
        if (count < 7) {
          truncated += ch;
          count++;
        }
      } else {
        truncated += ch;
      }
    }
    intPart = truncated;
  }
  if (parts.length > 1) {
    const decPart = parts.slice(1).join('').replace(/[^0-9]/g, '').slice(0, 2);
    return `${intPart}.${decPart}`;
  }
  return intPart;
}

// Rate limiting: max 9 digits before decimal point, optional commas & up to 2 decimal places, or '-'
export function filterAmount(val) {
  if (!val && val !== 0) return '';
  const str = val.toString();
  if (str === '-') return '-';
  const cleaned = str.replace(/[^0-9.,]/g, '');
  const parts = cleaned.split('.');
  let intPart = parts[0];
  const intDigits = intPart.replace(/,/g, '');
  if (intDigits.length > 9) {
    let count = 0;
    let truncated = '';
    for (const ch of intPart) {
      if (ch >= '0' && ch <= '9') {
        if (count < 9) {
          truncated += ch;
          count++;
        }
      } else {
        truncated += ch;
      }
    }
    intPart = truncated;
  }
  if (parts.length > 1) {
    const decPart = parts.slice(1).join('').replace(/[^0-9]/g, '').slice(0, 2);
    return `${intPart}.${decPart}`;
  }
  return intPart;
}
