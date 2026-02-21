import frappe
from frappe.model.document import Document


class WeavingContract(Document):

    def before_save(self):
        self.calculate_totals()

    def validate(self):
        self.calculate_totals()

    def calculate_totals(self):
        """Calculate totals from BOM Items child table"""
        total_consumption = 0
        total_yarn = 0
        total_bags = 0

        for item in self.get("bom_items") or []:
            # Calculate yarn qty: consumption * fabric_qty
            if item.consumption and self.fabric_qty:
                item.yarn_qty = item.consumption * self.fabric_qty
            else:
                item.yarn_qty = 0

            # Calculate required bags
            if item.yarn_qty and item.lbs_per_bag:
                import math
                item.required_bags = math.ceil(item.yarn_qty / item.lbs_per_bag)
            else:
                item.required_bags = 0

            total_consumption += item.consumption or 0
            total_yarn += item.yarn_qty or 0
            total_bags += item.required_bags or 0

        self.total_consumption = total_consumption
        self.total_yarn = total_yarn
        self.total_bags = total_bags

    def on_submit(self):
        self.db_set("custom_status", "Open")

    def on_cancel(self):
        self.db_set("custom_status", "Close")
