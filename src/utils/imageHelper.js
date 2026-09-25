import html2canvas from 'html2canvas';

export async function captureInvoiceCanvas(elementId = 'invoice-pad-preview') {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error('Invoice element not found');
  }

  // Preserve original inline styles and normalize wrappers
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
      scale: 3, // Ultra-sharp resolution for printing & sharing
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
    });
    return canvas;
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

export async function downloadInvoiceImage(elementId = 'invoice-pad-preview', invoiceNo = 'Invoice') {
  const canvas = await captureInvoiceCanvas(elementId);
  const cleanInvoiceNo = (invoiceNo || 'Invoice').replace(/[^a-zA-Z0-9_-]/g, '_');

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return resolve(false);
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice_${cleanInvoiceNo}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      resolve(true);
    }, 'image/png', 1.0);
  });
}

export async function copyInvoiceImageToClipboard(elementId = 'invoice-pad-preview') {
  const canvas = await captureInvoiceCanvas(elementId);

  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return resolve(false);
      try {
        if (navigator.clipboard && window.ClipboardItem) {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          resolve(true);
        } else {
          resolve(false);
        }
      } catch (err) {
        console.error('Failed to copy image to clipboard', err);
        resolve(false);
      }
    }, 'image/png', 1.0);
  });
}

export async function shareInvoiceImage(elementId = 'invoice-pad-preview', invoiceNo = 'Invoice') {
  const canvas = await captureInvoiceCanvas(elementId);
  const cleanInvoiceNo = (invoiceNo || 'Invoice').replace(/[^a-zA-Z0-9_-]/g, '_');

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) return resolve({ success: false, error: 'Blob failed' });

      const file = new File([blob], `Invoice_${cleanInvoiceNo}.png`, { type: 'image/png' });

      // Check if Web Share API with files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Invoice ${invoiceNo} - Vedant Enterprises`,
            text: `Invoice ${invoiceNo} from Vedant Enterprises`,
          });
          resolve({ success: true, method: 'native' });
        } catch (err) {
          if (err.name === 'AbortError') {
            resolve({ success: false, cancelled: true });
          } else {
            console.error('Share failed', err);
            resolve({ success: false, error: err });
          }
        }
      } else {
        // Fallback: Download image
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Invoice_${cleanInvoiceNo}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resolve({ success: true, method: 'download_fallback' });
      }
    }, 'image/png', 1.0);
  });
}
