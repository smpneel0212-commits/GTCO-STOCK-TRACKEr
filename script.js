/**
 * GTCO Stock Tracker - APMC Agent Ledger & Inventory Platform
 * Master-driven architecture inspired by Paisabhai.
 * Protected with Paisabhai Cross-Device Access Lock (SHARNU PATIL / 02161301).
 * Pre-loaded with official Neelahalli APMC Mandi Ledger Entries (264 bags, 213 Kuntal, 229kg loose).
 */

(function () {
  'use strict';

  // Authentication configuration matching Paisabhai
  const AUTH_CONFIG = {
    username: 'SHARNU PATIL',
    password: '02161301',
    storageKey: 'gtco_auth_session_v1'
  };

  // Bump storage version so newly loaded sheet entries populate immediately
  const STORAGE_KEY = 'gtco_stock_tracker_v5_50kg';

  // Seed data matching the user's Neelahalli Mandi sheet exactly
  const SHEET_FARMERS = [
    { id: 'f_smpatil', name: 'SMPATIL', mobile: '', village: 'NEELAHALLI', notes: 'Mandi Account' },
    { id: 'f_raju_mankar', name: 'RAJU MANKAR', mobile: '', village: 'NEELAHALLI', notes: '' },
    { id: 'f_baswaraj_sharnaiyya', name: 'BASWARAJ SHARNAIYYA', mobile: '', village: 'NEELAHALLI', notes: '' },
    { id: 'f_anil_pujari', name: 'ANIL PUJARI', mobile: '', village: 'NEELAHALLI', notes: '' },
    { id: 'f_devappa_k', name: 'DEVAPPA K', mobile: '', village: 'NEELAHALLI', notes: '' },
    { id: 'f_beerban_hola', name: 'BEERBAN HOLA', mobile: '', village: 'NEELAHALLI', notes: '' },
    { id: 'f_sharanu_post', name: 'SHARANU POST', mobile: '', village: 'NEELAHALLI', notes: '' },
    { id: 'f_siddu_bamnalli', name: 'SIDDU BAMNALLI', mobile: '', village: 'BAMNALLI', notes: '' },
    { id: 'f_jhangir_saab', name: 'JHANGIR SAAB', mobile: '', village: 'NEELAHALLI', notes: '' },
    { id: 'f_chandamma_byader', name: 'CHANDAMMA BYADER', mobile: '', village: 'NEELAHALLI', notes: '' },
    { id: 'f_shankappa_malagi', name: 'SHANKAPPA MALAGI', mobile: '', village: 'NEELAHALLI', notes: '' },
    { id: 'f_kalappa_madival', name: 'KALAPPA MADIVAL', mobile: '', village: 'NEELAHALLI', notes: '' },
    { id: 'f_jagadevi_police_patil', name: 'JAGADEVI POLICE PATIL', mobile: '', village: 'NEELAHALLI', notes: '' },
    { id: 'f_marthand_pujari', name: 'MARTHAND PUJARI', mobile: '', village: 'NEELAHALLI', notes: '' },
    { id: 'f_bmpatil', name: 'BMPATIL', mobile: '', village: 'NEELAHALLI', notes: '' },
    { id: 'f_nagappa_ambanna', name: 'NAGAPPA AMBANNA', mobile: '', village: 'NEELAHALLI', notes: '' },
    { id: 'f_baswaraj_devar', name: 'BASWARAJ DEVAR', mobile: '', village: 'KOKNALLI', notes: '' },
    { id: 'f_kashappa_byader', name: 'KASHAPPA BYADER', mobile: '', village: 'NEELAHALLI', notes: '' }
  ];

  const SHEET_COMMODITIES = [
    { id: 'comm_tr', code: 'TR', prefix: 'T', name: 'Pigeon Pea', localName: 'Toor / Kuntal Bag (50kg)', unitKg: 50 }
  ];

  const SHEET_LOCATIONS = [
    { id: 'loc_bay_a', name: 'BAY A', desc: 'Main APMC Floor Bay' }
  ];

  const SHEET_INWARD_LOTS = [
    { lotId: 'T01', arrivalDateTime: '2026-09-20T09:30', farmerId: 'f_smpatil', commodityId: 'comm_tr', unweighedBags: 11, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T02', arrivalDateTime: '2026-09-22T10:15', farmerId: 'f_raju_mankar', commodityId: 'comm_tr', unweighedBags: 14, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T03', arrivalDateTime: '2026-09-22T11:00', farmerId: 'f_baswaraj_sharnaiyya', commodityId: 'comm_tr', unweighedBags: 53, locationId: 'loc_bay_a', status: 'Stored (Unweighed)' },
    { lotId: 'T04', arrivalDateTime: '2026-09-24T08:30', farmerId: 'f_smpatil', commodityId: 'comm_tr', unweighedBags: 16.5, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T05', arrivalDateTime: '2026-09-24T09:00', farmerId: 'f_smpatil', commodityId: 'comm_tr', unweighedBags: 63, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T06', arrivalDateTime: '2026-09-24T09:30', farmerId: 'f_anil_pujari', commodityId: 'comm_tr', unweighedBags: 15, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T07', arrivalDateTime: '2026-09-24T10:00', farmerId: 'f_devappa_k', commodityId: 'comm_tr', unweighedBags: 7, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T08', arrivalDateTime: '2026-09-24T10:30', farmerId: 'f_beerban_hola', commodityId: 'comm_tr', unweighedBags: 5, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T09', arrivalDateTime: '2026-09-24T11:00', farmerId: 'f_sharanu_post', commodityId: 'comm_tr', unweighedBags: 7.5, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T10', arrivalDateTime: '2026-09-24T11:30', farmerId: 'f_siddu_bamnalli', commodityId: 'comm_tr', unweighedBags: 3, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T11', arrivalDateTime: '2026-09-24T12:00', farmerId: 'f_jhangir_saab', commodityId: 'comm_tr', unweighedBags: 6, locationId: 'loc_bay_a', status: 'Stored (Unweighed)' },
    { lotId: 'T12', arrivalDateTime: '2026-09-24T12:30', farmerId: 'f_chandamma_byader', commodityId: 'comm_tr', unweighedBags: 5, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T13', arrivalDateTime: '2026-09-24T13:00', farmerId: 'f_shankappa_malagi', commodityId: 'comm_tr', unweighedBags: 14, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T14', arrivalDateTime: '2026-09-24T13:30', farmerId: 'f_kalappa_madival', commodityId: 'comm_tr', unweighedBags: 9, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T15', arrivalDateTime: '2026-09-24T14:00', farmerId: 'f_jagadevi_police_patil', commodityId: 'comm_tr', unweighedBags: 5, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T16', arrivalDateTime: '2026-09-24T14:30', farmerId: 'f_marthand_pujari', commodityId: 'comm_tr', unweighedBags: 18, locationId: 'loc_bay_a', status: 'Stored (Unweighed)' },
    { lotId: 'T17', arrivalDateTime: '2026-09-24T15:30', farmerId: 'f_nagappa_ambanna', commodityId: 'comm_tr', unweighedBags: 8, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T18', arrivalDateTime: '2026-09-24T16:00', farmerId: 'f_baswaraj_devar', commodityId: 'comm_tr', unweighedBags: 3, locationId: 'loc_bay_a', status: 'Weighed & Sold' },
    { lotId: 'T19', arrivalDateTime: '2026-09-24T16:30', farmerId: 'f_kashappa_byader', commodityId: 'comm_tr', unweighedBags: 1, locationId: 'loc_bay_a', status: 'Weighed & Sold' }
  ];

  const SHEET_SALES = [
    { billNumber: 'BILL-2026-0001', dateTime: '2026-09-20T10:00', buyerName: 'APMC Open Auction', lotId: 'T01', farmerId: 'f_smpatil', commodityId: 'comm_tr', soldBags: 11, residualLooseKg: 0, totalWeightQtl: 11.00, ratePerQtl: 7200, totalBuyerPayable: 11 * 7200 },
    { billNumber: 'BILL-2026-0002', dateTime: '2026-09-22T11:00', buyerName: 'APMC Open Auction', lotId: 'T02', farmerId: 'f_raju_mankar', commodityId: 'comm_tr', soldBags: 19, residualLooseKg: 7, totalWeightQtl: 19.07, ratePerQtl: 7200, totalBuyerPayable: 19 * 7200 },
    { billNumber: 'BILL-2026-0003', dateTime: '2026-09-24T09:00', buyerName: 'APMC Open Auction', lotId: 'T04', farmerId: 'f_smpatil', commodityId: 'comm_tr', soldBags: 17, residualLooseKg: 39, totalWeightQtl: 17.39, ratePerQtl: 7200, totalBuyerPayable: 17 * 7200 },
    { billNumber: 'BILL-2026-0004', dateTime: '2026-09-24T09:30', buyerName: 'APMC Open Auction', lotId: 'T05', farmerId: 'f_smpatil', commodityId: 'comm_tr', soldBags: 63, residualLooseKg: 10, totalWeightQtl: 63.10, ratePerQtl: 7200, totalBuyerPayable: 63 * 7200 },
    { billNumber: 'BILL-2026-0005', dateTime: '2026-09-24T10:00', buyerName: 'APMC Open Auction', lotId: 'T06', farmerId: 'f_anil_pujari', commodityId: 'comm_tr', soldBags: 20, residualLooseKg: 13, totalWeightQtl: 20.13, ratePerQtl: 7200, totalBuyerPayable: 20 * 7200 },
    { billNumber: 'BILL-2026-0006', dateTime: '2026-09-24T10:30', buyerName: 'APMC Open Auction', lotId: 'T07', farmerId: 'f_devappa_k', commodityId: 'comm_tr', soldBags: 9, residualLooseKg: 5, totalWeightQtl: 9.05, ratePerQtl: 7200, totalBuyerPayable: 9 * 7200 },
    { billNumber: 'BILL-2026-0007', dateTime: '2026-09-24T11:00', buyerName: 'APMC Open Auction', lotId: 'T08', farmerId: 'f_beerban_hola', commodityId: 'comm_tr', soldBags: 6, residualLooseKg: 1, totalWeightQtl: 6.01, ratePerQtl: 7200, totalBuyerPayable: 6 * 7200 },
    { billNumber: 'BILL-2026-0008', dateTime: '2026-09-24T11:30', buyerName: 'APMC Open Auction', lotId: 'T09', farmerId: 'f_sharanu_post', commodityId: 'comm_tr', soldBags: 10, residualLooseKg: 3, totalWeightQtl: 10.03, ratePerQtl: 7200, totalBuyerPayable: 10 * 7200 },
    { billNumber: 'BILL-2026-0009', dateTime: '2026-09-24T12:00', buyerName: 'APMC Open Auction', lotId: 'T10', farmerId: 'f_siddu_bamnalli', commodityId: 'comm_tr', soldBags: 4, residualLooseKg: 16, totalWeightQtl: 4.16, ratePerQtl: 7200, totalBuyerPayable: 4 * 7200 },
    { billNumber: 'BILL-2026-0010', dateTime: '2026-09-24T13:00', buyerName: 'APMC Open Auction', lotId: 'T12', farmerId: 'f_chandamma_byader', commodityId: 'comm_tr', soldBags: 6, residualLooseKg: 2, totalWeightQtl: 6.02, ratePerQtl: 7200, totalBuyerPayable: 6 * 7200 },
    { billNumber: 'BILL-2026-0011', dateTime: '2026-09-24T13:30', buyerName: 'APMC Open Auction', lotId: 'T13', farmerId: 'f_shankappa_malagi', commodityId: 'comm_tr', soldBags: 18, residualLooseKg: 18, totalWeightQtl: 18.18, ratePerQtl: 7200, totalBuyerPayable: 18 * 7200 },
    { billNumber: 'BILL-2026-0012', dateTime: '2026-09-24T14:00', buyerName: 'APMC Open Auction', lotId: 'T14', farmerId: 'f_kalappa_madival', commodityId: 'comm_tr', soldBags: 11, residualLooseKg: 13, totalWeightQtl: 11.13, ratePerQtl: 7200, totalBuyerPayable: 11 * 7200 },
    { billNumber: 'BILL-2026-0013', dateTime: '2026-09-24T14:30', buyerName: 'APMC Open Auction', lotId: 'T15', farmerId: 'f_jagadevi_police_patil', commodityId: 'comm_tr', soldBags: 7, residualLooseKg: 8, totalWeightQtl: 7.08, ratePerQtl: 7200, totalBuyerPayable: 7 * 7200 },
    { billNumber: 'BILL-2026-0014', dateTime: '2026-09-24T16:00', buyerName: 'APMC Open Auction', lotId: 'T17', farmerId: 'f_nagappa_ambanna', commodityId: 'comm_tr', soldBags: 8, residualLooseKg: 25, totalWeightQtl: 8.25, ratePerQtl: 7200, totalBuyerPayable: 8 * 7200 },
    { billNumber: 'BILL-2026-0015', dateTime: '2026-09-24T16:30', buyerName: 'APMC Open Auction', lotId: 'T18', farmerId: 'f_baswaraj_devar', commodityId: 'comm_tr', soldBags: 3, residualLooseKg: 46, totalWeightQtl: 3.46, ratePerQtl: 7200, totalBuyerPayable: 3 * 7200 },
    { billNumber: 'BILL-2026-0016', dateTime: '2026-09-24T17:00', buyerName: 'APMC Open Auction', lotId: 'T19', farmerId: 'f_kashappa_byader', commodityId: 'comm_tr', soldBags: 1, residualLooseKg: 23, totalWeightQtl: 1.23, ratePerQtl: 7200, totalBuyerPayable: 1 * 7200 }
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
          const parsed = JSON.parse(saved);
          if (!parsed.outwardDispatches) parsed.outwardDispatches = [];
          return parsed;
        } catch (e) {
          console.error('Failed to parse storage, restoring sheet state', e);
        }
      }
      return this.getDefaultSheetState();
    }

    getDefaultSheetState() {
      return {
        schemaVersion: 4,
        inwardLots: JSON.parse(JSON.stringify(SHEET_INWARD_LOTS)),
        outwardDispatches: [],
        sales: JSON.parse(JSON.stringify(SHEET_SALES)),
        masters: {
          farmers: JSON.parse(JSON.stringify(SHEET_FARMERS)),
          commodities: JSON.parse(JSON.stringify(SHEET_COMMODITIES)),
          locations: JSON.parse(JSON.stringify(SHEET_LOCATIONS)),
          buyers: []
        }
      };
    }

    resetToSheetData() {
      if (confirm('Reload all 20 entries directly from the Neelahalli APMC Mandi spreadsheet?')) {
        this.state = this.getDefaultSheetState();
        this.saveState();
        this.populateFilterDropdowns();
        this.renderAll();
        alert('Neelahalli Mandi sheet data successfully reloaded!');
      }
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
      this.state.masters.commodities = this.state.masters.commodities.filter(c => c.id !== id);
      this.saveState();
      this.populateFilterDropdowns();
      this.populateInwardDropdowns();
      this.renderAll();
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
      this.renderMasterBuyers();
      this.initLucide();
    }

    deleteBuyer(id) {
      const buyer = this.state.masters.buyers.find(b => b.id === id);
      if (!buyer) return;
      this.state.masters.buyers = this.state.masters.buyers.filter(b => b.id !== id);
      this.saveState();
      this.renderMasterBuyers();
    }

    // -------------------------------------------------------------
    // LOT ID & GATE PASS NUMBER GENERATOR
    // -------------------------------------------------------------
    getNextLotId(commodityId) {
      const comm = this.state.masters.commodities.find(c => c.id === commodityId);
      const prefix = comm && comm.prefix ? comm.prefix : 'T';
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

    getNextGatePassNumber() {
      const year = new Date().getFullYear();
      let maxSeq = 0;
      (this.state.outwardDispatches || []).forEach(o => {
        const match = o.gatePassNo && o.gatePassNo.match(/OUT-\d+-(\d+)/);
        if (match) {
          const seq = parseInt(match[1], 10);
          if (seq > maxSeq) maxSeq = seq;
        }
      });
      return `OUT-${year}-${(maxSeq + 1).toString().padStart(4, '0')}`;
    }

    // Stock availability per lot
    getLotOutwardBags(lotId) {
      return (this.state.outwardDispatches || [])
        .filter(o => o.lotId === lotId)
        .reduce((sum, o) => sum + (parseFloat(o.bags) || 0), 0);
    }

    getLotAvailableBags(lotId) {
      const lot = this.state.inwardLots.find(l => l.lotId === lotId);
      if (!lot) return 0;
      const outwardBags = this.getLotOutwardBags(lotId);
      return Math.max(0, lot.unweighedBags - outwardBags);
    }

    // -------------------------------------------------------------
    // DROPDOWN POPULATORS
    // -------------------------------------------------------------
    populateFilterDropdowns() {
      const farmerSelect = document.getElementById('filter-farmer');
      const currentFarmer = farmerSelect.value;
      farmerSelect.innerHTML = `<option value="">👤 All Farmers</option>` +
        this.state.masters.farmers.map(f => `<option value="${f.id}">${this.escape(f.name)} (${f.village || ''})</option>`).join('');
      farmerSelect.value = currentFarmer;

      const commSelect = document.getElementById('filter-commodity');
      const currentComm = commSelect.value;
      commSelect.innerHTML = `<option value="">🌾 All Commodities</option>` +
        this.state.masters.commodities.map(c => `<option value="${c.id}">${this.escape(c.name)} (${c.code})</option>`).join('');
      commSelect.value = currentComm;

      const locSelect = document.getElementById('filter-location');
      const currentLoc = locSelect.value;
      locSelect.innerHTML = `<option value="">📍 All Locations</option>` +
        this.state.masters.locations.map(l => `<option value="${l.id}">${this.escape(l.name)}</option>`).join('');
      locSelect.value = currentLoc;
    }

    populateInwardDropdowns() {
      const farmerSelect = document.getElementById('inward-farmer');
      farmerSelect.innerHTML = `<option value="" disabled selected>-- Select Farmer --</option>` +
        this.state.masters.farmers.map(f => `<option value="${f.id}">${this.escape(f.name)} [${f.village || 'Neelahalli'}]</option>`).join('');

      const commSelect = document.getElementById('inward-commodity');
      commSelect.innerHTML = `<option value="" disabled selected>-- Select Commodity --</option>` +
        this.state.masters.commodities.map(c => `<option value="${c.id}">${this.escape(c.name)} (${c.localName || c.code})</option>`).join('');

      const locSelect = document.getElementById('inward-location');
      locSelect.innerHTML = `<option value="" disabled selected>-- Select Location --</option>` +
        this.state.masters.locations.map(l => `<option value="${l.id}">${this.escape(l.name)}</option>`).join('');
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
      this.openModal('modal-inward');
      this.updateInwardLotPreview();
    }

    handleInwardSubmit(e) {
      e.preventDefault();
      const farmerId = document.getElementById('inward-farmer').value;
      const commodityId = document.getElementById('inward-commodity').value;
      const unweighedBags = parseFloat(document.getElementById('inward-bags').value);
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
    // OUTWARD STOCK DISPATCH WORKFLOW
    // -------------------------------------------------------------
    openNewOutwardModal(preselectedLotId = '') {
      const select = document.getElementById('outward-lot-id');
      const lotsWithStock = this.state.inwardLots.filter(l => this.getLotAvailableBags(l.lotId) > 0);

      if (lotsWithStock.length === 0) {
        alert('No stock available in godown to dispatch. Record an Inward arrival first.');
        return;
      }

      select.innerHTML = `<option value="" disabled ${!preselectedLotId ? 'selected' : ''}>-- Select Available Lot --</option>` +
        lotsWithStock.map(l => {
          const farmer = this.state.masters.farmers.find(f => f.id === l.farmerId) || { name: 'Unknown' };
          const comm = this.state.masters.commodities.find(c => c.id === l.commodityId) || { name: 'Unknown' };
          const avail = this.getLotAvailableBags(l.lotId);
          return `<option value="${l.lotId}" ${l.lotId === preselectedLotId ? 'selected' : ''}>Lot ${l.lotId} - ${farmer.name} (${comm.name}) - ${avail} Bags in Store</option>`;
        }).join('');

      document.getElementById('outward-gatepass').value = this.getNextGatePassNumber();
      
      const dtInput = document.getElementById('outward-datetime');
      if (dtInput) {
        const now = new Date();
        const offset = now.getTimezoneOffset() * 60000;
        dtInput.value = (new Date(now - offset)).toISOString().slice(0, 16);
      }

      document.getElementById('outward-bags').value = '';
      document.getElementById('outward-receiver').value = '';
      document.getElementById('outward-vehicle').value = '';
      document.getElementById('outward-notes').value = '';

      this.handleOutwardLotSelect();
      this.openModal('modal-outward');
    }

    handleOutwardLotSelect() {
      const lotId = document.getElementById('outward-lot-id').value;
      const lot = this.state.inwardLots.find(l => l.lotId === lotId);
      const infoBox = document.getElementById('outward-lot-info-box');

      if (!lot) {
        if (infoBox) infoBox.classList.add('hidden');
        return;
      }

      const farmer = this.state.masters.farmers.find(f => f.id === lot.farmerId) || { name: 'Unknown' };
      const comm = this.state.masters.commodities.find(c => c.id === lot.commodityId) || { name: 'Unknown' };
      const avail = this.getLotAvailableBags(lot.lotId);

      document.getElementById('outward-info-farmer').textContent = farmer.name;
      document.getElementById('outward-info-commodity').textContent = comm.name;
      document.getElementById('outward-info-available').textContent = `${avail} Bags`;

      const bagsInput = document.getElementById('outward-bags');
      bagsInput.max = avail;
      bagsInput.placeholder = `Max ${avail} bags`;

      if (infoBox) infoBox.classList.remove('hidden');
    }

    handleOutwardSubmit(e) {
      e.preventDefault();
      const lotId = document.getElementById('outward-lot-id').value;
      const lot = this.state.inwardLots.find(l => l.lotId === lotId);
      if (!lot) return;

      const avail = this.getLotAvailableBags(lotId);
      const bags = parseFloat(document.getElementById('outward-bags').value);

      if (isNaN(bags) || bags <= 0) {
        alert('Please enter a valid number of outward bags.');
        return;
      }

      if (bags > avail) {
        alert(`Cannot dispatch ${bags} bags. Only ${avail} bags available in Lot ${lotId}.`);
        return;
      }

      const gatePassNo = document.getElementById('outward-gatepass').value.trim();
      const dateTime = document.getElementById('outward-datetime').value;
      const type = document.getElementById('outward-type').value;
      const receiver = document.getElementById('outward-receiver').value.trim();
      const vehicleNo = document.getElementById('outward-vehicle').value.trim();
      const notes = document.getElementById('outward-notes').value.trim();

      const outwardRecord = {
        id: `out_${Date.now()}`,
        gatePassNo,
        dateTime,
        lotId,
        farmerId: lot.farmerId,
        commodityId: lot.commodityId,
        bags,
        type,
        receiver,
        vehicleNo,
        notes
      };

      if (!this.state.outwardDispatches) this.state.outwardDispatches = [];
      this.state.outwardDispatches.unshift(outwardRecord);

      this.saveState();
      this.closeModal('modal-outward');
      this.renderAll();
      this.showOutwardSlip(outwardRecord);
    }

    showOutwardSlip(outward) {
      const farmer = this.state.masters.farmers.find(f => f.id === outward.farmerId) || { name: 'Unknown' };
      const comm = this.state.masters.commodities.find(c => c.id === outward.commodityId) || { name: 'Unknown' };

      const html = `
        <div class="text-center pb-3 border-b border-dashed border-slate-300">
          <h2 class="text-base font-extrabold text-amber-800">GTCO AGRO COMMODITY GODOWN</h2>
          <p class="text-[11px] text-slate-500">APMC Market Yard - Neelahalli / Main Gate Store</p>
          <div class="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-900 border border-amber-300">
            Official Outward Gate Pass / Delivery Challan
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div><strong class="text-slate-500">Gate Pass #:</strong> <span class="font-mono font-bold text-amber-800">${outward.gatePassNo}</span></div>
          <div class="text-right"><strong class="text-slate-500">Date:</strong> ${this.formatDateTime(outward.dateTime)}</div>
          <div><strong class="text-slate-500">Source Lot ID:</strong> <span class="lot-badge">${outward.lotId}</span></div>
          <div class="text-right"><strong class="text-slate-500">Dispatch Purpose:</strong> <span class="font-bold">${outward.type}</span></div>
          <div><strong class="text-slate-500">Farmer:</strong> <span class="font-bold">${this.escape(farmer.name)}</span></div>
          <div class="text-right"><strong class="text-slate-500">Commodity:</strong> ${this.escape(comm.name)}</div>
          <div><strong class="text-slate-500">Dispatched To:</strong> <span class="font-bold text-slate-900">${this.escape(outward.receiver)}</span></div>
          <div class="text-right"><strong class="text-slate-500">Vehicle / Truck #:</strong> <span class="font-mono font-bold uppercase">${this.escape(outward.vehicleNo)}</span></div>
        </div>

        <div class="my-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-center">
          <div class="text-[11px] font-bold text-amber-900 uppercase">Total Produce Dispatched</div>
          <div class="text-2xl font-extrabold text-amber-950 font-mono my-0.5">${outward.bags} Bags</div>
          <div class="text-[11px] text-slate-600 font-semibold">${comm.name} • Mandi Packing</div>
        </div>

        ${outward.notes ? `<div class="p-2 rounded-lg bg-slate-100 text-[11px] text-slate-600"><strong>Driver/Notes:</strong> ${this.escape(outward.notes)}</div>` : ''}

        <div class="pt-6 grid grid-cols-2 text-center text-[10px] text-slate-500">
          <div>
            <div class="border-t border-slate-300 w-32 mx-auto pt-1 font-bold">Godown Clerk / In-Charge</div>
          </div>
          <div>
            <div class="border-t border-slate-300 w-32 mx-auto pt-1 font-bold">Driver / Receiver Signature</div>
          </div>
        </div>
      `;

      document.getElementById('outward-slip-print-area').innerHTML = html;
      this.openModal('modal-outward-slip');
    }

    // -------------------------------------------------------------
    // WEIGHING & SALE CHECKOUT (KUNTAL BAG & KG BAG)
    // -------------------------------------------------------------
    openWeighModal(lotId) {
      const lot = this.state.inwardLots.find(l => l.lotId === lotId);
      if (!lot) return;

      const farmer = this.state.masters.farmers.find(f => f.id === lot.farmerId) || { name: 'Unknown' };
      const comm = this.state.masters.commodities.find(c => c.id === lot.commodityId) || { name: 'Unknown', unitKg: 50 };

      document.getElementById('sale-lot-id').value = lot.lotId;
      document.getElementById('sale-display-lot').textContent = lot.lotId;
      document.getElementById('sale-display-farmer').textContent = farmer.name;
      document.getElementById('sale-display-commodity').textContent = `${comm.name} (${comm.localName || comm.code})`;
      document.getElementById('sale-display-rawbags').textContent = `${lot.unweighedBags} bags`;

      document.getElementById('sale-input-total-kg').value = lot.unweighedBags;
      document.getElementById('sale-input-bags').value = Math.floor(lot.unweighedBags);
      document.getElementById('sale-input-loose').value = 0;
      document.getElementById('sale-bill-number').value = this.getNextBillNumber();
      document.getElementById('sale-rate').value = 7200;

      this.updateSalePreviewCalculations();
      this.openModal('modal-sale');
    }

    handleScaleWeightChange() {
      const val = parseFloat(document.getElementById('sale-input-total-kg').value);
      if (!isNaN(val) && val >= 0) {
        const kuntalBags = Math.floor(val);
        const looseKg = Math.round((val - kuntalBags) * 100);
        document.getElementById('sale-input-bags').value = kuntalBags;
        document.getElementById('sale-input-loose').value = looseKg;
      }
      this.updateSalePreviewCalculations();
    }

    handleBagOrLooseChange() {
      const bags = parseInt(document.getElementById('sale-input-bags').value, 10) || 0;
      const loose = parseFloat(document.getElementById('sale-input-loose').value) || 0;
      const totalNotation = bags + (loose / 100);
      document.getElementById('sale-input-total-kg').value = totalNotation.toFixed(2);
      this.updateSalePreviewCalculations();
    }

    handleRateChange() {
      this.updateSalePreviewCalculations();
    }

    updateSalePreviewCalculations() {
      const bags = parseInt(document.getElementById('sale-input-bags').value, 10) || 0;
      const loose = parseFloat(document.getElementById('sale-input-loose').value) || 0;
      const rate = parseFloat(document.getElementById('sale-rate').value) || 0;

      const totalNetKg = (bags * 50) + loose;
      const totalNotation = (bags + (loose / 100)).toFixed(2);
      const buyerPayable = bags * rate; // whole 50kg Kuntal bags

      document.getElementById('sale-live-calc-text').textContent =
        `Yield: ${bags} Kuntal Bags (50kg each = ${bags * 50} kg) + ${loose} kg Loose = ${totalNetKg} kg Net (Sheet: ${totalNotation})`;

      document.getElementById('sale-buyer-amount').value =
        `₹ ${buyerPayable.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

      document.getElementById('preview-buyer-bags').textContent = `${bags} Bags (50kg)`;
      document.getElementById('preview-farmer-credit').textContent = `${bags} Bags + ${loose} kg`;
      document.getElementById('preview-shop-loose').textContent = `${loose} kg`;
    }

    handleSaleSubmit(e) {
      e.preventDefault();
      const lotId = document.getElementById('sale-lot-id').value;
      const lot = this.state.inwardLots.find(l => l.lotId === lotId);
      if (!lot) return;

      const billNumber = document.getElementById('sale-bill-number').value.trim();
      const buyerName = document.getElementById('sale-buyer-input').value.trim() || 'APMC Open Auction';
      const soldBags = parseInt(document.getElementById('sale-input-bags').value, 10);
      const residualLooseKg = parseFloat(document.getElementById('sale-input-loose').value);
      const ratePerQtl = parseFloat(document.getElementById('sale-rate').value) || 7200;

      if (!billNumber || isNaN(soldBags) || isNaN(residualLooseKg)) {
        alert('Please complete all sale fields.');
        return;
      }

      const totalWeightQtl = (soldBags + (residualLooseKg / 100)).toFixed(2);
      const totalNetKg = (soldBags * 50) + residualLooseKg;
      const totalBuyerPayable = soldBags * ratePerQtl;

      // Update lot status
      lot.status = 'Weighed & Sold';

      const saleRecord = {
        billNumber,
        dateTime: new Date().toISOString(),
        buyerName,
        lotId,
        farmerId: lot.farmerId,
        commodityId: lot.commodityId,
        soldBags,
        residualLooseKg,
        totalWeightQtl,
        totalNetKg,
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
      const comm = this.state.masters.commodities.find(c => c.id === sale.commodityId) || { name: 'Unknown', unitKg: 50 };
      const totalNetKg = sale.totalNetKg || ((sale.soldBags * 50) + sale.residualLooseKg);
      const sheetNotation = sale.totalWeightQtl || (sale.soldBags + (sale.residualLooseKg / 100)).toFixed(2);

      const html = `
        <div class="text-center pb-3 border-b border-dashed border-slate-300">
          <h2 class="text-base font-extrabold text-brand-800">GTCO AGRO COMMODITY TRADING CO.</h2>
          <p class="text-[11px] text-slate-500">APMC Commission Agent / Arhatiya - Neelahalli Mandi</p>
          <div class="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-200 text-slate-800">
            Sauda Chitthi / APMC Commercial Sale Slip (50kg Bag Standard)
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2 text-[11px]">
          <div><strong class="text-slate-500">Bill Number:</strong> <span class="font-mono font-bold">${sale.billNumber}</span></div>
          <div class="text-right"><strong class="text-slate-500">Date:</strong> ${this.formatDateTime(sale.dateTime)}</div>
          <div><strong class="text-slate-500">Farmer:</strong> <span class="font-bold">${this.escape(farmer.name)} (${farmer.village || 'Neelahalli'})</span></div>
          <div class="text-right"><strong class="text-slate-500">Lot ID:</strong> <span class="lot-badge">${sale.lotId}</span></div>
          <div><strong class="text-slate-500">Commodity:</strong> ${this.escape(comm.name)} (50kg Bag)</div>
          <div class="text-right"><strong class="text-slate-500">Buyer:</strong> ${this.escape(sale.buyerName || 'APMC Auction')}</div>
        </div>

        <table class="w-full text-left border-collapse text-[11px] my-2">
          <thead>
            <tr class="bg-slate-100 border-b border-slate-200 font-bold text-slate-700">
              <th class="p-1.5">Description</th>
              <th class="p-1.5 text-right">Standard Qty</th>
              <th class="p-1.5 text-right">Net Weight</th>
              <th class="p-1.5 text-right">Rate / 50kg Bag</th>
              <th class="p-1.5 text-right">Buyer Payable</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr>
              <td class="p-1.5 font-bold">Kuntal Bags Sold (50kg)</td>
              <td class="p-1.5 text-right font-bold">${sale.soldBags} Bags</td>
              <td class="p-1.5 text-right font-mono">${sale.soldBags * 50} kg</td>
              <td class="p-1.5 text-right">₹ ${sale.ratePerQtl || 7200}</td>
              <td class="p-1.5 text-right font-mono font-bold text-brand-700">₹ ${(sale.totalBuyerPayable || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
            </tr>
            <tr class="bg-amber-50 text-amber-900">
              <td class="p-1.5 font-bold">Residual Loose Stock</td>
              <td class="p-1.5 text-right">Unsold</td>
              <td class="p-1.5 text-right font-mono font-bold">${sale.residualLooseKg} kg</td>
              <td class="p-1.5 text-right">--</td>
              <td class="p-1.5 text-right font-bold">Shop Loose Ledger</td>
            </tr>
            <tr class="border-t-2 border-slate-900 font-bold bg-slate-100">
              <td class="p-1.5">Total Weighed Yield</td>
              <td class="p-1.5 text-right">${sale.soldBags} Bags + ${sale.residualLooseKg} kg</td>
              <td class="p-1.5 text-right font-mono">${totalNetKg} kg (${sheetNotation})</td>
              <td class="p-1.5 text-right">Net Buyer</td>
              <td class="p-1.5 text-right font-mono text-brand-800 text-xs">₹ ${(sale.totalBuyerPayable || 0).toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
            </tr>
          </tbody>
        </table>

        <div class="p-2 rounded-xl bg-slate-100 text-[10px] text-slate-600 leading-tight">
          <strong>Settlement Notice:</strong> Buyer invoice is generated strictly for whole 50kg Kuntal bag units.
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

    matchesFilter(item, type) {
      const f = this.filters;
      const farmerId = item.farmerId;
      const commodityId = item.commodityId;

      if (f.farmerId && farmerId !== f.farmerId) return false;
      if (f.commodityId && commodityId !== f.commodityId) return false;

      if (type === 'lot') {
        if (f.locationId && item.locationId !== f.locationId) return false;
        if (f.status && item.status !== f.status) return false;
      }

      if (f.text) {
        const farmer = this.state.masters.farmers.find(it => it.id === farmerId);
        const comm = this.state.masters.commodities.find(it => it.id === commodityId);
        const farmerName = farmer ? `${farmer.name} ${farmer.village || ''}`.toLowerCase() : '';
        const commName = comm ? `${comm.name} ${comm.localName || ''} ${comm.code}`.toLowerCase() : '';
        const lotId = (item.lotId || '').toLowerCase();

        let extraMatch = false;
        if (type === 'lot') {
          const loc = this.state.masters.locations.find(it => it.id === item.locationId);
          const locName = loc ? loc.name.toLowerCase() : '';
          extraMatch = locName.includes(f.text);
        } else if (type === 'sale') {
          const billNo = (item.billNumber || '').toLowerCase();
          extraMatch = billNo.includes(f.text);
        } else if (type === 'outward') {
          const gatePass = (item.gatePassNo || '').toLowerCase();
          const vehicle = (item.vehicleNo || '').toLowerCase();
          const receiver = (item.receiver || '').toLowerCase();
          extraMatch = gatePass.includes(f.text) || vehicle.includes(f.text) || receiver.includes(f.text);
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
      this.renderOutwardTable();
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

      // Total Unweighed Bags Inward
      let totalInwardBags = 0;
      let unsoldBags = 0;
      filteredLots.forEach(l => {
        totalInwardBags += l.unweighedBags;
        if (l.status === 'Stored (Unweighed)') {
          unsoldBags += l.unweighedBags;
        }
      });

      // Total Sold Kuntal Bags
      let totalKuntalBags = 0;
      let totalLooseKg = 0;
      filteredSales.forEach(s => {
        totalKuntalBags += s.soldBags;
        totalLooseKg += s.residualLooseKg;
      });

      document.getElementById('kpi-inward-bags').textContent = totalInwardBags;
      document.getElementById('kpi-inward-lots-sub').textContent = `${filteredLots.length} farmer lots received`;

      document.getElementById('kpi-kuntal-bags').textContent = totalKuntalBags;
      document.getElementById('kpi-sold-lots-sub').textContent = `${filteredSales.length} lots settled & sold`;

      document.getElementById('kpi-loose-kg').textContent = totalLooseKg;
      document.getElementById('kpi-unsold-bags').textContent = unsoldBags;

      const looseSub = document.getElementById('kpi-loose-sub');
      if (looseSub) {
        const eq50kg = Math.floor(totalLooseKg / 50);
        const remKg = totalLooseKg % 50;
        looseSub.textContent = `${eq50kg} Convertible 50kg Bags + ${remKg} kg`;
      }

      document.getElementById('badge-inward-count').textContent = this.state.inwardLots.length;
      document.getElementById('badge-outward-count').textContent = (this.state.outwardDispatches || []).length;
      document.getElementById('badge-sales-count').textContent = this.state.sales.length;

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
            <td colspan="13" class="text-center py-10 text-slate-400">
              <div class="flex flex-col items-center justify-center gap-2">
                <i data-lucide="package-open" class="w-8 h-8 text-slate-300"></i>
                <p class="font-semibold text-xs">No matching inward lots found.</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map(lot => {
        const farmer = this.state.masters.farmers.find(f => f.id === lot.farmerId) || { name: 'Unknown', village: 'NEELAHALLI' };
        const loc = this.state.masters.locations.find(l => l.id === lot.locationId) || { name: 'BAY A' };
        const sale = this.state.sales.find(s => s.lotId === lot.lotId);

        const isUnweighed = lot.status === 'Stored (Unweighed)';
        const kuntalBag = sale ? sale.soldBags : '--';
        const kgBag = sale ? (sale.residualLooseKg > 0 ? sale.residualLooseKg : '0') : '--';
        const totalWeight = sale ? (sale.totalWeightQtl ? sale.totalWeightQtl : (sale.soldBags + (sale.residualLooseKg/100)).toFixed(2)) : '--';
        const soldWeight = sale ? sale.soldBags : '--';
        const unsoldWeight = sale ? (sale.residualLooseKg > 0 ? (sale.residualLooseKg / 100).toFixed(2) : '0') : '--';

        return `
          <tr class="hover:bg-slate-50/80 transition text-xs">
            <td class="py-3 px-3 text-slate-600 font-mono">${lot.arrivalDateTime.slice(0, 10)}</td>
            <td class="py-3 px-3"><span class="lot-badge">${lot.lotId}</span></td>
            <td class="py-3 px-3 font-bold text-slate-900">${this.escape(farmer.name)}</td>
            <td class="py-3 px-3 text-slate-600">${this.escape(farmer.village || 'NEELAHALLI')}</td>
            <td class="py-3 px-3 text-center font-bold font-mono text-slate-900">${lot.unweighedBags}</td>
            <td class="py-3 px-3 text-center font-mono font-bold text-blue-700">${kuntalBag}</td>
            <td class="py-3 px-3 text-center font-mono text-amber-800">${kgBag !== '--' && kgBag > 0 ? `<span class="loose-badge">${kgBag} kg</span>` : kgBag}</td>
            <td class="py-3 px-3 text-right font-mono font-bold text-slate-900">${totalWeight}</td>
            <td class="py-3 px-3 text-right font-mono text-emerald-700 font-bold">${soldWeight}</td>
            <td class="py-3 px-3 text-right font-mono text-slate-600">${unsoldWeight}</td>
            <td class="py-3 px-3 text-slate-700 font-semibold">${this.escape(loc.name)}</td>
            <td class="py-3 px-3 text-center">
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${isUnweighed ? 'bg-amber-100 text-amber-800 border border-amber-200' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}">
                ${isUnweighed ? 'Unsold' : 'Sold'}
              </span>
            </td>
            <td class="py-3 px-3 text-right space-x-1">
              ${isUnweighed ? `
                <button onclick="app.openWeighModal('${lot.lotId}')" class="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition">
                  <i data-lucide="scale" class="w-3 h-3"></i> Weigh & Sell
                </button>
              ` : `
                <button onclick="app.showInvoiceSlipByBill('${sale.billNumber}')" class="px-2 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition">
                  Slip
                </button>
              `}
            </td>
          </tr>
        `;
      }).join('');
    }

    renderOutwardTable() {
      const tbody = document.getElementById('outward-table-body');
      const filtered = (this.state.outwardDispatches || []).filter(o => this.matchesFilter(o, 'outward'));

      if (filtered.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="9" class="text-center py-10 text-slate-400">
              <div class="flex flex-col items-center justify-center gap-2">
                <i data-lucide="truck" class="w-8 h-8 text-slate-300"></i>
                <p class="font-semibold text-xs">No outward dispatches recorded yet.</p>
                <p class="text-[11px] text-slate-400">Click "+ Outward" to dispatch bags from godown to a buyer truck.</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map(o => {
        const farmer = this.state.masters.farmers.find(f => f.id === o.farmerId) || { name: 'Unknown' };
        const comm = this.state.masters.commodities.find(c => c.id === o.commodityId) || { name: 'Unknown' };

        return `
          <tr class="hover:bg-slate-50/80 transition text-xs">
            <td class="py-3 px-4 font-mono font-bold text-amber-800">${o.gatePassNo}</td>
            <td class="py-3 px-4 text-slate-600">${this.formatDateTime(o.dateTime)}</td>
            <td class="py-3 px-4"><span class="lot-badge">${o.lotId}</span></td>
            <td class="py-3 px-4">${this.escape(comm.name)}</td>
            <td class="py-3 px-4 font-bold text-slate-900">${this.escape(farmer.name)}</td>
            <td class="py-3 px-4 text-center font-bold font-mono text-amber-700 text-sm">${o.bags} Bags</td>
            <td class="py-3 px-4 font-semibold text-slate-800">${this.escape(o.receiver)}</td>
            <td class="py-3 px-4 font-mono font-bold uppercase text-slate-700">${this.escape(o.vehicleNo)}</td>
            <td class="py-3 px-4 text-right">
              <button onclick='app.showOutwardSlipById("${o.id}")' class="px-2.5 py-1 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition inline-flex items-center gap-1">
                <i data-lucide="receipt" class="w-3.5 h-3.5"></i> Pass
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }

    showOutwardSlipById(id) {
      const outward = (this.state.outwardDispatches || []).find(o => o.id === id);
      if (outward) this.showOutwardSlip(outward);
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
                <p class="font-semibold text-xs">No commercial sales bills found.</p>
              </div>
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = filtered.map(s => {
        const farmer = this.state.masters.farmers.find(f => f.id === s.farmerId) || { name: 'Unknown', village: 'NEELAHALLI' };
        const totalWeight = s.totalWeightQtl ? s.totalWeightQtl : (s.soldBags + (s.residualLooseKg / 100)).toFixed(2);

        return `
          <tr class="hover:bg-slate-50/80 transition text-xs">
            <td class="py-3 px-4 font-mono font-bold text-blue-700">${s.billNumber}</td>
            <td class="py-3 px-4 text-slate-600">${s.dateTime.slice(0, 10)}</td>
            <td class="py-3 px-4 font-bold text-slate-900">${this.escape(farmer.name)}</td>
            <td class="py-3 px-4 text-slate-600">${this.escape(farmer.village || 'NEELAHALLI')}</td>
            <td class="py-3 px-4"><span class="lot-badge">${s.lotId}</span></td>
            <td class="py-3 px-4 text-center font-bold font-mono text-blue-700 text-sm">${s.soldBags} Bags</td>
            <td class="py-3 px-4 text-center"><span class="loose-badge">+ ${s.residualLooseKg} kg</span></td>
            <td class="py-3 px-4 text-right font-mono font-bold text-slate-900">${(s.soldBags * 50) + s.residualLooseKg} kg <span class="text-xs text-slate-500 font-normal">(${totalWeight})</span></td>
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

      // Aggregate loose per farmer
      const looseMap = {};
      filteredSales.forEach(s => {
        if (s.residualLooseKg > 0) {
          const key = s.farmerId;
          if (!looseMap[key]) {
            looseMap[key] = {
              farmerId: s.farmerId,
              totalKg: 0
            };
          }
          looseMap[key].totalKg += s.residualLooseKg;
        }
      });

      const entries = Object.values(looseMap).sort((a, b) => b.totalKg - a.totalKg);
      if (entries.length === 0) {
        summaryBody.innerHTML = `<tr><td colspan="5" class="text-center py-6 text-slate-400 text-xs">No loose balances recorded.</td></tr>`;
      } else {
        summaryBody.innerHTML = entries.map(item => {
          const farmer = this.state.masters.farmers.find(f => f.id === item.farmerId) || { name: 'Unknown', village: 'NEELAHALLI' };
          const eqBags = Math.floor(item.totalKg / 50);
          const remainder = item.totalKg % 50;

          return `
            <tr class="hover:bg-slate-50 text-xs">
              <td class="py-2.5 px-4 font-bold text-slate-900">${this.escape(farmer.name)}</td>
              <td class="py-2.5 px-4 text-slate-600">${this.escape(farmer.village || 'NEELAHALLI')}</td>
              <td class="py-2.5 px-4 text-right"><span class="loose-badge">${item.totalKg} kg</span></td>
              <td class="py-2.5 px-4 text-right font-mono font-bold">${eqBags > 0 ? `${eqBags} Bags (50kg)` : '0 Bags'}</td>
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
              <td class="py-2.5 px-4 text-slate-600">Shop Loose Bin</td>
            </tr>
          `;
        }).join('');
      }

      document.getElementById('badge-loose-count').textContent = entries.length;
    }

    renderMasterFarmers() {
      const tbody = document.getElementById('master-farmers-table-body');
      if (this.state.masters.farmers.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center py-8 text-slate-400 text-xs">No farmers added yet.</td></tr>`;
        return;
      }
      tbody.innerHTML = this.state.masters.farmers.map(f => `
        <tr class="hover:bg-slate-50 text-xs">
          <td class="py-2.5 px-4 font-bold text-slate-900">${this.escape(f.name)}</td>
          <td class="py-2.5 px-4 text-slate-600">${this.escape(f.mobile || '--')}</td>
          <td class="py-2.5 px-4 text-slate-600 font-semibold">${this.escape(f.village || 'NEELAHALLI')}</td>
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
        tbody.innerHTML = `<tr><td colspan="6" class="text-center py-8 text-slate-400 text-xs">No commodities added.</td></tr>`;
        return;
      }
      tbody.innerHTML = this.state.masters.commodities.map(c => `
        <tr class="hover:bg-slate-50 text-xs">
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
        tbody.innerHTML = `<tr><td colspan="3" class="text-center py-8 text-slate-400 text-xs">No storage locations added yet.</td></tr>`;
        return;
      }
      tbody.innerHTML = this.state.masters.locations.map(l => `
        <tr class="hover:bg-slate-50 text-xs">
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
        tbody.innerHTML = `<tr><td colspan="4" class="text-center py-8 text-slate-400 text-xs">No buyers added yet.</td></tr>`;
        return;
      }
      tbody.innerHTML = this.state.masters.buyers.map(b => `
        <tr class="hover:bg-slate-50 text-xs">
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

      // Sheet 1: Inward Produce matching user's CSV format
      const inwardRows = this.state.inwardLots.map(l => {
        const farmer = this.state.masters.farmers.find(f => f.id === l.farmerId) || { name: 'Unknown', village: 'NEELAHALLI' };
        const loc = this.state.masters.locations.find(item => item.id === l.locationId) || { name: 'BAY A' };
        const sale = this.state.sales.find(s => s.lotId === l.lotId);
        return {
          'Date': l.arrivalDateTime.slice(0, 10),
          'Agriculturist / Farmer Name': farmer.name,
          'Village': farmer.village || 'NEELAHALLI',
          'Unweighed Bags Inward': l.unweighedBags,
          'KUNTAL BAG (50kg)': sale ? sale.soldBags : '',
          'KG BAG (Loose kg)': sale ? sale.residualLooseKg : '',
          'TOTAL WEIGHT': sale ? (sale.totalWeightQtl || (sale.soldBags + sale.residualLooseKg/100)) : '',
          'Sold Weight (50kg Bags)': sale ? sale.soldBags : '',
          'BILL NO': sale ? sale.billNumber : '',
          'UN SOLD WEIGHT': sale ? (sale.residualLooseKg > 0 ? (sale.residualLooseKg / 100).toFixed(2) : 0) : '',
          'PRODUCT AT': loc.name
        };
      });
      const wsInward = XLSX.utils.json_to_sheet(inwardRows);
      XLSX.utils.book_append_sheet(wb, wsInward, 'Mandi_Inward_Sales');

      // Sheet 2: Loose Stock consolidation
      const looseRows = Object.values(
        this.state.sales.filter(s => s.residualLooseKg > 0).reduce((acc, s) => {
          if (!acc[s.farmerId]) acc[s.farmerId] = { farmerId: s.farmerId, looseKg: 0 };
          acc[s.farmerId].looseKg += s.residualLooseKg;
          return acc;
        }, {})
      ).map(item => {
        const farmer = this.state.masters.farmers.find(f => f.id === item.farmerId) || { name: 'Unknown', village: 'NEELAHALLI' };
        return {
          'Farmer Name': farmer.name,
          'Village': farmer.village,
          'Total Loose Stock (kg)': item.looseKg,
          'Convertible 50kg Bags': Math.floor(item.looseKg / 50),
          'Remaining Loose (kg)': item.looseKg % 50
        };
      });
      const wsLoose = XLSX.utils.json_to_sheet(looseRows);
      XLSX.utils.book_append_sheet(wb, wsLoose, 'Loose_Stock_Ledger');

      // Sheet 3: Outward Dispatches
      const outwardRows = (this.state.outwardDispatches || []).map(o => {
        const farmer = this.state.masters.farmers.find(f => f.id === o.farmerId) || { name: 'Unknown' };
        const comm = this.state.masters.commodities.find(c => c.id === o.commodityId) || { name: 'Unknown' };
        return {
          'Gate Pass #': o.gatePassNo,
          'Date': o.dateTime,
          'Source Lot ID': o.lotId,
          'Farmer': farmer.name,
          'Commodity': comm.name,
          'Dispatched Bags': o.bags,
          'Purpose': o.type,
          'Consignee / Receiver': o.receiver,
          'Vehicle #': o.vehicleNo,
          'Driver / Notes': o.notes
        };
      });
      const wsOutward = XLSX.utils.json_to_sheet(outwardRows.length ? outwardRows : [{ Info: 'No outward dispatches yet' }]);
      XLSX.utils.book_append_sheet(wb, wsOutward, 'Outward_Dispatches');

      // Sheet 4: Farmers Directory
      const wsFarmers = XLSX.utils.json_to_sheet(this.state.masters.farmers);
      XLSX.utils.book_append_sheet(wb, wsFarmers, 'Farmers_Directory');

      const dateStr = new Date().toISOString().slice(0, 10);
      XLSX.writeFile(wb, `Neelahalli_APMC_Mandi_Ledger_${dateStr}.xlsx`);
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
