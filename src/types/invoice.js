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
});

export const SAMPLE_INVOICE = {
  id: 'sample-inv-1',
  company: { ...DEFAULT_COMPANY },
  invoiceNo: 'VE 26/27 A-5',
  invoiceDate: '2026-09-05',
  poNo: '',
  poDate: '',
  billTo: 'APEX ENGINEERING WORKS\nPlot No. 45, Phase II, Industrial Area\nGoa - 403722',
  placeOfService: 'Goa',
  kindAttention: 'Kind Attention: Accounts & Billing Department',
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
      description: 'Electrical Panel Maintenance & Servicing',
      colsDbs: '20',
      uom: 'NOS',
      rate: '7500',
      amount: '150000',
    },
    {
      id: 'item-2',
      srNo: 2,
      description: 'Control Wiring & Cable Termination',
      colsDbs: '10',
      uom: 'NOS',
      rate: '7500',
      amount: '75000',
    },
    {
      id: 'item-3',
      srNo: 3,
      description: 'Transformer Oil Filtration & Testing',
      colsDbs: '5',
      uom: 'NOS',
      rate: '6500',
      amount: '32500',
    },
    {
      id: 'item-4',
      srNo: 4,
      description: 'Switchgear Overhaul & Calibration',
      colsDbs: '6',
      uom: 'NOS',
      rate: '6500',
      amount: '39000',
    },
    {
      id: 'item-5',
      srNo: 5,
      description: 'Busbar Fabrication & Installation',
      colsDbs: '2',
      uom: 'NOS',
      rate: '28000',
      amount: '56000',
    },
    {
      id: 'item-6',
      srNo: 6,
      description: 'Industrial Sensor & Relay Testing',
      colsDbs: '10',
      uom: 'NOS',
      rate: '820',
      amount: '8200',
    },
    {
      id: 'item-7',
      srNo: 7,
      description: 'Motor Rewinding & Balancing',
      colsDbs: '2',
      uom: 'NOS',
      rate: '25230',
      amount: '50460',
    },
    {
      id: 'item-8',
      srNo: 8,
      description: 'Power Distribution Unit Servicing',
      colsDbs: '2',
      uom: 'NOS',
      rate: '23700',
      amount: '47400',
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
