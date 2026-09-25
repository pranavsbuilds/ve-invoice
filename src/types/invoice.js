export const DEFAULT_COMPANY = {
  name: 'VEDANT ENTERPRISES',
  address: 'H No 271/1, Zuarinagar, Sancoal, Goa - 403726',
  email: 'baburaosapugade@gmail.com',
  phone: '7769011502 / 9284052061',
  gstin: '30TCEPS9342N1ZP',
  udyam: 'UDYAM-GA-02-0025499',
  defaultSac: '998719',
};

export const COMMON_UOM = [
  'NOS',
  'SETS',
  'MTR',
  'KGS',
  'LOT',
  'HOURS',
  'DAYS',
  'PKTS',
];

export const COMMON_SAC_CODES = [
  { code: '998719', label: '998719 - Maintenance & repair of electrical/machinery' },
  { code: '9954', label: '9954 - General construction / installation services' },
  { code: '998314', label: '998314 - Engineering & technical testing services' },
  { code: '9987', label: '9987 - Maintenance, repair & installation services' },
];

export const createEmptyItem = (srNo = 1) => ({
  id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
  srNo,
  description: '',
  colsDbs: '',
  uom: 'NOS',
  rate: '',
  amount: '',
  isManualAmount: false,
});

export const SAMPLE_INVOICE = {
  id: 'sample-inv-1',
  company: { ...DEFAULT_COMPANY },
  invoiceNo: 'VE 26/27 A-5',
  invoiceDate: '2026-09-05',
  poNo: '',
  poDate: '',
  billTo: 'MARINE ELECTRICALS\nIndustrial Estate Verna\n403722 GOA',
  placeOfService: 'Verna',
  kindAttention: 'M/s. Chaitali Gaude / GSTIN 30AAFCM3153Q1ZQ',
  sacCode: '998719',
  taxMode: 'CGST_SGST', // 'CGST_SGST' or 'IGST'
  cgstRate: 9,
  sgstRate: 9,
  igstRate: 18,
  fillPadRows: true, // pad with blank rows to simulate physical sheet
  targetRowCount: 16,
  items: [
    {
      id: 'item-1',
      srNo: 1,
      description: '10030.40',
      colsDbs: '20',
      uom: 'NOS',
      rate: '7500',
      amount: '150000',
      isManualAmount: false,
    },
    {
      id: 'item-2',
      srNo: 2,
      description: '10030.14',
      colsDbs: '10',
      uom: 'NOS',
      rate: '7500',
      amount: '75000',
      isManualAmount: false,
    },
    {
      id: 'item-3',
      srNo: 3,
      description: '15983.9',
      colsDbs: '5',
      uom: 'NOS',
      rate: '6500',
      amount: '32500',
      isManualAmount: false,
    },
    {
      id: 'item-4',
      srNo: 4,
      description: '15983.10',
      colsDbs: '6',
      uom: 'NOS',
      rate: '6500',
      amount: '39000',
      isManualAmount: false,
    },
    {
      id: 'item-5',
      srNo: 5,
      description: '15966.12',
      colsDbs: '2',
      uom: 'NOS',
      rate: '28000',
      amount: '56000',
      isManualAmount: false,
    },
    {
      id: 'item-6',
      srNo: 6,
      description: '16002.01, 10030.14, 100291.14',
      colsDbs: '10',
      uom: 'NOS',
      rate: '820',
      amount: '8200',
      isManualAmount: false,
    },
    {
      id: 'item-7',
      srNo: 7,
      description: 'TALLY',
      colsDbs: '-',
      uom: 'NOS',
      rate: '-',
      amount: '50460',
      isManualAmount: true,
    },
    {
      id: 'item-8',
      srNo: 8,
      description: 'RPP busbar',
      colsDbs: '2',
      uom: 'NOS',
      rate: '23700',
      amount: '47400',
      isManualAmount: false,
    },
  ],
  customAmountInWords: '',
  authorisedSignatory: 'VEDANT ENTERPRISES',
  updatedAt: new Date().toISOString(),
};

export const getNextInvoiceNumber = () => {
  const currentYear = new Date().getFullYear().toString().slice(2);
  const nextYear = (parseInt(currentYear, 10) + 1).toString();
  const defaultNo = `VE ${currentYear}/${nextYear} A-1`;

  try {
    const raw = typeof window !== 'undefined' ? localStorage.getItem('vedant_invoice_history') : null;
    if (raw) {
      const history = JSON.parse(raw);
      if (Array.isArray(history) && history.length > 0) {
        const lastInv = history.find((inv) => inv && inv.invoiceNo);
        if (lastInv && lastInv.invoiceNo) {
          const match = lastInv.invoiceNo.match(/^(.*?)(\d+)([^\d]*)$/);
          if (match) {
            const prefix = match[1];
            const digits = match[2];
            const suffix = match[3];
            const nextNum = parseInt(digits, 10) + 1;
            const padded = digits.startsWith('0') && digits.length > 1
              ? String(nextNum).padStart(digits.length, '0')
              : String(nextNum);
            return `${prefix}${padded}${suffix}`;
          }
        }
      }
    }
  } catch {
    // fallback to default
  }

  return defaultNo;
};

export const createNewInvoice = () => {
  const today = new Date().toISOString().split('T')[0];
  return {
    id: `inv-${Date.now()}`,
    company: { ...DEFAULT_COMPANY },
    invoiceNo: getNextInvoiceNumber(),
    invoiceDate: today,
    poNo: '',
    poDate: '',
    billTo: '',
    placeOfService: 'Goa',
    kindAttention: '',
    sacCode: '998719',
    taxMode: 'CGST_SGST',
    cgstRate: 9,
    sgstRate: 9,
    igstRate: 18,
    fillPadRows: true,
    targetRowCount: 16,
    items: [createEmptyItem(1)],
    customAmountInWords: '',
    authorisedSignatory: 'VEDANT ENTERPRISES',
    updatedAt: new Date().toISOString(),
  };
};
