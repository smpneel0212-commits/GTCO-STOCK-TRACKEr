# GTCO Stock Tracker: APMC Agent Ledger & Inventory Platform

> **Domain:** Agricultural Produce Market Committee (APMC)  
> **Target User:** Commission Agent / Arhatiya  
> **Scope:** Inward, Lot Generation, Weighing, Sale, and Loose Stock Ledger  
> **Version:** 1.0 (Production Ready)

---

## 🌾 Overview & Business Objective

APMC trading involves receiving unweighed agricultural commodities from farmers, storing them safely until market prices are favorable, executing lot-based sales to buyers in standard 50 kg bag units, settling accounts, and tracking residual loose stock quantities.

### Key Domain Challenge Addressed
When unweighed farmer lots are eventually weighed into standard 50 kg units, discrepancies arise (for example, 10 unweighed bags may yield 11 bags and 25 kg loose). Buyers purchase whole bags only. **GTCO Stock Tracker** accurately splits sales by bill number while crediting remaining loose quantities back to the specific farmer's account and tracking shop inventory.

---

## 📦 Commodity Master Data

Standard bag unit across all commodities is fixed at **50 kg**:

| Code | Commodity Name | Local / Regional Name | Standard Bag Unit | Lot Prefix |
| :--- | :--- | :--- | :--- | :--- |
| **TR** | Pigeon Pea | Toor / Tuvar | 50 kg | `T` (e.g., T01) |
| **CH** | Bengal Gram | Chana | 50 kg | `C` (e.g., C01) |
| **MG** | Green Gram | Moong | 50 kg | `M` (e.g., M01) |
| **UD** | Black Gram | Urad / Matt Pe | 50 kg | `U` (e.g., U01) |
| **JW** | Sorghum | Jowar | 50 kg | `J` (e.g., J01) |
| **SF** | Safflower | Kusub | 50 kg | `S` (e.g., S01) |

---

## 🔄 Core Workflows

### 1. Inward Storing & Lot Numbering
- **Inward Entry:** Captures Inward Date & Time, Farmer Name, Commodity Type, Raw Unweighed Bag Count, and Godown/Bin Storage Location.
- **Dynamic Lot ID Generation:** Automatically assigns unique sequential Lot IDs prefixed by commodity (e.g., `T01`, `C03`, `M02`).
- **Initial Status:** Marked as `"Stored (Unweighed)"` until the farmer decides market prices are favorable.

### 2. Weighing, Buyer Sale & Loose Stock Settlement
- Produce is brought to the scale and weighed strictly into 50 kg bag capacities.
- **Mathematical Settlement:**
  - $\text{Total Net Weight (kg)} = (\text{Sold Bags} \times 50) + \text{Residual Loose (kg)}$
  - **Buyer Billing:** Billed only for whole bags under generated Bill #[Bill_Number].
  - **Farmer Settlement:** Farmer is credited for both whole bags and loose weight.
  - **Shop Loose Ledger:** Residual loose stock (0–49 kg) transfers to Shop Loose Stock Inventory under the farmer's ledger.

### 3. Commercial Audit Trail & Sale Ledger
Maintains an immutable record of:
- Bill Number (e.g., `BILL-2026-0412`)
- Buyer Name (e.g., `Shree Traders`)
- Lot ID (`T01`)
- Sold Standard Bags (50 kg)
- Residual Loose (kg)
- Farmer Account Credited

### 4. Real-Time APMC Dashboard
- **Active Unweighed Stock:** Raw bags stored across godowns.
- **Weighed Lots Pending Sale:** Lots ready for auction or buyer assignment.
- **Cumulative Loose Stock Balances:** Live per-farmer and total shop loose inventory balances.

---

## 🚀 Quick Start

1. Open `index.html` in any modern web browser:
   ```powershell
   Start-Process "index.html"
   ```
2. Or serve using any local static file server.
3. All data is persisted automatically in `localStorage` with options to export/backup as JSON.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
