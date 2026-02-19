import frappe
from frappe.model.document import Document


class LoomProduction(Document):

    def validate(self):
        self.calculate_row_totals()
        self.calculate_summary_totals()

    def before_save(self):
        self.calculate_row_totals()
        self.calculate_summary_totals()

    def calculate_row_totals(self):
        """Calculate production_meters and total_picks for each row."""
        for row in self.get("loom_production_items") or []:
            # Production Meters = Cuts x Cut Length
            if row.cuts and row.cut_length:
                row.production_meters = row.cuts * row.cut_length
            else:
                row.production_meters = 0

            # Total Picks = Production Meters x Picks/CM x 100
            if row.production_meters and row.picks_per_cm:
                row.total_picks = int(row.production_meters * row.picks_per_cm * 100)
            else:
                row.total_picks = 0

    def calculate_summary_totals(self):
        """Roll up totals from child table to parent."""
        items = self.get("loom_production_items") or []

        self.total_looms = len(items)
        self.total_production_meters = sum(row.production_meters or 0 for row in items)
        self.total_cuts = sum(row.cuts or 0 for row in items)

        efficiencies = [row.efficiency for row in items if row.efficiency]
        self.average_efficiency = round(sum(efficiencies) / len(efficiencies), 2) if efficiencies else 0
