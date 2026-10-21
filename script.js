/**
 * GTCO Stock Tracker - APMC Agent Ledger & Inventory Platform
 * Master-driven architecture inspired by Paisabhai.
 * Protected with Paisabhai Cross-Device Access Lock (SHARNU PATIL / 02161301).
 * Zero hardcoded demo transactions. User-defined Farmers, Commodities, Locations & Buyers.
 * Real-time dynamic multi-criteria search & isolation by Farmer, Commodity, or Location.
 */

(function () {
  'use strict';

  // Authentication configuration matching Paisabhai
  const AUTH_CONFIG = {
    username: 'SHARNU PATIL',
    password: '02161301',
    storageKey: 'gtco_auth_session_v1'
  };

  const STORAGE_KEY = 'gtco_stock_tracker_v2';

  // Standard APMC Master Reference (available via one-click load if user desires)
  const STANDARD_APMC_COMMODITIES = [
    { id: 'comm_tr', code: 'TR', prefix: 'T', name: 'Pigeon Pea', localName: 'Toor / Tuvar', unitKg: 50 },
    { id: 'comm_ch', code: 'CH', prefix: 'C', name: 'Bengal Gram', localName: 'Chana', unitKg: 50 },
    { id: 'comm_mg', code: 'MG', prefix: 'M', name: 'Green Gram', localName: 'Moong', unitKg: 50 },
    { id: 'comm_ud', code: 'UD', prefix: 'U', name: 'Black Gram', localName: 'Urad / Matt Pe', unitKg: 50 },
    { id: 'comm_jw', code: 'JW', prefix: 'J', name: 'Sorghum', localName: 'Jowar', unitKg: 50 },
    { id: 'comm_sf', code: 'SF', prefix: 'S', name: 'Safflower', localName: 'Kusub', unitKg: 50 }
  ];

  class MandiApp {
    constructor() {
      this.state = this.loadState();
      this.currentView = 'inward';
      this.currentMasterTab = 'farmers';
      this.filters = {
        text: '',
        farmerId: '',
        commodityId: '',
        locationId: '',
        status: ''
      };
      this.quickAddCallback = null;
      this.isAuthenticated = false;
    }

    loadState() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse storage, creating fresh state', e);
        }
      }
      return {
        schemaVersion: 2,
        inwardLots: [],
        sales: [],
        masters: {
          farmers: [],
          commodities: [],
          locations: [],
          buyers: []
        }
      };
    }

    saveState() {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    }

    // -------------------------------------------------------------
    // AUTHENTICATION LOGIC (PAISABHAI COMPATIBLE)
    // -------------------------------------------------------------
    checkAuth() {
      const isAuth = localStorage.getItem(AUTH_CONFIG.storageKey) === 'true';
      if (isAuth) {
        this.isAuthenticated = true;
        this.showAppShell();
        this.init();
      } else {
        this.isAuthenticated = false;
        this.showLoginView();
      }
    }

    showLoginView() {
      const loginView = document.getElementById('view-login');
      const appShell = document.getElementById('app-shell');
      if (loginView) loginView.classList.remove('hidden');
      if (appShell) appShell.classList.add('hidden');
      const usernameEl = document.getElementById('login-username');
      if (usernameEl) {
        usernameEl.value = '';
        setTimeout(() => usernameEl.focus(), 150);
      }
      const passEl = document.getElementById('login-password');
      if (passEl) passEl.value = '';
      const errEl = document.getElementById('login-error');
      if (errEl) errEl.classList.add('hidden');
      this.initLucide();
    }

    showAppShell() {
      const loginView = document.getElementById('view-login');
      const appShell = document.getElementById('app-shell');
      if (loginView) loginView.classList.add('hidden');
      if (appShell) appShell.classList.remove('hidden');
      this.initLucide();
    }

    handleLogin(e) {
      if (e) e.preventDefault();
      const userEl = document.getElementById('login-username');
      const passEl = document.getElementById('login-password');
      const errEl = document.getElementById('login-error');
      const errText = document.getElementById('login-error-text');

      const user = userEl ? userEl.value.trim() : '';
      const pass = passEl ? passEl.value.trim() : '';

      // Normalize username: compare case-insensitively with AUTH_CONFIG.username
      if (user.toUpperCase() === AUTH_CONFIG.username.toUpperCase() && pass === AUTH_CONFIG.password) {
        localStorage.setItem(AUTH_CONFIG.storageKey, 'true');
        this.isAuthenticated = true;
        if (errEl) errEl.classList.add('hidden');
        this.showAppShell();
        this.init();
      } else {
        if (errEl) {
          errEl.classList.remove('hidden');
          if (errText) errText.textContent = 'Invalid username or password. Please try again.';
        }
        if (passEl) {
          passEl.value = '';
          passEl.focus();
        }
      }
      this.initLucide();
    }

    logout() {
      localStorage.removeItem(AUTH_CONFIG.storageKey);
      this.isAuthenticated = false;
      this.showLoginView();
    }

    togglePasswordVisibility() {
      const passEl = document.getElementById('login-password');
      const eyeIcon = document.getElementById('eye-icon');
      if (!passEl) return;
      if (passEl.type === 'password') {
        passEl.type = 'text';
        if (eyeIcon) eyeIcon.setAttribute('data-lucide', 'eye-off');
      } else {
        passEl.type = 'password';
        if (eyeIcon) eyeIcon.setAttribute('data-lucide', 'eye');
      }
      this.initLucide();
    }

    // -------------------------------------------------------------
    // INITIALIZATION
    // -------------------------------------------------------------
    init() {
      this.populateFilterDropdowns();
      this.renderAll();
      this.initLucide();
      
      // Default inward datetime to current local time
      const dtInput = document.getElementById('inward-datetime');
      if (dtInput) {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        dtInput.value = (new Date(now - offset)).toISOString().slice(0, 16);
      }
    }

    initLucide() {
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }

    // -------------------------------------------------------------
    // NAVIGATION
    // -------------------------------------------------------------
    navigate(viewName) {
      this.currentView = viewName;
      document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.mob-nav-tab').forEach(t => t.classList.remove('active'));

      const panel = document.getElementById(`view-${viewName}`);
      const navBtn = document.getElementById(`nav-btn-${viewName}`);
      const mobBtn = document.getElementById(`mob-nav-${viewName}`);

      if (panel) panel.classList.add('active');
      if (navBtn) navBtn.classList.add('active');
      if (mobBtn) mobBtn.classList.add('active');

      this.initLucide();
    }

    switchMasterTab(tabName) {
      this.currentMasterTab = tabName;
      document.querySelectorAll('.master-panel').forEach(p => p.classList.add('hidden'));
      document.querySelectorAll('.master-subtab').forEach(t => t.classList.remove('active'));

      const targetPanel = document.getElementById(`master-panel-${tabName}`);
      const targetTab = document.getElementById(`master-tab-${tabName}`);

      if (targetPanel) targetPanel.classList.remove('hidden');
      if (targetTab) targetTab.classList.add('active');

      this.initLucide();
    }

    // -------------------------------------------------------------
    // MODAL CONTROLS
    // -------------------------------------------------------------
    openModal(id) {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('show');
        this.initLucide();
      }
    }

    closeModal(id) {
      const modal = document.getElementById(id);
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('show');
      }
    }

    // -------------------------------------------------------------
    // MASTER MANAGEMENT (FARMERS, COMMODITIES, LOCATIONS, BUYERS)
    // -------------------------------------------------------------
    openFarmerModal(isQuickAdd = false) {
      document.getElementById('form-master-farmer').reset();
      document.getElementById('farmer-edit-id').value = '';
      document.getElementById('modal-farmer-title').textContent = 'Add New Farmer';
      this.quickAddCallback = isQuickAdd ? 'farmer' : null;
      this.openModal('modal-farmer');
    }

    editFarmer(id) {
      const farmer = this.state.masters.farmers.find(f => f.id === id);
      if (!farmer) return;
      document.getElementById('farmer-edit-id').value = farmer.id;
      document.getElementById('farmer-input-name').value = farmer.name;
      document.getElementById('farmer-input-mobile').value = farmer.mobile || '';
      document.getElementById('farmer-input-village').value = farmer.village || '';
      document.getElementById('farmer-input-notes').value = farmer.notes || '';
      document.getElementById('modal-farmer-title').textContent = 'Edit Farmer';
      this.openModal('modal-farmer');
    }

    handleSaveFarmer(e) {
      e.preventDefault();
      const id = document.getElementById('farmer-edit-id').value || `farmer_${Date.now()}`;
      const name = document.getElementById('farmer-input-name').value.trim();
      const mobile = document.getElementById('farmer-input-mobile').value.trim();
      const village = document.getElementById('farmer-input-village').value.trim();
      const notes = document.getElementById('farmer-input-notes').value.trim();

      const existingIndex = this.state.masters.farmers.findIndex(f => f.id === id);
      const farmerObj = { id, name, mobile, village, notes };

      if (existingIndex >= 0) {
        this.state.masters.farmers[existingIndex] = farmerObj;
      } else {
        this.state.masters.farmers.push(farmerObj);
      }

      this.saveState();
      this.closeModal('modal-farmer');
      this.populateFilterDropdowns();
      this.populateInwardDropdowns();
      this.renderMasterFarmers();

      if (this.quickAddCallback === 'farmer') {
        const select = document.getElementById('inward-farmer');
        if (select) select.value = id;
        this.quickAddCallback = null;
      }
      this.initLucide();
    }

    deleteFarmer(id) {
      const farmer = this.state.masters.farmers.find(f => f.id === id);
      if (!farmer) return;
      const count = this.state.inwardLots.filter(l => l.farmerId === id).length;
      if (count > 0 && !confirm(`Farmer "${farmer.name}" has ${count} associated lot(s). Delete anyway?`)) {
        return;
      }
      this.state.masters.farmers = this.state.masters.farmers.filter(f => f.id !== id);
      this.saveState();
      this.populateFilterDropdowns();
      this.populateInwardDropdowns();
      this.renderAll();
    }

    // Commodities
    openCommodityModal(isQuickAdd = false) {
      document.getElementById('form-master-commodity').reset();
      document.getElementById('commodity-edit-id').value = '';
      document.getElementById('commodity-input-unit').value = '50';
      document.getElementById('modal-commodity-title').textContent = 'Add New Commodity';
      this.quickAddCallback = isQuickAdd ? 'commodity' : null;
      this.openModal('modal-commodity');
    }

    editCommodity(id) {
      const comm = this.state.masters.commodities.find(c => c.id === id);
      if (!comm) return;
      document.getElementById('commodity-edit-id').value = comm.id;
      document.getElementById('commodity-input-code').value = comm.code;
      document.getElementById('commodity-input-prefix').value = comm.prefix;
      document.getElementById('commodity-input-name').value = comm.name;
      document.getElementById('commodity-input-local').value = comm.localName || '';
      document.getElementById('commodity-input-unit').value = comm.unitKg || 50;
      document.getElementById('modal-commodity-title').textContent = 'Edit Commodity';
      this.openModal('modal-commodity');
    }

    handleSaveCommodity(e) {
      e.preventDefault();
      const id = document.getElementById('commodity-edit-id').value || `comm_${Date.now()}`;
      const code = document.getElementById('commodity-input-code').value.trim().toUpperCase();
      const prefix = document.getElementById('commodity-input-prefix').value.trim().toUpperCase();
      const name = document.getElementById('commodity-input-name').value.trim();
      const localName = document.getElementById('commodity-input-local').value.trim();
      const unitKg = parseFloat(document.getElementById('commodity-input-unit').value) || 50;

      const existingIndex = this.state.masters.commodities.findIndex(c => c.id === id);
      const commObj = { id, code, prefix, name, localName, unitKg };

      if (existingIndex >= 0) {
        this.state.masters.commodities[existingIndex] = commObj;
      } else {
        this.state.masters.commodities.push(commObj);
      }

      this.saveState();
      this.closeModal('modal-commodity');
      this.populateFilterDropdowns();
      this.populateInwardDropdowns();
      this.renderMasterCommodities();

      if (this.quickAddCallback === 'commodity') {
        const select = document.getElementById('inward-commodity');
        if (select) {
          select.value = id;
          this.updateInwardLotPreview();
        }
        this.quickAddCallback = null;
      }
      this.initLucide();
    }

    deleteCommodity(id) {
      const comm = this.state.masters.commodities.find(c => c.id === id);
      if (!comm) return;
      const count = this.state.inwardLots.filter(l => l.commodityId === id).length;
      if (count > 0 && !confirm(`Commodity "${comm.name}" has ${count} registered lot(s). Delete anyway?`)) {
        return;
      }
      this.state.masters.commodities = this.state.masters.commodities.filter(c => c.id !== id);
      this.saveState();
      this.populateFilterDropdowns();
      this.populateInwardDropdowns();
      this.renderAll();
    }

    populateDefaultAPMCCommodities() {
      if (this.state.masters.commodities.length > 0 && !confirm('Add standard APMC commodities (Toor, Chana, Moong, Urad, Jowar, Kusub) to your existing list?')) {
        return;
      }
      STANDARD_APMC_COMMODITIES.forEach(c => {
        if (!this.state.masters.commodities.some(item => item.code === c.code)) {
          this.state.masters.commodities.push({ ...c });
        }
      });
      this.saveState();
      this.populateFilterDropdowns();
      this.populateInwardDropdowns();
      this.renderMasterCommodities();
      this.initLucide();
    }

    // Storage Locations
    openLocationModal(isQuickAdd = false) {
      document.getElementById('form-master-location').reset();
      document.getElementById('location-edit-id').value = '';
      document.getElementById('modal-location-title').textContent = 'Add Storage Location';
      this.quickAddCallback = isQuickAdd ? 'location' : null;
      this.openModal('modal-location');
    }

    editLocation(id) {
      const loc = this.state.masters.locations.find(l => l.id === id);
      if (!loc) return;
      document.getElementById('location-edit-id').value = loc.id;
      document.getElementById('location-input-name').value = loc.name;
      document.getElementById('location-input-desc').value = loc.desc || '';
      document.getElementById('modal-location-title').textContent = 'Edit Storage Location';
      this.openModal('modal-location');
    }

    handleSaveLocation(e) {
      e.preventDefault();
      const id = document.getElementById('location-edit-id').value || `loc_${Date.now()}`;
      const name = document.getElementById('location-input-name').value.trim();
      const desc = document.getElementById('location-input-desc').value.trim();

      const existingIndex = this.state.masters.locations.findIndex(l => l.id === id);
      const locObj = { id, name, desc };

      if (existingIndex >= 0) {
        this.state.masters.locations[existingIndex] = locObj;
      } else {
        this.state.masters.locations.push(locObj);
      }

      this.saveState();
      this.closeModal('modal-location');
      this.populateFilterDropdowns();
      this.populateInwardDropdowns();
      this.renderMasterLocations();

      if (this.quickAddCallback === 'location') {
        const select = document.getElementById('inward-location');
        if (select) select.value = id;
        this.quickAddCallback = null;
      }
      this.initLucide();
    }

    deleteLocation(id) {
      const loc = this.state.masters.locations.find(l => l.id === id);
      if (!loc) return;
      this.state.masters.locations = this.state.masters.locations.filter(l => l.id !== id);
      this.saveState();
      this.populateFilterDropdowns();
      this.populateInwardDropdowns();
      this.renderAll();
    }

    // Buyers
    openBuyerModal(isQuickAdd = false) {
      document.getElementById('form-master-buyer').reset();
      document.getElementById('buyer-edit-id').value = '';
      document.getElementById('modal-buyer-title').textContent = 'Add Buyer / Trader';
      this.quickAddCallback = isQuickAdd ? 'buyer' : null;
      this.openModal('modal-buyer');
    }

    editBuyer(id) {
      const buyer = this.state.masters.buyers.find(b => b.id === id);
      if (!buyer) return;
      document.getElementById('buyer-edit-id').value = buyer.id;
      document.getElementById('buyer-input-name').value = buyer.name;
      document.getElementById('buyer-input-contact').value = buyer.contact || '';
      document.getElementById('buyer-input-license').value = buyer.license || '';
      document.getElementById('modal-buyer-title').textContent = 'Edit Buyer';
      this.openModal('modal-buyer');
    }

    handleSaveBuyer(e) {
      e.preventDefault();
      const id = document.getElementById('buyer-edit-id').value || `buyer_${Date.now()}`;
      const name = document.getElementById('buyer-input-name').value.trim();
      const contact = document.getElementById('buyer-input-contact').value.trim();
      const license = document.getElementById('buyer-input-license').value.trim();

      const existingIndex = this.state.masters.buyers.findIndex(b => b.id === id);
      const buyerObj = { id, name, contact, license };

      if (existingIndex >= 0) {
        this.state.masters.buyers[existingIndex] = buyerObj;
      } else {
        this.state.masters.buyers.push(buyerObj);
      }

      this.saveState();
      this.closeModal('modal-buyer');
      this.populateBuyerDropdown();
      this.renderMasterBuyers();

      if (this.quickAddCallback === 'buyer') {
        const select = document.getElementById('sale-buyer');
        if (select) select.value = id;
        this.quickAddCallback = null;
      }
      this.initLucide();
    }

    deleteBuyer(id) {
      const buyer = this.state.masters.buyers.find(b => b.id === id);
      if (!buyer) return;
      this.state.masters.buyers = this.state.masters.buyers.filter(b => b.id !== id);
      this.saveState();
      this.populateBuyerDropdown();
      this.renderMasterBuyers();
    }

    // -------------------------------------------------------------
    // LOT ID GENERATOR
    // -------------------------------------------------------------
    getNextLotId(commodityId) {
      const comm = this.state.masters.commodities.find(c => c.id === commodityId);
      const prefix = comm && comm.prefix ? comm.prefix : 'L';
      let maxNum = 0;
      this.state.inwardLots.forEach(lot => {
        if (lot.lotId && lot.lotId.startsWith(prefix)) {
          const num = parseInt(lot.lotId.slice(prefix.length), 10);
          if (!isNaN(num) && num > maxNum) maxNum = num;
        }
      });
      return `${prefix}${(maxNum + 1).toString().padStart(2, '0')}`;
    }

    getNextBillNumber() {
      const year = new Date().getFullYear();
      let maxSeq = 0;
      this.state.sales.forEach(s => {
        const match = s.billNumber && s.billNumber.match(/BILL-\d+-(\d+)/);
        if (match) {
          const seq = parseInt(match[1], 10);
          if (seq > maxSeq) maxSeq = seq;
        }
      });
      return `BILL-${year}-${(maxSeq + 1).toString().padStart(4, '0')}`;
    }

    // -------------------------------------------------------------
    // DROPDOWN POPULATORS
    // -------------------------------------------------------------
    populateFilterDropdowns() {
      // Farmer filter
      const farmerSelect = document.getElementById('filter-farmer');
      const currentFarmer = farmerSelect.value;
      farmerSelect.innerHTML = `<option value="">👤 All Farmers</option>` +
        this.state.masters.farmers.map(f => `<option value="${f.id}">${this.escape(f.name)}</option>`).join('');
      farmerSelect.value = currentFarmer;

      // Commodity filter
      const commSelect = document.getElementById('filter-commodity');
      const currentComm = commSelect.value;
      commSelect.innerHTML = `<option value="">🌾 All Commodities</option>` +
        this.state.masters.commodities.map(c => `<option value="${c.id}">${this.escape(c.name)} (${c.code})</option>`).join('');
      commSelect.value = currentComm;

      // Location filter
      const locSelect = document.getElementById('filter-location');
      const currentLoc = locSelect.value;
      locSelect.innerHTML = `<option value="">📍 All Locations</option>` +
        this.state.masters.locations.map(l => `<option value="${l.id}">${this.escape(l.name)}</option>`).join('');
      locSelect.value = currentLoc;
    }

    populateInwardDropdowns() {
      // Farmers
      const farmerSelect = document.getElementById('inward-farmer');
      farmerSelect.innerHTML = `<option value="" disabled selected>-- Select Farmer --</option>` +
        this.state.masters.farmers.map(f => `<option value="${f.id}">${this.escape(f.name)} ${f.village ? `(${f.village})` : ''}</option>`).join('');

      // Commodities
      const commSelect = document.getElementById('inward-commodity');
      commSelect.innerHTML = `<option value="" disabled selected>-- Select Commodity --</option>` +
        this.state.masters.commodities.map(c => `<option value="${c.id}">${this.escape(c.name)} [${c.localName || c.code}] - ${c.unitKg}kg</option>`).join('');

      // Locations
      const locSelect = document.getElementById('inward-location');
      locSelect.innerHTML = `<option value="" disabled selected>-- Select Location --</option>` +
        this.state.masters.locations.map(l => `<option value="${l.id}">${this.escape(l.name)}</option>`).join('');
    }

    populateBuyerDropdown() {
      const buyerSelect = document.getElementById('sale-buyer');
      buyerSelect.innerHTML = `<option value="" disabled selected>-- Select Buyer --</option>` +
        this.state.masters.buyers.map(b => `<option value="${b.id}">${this.escape(b.name)}</option>`).join('');
    }

    updateInwardLotPreview() {
      const commId = document.getElementById('inward-commodity').value;
      const preview = document.getElementById('inward-lot-preview');
      if (commId) {
        preview.value = this.getNextLotId(commId);
      } else {
        preview.value = 'Select Commodity';
      }
    }

    // -------------------------------------------------------------
    // INWARD SUBMISSION
    // -------------------------------------------------------------
    openNewInwardModal() {
      this.populateInwardDropdowns();
      if (this.state.masters.farmers.length === 0) {
        alert('Please add at least one Farmer in Master Settings or via the + Add Farmer button.');
      }
      if (this.state.masters.commodities.length === 0) {
        alert('Please add at least one Commodity in Master Settings or click "Load Standard Commodities".');
      }
      this.openModal('modal-inward');
      this.updateInwardLotPreview();
    }

    handleInwardSubmit(e) {
      e.preventDefault();
      const farmerId = document.getElementById('inward-farmer').value;
      const commodityId = document.getElementById('inward-commodity').value;
      const unweighedBags = parseInt(document.getElementById('inward-bags').value, 10);
      const arrivalDateTime = document.getElementById('inward-datetime').value;
      const locationId = document.getElementById('inward-location').value;

      if (!farmerId || !commodityId || !locationId || isNaN(unweighedBags) || unweighedBags <= 0) {
        alert('Please fill all mandatory fields properly.');
        return;
      }

      const lotId = this.getNextLotId(commodityId);
      const lotRecord = {
        lotId,
        farmerId,
        commodityId,
        unweighedBags,
        arrivalDateTime,
        locationId,
        status: 'Stored (Unweighed)'
      };

      this.state.inwardLots.unshift(lotRecord);
      this.saveState();
      this.closeModal('modal-inward');
      document.getElementById('form-inward').reset();
      this.renderAll();
      this.navigate('inward');
    }

    // -------------------------------------------------------------
    // WEIGHING & SALE CHECKOUT
    // -------------------------------------------------------------
    openWeighModal(lotId) {
      const lot = this.state.inwardLots.find(l => l.lotId === lotId);
      if (!lot) return;

      const farmer = this.state.masters.farmers.find(f => f.id === lot.farmerId) || { name: 'Unknown' };
      const comm = this.state.masters.commodities.find(c => c.id === lot.commodityId) || { name: 'Unknown', unitKg: 50 };

      this.populateBuyerDropdown();

      document.getElementById('sale-lot-id').value = lot.lotId;
      document.getElementById('sale-display-lot').textContent = lot.lotId;
      document.getElementById('sale-display-farmer').textContent = farmer.name;
      document.getElementById('sale-display-commodity').textContent = `${comm.name} (${comm.localName || comm.code})`;
      document.getElementById('sale-display-rawbags').textContent = `${lot.unweighedBags} bags`;

      // Preset scale inputs
      const estimatedBags = lot.unweighedBags;
      document.getElementById('sale-input-total-kg').value = estimatedBags * (comm.unitKg || 50);
      document.getElementById('sale-input-bags').value = estimatedBags;
      document.getElementById('sale-input-loose').value = 0;
      document.getElementById('sale-bill-number').value = this.getNextBillNumber();
      document.getElementById('sale-rate').value = 7000;

      this.updateSalePreviewCalculations();
      this.openModal('modal-sale');
    }

    handleScaleWeightChange() {
      const totalKg = parseFloat(document.getElementById('sale-input-total-kg').value);
      if (!isNaN(totalKg) && totalKg >= 0) {
        const wholeBags = Math.floor(totalKg / 50);
        const loose = Math.round((totalKg % 50) * 100) / 100;
        document.getElementById('sale-input-bags').value = wholeBags;
        document.getElementById('sale-input-loose').value = loose;
      }
      this.updateSalePreviewCalculations();
    }

    handleBagOrLooseChange() {
      const bags = parseInt(document.getElementById('sale-input-bags').value, 10) || 0;
      const loose = parseFloat(document.getElementById('sale-input-loose').value) || 0;
      document.getElementById('sale-input-total-kg').value = (bags * 50) + loose;
      this.updateSalePreviewCalculations();
    }

    handleRateChange() {
      this.updateSalePreviewCalculations();
    }

    updateSalePreviewCalculations() {
      const bags = parseInt(document.getElementById('sale-input-bags').value, 10) || 0;
      const loose = parseFloat(document.getElementById('sale-input-loose').value) || 0;
      const rate = parseFloat(document.getElementById('sale-rate').value) || 0;

      const totalKg = (bags * 50) + loose;
      // Buyer pays strictly for whole 50kg bags
      const buyerTotalKg = bags * 50;
      const buyerPayable = (buyerTotalKg * rate) / 100;

      document.getElementById('sale-live-calc-text').textContent =
        `Yield: ${bags} Whole Bags (${bags * 50} kg) + ${loose} kg Loose = ${totalKg} kg Total Net Weighed`;

      document.getElementById('sale-buyer-amount').value =
        `₹ ${buyerPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      document.getElementById('preview-buyer-bags').textContent = `${bags} Bags`;
      document.getElementById('preview-farmer-credit').textContent = `${bags} Bags + ${loose} kg`;
      document.getElementById('preview-shop-loose').textContent = `${loose} kg`;
    }

    handleSaleSubmit(e) {
      e.preventDefault();
      const lotId = document.getElementById('sale-lot-id').value;
      const lot = this.state.inwardLots.find(l => l.lotId === lotId);
      if (!lot) return;

      const billNumber = document.getElementById('sale-bill-number').value.trim();
      const buyerId = document.getElementById('sale-buyer').value;
      const soldBags = parseInt(document.getElementById('sale-input-bags').value, 10);
      const residualLooseKg = parseFloat(document.getElementById('sale-input-loose').value);
      const ratePerQtl = parseFloat(document.getElementById('sale-rate').value) || 0;

      if (!billNumber || !buyerId || isNaN(soldBags) || isNaN(residualLooseKg)) {
        alert('Please complete all sale fields.');
        return;
      }

      const totalBuyerPayable = (soldBags * 50 * ratePerQtl) / 100;

      // Update lot status
      lot.status = 'Weighed & Sold';

      const saleRecord = {
        billNumber,
        dateTime: new Date().toISOString(),
        buyerId,
        lotId,
        farmerId: lot.farmerId,
        commodityId: lot.commodityId,
        soldBags,
        residualLooseKg,
        ratePerQtl,
        totalBuyerPayable
      };

      this.state.sales.unshift(saleRecord);
      this.saveState();
      this.closeModal('modal-sale');
      this.renderAll();
      this.showInvoiceSlip(saleRecord);
    }

    showInvoiceSlip(sale) {
      const farmer = this.state.masters.farmers.find(f => f.id === sale.farmerId) || { name: 'Unknown' };
      const buyer = this.state.masters.buyers.find(b => b.id === sale.buyerId) || { name: 'Unknown' };
      const comm = this.state.masters.commodities.find(c => c.id === sale.commodityId) || { name: 'Unknown', unitKg: 50 };
      const totalKg = (sale.soldBags * 50) + sale.residualLooseKg;

      const html = `
        <div class="text-center pb-3 border-b border-dashed border-slate-300">
          <h2 class="text-base font-extrabold text-brand-800">GTCO AGRO COMMODITY TRADING CO.</h2>
          <p class="text-[11px] text-slate-500">APMC Commission Agent / Arhatiya - Shop No. 14</p>
          <div class="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-200 text-slate-800">
            Sauda Chitthi / APMC Commercial Sale Slip
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div><strong class="text-slate-500">Bill Number:</strong> <span class="font-mono font-bold">${sale.billNumber}</span></div>
          <div class="text-right"><strong class="text-slate-500">Date:</strong> ${this.formatDateTime(sale.dateTime)}</div>
          <div><strong class="text-slate-500">Buyer:</strong> <span class="font-bold">${this.escape(buyer.name)}</span></div>
          <div class="text-right"><strong class="text-slate-500">Lot ID:</strong> <span class="lot-badge">${sale.lotId}</span></div>
          <div><strong class="text-slate-500">Farmer Credited:</strong> <span class="font-bold">${this.escape(farmer.name)}</span></div>
          <div class="text-right"><strong class="text-slate-500">Commodity:</strong> ${this.escape(comm.name)} (${comm.localName || comm.code})</div>
        </div>

        <table class="w-full text-left border-collapse text-[11px] my-2">
          <thead>
            <tr class="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
              <th class="p-1.5">Description</th>
              <th class="p-1.5 text-right">Standard Qty</th>
              <th class="p-1.5 text-right">Weight</th>
              <th class="p-1.5 text-right">Rate/Qtl</th>
              <th class="p-1.5 text-right">Buyer Payable</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr>
              <td class="p-1.5 font-bold">Standard 50kg Bags</td>
              <td class="p-1.5 text-right font-bold">${sale.soldBags} Bags</td>
              <td class="p-1.5 text-right font-mono">${sale.soldBags * 50} kg</td>
              <td class="p-1.5 text-right">₹ ${sale.ratePerQtl}</td>
              <td class="p-1.5 text-right font-mono font-bold text-brand-700">₹ ${(sale.totalBuyerPayable || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
            </tr>
            <tr class="bg-amber-50 text-amber-900">
              <td class="p-1.5 font-bold">Residual Loose Stock</td>
              <td class="p-1.5 text-right">Excluded</td>
              <td class="p-1.5 text-right font-mono font-bold">${sale.residualLooseKg} kg</td>
              <td class="p-1.5 text-right">--</td>
              <td class="p-1.5 text-right font-bold">Transferred to Shop Loose</td>
            </tr>
            <tr class="border-t-2 border-slate-900 font-bold bg-slate-100">
              <td class="p-1.5">Total Lot Yield</td>
              <td class="p-1.5 text-right">${sale.soldBags} Bags + ${sale.residualLooseKg} kg</td>
              <td class="p-1.5 text-right font-mono">${totalKg} kg</td>
              <td class="p-1.5 text-right">Net Buyer</td>
              <td class="p-1.5 text-right font-mono text-brand-800 text-xs">₹ ${(sale.totalBuyerPayable || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
            </tr>
          </tbody>
        </table>

        <div class="p-2 rounded-xl bg-slate-100 text-[10px] text-slate-600 leading-tight">
          <strong>Settlement Audit:</strong> Buyer billed strictly for standardized 50kg units.
          Residual loose (${sale.residualLooseKg} kg) is deposited into Shop Loose Inventory and credited to
          <strong>${this.escape(farmer.name)}</strong>'s ledger account.
        </div>
      `;

      document.getElementById('invoice-print-area').innerHTML = html;
      this.openModal('modal-invoice');
    }

    // -------------------------------------------------------------
    // SEARCH & FILTER ENGINE
    // -------------------------------------------------------------
    handleFilterChange() {
      this.filters.text = (document.getElementById('filter-search-text').value || '').toLowerCase().trim();
      this.filters.farmerId = document.getElementById('filter-farmer').value;
      this.filters.commodityId = document.getElementById('filter-commodity').value;
      this.filters.locationId = document.getElementById('filter-location').value;
      this.filters.status = document.getElementById('filter-status').value;

      const hasActive = Boolean(this.filters.text || this.filters.farmerId || this.filters.commodityId || this.filters.locationId || this.filters.status);
      const indicator = document.getElementById('active-filter-indicator');
      if (indicator) {
        if (hasActive) {
          indicator.classList.remove('hidden');
        } else {
          indicator.classList.add('hidden');
        }
      }

      this.renderAll();
    }

    resetFilters() {
      document.getElementById('filter-search-text').value = '';
      document.getElementById('filter-farmer').value = '';
      document.getElementById('filter-commodity').value = '';
      document.getElementById('filter-location').value = '';
      document.getElementById('filter-status').value = '';
      this.handleFilterChange();
    }

    matchesFilter(lotOrSale, type) {
      const f = this.filters;
      const farmerId = lotOrSale.farmerId;
      const commodityId = lotOrSale.commodityId;

      if (f.farmerId && farmerId !== f.farmerId) return false;
      if (f.commodityId && commodityId !== f.commodityId) return false;

      if (type === 'lot') {
        if (f.locationId && lotOrSale.locationId !== f.locationId) return false;
        if (f.status && lotOrSale.status !== f.status) return false;
      }

      if (f.text) {
        const farmer = this.state.masters.farmers.find(item => item.id === farmerId);
        const comm = this.state.masters.commodities.find(item => item.id === commodityId);
        const farmerName = farmer ? farmer.name.toLowerCase() : '';
        const commName = comm ? `${comm.name} ${comm.localName || ''} ${comm.code}`.toLowerCase() : '';
        const lotId = (lotOrSale.lotId || '').toLowerCase();

        let extraMatch = false;
        if (type === 'lot') {
          const loc = this.state.masters.locations.find(item => item.id === lotOrSale.locationId);
          const locName = loc ? loc.name.toLowerCase() : '';
          extraMatch = locName.includes(f.text);
        } else if (type === 'sale') {
          const buyer = this.state.masters.buyers.find(item => item.id === lotOrSale.buyerId);
          const buyerName = buyer ? buyer.name.toLowerCase() : '';
          const billNo = (lotOrSale.billNumber || '').toLowerCase();
          extraMatch = buyerName.includes(f.text) || billNo.includes(f.text);
        }

        const matches = farmerName.includes(f.text) || commName.includes(f.text) || lotId.includes(f.text) || extraMatch;
        if (!matches) return false;
      }

      return true;
    }

    // -------------------------------------------------------------
    // RENDER FUNCTIONS
    // -------------------------------------------------------------
    renderAll() {
      this.renderKPIs();
      this.renderInwardTable();
      this.renderSalesTable();
      this.renderLooseStockLedger();
      this.renderMasterFarmers();
      this.renderMasterCommodities();
      this.renderMasterLocations();
      this.renderMasterBuyers();
      this.initLucide();
    }

    renderKPIs() {
      const filteredLots = this.state.inwardLots.filter(l => this.matchesFilter(l, 'lot'));
      const filteredSales = this.state.sales.filter(s => this.matchesFilter(s, 'sale'));

      let unweighedBags = 0;
      let unweighedLots = 0;
      filteredLots.forEach(l => {
        if (l.status === 'Stored (Unweighed)') {
          unweighedBags += l.unweighedBags;
          unweighedLots++;
        }
      });

      let soldBags = 0;
      let residualLoose = 0;
      const farmersWithLoose = new Set();
      filteredSales.forEach(s => {
        soldBags += s.soldBags;
        residualLoose += s.residualLooseKg;
        if (s.residualLooseKg > 0) farmersWithLoose.add(s.farmerId);
      });

      const totalQuintals = ((soldBags * 50) + residualLoose) / 100;

      document.getElementById('kpi-unweighed-bags').textContent = unweighedBags;
      document.getElementById('kpi-unweighed-lots-sub').textContent = `${unweighedLots} lot(s) in godown`;

      document.getElementById('kpi-sold-bags').textContent = soldBags;
      document.getElementById('kpi-sold-quintals-sub').textContent = `${totalQuintals.toFixed(2)} Quintals gross`;

      document.getElementById('kpi-loose-kg').textContent = residualLoose.toFixed(1);
      document.getElementById('kpi-loose-farmers-sub').textContent = `${farmersWithLoose.size} farmer ledger(s)`;

      document.getElementById('kpi-bills-count').textContent = filteredSales.length;

      document.getElementById('badge-inward-count').textContent = this.state.inwardLots.length;
      document.getElementById('badge-sales-count').textContent = this.state.sales.length;
      document.getElementById('badge-loose-count').textContent = farmersWithLoose.size;

      document.getElementById('badge-master-farmers').textContent = this.state.masters.farmers.length;
      document.getElementById('badge-master-commodities').textContent = this.state.masters.commodities.length;
      document.getElementById('badge-master-locations').textContent = this.state.masters.locations.length;
      document.getElementById('badge-master-buyers').textContent = this.state.masters.buyers.length;
    }

    renderInwardTable() {
      const tbody = document.getElementById('inward-table-body');
      const filtered = this.state.inwardLots.filter(l => this.matchesFilter(l, 'lot'));

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="8" class="text-center py-10 text-slate-400">
              <div class="flex flex-col items-center justify-center gap-2">
                <i data-lucide="package-open" class="w-8 h-8 text-slate-300"></i>
                <p class="font-semibold text-xs">No matching inward lots found.</p>
                <p class="text-[11px] text-slate-400">Click "+ New Inward" or adjust your filters above.</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map(lot => {
        const farmer = this.state.masters.farmers.find(f => f.id === lot.farmerId) || { name: 'Unknown' };
        const comm = this.state.masters.commodities.find(c => c.id === lot.commodityId) || { name: 'Unknown', localName: '' };
        const loc = this.state.masters.locations.find(l => l.id === lot.locationId) || { name: 'Unknown' };
        const isUnweighed = lot.status === 'Stored (Unweighed)';

        return `
          <tr class="hover:bg-slate-50/80 transition">
            <td class="py-3 px-4"><span class="lot-badge">${lot.lotId}</span></td>
            <td class="py-3 px-4 text-slate-600">${this.formatDateTime(lot.arrivalDateTime)}</td>
            <td class="py-3 px-4 font-bold text-slate-900">${this.escape(farmer.name)}</td>
            <td class="py-3 px-4">${this.escape(comm.name)} <span class="text-slate-400 text-xs">(${comm.localName || ''})</span></td>
            <td class="py-3 px-4 text-center font-bold font-mono text-slate-800">${lot.unweighedBags}</td>
            <td class="py-3 px-4 text-slate-600">${this.escape(loc.name)}</td>
            <td class="py-3 px-4 text-center">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isUnweighed ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}">
                ${lot.status}
              </span>
            </td>
            <td class="py-3 px-4 text-right">
              ${isUnweighed ? `
                <button onclick="app.openWeighModal('${lot.lotId}')" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition">
                  <i data-lucide="scale" class="w-3.5 h-3.5"></i> Weigh & Sell
                </button>
              ` : `
                <span class="text-emerald-700 font-bold text-xs flex items-center justify-end gap-1">
                  <i data-lucide="check" class="w-3.5 h-3.5"></i> Settled
                </span>
              `}
            </td>
          </tr>
        `;
      }).join('');
    }

    renderSalesTable() {
      const tbody = document.getElementById('sales-table-body');
      const filtered = this.state.sales.filter(s => this.matchesFilter(s, 'sale'));

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="9" class="text-center py-10 text-slate-400">
              <div class="flex flex-col items-center justify-center gap-2">
                <i data-lucide="scale" class="w-8 h-8 text-slate-300"></i>
                <p class="font-semibold text-xs">No commercial sales bills recorded.</p>
                <p class="text-[11px] text-slate-400">Lots weighed and sold will appear here with strict 50kg splits.</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map(s => {
        const farmer = this.state.masters.farmers.find(f => f.id === s.farmerId) || { name: 'Unknown' };
        const buyer = this.state.masters.buyers.find(b => b.id === s.buyerId) || { name: 'Unknown' };
        const comm = this.state.masters.commodities.find(c => c.id === s.commodityId) || { name: 'Unknown' };

        return `
          <tr class="hover:bg-slate-50/80 transition">
            <td class="py-3 px-4 font-mono font-bold text-blue-700">${s.billNumber}</td>
            <td class="py-3 px-4 text-slate-600 text-xs">${this.formatDateTime(s.dateTime)}</td>
            <td class="py-3 px-4 font-bold text-slate-900">${this.escape(buyer.name)}</td>
            <td class="py-3 px-4"><span class="lot-badge">${s.lotId}</span></td>
            <td class="py-3 px-4">${this.escape(comm.name)}</td>
            <td class="py-3 px-4 font-bold font-mono">${s.soldBags} Bags</td>
            <td class="py-3 px-4"><span class="loose-badge">+ ${s.residualLooseKg} kg loose</span></td>
            <td class="py-3 px-4 font-bold text-slate-900">${this.escape(farmer.name)}</td>
            <td class="py-3 px-4 text-right">
              <button onclick='app.showInvoiceSlipByBill("${s.billNumber}")' class="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition inline-flex items-center gap-1">
                <i data-lucide="receipt" class="w-3.5 h-3.5"></i> Slip
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    showInvoiceSlipByBill(billNumber) {
      const sale = this.state.sales.find(s => s.billNumber === billNumber);
      if (sale) this.showInvoiceSlip(sale);
    }

    renderLooseStockLedger() {
      const filteredSales = this.state.sales.filter(s => this.matchesFilter(s, 'sale'));
      const summaryBody = document.getElementById('loose-summary-body');
      const auditBody = document.getElementById('loose-audit-body');

      // Aggregate
      const looseMap = {};
      filteredSales.forEach(s => {
        if (s.residualLooseKg > 0) {
          const key = `${s.farmerId}___${s.commodityId}`;
          if (!looseMap[key]) {
            looseMap[key] = {
              farmerId: s.farmerId,
              commodityId: s.commodityId,
              totalKg: 0
            };
          }
          looseMap[key].totalKg += s.residualLooseKg;
        }
      });

      const entries = Object.values(looseMap);
      if (entries.length === 0) {
        summaryBody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-400 text-xs">No loose balances recorded.</td></tr>`;
      } else {
        summaryBody.innerHTML = entries.map(item => {
          const farmer = this.state.masters.farmers.find(f => f.id === item.farmerId) || { name: 'Unknown' };
          const comm = this.state.masters.commodities.find(c => c.id === item.commodityId) || { name: 'Unknown' };
          const eqBags = Math.floor(item.totalKg / 50);
          const remainder = Math.round((item.totalKg % 50) * 100) / 100;

          return `
            <tr class="hover:bg-slate-50">
              <td class="py-2.5 px-4 font-bold text-slate-900">${this.escape(farmer.name)}</td>
              <td class="py-2.5 px-4">${this.escape(comm.name)}</td>
              <td class="py-2.5 px-4 text-right"><span class="loose-badge">${item.totalKg} kg</span></td>
              <td class="py-2.5 px-4 text-right font-mono font-bold">${eqBags} bags (50kg)</td>
              <td class="py-2.5 px-4 text-right text-slate-500 font-mono">${remainder} kg</td>
            </tr>
          `;
        }).join('');
      }

      const looseSales = filteredSales.filter(s => s.residualLooseKg > 0);
      if (looseSales.length === 0) {
        auditBody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-400 text-xs">No loose audit logs.</td></tr>`;
      } else {
        auditBody.innerHTML = looseSales.map(s => {
          const farmer = this.state.masters.farmers.find(f => f.id === s.farmerId) || { name: 'Unknown' };
          return `
            <tr class="hover:bg-slate-50 text-xs">
              <td class="py-2.5 px-4 font-mono font-bold text-blue-700">${s.billNumber}</td>
              <td class="py-2.5 px-4 font-bold text-slate-900">${this.escape(farmer.name)}</td>
              <td class="py-2.5 px-4"><span class="lot-badge">${s.lotId}</span></td>
              <td class="py-2.5 px-4 text-right font-bold text-rose-700">+ ${s.residualLooseKg} kg</td>
              <td class="py-2.5 px-4 text-slate-600">Deposited to Shop Bin</td>
            </tr>
          `;
        }).join('');
      }
    }

    renderMasterFarmers() {
      const tbody = document.getElementById('master-farmers-table-body');
      if (this.state.masters.farmers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-8 text-slate-400 text-xs">No farmers added yet. Click "+ Add Farmer" to register your farmers.</td></tr>`;
        return;
      }
      tbody.innerHTML = this.state.masters.farmers.map(f => `
        <tr class="hover:bg-slate-50">
          <td class="py-2.5 px-4 font-bold text-slate-900">${this.escape(f.name)}</td>
          <td class="py-2.5 px-4 text-slate-600">${this.escape(f.mobile || '--')}</td>
          <td class="py-2.5 px-4 text-slate-600">${this.escape(f.village || '--')}</td>
          <td class="py-2.5 px-4 text-slate-500 text-xs">${this.escape(f.notes || '--')}</td>
          <td class="py-2.5 px-4 text-right space-x-1">
            <button onclick="app.editFarmer('${f.id}')" class="p-1 text-slate-600 hover:text-brand-700" title="Edit"><i data-lucide="edit" class="w-3.5 h-3.5"></i></button>
            <button onclick="app.deleteFarmer('${f.id}')" class="p-1 text-slate-400 hover:text-rose-600" title="Delete"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </td>
        </tr>
      `).join('');
    }

    renderMasterCommodities() {
      const tbody = document.getElementById('master-commodities-table-body');
      if (this.state.masters.commodities.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-slate-400 text-xs">No commodities added. Click "+ Add Commodity" or "Load Standard Commodities".</td></tr>`;
        return;
      }
      tbody.innerHTML = this.state.masters.commodities.map(c => `
        <tr class="hover:bg-slate-50">
          <td class="py-2.5 px-4 font-mono font-bold text-slate-900">${c.code}</td>
          <td class="py-2.5 px-4 font-bold">${this.escape(c.name)}</td>
          <td class="py-2.5 px-4 text-slate-600">${this.escape(c.localName || '--')}</td>
          <td class="py-2.5 px-4 text-center font-bold text-blue-700">${c.unitKg} kg</td>
          <td class="py-2.5 px-4 text-center"><span class="lot-badge">${c.prefix}</span></td>
          <td class="py-2.5 px-4 text-right space-x-1">
            <button onclick="app.editCommodity('${c.id}')" class="p-1 text-slate-600 hover:text-brand-700" title="Edit"><i data-lucide="edit" class="w-3.5 h-3.5"></i></button>
            <button onclick="app.deleteCommodity('${c.id}')" class="p-1 text-slate-400 hover:text-rose-600" title="Delete"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </td>
        </tr>
      `).join('');
    }

    renderMasterLocations() {
      const tbody = document.getElementById('master-locations-table-body');
      if (this.state.masters.locations.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" class="text-center py-8 text-slate-400 text-xs">No storage locations added yet. Click "+ Add Location".</td></tr>`;
        return;
      }
      tbody.innerHTML = this.state.masters.locations.map(l => `
        <tr class="hover:bg-slate-50">
          <td class="py-2.5 px-4 font-bold text-slate-900">${this.escape(l.name)}</td>
          <td class="py-2.5 px-4 text-slate-600 text-xs">${this.escape(l.desc || '--')}</td>
          <td class="py-2.5 px-4 text-right space-x-1">
            <button onclick="app.editLocation('${l.id}')" class="p-1 text-slate-600 hover:text-brand-700" title="Edit"><i data-lucide="edit" class="w-3.5 h-3.5"></i></button>
            <button onclick="app.deleteLocation('${l.id}')" class="p-1 text-slate-400 hover:text-rose-600" title="Delete"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </td>
        </tr>
      `).join('');
    }

    renderMasterBuyers() {
      const tbody = document.getElementById('master-buyers-table-body');
      if (this.state.masters.buyers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-8 text-slate-400 text-xs">No buyers added yet. Click "+ Add Buyer".</td></tr>`;
        return;
      }
      tbody.innerHTML = this.state.masters.buyers.map(b => `
        <tr class="hover:bg-slate-50">
          <td class="py-2.5 px-4 font-bold text-slate-900">${this.escape(b.name)}</td>
          <td class="py-2.5 px-4 text-slate-600">${this.escape(b.contact || '--')}</td>
          <td class="py-2.5 px-4 text-slate-600 text-xs">${this.escape(b.license || '--')}</td>
          <td class="py-2.5 px-4 text-right space-x-1">
            <button onclick="app.editBuyer('${b.id}')" class="p-1 text-slate-600 hover:text-brand-700" title="Edit"><i data-lucide="edit" class="w-3.5 h-3.5"></i></button>
            <button onclick="app.deleteBuyer('${b.id}')" class="p-1 text-slate-400 hover:text-rose-600" title="Delete"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </td>
        </tr>
      `).join('');
    }

    // -------------------------------------------------------------
    // EXCEL EXPORT (SHEETJS MULTI-SHEET)
    // -------------------------------------------------------------
    exportToExcel() {
      if (!window.XLSX) {
        alert('SheetJS is loading. Please try again in a moment.');
        return;
      }

      const wb = XLSX.utils.book_new();

      // Sheet 1: Inward Lots
      const inwardRows = this.state.inwardLots.map(l => {
        const farmer = this.state.masters.farmers.find(f => f.id === l.farmerId) || { name: 'Unknown' };
        const comm = this.state.masters.commodities.find(c => c.id === l.commodityId) || { name: 'Unknown' };
        const loc = this.state.masters.locations.find(item => item.id === l.locationId) || { name: 'Unknown' };
        return {
          'Lot ID': l.lotId,
          'Arrival Date': l.arrivalDateTime,
          'Farmer': farmer.name,
          'Commodity': comm.name,
          'Raw Unweighed Bags': l.unweighedBags,
          'Storage Location': loc.name,
          'Status': l.status
        };
      });
      const wsInward = XLSX.utils.json_to_sheet(inwardRows.length ? inwardRows : [{ Info: 'No inward records' }]);
      XLSX.utils.book_append_sheet(wb, wsInward, 'Inward_Produce');

      // Sheet 2: Sales Ledger
      const salesRows = this.state.sales.map(s => {
        const farmer = this.state.masters.farmers.find(f => f.id === s.farmerId) || { name: 'Unknown' };
        const buyer = this.state.masters.buyers.find(b => b.id === s.buyerId) || { name: 'Unknown' };
        const comm = this.state.masters.commodities.find(c => c.id === s.commodityId) || { name: 'Unknown' };
        return {
          'Bill Number': s.billNumber,
          'Date': s.dateTime,
          'Buyer': buyer.name,
          'Lot ID': s.lotId,
          'Commodity': comm.name,
          'Sold Standard Bags (50kg)': s.soldBags,
          'Residual Loose (kg)': s.residualLooseKg,
          'Farmer Credited': farmer.name,
          'Rate / Quintal': s.ratePerQtl,
          'Total Buyer Payable ₹': s.totalBuyerPayable
        };
      });
      const wsSales = XLSX.utils.json_to_sheet(salesRows.length ? salesRows : [{ Info: 'No sales records' }]);
      XLSX.utils.book_append_sheet(wb, wsSales, 'Sales_Audit_Ledger');

      // Sheet 3: Masters
      const wsFarmers = XLSX.utils.json_to_sheet(this.state.masters.farmers.length ? this.state.masters.farmers : [{ Info: 'No farmers' }]);
      XLSX.utils.book_append_sheet(wb, wsFarmers, 'Master_Farmers');

      const wsCommodities = XLSX.utils.json_to_sheet(this.state.masters.commodities.length ? this.state.masters.commodities : [{ Info: 'No commodities' }]);
      XLSX.utils.book_append_sheet(wb, wsCommodities, 'Master_Commodities');

      const dateStr = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `GTCO_Stock_Tracker_Ledger_${dateStr}.xlsx`);
    }

    // -------------------------------------------------------------
    // UTILITIES
    // -------------------------------------------------------------
    formatDateTime(isoStr) {
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

    escape(str) {
      if (!str) return '';
      return String(str).replace(/[&<>"']/g, m => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[m]));
    }
  }

  // Global instance
  window.app = new MandiApp();
  document.addEventListener('DOMContentLoaded', () => {
    window.app.checkAuth();
  });
})();
