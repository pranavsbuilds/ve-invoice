import { numberToWordsIndian } from './numberToWords';

export function calculateInvoiceTotals(invoice) {
  const items = invoice.items || [];
  
  let taxableValue = 0;
  
  const processedItems = items.map((item, index) => {
    let amt = 0;
    const qty = parseFloat(item.colsDbs);
    const rate = parseFloat(item.rate);

    if (item.isManualAmount || isNaN(qty) || isNaN(rate)) {
      amt = parseFloat(item.amount) || 0;
    } else {
      amt = Math.round(qty * rate * 100) / 100;
    }

    taxableValue += amt;

    return {
      ...item,
      srNo: index + 1,
      calculatedAmount: amt
    };
  });

  taxableValue = Math.round(taxableValue * 100) / 100;

  let cgstAmount = 0;
  let sgstAmount = 0;
  let igstAmount = 0;
  let grossTotal = taxableValue;

  if (invoice.taxMode === 'IGST') {
    const igstRate = parseFloat(invoice.igstRate) || 0;
    igstAmount = Math.round(taxableValue * (igstRate / 100) * 100) / 100;
    grossTotal = Math.round((taxableValue + igstAmount) * 100) / 100;
  } else {
    // CGST + SGST
    const cgstRate = parseFloat(invoice.cgstRate) || 0;
    const sgstRate = parseFloat(invoice.sgstRate) || 0;
    cgstAmount = Math.round(taxableValue * (cgstRate / 100) * 100) / 100;
    sgstAmount = Math.round(taxableValue * (sgstRate / 100) * 100) / 100;
    grossTotal = Math.round((taxableValue + cgstAmount + sgstAmount) * 100) / 100;
  }

  const amountInWords = invoice.customAmountInWords?.trim() 
    ? invoice.customAmountInWords 
    : numberToWordsIndian(grossTotal);

  return {
    processedItems,
    taxableValue,
    cgstAmount,
    sgstAmount,
    igstAmount,
    grossTotal,
    amountInWords,
  };
}
