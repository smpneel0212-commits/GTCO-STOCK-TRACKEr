/**
 * GTCO Stock Tracker - APMC Agent Ledger & Inventory Platform
 * Implements APMC Commission Agent / Arhatiya workflows for:
 * Inward Lot generation, 50kg weighing standardization, buyer billing,
 * farmer accounting, and loose stock inventory tracking.
 */

// Commodity Master configuration
const COMMODITY_MASTER = {
  TR: { code: 'TR', name: 'Pigeon Pea', localName: 'Toor / Tuvar', unitKg: 50, prefix: 'T' },
  CH: { code: 'CH', name: 'Bengal Gram', localName: 'Chana', unitKg: 50, prefix: 'C' },
  MG: { code: 'MG', name: 'Green Gram', localName: 'Moong', unitKg: 50, prefix: 'M' },
  UD: { code: 'UD', name: 'Black Gram', localName: 'Urad / Matt Pe', unitKg: 50, prefix: 'U' },
  JW: { code: 'JW', name: 'Sorghum', localName: 'Jowar', unitKg: 50, prefix: 'J' },
  SF: { code: 'SF', name: 'Safflower', localName: 'Kusub', unitKg: 50, prefix: 'S' }
};

// Initial Seed Data directly matching specification
const INITIAL_INWARD_LOTS = [
  {
    lotId: 'T01',
    dateTime: '2026-04-10T09:30',
    farmerName: 'Ramesh Patil',
    commodityCode: 'TR',
    unweighedBags: 10,
    storageLocation: 'Godown 1 - Bin A',
    status: 'Weighed & Sold'
  },
  {
    lotId: 'C03',
    dateTime: '2026-04-11T10:15',
    farmerName: 'Suresh Deshmukh',
    commodityCode: 'CH',
    unweighedBags: 22,
    storageLocation: 'Godown 2 - Section C',
    status: 'Weighed & Sold'
  },
  {
    lotId: 'M02',
    dateTime: '2026-04-12T11:00',
    farmerName: 'Vijay Shinde',
    commodityCode: 'MG',
    unweighedBags: 8,
    storageLocation: 'Godown 1 - Bin D',
    status: 'Weighed & Sold'
  },
  {
    lotId: 'T02',
    dateTime: '2026-04-15T08:45',
    farmerName: 'Ramesh Patil',
    commodityCode: 'TR',
    unweighedBags: 15,
    storageLocation: 'Godown 1 - Floor Bin 2',
    status: 'Stored (Unweighed)'
  },
  {
    lotId: 'C04',
    dateTime: '2026-04-16T14:20',
    farmerName: 'Ganesh More',
    commodityCode: 'CH',
    unweighedBags: 30,
    storageLocation: 'Godown 2 - Floor Bin 4',
    status: 'Stored (Unweighed)'
  },
  {
    lotId: 'U01',
    dateTime: '2026-04-17T10:00',
    farmerName: 'Balaji Pawar',
    commodityCode: 'UD',
    unweighedBags: 20,
    storageLocation: 'Godown 3 - Bay 1',
    status: 'Stored (Unweighed)'
  }
];

const INITIAL_SALES = [
  {
    billNumber: 'BILL-2026-0412',
    dateTime: '2026-04-14T15:30',
    buyerName: 'Shree Traders',
    lotId: 'T01',
    commodityCode: 'TR',
    soldBags: 11,
    residualLooseKg: 25,
    farmerName: 'Ramesh Patil',
    ratePerQtl: 7200,
    totalBuyerPayable: (11 * 50 * 7200) / 100 // 11 bags * 50kg = 550kg = 5.5 Qtl
  },
  {
    billNumber: 'BILL-2026-0413',
    dateTime: '2026-04-14T16:45',
    buyerName: 'Apex Grains Co.',
    lotId: 'C03',
    commodityCode: 'CH',
    soldBags: 24,
    residualLooseKg: 10,
    farmerName: 'Suresh Deshmukh',
    ratePerQtl: 5600,
    totalBuyerPayable: (24 * 50 * 5600) / 100
  },
  {
    billNumber: 'BILL-2026-0414',
    dateTime: '2026-04-15T11:20',
    buyerName: 'Kisan Agro',
    lotId: 'M02',
    commodityCode: 'MG',
    soldBags: 8,
    residualLooseKg: 35,
    farmerName: 'Vijay Shinde',
    ratePerQtl: 8400,
    totalBuyerPayable: (8 * 50 * 8400) / 100
  }
];

// State Store with localStorage persistence
class MandiStore {
  constructor() {
    this.inwardLots = JSON.parse(localStorage.getItem('gtco_inward_lots')) || INITIAL_INWARD_LOTS;
    this.sales = JSON.parse(localStorage.getItem('gtco_sales')) || INITIAL_SALES;
  }

  save() {
    localStorage.setItem('gtco_inward_lots', JSON.stringify(this.inwardLots));
    localStorage.setItem('gtco_sales', JSON.stringify(this.sales));
  }

  reset() {
    this.inwardLots = JSON.parse(JSON.stringify(INITIAL_INWARD_LOTS));
    this.sales = JSON.parse(JSON.stringify(INITIAL_SALES));
    this.save();
  }

  // Generate unique Lot ID (e.g., T01, T02...)
  getNextLotId(commodityCode) {
    const meta = COMMODITY_MASTER[commodityCode];
    if (!meta) return 'L01';
    const prefix = meta.prefix;
    
    // Find highest existing lot number with this prefix
    let maxNum = 0;
    this.inwardLots.forEach(lot => {
      if (lot.lotId && lot.lotId.startsWith(prefix)) {
        const numPart = parseInt(lot.lotId.slice(prefix.length), 10);
        if (!isNaN(numPart) && numPart > maxNum) {
          maxNum = numPart;
        }
      }
    });

    const nextNum = maxNum + 1;
    return `${prefix}${nextNum.toString().padStart(2, '0')}`;
  }

  getNextBillNumber() {
    const year = 2026;
    let maxSeq = 414;
    this.sales.forEach(sale => {
      const match = sale.billNumber.match(/BILL-\d+-(\d+)/);
      if (match) {
        const seq = parseInt(match[1], 10);
        if (seq > maxSeq) maxSeq = seq;
      }
    });
    return `BILL-${year}-${(maxSeq + 1).toString().padStart(4, '0')}`;
  }
}

const store = new MandiStore();

// UI Elements & App Controller
document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initModals();
  initForms();
  renderAll();

  // Set default datetime to now
  const dtInput = document.getElementById('inward-datetime');
  if (dtInput) {
    const now = new Date();
    dtInput.value = now.toISOString().slice(0, 16);
  }
});

function initTabs() {
  const tabs = document.querySelectorAll('.tab-btn');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-tab');
      const targetEl = document.getElementById(targetId);
      if (targetEl) targetEl.classList.add('active');
    });
  });
}

function initModals() {
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      closeModal(modalId);
    });
  });

  const btnNewInward = document.getElementById('btn-new-inward');
  if (btnNewInward) {
    btnNewInward.addEventListener('click', () => {
      const commoditySelect = document.getElementById('inward-commodity');
      commoditySelect.value = 'TR';
      updateLotPreview();
      openModal('modal-inward');
    });
  }

  const btnExport = document.getElementById('btn-export-json');
  if (btnExport) {
    btnExport.addEventListener('click', exportData);
  }

  const btnReset = document.getElementById('btn-reset-data');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      if (confirm('Reset all ledger data to standard APMC specification demo data?')) {
        store.reset();
        renderAll();
      }
    });
  }

  // Auto lot preview update
  const commoditySelect = document.getElementById('inward-commodity');
  if (commoditySelect) {
    commoditySelect.addEventListener('change', updateLotPreview);
  }

  // Real-time calculation bindings on Weighing modal
  const totalWeightInput = document.getElementById('sale-total-weight');
  const soldBagsInput = document.getElementById('sale-sold-bags');
  const residualLooseInput = document.getElementById('sale-residual-loose');
  const rateInput = document.getElementById('sale-rate');

  totalWeightInput.addEventListener('input', () => {
    const totalWeight = parseFloat(totalWeightInput.value);
    if (!isNaN(totalWeight) && totalWeight >= 0) {
      const bags = Math.floor(totalWeight / 50);
      const loose = Math.round((totalWeight % 50) * 100) / 100;
      soldBagsInput.value = bags;
      residualLooseInput.value = loose;
    }
    updateSaleCalculations();
  });

  soldBagsInput.addEventListener('input', () => {
    const bags = parseInt(soldBagsInput.value, 10) || 0;
    const loose = parseFloat(residualLooseInput.value) || 0;
    totalWeightInput.value = (bags * 50) + loose;
    updateSaleCalculations();
  });

  residualLooseInput.addEventListener('input', () => {
    const bags = parseInt(soldBagsInput.value, 10) || 0;
    const loose = parseFloat(residualLooseInput.value) || 0;
    totalWeightInput.value = (bags * 50) + loose;
    updateSaleCalculations();
  });

  rateInput.addEventListener('input', updateSaleCalculations);

  // Search & Filter Listeners
  document.getElementById('inward-search').addEventListener('input', renderInwardTable);
  document.getElementById('inward-filter-status').addEventListener('change', renderInwardTable);
  document.getElementById('sales-search').addEventListener('input', renderSalesTable);
}

function updateLotPreview() {
  const code = document.getElementById('inward-commodity').value;
  const previewInput = document.getElementById('inward-lot-preview');
  if (code && previewInput) {
    previewInput.value = store.getNextLotId(code);
  }
}

function updateSaleCalculations() {
  const bags = parseInt(document.getElementById('sale-sold-bags').value, 10) || 0;
  const loose = parseFloat(document.getElementById('sale-residual-loose').value) || 0;
  const rate = parseFloat(document.getElementById('sale-rate').value) || 0;

  const totalKg = (bags * 50) + loose;
  const totalBuyerKg = bags * 50; // Buyers purchase whole bags only
  const buyerPayable = (totalBuyerKg * rate) / 100; // rate per quintal (100kg)

  document.getElementById('calc-breakdown-text').textContent =
    `Standard Breakdown: ${bags} Whole Bags (${bags * 50} kg) + ${loose} kg Loose = ${totalKg} kg Net Weighed`;

  document.getElementById('sale-buyer-amount').value = `₹ ${buyerPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  document.getElementById('preview-buyer-bags').textContent = bags;
  document.getElementById('preview-farmer-summary').textContent = `${bags} Bags (50kg) + ${loose} kg loose`;
  document.getElementById('preview-loose-kg').textContent = `${loose} kg`;
}

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('show');
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}

function initForms() {
  // Inward Form Submission
  const inwardForm = document.getElementById('form-inward');
  inwardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const commCode = document.getElementById('inward-commodity').value;
    const lotId = store.getNextLotId(commCode);
    const farmer = document.getElementById('inward-farmer').value.trim();
    const dt = document.getElementById('inward-datetime').value;
    const bags = parseInt(document.getElementById('inward-bags').value, 10);
    const location = document.getElementById('inward-location').value.trim();

    store.inwardLots.unshift({
      lotId,
      dateTime: dt,
      farmerName: farmer,
      commodityCode: commCode,
      unweighedBags: bags,
      storageLocation: location,
      status: 'Stored (Unweighed)'
    });

    store.save();
    closeModal('modal-inward');
    inwardForm.reset();
    renderAll();
  });

  // Weighing & Sale Form Submission
  const saleForm = document.getElementById('form-sale');
  saleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const lotId = document.getElementById('sale-lot-id').value;
    const lot = store.inwardLots.find(l => l.lotId === lotId);
    if (!lot) return;

    const billNumber = document.getElementById('sale-bill-number').value.trim();
    const buyerName = document.getElementById('sale-buyer-name').value.trim();
    const soldBags = parseInt(document.getElementById('sale-sold-bags').value, 10);
    const residualLooseKg = parseFloat(document.getElementById('sale-residual-loose').value);
    const ratePerQtl = parseFloat(document.getElementById('sale-rate').value) || 0;
    const totalBuyerPayable = (soldBags * 50 * ratePerQtl) / 100;

    // Update lot status
    lot.status = 'Weighed & Sold';

    // Record sale
    const saleRecord = {
      billNumber,
      dateTime: new Date().toISOString().slice(0, 16),
      buyerName,
      lotId,
      commodityCode: lot.commodityCode,
      soldBags,
      residualLooseKg,
      farmerName: lot.farmerName,
      ratePerQtl,
      totalBuyerPayable
    };

    store.sales.unshift(saleRecord);
    store.save();
    closeModal('modal-sale');
    renderAll();

    // Show Printable Slip
    showInvoiceSlip(saleRecord);
  });
}

// Global action to trigger weighing workflow for a lot
window.openWeighSaleModal = function(lotId) {
  const lot = store.inwardLots.find(l => l.lotId === lotId);
  if (!lot) return;

  const commMeta = COMMODITY_MASTER[lot.commodityCode] || { name: lot.commodityCode };
  document.getElementById('sale-lot-id').value = lot.lotId;
  document.getElementById('sale-lot-display').textContent = lot.lotId;
  document.getElementById('sale-farmer-display').textContent = lot.farmerName;
  document.getElementById('sale-commodity-display').textContent = `${commMeta.name} (${commMeta.localName || ''})`;
  document.getElementById('sale-unweighed-display').textContent = `${lot.unweighedBags} Bags`;

  // Estimate initial bags ~ unweighed count
  document.getElementById('sale-total-weight').value = lot.unweighedBags * 50;
  document.getElementById('sale-sold-bags').value = lot.unweighedBags;
  document.getElementById('sale-residual-loose').value = 0;
  document.getElementById('sale-bill-number').value = store.getNextBillNumber();
  document.getElementById('sale-buyer-name').value = '';
  document.getElementById('sale-rate').value = 7000;

  updateSaleCalculations();
  openModal('modal-sale');
};

function renderAll() {
  renderKPIs();
  renderInwardTable();
  renderSalesTable();
  renderLooseStockLedger();
  renderCommodityTable();
}

function renderKPIs() {
  let unweighedBagsCount = 0;
  let unweighedLotsCount = 0;
  store.inwardLots.forEach(lot => {
    if (lot.status === 'Stored (Unweighed)') {
      unweighedBagsCount += lot.unweighedBags;
      unweighedLotsCount++;
    }
  });

  let totalSoldBags = 0;
  let totalResidualKg = 0;
  const farmersWithLoose = new Set();

  store.sales.forEach(s => {
    totalSoldBags += s.soldBags;
    totalResidualKg += s.residualLooseKg;
    if (s.residualLooseKg > 0) {
      farmersWithLoose.add(s.farmerName);
    }
  });

  const grossQuintals = ((totalSoldBags * 50) + totalResidualKg) / 100;

  document.getElementById('kpi-unweighed-bags').innerHTML = `${unweighedBagsCount} <span class="unit">raw bags</span>`;
  document.getElementById('kpi-unweighed-lots').textContent = `${unweighedLotsCount} lots active in godown`;

  document.getElementById('kpi-sold-bags').innerHTML = `${totalSoldBags} <span class="unit">bags (50kg)</span>`;
  document.getElementById('kpi-total-quintals').textContent = `${grossQuintals.toFixed(2)} Quintals gross`;

  document.getElementById('kpi-loose-kg').innerHTML = `${totalResidualKg.toFixed(1)} <span class="unit">kg</span>`;
  document.getElementById('kpi-farmers-with-loose').textContent = `Across ${farmersWithLoose.size} farmer ledger accounts`;

  document.getElementById('kpi-bills-count').innerHTML = `${store.sales.length} <span class="unit">bills</span>`;

  document.getElementById('tab-inward-count').textContent = store.inwardLots.length;
  document.getElementById('tab-sales-count').textContent = store.sales.length;
  document.getElementById('tab-loose-count').textContent = farmersWithLoose.size;
}

function renderInwardTable() {
  const tbody = document.getElementById('inward-table-body');
  const search = document.getElementById('inward-search').value.toLowerCase();
  const filterStatus = document.getElementById('inward-filter-status').value;

  const filtered = store.inwardLots.filter(lot => {
    const matchesSearch = lot.lotId.toLowerCase().includes(search) ||
                          lot.farmerName.toLowerCase().includes(search) ||
                          lot.storageLocation.toLowerCase().includes(search);
    const matchesStatus = filterStatus === 'ALL' || lot.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: #64748b; padding: 2rem;">No matching inward lots found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(lot => {
    const comm = COMMODITY_MASTER[lot.commodityCode] || { name: lot.commodityCode, localName: '' };
    const isUnweighed = lot.status === 'Stored (Unweighed)';
    const statusClass = isUnweighed ? 'status-unweighed' : 'status-sold';

    return `
      <tr>
        <td><span class="lot-badge">${lot.lotId}</span></td>
        <td>${formatDate(lot.dateTime)}</td>
        <td><strong>${escapeHtml(lot.farmerName)}</strong></td>
        <td>${comm.name} <small style="color:#64748b">(${comm.localName})</small></td>
        <td><strong>${lot.unweighedBags}</strong> Bags</td>
        <td>${escapeHtml(lot.storageLocation)}</td>
        <td><span class="status-pill ${statusClass}">${lot.status}</span></td>
        <td>
          ${isUnweighed ? `
            <button class="btn btn-success btn-sm" onclick="openWeighSaleModal('${lot.lotId}')">
              ⚖️ Weigh & Sell
            </button>
          ` : `
            <span style="color:#16a34a; font-weight:600; font-size:0.8rem;">✓ Settled</span>
          `}
        </td>
      </tr>
    `;
  }).join('');
}

function renderSalesTable() {
  const tbody = document.getElementById('sales-table-body');
  const search = document.getElementById('sales-search').value.toLowerCase();

  const filtered = store.sales.filter(s => {
    return s.billNumber.toLowerCase().includes(search) ||
           s.buyerName.toLowerCase().includes(search) ||
           s.lotId.toLowerCase().includes(search) ||
           s.farmerName.toLowerCase().includes(search);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align: center; color: #64748b; padding: 2rem;">No matching sales transactions found.</td></tr>`;
    return;
  }

  tbody.innerHTML = filtered.map(s => {
    const totalNetWeight = (s.soldBags * 50) + s.residualLooseKg;
    return `
      <tr>
        <td><span class="font-mono" style="color:#1d4ed8; font-weight:700;">${s.billNumber}</span></td>
        <td>${formatDate(s.dateTime)}</td>
        <td><strong>${escapeHtml(s.buyerName)}</strong></td>
        <td><span class="lot-badge">${s.lotId}</span></td>
        <td><strong>${s.soldBags}</strong> Bags (50kg)</td>
        <td><span class="loose-badge">+ ${s.residualLooseKg} kg loose</span></td>
        <td><strong>${escapeHtml(s.farmerName)}</strong></td>
        <td class="font-mono">${totalNetWeight} kg</td>
        <td>
          <button class="btn btn-outline btn-sm" onclick='viewSlip("${s.billNumber}")'>
            📄 View Slip
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

function renderLooseStockLedger() {
  // Aggregate loose balances per farmer & commodity
  const looseMap = {};
  store.sales.forEach(sale => {
    const key = `${sale.farmerName}___${sale.commodityCode}`;
    if (!looseMap[key]) {
      looseMap[key] = {
        farmerName: sale.farmerName,
        commodityCode: sale.commodityCode,
        totalLooseKg: 0
      };
    }
    looseMap[key].totalLooseKg += sale.residualLooseKg;
  });

  const summaryBody = document.getElementById('loose-summary-body');
  const entries = Object.values(looseMap).filter(item => item.totalLooseKg > 0);

  if (entries.length === 0) {
    summaryBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b;">No outstanding loose stock.</td></tr>`;
  } else {
    summaryBody.innerHTML = entries.map(item => {
      const comm = COMMODITY_MASTER[item.commodityCode] || { name: item.commodityCode, localName: '' };
      const eqBags = Math.floor(item.totalLooseKg / 50);
      const remLoose = Math.round((item.totalLooseKg % 50) * 100) / 100;

      return `
        <tr>
          <td><strong>${escapeHtml(item.farmerName)}</strong></td>
          <td>${comm.name} (${comm.localName})</td>
          <td><span class="loose-badge">${item.totalLooseKg} kg</span></td>
          <td>${eqBags > 0 ? `<strong>${eqBags} bags (50kg)</strong>` : '0 bags'}</td>
          <td>${remLoose} kg loose</td>
        </tr>
      `;
    }).join('');
  }

  // Audit activity log
  const auditBody = document.getElementById('loose-audit-body');
  const auditEntries = store.sales.filter(s => s.residualLooseKg > 0);
  
  if (auditEntries.length === 0) {
    auditBody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#64748b;">No loose transactions.</td></tr>`;
  } else {
    auditBody.innerHTML = auditEntries.map(s => `
      <tr>
        <td><span class="font-mono">${s.billNumber}</span></td>
        <td><strong>${escapeHtml(s.farmerName)}</strong></td>
        <td><span class="lot-badge">${s.lotId}</span></td>
        <td>+ ${s.residualLooseKg} kg credited</td>
        <td>Transferred to Shop Loose Bin</td>
      </tr>
    `).join('');
  }
}

function renderCommodityTable() {
  const tbody = document.getElementById('commodity-table-body');
  tbody.innerHTML = Object.values(COMMODITY_MASTER).map(c => {
    const lotCount = store.inwardLots.filter(l => l.commodityCode === c.code).length;
    return `
      <tr>
        <td><strong class="font-mono">${c.code}</strong></td>
        <td><strong>${c.name}</strong></td>
        <td>${c.localName}</td>
        <td><span style="background:#e0f2fe; color:#0369a1; padding:0.2rem 0.5rem; border-radius:4px; font-weight:700;">${c.unitKg} kg</span></td>
        <td><span class="lot-badge">${c.prefix}</span></td>
        <td>${lotCount} lots registered</td>
      </tr>
    `;
  }).join('');
}

window.viewSlip = function(billNumber) {
  const sale = store.sales.find(s => s.billNumber === billNumber);
  if (!sale) return;
  showInvoiceSlip(sale);
};

function showInvoiceSlip(sale) {
  const comm = COMMODITY_MASTER[sale.commodityCode] || { name: sale.commodityCode, localName: '' };
  const totalWeight = (sale.soldBags * 50) + sale.residualLooseKg;

  const html = `
    <div class="invoice-header">
      <h2 style="font-size:1.3rem; font-weight:800; color:#15803d;">GTCO AGRO COMMODITY TRADERS</h2>
      <p style="font-size:0.8rem; color:#64748b;">APMC Market Yard Shop No. 14, Main Mandi Gate</p>
      <h4 style="margin-top:0.5rem; font-size:1rem; letter-spacing:0.05em; text-transform:uppercase;">Sauda Chitthi / APMC Commercial Sale Slip</h4>
    </div>

    <div class="invoice-row">
      <span><strong>Bill Number:</strong> <span class="font-mono">${sale.billNumber}</span></span>
      <span><strong>Date & Time:</strong> ${formatDate(sale.dateTime)}</span>
    </div>

    <div class="invoice-row">
      <span><strong>Buyer Name:</strong> ${escapeHtml(sale.buyerName)}</span>
      <span><strong>Lot ID:</strong> <span class="lot-badge">${sale.lotId}</span></span>
    </div>

    <div class="invoice-row">
      <span><strong>Farmer Credited:</strong> ${escapeHtml(sale.farmerName)}</span>
      <span><strong>Commodity:</strong> ${comm.name} (${comm.localName})</span>
    </div>

    <div class="invoice-divider"></div>

    <table style="width:100%; border-collapse:collapse; margin:1rem 0; font-size:0.9rem;">
      <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
        <th style="padding:0.5rem; text-align:left;">Description</th>
        <th style="padding:0.5rem; text-align:right;">Standard Qty</th>
        <th style="padding:0.5rem; text-align:right;">Weight (kg)</th>
        <th style="padding:0.5rem; text-align:right;">Rate / Qtl</th>
        <th style="padding:0.5rem; text-align:right;">Total ₹</th>
      </tr>
      <tr style="border-bottom:1px solid #e2e8f0;">
        <td style="padding:0.5rem; text-align:left;"><strong>Buyer Whole Bags (Standard 50kg)</strong></td>
        <td style="padding:0.5rem; text-align:right;"><strong>${sale.soldBags} Bags</strong></td>
        <td style="padding:0.5rem; text-align:right;">${sale.soldBags * 50} kg</td>
        <td style="padding:0.5rem; text-align:right;">₹ ${sale.ratePerQtl || 7000}</td>
        <td style="padding:0.5rem; text-align:right; font-weight:700;">₹ ${(sale.totalBuyerPayable || 0).toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
      </tr>
      <tr style="background:#fffbeb; color:#92400e;">
        <td style="padding:0.5rem; text-align:left;"><strong>Residual Loose Stock (Excluded from Buyer)</strong></td>
        <td style="padding:0.5rem; text-align:right;">Loose</td>
        <td style="padding:0.5rem; text-align:right;"><strong>${sale.residualLooseKg} kg</strong></td>
        <td style="padding:0.5rem; text-align:right;">--</td>
        <td style="padding:0.5rem; text-align:right;">Credited to Farmer</td>
      </tr>
      <tr style="font-weight:800; border-top:2px solid #0f172a;">
        <td style="padding:0.5rem; text-align:left;">Total Weighed Lot Net Weight</td>
        <td style="padding:0.5rem; text-align:right;">${sale.soldBags} Bags + ${sale.residualLooseKg} kg</td>
        <td style="padding:0.5rem; text-align:right;">${totalWeight} kg</td>
        <td style="padding:0.5rem; text-align:right;">Buyer Net</td>
        <td style="padding:0.5rem; text-align:right; color:#15803d; font-size:1.05rem;">₹ ${(sale.totalBuyerPayable || 0).toLocaleString('en-IN', {minimumFractionDigits:2})}</td>
      </tr>
    </table>

    <div style="background:#f1f5f9; padding:0.75rem; border-radius:6px; font-size:0.8rem; margin-top:1rem;">
      <strong>Audit Notice:</strong> Buyer invoice is generated strictly for whole 50 kg standardized bags.
      Residual loose quantity (${sale.residualLooseKg} kg) has been automatically deposited into the Shop Loose Inventory
      and credited to farmer <strong>${escapeHtml(sale.farmerName)}</strong>'s ledger account.
    </div>
  `;

  document.getElementById('invoice-print-area').innerHTML = html;
  openModal('modal-invoice');
}

function formatDate(isoStr) {
  if (!isoStr) return '--';
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return isoStr;
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m];
  });
}

function exportData() {
  const exportPayload = {
    platform: 'GTCO Stock Tracker',
    version: '1.0',
    exportTimestamp: new Date().toISOString(),
    inwardLots: store.inwardLots,
    sales: store.sales
  };
  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `APMC_Ledger_Backup_${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
