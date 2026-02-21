frappe.ui.form.on('Shift', {
	start_time: function(frm) {
		frm.trigger('calculate_working_hours');
	},
	end_time: function(frm) {
		frm.trigger('calculate_working_hours');
	},
	calculate_working_hours: function(frm) {
		if (frm.doc.start_time && frm.doc.end_time) {
			// Parse HH:MM:SS strings
			const toSeconds = (t) => {
				const parts = t.split(':').map(Number);
				return parts[0] * 3600 + parts[1] * 60 + (parts[2] || 0);
			};
			let start = toSeconds(frm.doc.start_time);
			let end   = toSeconds(frm.doc.end_time);
			if (end < start) end += 86400; // overnight shift
			const hours = (end - start) / 3600;
			frm.set_value('working_hours', Math.round(hours * 100) / 100);
		}
	}
});
