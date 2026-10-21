# GTCO Stock Tracker - APMC Inward, Outward & Inventory Platform

> **Domain:** Agricultural Produce Market Committee (APMC)  
> **Target User:** Commission Agent / Arhatiya  
> **Security:** Cross-Device Access Lock (Username: `SHARNU PATIL` / Password: `02161301`)  
> **Architecture:** Master-Driven Ledger (inspired by Paisabhai)  
> **Deployment:** GitHub Pages (Serverless Client-Side Single Page Application)

---

## 🌾 Complete Inward & Outward Stock Tracking

**GTCO Stock Tracker** manages the full lifecycle of agricultural commodities in the mandi:

### 1. Inward Stock (Produce Arrivals)
- Record incoming unweighed farmer lots with auto-generated Lot IDs (`T01`, `C01`, `M01`...).
- Track farmer, commodity, initial raw bags received, and godown storage location.

### 2. Outward Stock (Produce Dispatches & Gate Passes)
- Record stock leaving the godown (buyer sale deliveries, farmer withdrawals, or godown/mill transfers).
- Auto-generates Gate Pass / Challan # (`OUT-2026-0001`).
- Records truck / vehicle number, consignee / buyer, driver contact, and dispatched bag count.
- Generates official, printable **APMC Outward Gate Pass / Delivery Challan**.

### 3. Godown Stock Balance
$$\text{Godown Balance (Bags in Store)} = \text{Total Inward Bags} - \text{Total Outward Bags}$$
- Every inward lot displays:
  - **Inward Bags** (Total received)
  - **Dispatched Out** (Bags already shipped)
  - **In Stock** (Available bags remaining)

---

## 🔍 Multi-Criteria Search & Stock Isolation

- **Filter by Farmer:** Isolates all inward lots, outward dispatches, and loose balances for that specific farmer.
- **Filter by Commodity:** Isolates all active godown stock, outward dispatches, and sales for that commodity.
- **Filter by Godown Location:** Filter stock resting in a specific warehouse bin.
- **Universal Text Search:** Live-filters simultaneously across Farmer, Commodity, Lot ID, Vehicle #, Gate Pass #, Location, Bill #, and Buyer.
- **Dynamic KPI Recalculation:** Top cards dynamically update to show exact Inward, Outward, and Godown balance for active filters.

---

## ⚖️ Standard 50kg Weighing & Commercial Split Engine

When unweighed farmer produce is brought to the scale:
$$\text{Total Net Weight (kg)} = (\text{Sold Whole Bags} \times 50) + \text{Residual Loose (kg)}$$
- **Buyer Billing:** Billed strictly for whole 50 kg bags under an auto-generated Bill Number.
- **Farmer Account Settlement:** Farmer is credited for both whole bags and residual loose weight.
- **Shop Loose Stock:** Residual loose stock ($0 \le \text{loose} < 50\text{ kg}$) is deposited into Shop Loose Inventory mapped to the farmer's ledger.

---

## 📊 Two-Way Excel Synchronization (SheetJS)

Export your complete APMC ledger to a formatted Excel workbook with one click:
- `Inward_Produce`
- `Outward_Dispatches`
- `Sales_Audit_Ledger`
- `Master_Farmers`
- `Master_Commodities`

---

## 🚀 Live Demo
Access the live platform on GitHub Pages:
**[https://smpneel0212-commits.github.io/GTCO-STOCK-TRACKEr/](https://smpneel0212-commits.github.io/GTCO-STOCK-TRACKEr/)**

* **Username:** `SHARNU PATIL` *(case-insensitive)*  
* **Password:** `02161301`

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
