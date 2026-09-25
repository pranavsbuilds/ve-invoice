import { numberToWordsIndian } from './numberToWords';

export function calculateInvoiceTotals(invoice) {
  const items = invoice.items || [];
  
  let taxableValue = 0;
  
  const processedItems = items.map((item, index) => {
    let amt = 0;
    const cleanQtyStr = (item.colsDbs || '').toString().replace(/,/g, '').trim();
    const cleanRateStr = (item.rate || '').toString().replace(/,/g, '').trim();
    const cleanAmtStr = (item.amount || '').toString().replace(/,/g, '').trim();

    const qty = parseFloat(cleanQtyStr);
    const rate = parseFloat(cleanRateStr);
    const parsedAmt = parseFloat(cleanAmtStr);

    if (cleanAmtStr !== '' && cleanAmtStr !== '-' && !isNaN(parsedAmt)) {
      amt = Math.round(parsedAmt * 100) / 100;
    } else if (!isNaN(qty) && !isNaN(rate)) {
      amt = Math.round(qty * rate * 100) / 100;
    } else {
      amt = 0;
    }

    taxableValue += amt;

    return {
      ...item,
      srNo: index + 1,
      calculatedAmount: amt,
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
