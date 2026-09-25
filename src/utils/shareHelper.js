import { formatIndianCurrency } from './numberToWords';

export function createInvoiceShareText(invoice, totals) {
  const company = invoice.company?.name || 'VEDANT ENTERPRISES';
  const client = (invoice.billTo || '').split('\n')[0] || 'Valued Customer';
  const totalStr = formatIndianCurrency(totals.grossTotal, true);
  
  return `*TAX INVOICE - ${company}*
------------------------------
*Invoice No:* ${invoice.invoiceNo}
*Date:* ${invoice.invoiceDate}
*Billed To:* ${client}
*Place of Service:* ${invoice.placeOfService || 'Goa'}
*SAC Code:* ${invoice.sacCode}
------------------------------
*Taxable Value:* ${formatIndianCurrency(totals.taxableValue, true)}
${invoice.taxMode === 'IGST' 
  ? `*IGST (${invoice.igstRate}%):* ${formatIndianCurrency(totals.igstAmount, true)}`
  : `*CGST (${invoice.cgstRate}%):* ${formatIndianCurrency(totals.cgstAmount, true)}\n*SGST (${invoice.sgstRate}%):* ${formatIndianCurrency(totals.sgstAmount, true)}`
}
*Gross Total Value:* ${totalStr}
*Amount in Words:* ${totals.amountInWords}
------------------------------
*Contact:* ${invoice.company?.phone || '7769011502'}
*Email:* ${invoice.company?.email || 'baburaosapugade@gmail.com'}
*GSTIN:* ${invoice.company?.gstin || '30TCEPS9342N1ZP'}`;
}

export function shareViaWhatsApp(invoice, totals, customPhone = '') {
  const text = createInvoiceShareText(invoice, totals);
  const encoded = encodeURIComponent(text);
  const phoneClean = customPhone.replace(/[^0-9]/g, '');
  
  const url = phoneClean 
    ? `https://api.whatsapp.com/send?phone=${phoneClean}&text=${encoded}`
    : `https://api.whatsapp.com/send?text=${encoded}`;
    
  window.open(url, '_blank');
}

export async function shareViaNativeShare(invoice, totals) {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `Invoice ${invoice.invoiceNo} - Vedant Enterprises`,
        text: createInvoiceShareText(invoice, totals),
      });
      return { success: true };
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
      return { success: false, error: err };
    }
  }
  return { success: false, unsupported: true };
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy', err);
    return false;
  }
}
