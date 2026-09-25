import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export async function downloadInvoicePDF(elementId, invoiceNo = 'Invoice') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Invoice preview element not found');
  }

  // Temporarily reset any scaling on element and its preview containers
  const wrapper = element.closest('.print-area-wrapper');
  const innerScaled = element.parentElement;

  const originalTransform = element.style.transform;
  const originalWrapperStyle = wrapper ? wrapper.getAttribute('style') : null;
  const originalInnerStyle = innerScaled ? innerScaled.getAttribute('style') : null;

  element.style.transform = 'none';
  if (wrapper) {
    wrapper.style.width = 'auto';
    wrapper.style.height = 'auto';
    wrapper.style.overflow = 'visible';
  }
  if (innerScaled && innerScaled !== wrapper) {
    innerScaled.style.transform = 'none';
    innerScaled.style.width = 'auto';
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 3, // High resolution for crisp borders and text
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });

    const imgData = canvas.toDataURL('image/png');

    // Standard A4 dimensions in mm: 210 x 297
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pdfWidth = 210;
    const pdfHeight = 297;

    // Scale precisely so the entire sheet with its outer black border fits on exactly 1 A4 page
    const widthRatio = pdfWidth / canvas.width;
    const heightRatio = pdfHeight / canvas.height;
    const scale = Math.min(widthRatio, heightRatio);

    const renderedWidth = canvas.width * scale;
    const renderedHeight = canvas.height * scale;

    // Center horizontally and vertically
    const xPos = (pdfWidth - renderedWidth) / 2;
    const yPos = (pdfHeight - renderedHeight) / 2;

    pdf.addImage(imgData, 'PNG', xPos, yPos, renderedWidth, renderedHeight, '', 'FAST');

    const cleanInvoiceNo = (invoiceNo || 'Invoice').replace(/[^a-zA-Z0-9_-]/g, '_');
    pdf.save(`Invoice_${cleanInvoiceNo}.pdf`);
    return true;
  } finally {
    element.style.transform = originalTransform;
    if (wrapper) {
      if (originalWrapperStyle) wrapper.setAttribute('style', originalWrapperStyle);
      else wrapper.removeAttribute('style');
    }
    if (innerScaled && innerScaled !== wrapper) {
      if (originalInnerStyle) innerScaled.setAttribute('style', originalInnerStyle);
      else innerScaled.removeAttribute('style');
    }
  }
}

export function printInvoice() {
  window.print();
}
