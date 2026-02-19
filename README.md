# Weaving — Generic ERPNext App

A **multi-site compatible**, open-source Frappe/ERPNext app for managing the complete weaving production workflow.

> ✅ No company-specific data. Works on any ERPNext site out of the box.

---

## 📦 DocTypes Included

| DocType | Type | Description |
|---|---|---|
| Loom Type | Master | Types of looms (Air Jet, Rapier, etc.) |
| Loom | Master | Individual loom machines with specs |
| Shift | Master | Work shifts with supervisor & auto working hours |
| Weaving Contract | Master (Submittable) | Customer weaving contracts with BOM |
| BOM Items | Child Table | Yarn BOM rows linked to Weaving Contract |
| Loom Production | Master (Submittable) | Daily production records per shift |
| Loom Production Items | Child Table | Per-loom production data rows |

---

## 🚀 Installation (Any ERPNext Site)

### Option 1 — From local folder

```bash
# Copy app to your bench apps directory
cp -r weaving /path/to/bench/apps/

# Install on any site
bench --site YOUR_SITE_NAME install-app weaving

# Run migrations
bench --site YOUR_SITE_NAME migrate

# Build assets
bench build --app weaving

# Restart
bench restart
```

### Option 2 — From Git (after publishing)

```bash
bench get-app https://github.com/YOUR_ORG/weaving
bench --site YOUR_SITE_NAME install-app weaving
bench --site YOUR_SITE_NAME migrate
bench restart
```

### Multi-Site Usage

Install on as many sites as needed — each site is fully independent:

```bash
bench --site site1.example.com install-app weaving
bench --site site2.example.com install-app weaving
bench --site site3.example.com install-app weaving
```

---

## 🔗 Dependent Standard DocTypes

These are standard ERPNext/Frappe doctypes that must exist (they do by default in ERPNext):

| Linked From | Links To |
|---|---|
| Weaving Contract | Customer, Item, Payment Term |
| BOM Items | Item, Brand |
| Loom | Loom Type |
| Shift | Employee |
| Loom Production | Shift, Employee |
| Loom Production Items | Loom, Loom Type, Weaving Contract |

---

## 📋 DocType Field Reference

### Loom Type
| Field | Type |
|---|---|
| Loom Type | Data (Name) |

### Loom
| Field | Type | Notes |
|---|---|---|
| Loom No | Data | Auto-name |
| Loom Type | Link → Loom Type | |
| Status | Select | Running / Idle / Maintenance |
| Width | Float | |
| RPM | Float | |
| Reed Space | Float | |
| Efficiency % | Float | |
| Power Consumption (kW) | Float | |

### Shift
| Field | Type | Notes |
|---|---|---|
| Shift Name | Data | Auto-name |
| Start Time | Time | |
| End Time | Time | |
| Supervisor | Link → Employee | |
| Working Hours | Float | Auto-calculated |

### Weaving Contract *(naming: WC-.#####)*
| Field | Type |
|---|---|
| Contract No | Data |
| Weaver | Link → Customer |
| Construction | Link → Item |
| Fabric Qty | Float |
| Fabric Type | Link → Fabric Type* |
| Description | Data |
| Date | Date |
| Type | Link → Weaving Type* |
| Selvedge | Link → Selvedge* |
| Weave | Link → Weave* |
| Loom Type | Link → Loom Type |
| Loom Size | Float |
| No of Looms | Int |
| Tolerance % | Percent |
| Piece Length | Data |
| Sizing Rate Per LBS/Meter | Float |
| Weaving Rate Per Pick/Meter | Data |
| Total Charges Per Meter | Data |
| Payment Terms | Link → Payment Term |
| BOM Items | Child Table |
| Total Consumption / Yarn / Bags | Float (auto) |

*\*These simple master doctypes (Fabric Type, Weaving Type, Selvedge, Weave) should be created on your site via **Customize Form** or the DocType list.*

### BOM Items *(child)*
| Field | Type | Notes |
|---|---|---|
| For | Select | Warp / Weft |
| Yarn Count | Link → Item | |
| Consumption LBS/Meter | Float | |
| Yarn Qty | Float | Auto: Consumption × Fabric Qty |
| UOM | Data | Fetched from Item |
| Lbs Per Bag | Float | |
| Required Bags | Int | Auto: ⌈Yarn Qty ÷ Lbs Per Bag⌉ |
| Delivery Quantity | Float | |
| Delivery Date | Date | |
| Brand | Link → Brand | |

### Loom Production *(naming: LP-.#####)*
| Field | Type |
|---|---|
| Date | Date |
| Shift | Link → Shift |
| Supervisor | Link → Employee (fetched) |
| Start / End Time | Time (fetched) |
| Loom Production Items | Child Table |
| Total Looms / Cuts / Meters | Int/Float (auto) |
| Average Efficiency % | Percent (auto) |

### Loom Production Items *(child)*
| Field | Type | Notes |
|---|---|---|
| Loom | Link → Loom | |
| Loom Type | Link → Loom Type | Fetched |
| Weaving Contract | Link → Weaving Contract | |
| Beam No | Data | |
| Cuts | Int | |
| Cut Length (Meters) | Float | |
| Production Meters | Float | Auto: Cuts × Cut Length |
| Picks / CM | Float | |
| Total Picks | Int | Auto: Meters × Picks/CM × 100 |
| Efficiency % | Percent | |
| Remarks | Small Text | |

---

## ⚙️ Business Logic (Auto-Calculations)

**Weaving Contract:**
- `Yarn Qty = Consumption × Fabric Qty` (per BOM row)
- `Required Bags = ⌈Yarn Qty ÷ Lbs Per Bag⌉`
- `Total Consumption / Yarn / Bags` = sum of child rows

**Shift:**
- `Working Hours` = End Time − Start Time (handles overnight shifts)

**Loom Production:**
- `Production Meters = Cuts × Cut Length`
- `Total Picks = Production Meters × Picks/CM × 100`
- `Average Efficiency` = average of all rows

---

## 📄 License

MIT License — Free to use, modify, and distribute.
