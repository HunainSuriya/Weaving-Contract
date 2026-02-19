# Weaving App for Frappe/ERPNext

A custom Frappe app providing the **Weaving** module with:

- **Weaving Contract** — Master DocType (submittable)
- **BOM Items** — Child DocType (linked as table in Weaving Contract)

---

## Installation

### Prerequisites
- Frappe Bench set up with ERPNext installed
- Python 3.8+

### Steps

```bash
# 1. Get the app into your bench
bench get-app weaving /path/to/weaving
# OR place the folder directly in apps/
cp -r weaving /path/to/your/bench/apps/

# 2. Install the app on your site
bench --site your-site.local install-app weaving

# 3. Run migrations
bench --site your-site.local migrate

# 4. Build assets
bench build --app weaving

# 5. Restart bench
bench restart
```

---

## Weaving Contract Fields

| Field | Type | Description |
|-------|------|-------------|
| Series (naming_series) | Select | Auto-naming: WC-.##### |
| Contract No | Data | Manual contract reference number |
| Weaver | Link → Customer | The weaver/party |
| Construction | Link → Item | Fabric construction item |
| Fabric Qty | Float | Total fabric quantity |
| Job Status | Select | Open / Close |
| Fabric Type | Link → Fabric Type | Type of fabric |
| Description | Data | Short description |
| Greige Request No | Int | Reference number |
| Date | Date | Contract date |
| Type | Link → Weaving Type | Weaving type |
| Selvedge | Link → Selvedge | Selvedge type |
| Weave | Link → Weave | Weave type |
| ERP Doc# | Data | ERP document reference |
| Mat ID | Data | Material ID |
| **BOM Items** | Table → BOM Items | Child table (see below) |
| Total Consumption | Float | Auto-calculated sum |
| Total Yarn | Float | Auto-calculated sum |
| Total Bags | Int | Auto-calculated sum |
| Sizing Rate Per LBS | Float | Costing |
| Sizing Rate Per Meter | Float | Costing |
| Weaving Rate Per Pick | Data | Costing (editable on submit) |
| Weaving Rate Per Meter | Data | Costing (editable on submit) |
| Total Charges Per Meter | Data | Costing (read-only) |
| Loom Type | Link → Loom Type | Loom details |
| Tolerance % | Percent | Tolerance percentage |
| Loom Size | Float | Loom size |
| No Of Loom | Int | Number of looms |
| Piece Length | Data | Length per piece |
| Payment Terms | Link → Payment Term | Payment terms |

---

## BOM Items (Child Table) Fields

| Field | Type | Description |
|-------|------|-------------|
| For | Select | Warp / Weft |
| Yarn Count | Link → Item | The yarn item |
| Consumption LBS/Meter | Float | Consumption rate |
| Yarn Qty | Float | Auto-calculated (Consumption × Fabric Qty) |
| UOM | Data | Fetched from Yarn Count's stock_uom |
| Lbs Per Bag | Float | Weight per bag |
| Required Bags | Int | Auto-calculated (ceil(Yarn Qty / Lbs Per Bag)) |
| Delivery Quantity | Float | Scheduled delivery qty |
| Delivery Date | Date | Scheduled delivery date |
| Brand | Link → Brand | Yarn brand |

---

## Business Logic

### Auto-Calculations
- **Yarn Qty** = Consumption × Fabric Qty (per BOM row)
- **Required Bags** = ⌈Yarn Qty ÷ Lbs Per Bag⌉ (ceiling division)
- **Total Consumption** = Sum of all row consumptions
- **Total Yarn** = Sum of all row yarn quantities
- **Total Bags** = Sum of all required bags

### Workflow
- Document is **submittable**
- On submit → Job Status set to **Open**
- On cancel → Job Status set to **Close**
- A **Close Contract** button appears on submitted Open contracts

---

## Dependent Doctypes (must exist or be created)
The following linked DocTypes must exist in your ERPNext instance:
- `Customer` (standard ERPNext)
- `Item` (standard ERPNext)
- `Brand` (standard ERPNext)
- `Payment Term` (standard ERPNext)
- `Fabric Type` — Create as simple doctype with name field
- `Weaving Type` — Create as simple doctype with name field
- `Selvedge` — Create as simple doctype with name field
- `Weave` — Create as simple doctype with name field
- `Loom Type` — Create as simple doctype with name field
