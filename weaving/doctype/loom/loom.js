frappe.ui.form.on('Loom', {
	refresh: function(frm) {
		const colors = { 'Running': 'green', 'Idle': 'orange', 'Maintenance': 'red' };
		const status = frm.doc.status;
		if (status) {
			frm.page.set_indicator(__(status), colors[status] || 'grey');
		}
	},

	status: function(frm) {
		const colors = { 'Running': 'green', 'Idle': 'orange', 'Maintenance': 'red' };
		frm.page.set_indicator(__(frm.doc.status), colors[frm.doc.status] || 'grey');
	}
});
