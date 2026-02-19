import frappe
from frappe.model.document import Document
from datetime import datetime, timedelta


class Shift(Document):

    def validate(self):
        self.calculate_working_hours()

    def calculate_working_hours(self):
        """Auto-calculate working hours from start and end time."""
        if self.start_time and self.end_time:
            # Times are stored as timedelta in Frappe
            start = self.start_time
            end = self.end_time

            # Handle overnight shifts (end time < start time)
            if isinstance(start, str):
                start = datetime.strptime(start, "%H:%M:%S")
                end = datetime.strptime(end, "%H:%M:%S")
                if end < start:
                    end += timedelta(hours=24)
                diff = end - start
            else:
                # timedelta objects
                diff = end - start
                if diff.total_seconds() < 0:
                    diff += timedelta(hours=24)

            total_seconds = diff.total_seconds() if hasattr(diff, 'total_seconds') else diff
            self.working_hours = round(total_seconds / 3600, 2)
