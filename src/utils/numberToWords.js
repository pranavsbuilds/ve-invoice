/**
 * Converts a numeric amount to Indian Currency Words format
 * e.g., 541100.80 -> "Five Lakh Forty One Thousand One Hundred Rupees and Eighty Paise Only"
 */

const ones = [
  '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
  'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
  'Seventeen', 'Eighteen', 'Nineteen'
];

const tens = [
  '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
];

function convertTwoDigits(num) {
  if (num < 20) {
    return ones[num];
  }
  const t = Math.floor(num / 10);
  const o = num % 10;
  return (tens[t] + (o > 0 ? ' ' + ones[o] : '')).trim();
}

function convertThreeDigits(num) {
  const h = Math.floor(num / 100);
  const rest = num % 100;
  let str = '';
  if (h > 0) {
    str += ones[h] + ' Hundred';
  }
  if (rest > 0) {
    if (str.length > 0) str += ' ';
    str += convertTwoDigits(rest);
  }
  return str.trim();
}

export function numberToWordsIndian(amount) {
  if (amount === undefined || amount === null || isNaN(amount) || amount === '') {
    return '';
  }

  const num = Number(amount);
  if (num === 0) {
    return 'Zero Rupees Only';
  }

  if (num < 0) {
    return 'Minus ' + numberToWordsIndian(Math.abs(num));
  }

  const rounded = Math.round(num * 100) / 100;
  const integerPart = Math.floor(rounded);
  const decimalPart = Math.round((rounded - integerPart) * 100);

  let remaining = integerPart;
  const parts = [];

  // Crores (num >= 1,00,00,000)
  if (remaining >= 10000000) {
    const crores = Math.floor(remaining / 10000000);
    remaining %= 10000000;
    parts.push(numberToWordsIndian(crores).replace(' Rupees Only', '') + ' Crore');
  }

  // Lakhs (num >= 1,00,000)
  if (remaining >= 100000) {
    const lakhs = Math.floor(remaining / 100000);
    remaining %= 100000;
    parts.push(convertTwoDigits(lakhs) + ' Lakh');
  }

  // Thousands (num >= 1,000)
  if (remaining >= 1000) {
    const thousands = Math.floor(remaining / 1000);
    remaining %= 1000;
    parts.push(convertTwoDigits(thousands) + ' Thousand');
  }

  // Hundreds & Below
  if (remaining > 0) {
    parts.push(convertThreeDigits(remaining));
  }

  let words = parts.join(' ').trim();
  if (words.length > 0) {
    words = words + ' Rupees';
  } else {
    words = 'Zero Rupees';
  }

  if (decimalPart > 0) {
    words += ' and ' + convertTwoDigits(decimalPart) + ' Paise';
  }

  return words + ' Only';
}

/**
 * Format number into Indian comma format e.g. 5,41,100.80
 */
export function formatIndianCurrency(amount, showSymbol = false) {
  if (amount === undefined || amount === null || isNaN(amount) || amount === '') {
    return showSymbol ? '₹ 0.00' : '0.00';
  }
  const num = Number(amount);
  const formatted = num.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return showSymbol ? `₹ ${formatted}` : formatted;
}
