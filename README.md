# GTCO Stock Tracker - APMC Agent Ledger & Inventory Platform

> **Domain:** Agricultural Produce Market Committee (APMC)  
> **Target User:** Commission Agent / Arhatiya  
> **Architecture:** Master-Driven Ledger (inspired by Paisabhai)  
> **Deployment:** GitHub Pages (Serverless Client-Side Single Page Application)

---

## 🌾 Overview & Philosophy

**GTCO Stock Tracker** is built specifically for APMC mandi commission agents (*Arhatiyas*). 

### 100% Master-Driven (Zero Hardcoded Demo Data)
Just like an Excel Master Tab, the platform **contains zero hardcoded demo data**. You have total control to add, edit, and manage:
- **Farmers Directory:** Add your own farmers (Name, Mobile, Village, Notes).
- **Commodities Master:** Add your own commodities (Name, Regional/Mandi Name, Code, Bag Size in kg [default 50kg], Lot Prefix like `T`, `C`, etc.).
- **Storage Locations Master:** Add your own godowns, floor bins, sheds, and bays.
- **Buyers Directory:** Register grain companies, traders, and mandi buyers.

---

## 🔍 Multi-Criteria Search & Stock Isolation

The platform features an instant search and dynamic filtering bar:
- **Filter by Farmer:** Isolates all inward lots, sales transactions, and residual loose stock balances for that specific farmer.
- **Filter by Commodity:** Isolates all active godown stock, sold bags, and loose quantities for that commodity.
- **Filter by Godown Location:** Quickly audit stock resting in a specific warehouse bin.
- **Universal Text Search:** Live-filters simultaneously across Farmer, Commodity, Lot ID, Location, Bill Number, and Buyer.
- **Dynamic KPI Cards:** The top summary cards instantly recalculate to show the exact totals for the filtered farmer or commodity!

---

## ⚖️ Standard 50kg Weighing & Commercial Split Engine

When unweighed farmer produce is brought to the scale:
1. **Scale Standardization:** 
   $$\text{Total Net Weight (kg)} = (\text{Sold Whole Bags} \times 50) + \text{Residual Loose (kg)}$$
2. **Buyer Billing:** Buyers purchase strictly whole 50 kg bags under an auto-generated Bill Number.
3. **Farmer Account Settlement:** Farmer is credited for both whole bags and residual loose weight.
4. **Shop Loose Stock:** Residual loose stock ($0 \le \text{loose} < 50\text{ kg}$) is automatically deposited into the Shop Loose Inventory mapped to that farmer's ledger.

---

## 📊 Two-Way Excel Synchronization (SheetJS)

Export your complete APMC ledger to a formatted Excel workbook with one click:
- `Inward_Produce`
- `Sales_Audit_Ledger`
- `Master_Farmers`
- `Master_Commodities`

---

## 🚀 Live Demo
Access the live platform on GitHub Pages:
**[https://smpneel0212-commits.github.io/GTCO-STOCK-TRACKEr/](https://smpneel0212-commits.github.io/GTCO-STOCK-TRACKEr/)**

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
