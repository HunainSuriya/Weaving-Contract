frappe.ui.form.on('Loom Production', {
	refresh: function(frm) {
		// Quick Add All Looms button (only on new/draft)
		if (frm.doc.docstatus === 0) {
			frm.add_custom_button(__('Fetch All Active Looms'), function() {
				frappe.call({
					method: 'frappe.client.get_list',
					args: {
						doctype: 'Loom',
						filters: [['status', 'in', ['Running', 'Idle']]],
						fields: ['name', 'loom_type'],
						limit_page_length: 200
					},
					callback: function(r) {
						if (r.message && r.message.length) {
							// Avoid duplicates
							const existing = (frm.doc.loom_production_items || []).map(r => r.loom);
							let added = 0;
							r.message.forEach(function(loom) {
								if (!existing.includes(loom.name)) {
									let row = frappe.model.add_child(frm.doc, 'Loom Production Items', 'loom_production_items');
									frappe.model.set_value(row.doctype, row.name, 'loom', loom.name);
									frappe.model.set_value(row.doctype, row.name, 'loom_type', loom.loom_type);
									added++;
								}
							});
							frm.refresh_field('loom_production_items');
							frappe.show_alert({ message: `${added} loom(s) added`, indicator: 'green' });
						} else {
							frappe.msgprint(__('No active looms found.'));
						}
					}
				});
			}, __('Actions'));
		}
	},

	shift: function(frm) {
		// Fetch supervisor and times from shift
		if (frm.doc.shift) {
			frappe.db.get_doc('Shift', frm.doc.shift).then(doc => {
				frm.set_value('supervisor', doc.supervisor);
				frm.set_value('start_time', doc.start_time);
				frm.set_value('end_time', doc.end_time);
			});
		}
	},

	calculate_totals: function(frm) {
		let total_meters = 0, total_cuts = 0, total_looms = 0;
		let efficiencies = [];

		(frm.doc.loom_production_items || []).forEach(function(row) {
			total_looms++;
			total_cuts += (row.cuts || 0);
			total_meters += (row.production_meters || 0);
			if (row.efficiency) efficiencies.push(row.efficiency);
		});

		frm.set_value('total_looms', total_looms);
		frm.set_value('total_production_meters', total_meters);
		frm.set_value('total_cuts', total_cuts);
		const avg_eff = efficiencies.length ? efficiencies.reduce((a, b) => a + b, 0) / efficiencies.length : 0;
		frm.set_value('average_efficiency', Math.round(avg_eff * 100) / 100);
	}
});

frappe.ui.form.on('Loom Production Items', {
	cuts: function(frm, cdt, cdn) {
		calc_row(frm, cdt, cdn);
	},
	cut_length: function(frm, cdt, cdn) {
		calc_row(frm, cdt, cdn);
	},
	picks_per_cm: function(frm, cdt, cdn) {
		calc_row(frm, cdt, cdn);
	},
	efficiency: function(frm) {
		frm.trigger('calculate_totals');
	},
	loom_production_items_remove: function(frm) {
		frm.trigger('calculate_totals');
	}
});

function calc_row(frm, cdt, cdn) {
	let row = locals[cdt][cdn];
	let prod_meters = (row.cuts || 0) * (row.cut_length || 0);
	frappe.model.set_value(cdt, cdn, 'production_meters', prod_meters);

	let total_picks = prod_meters && row.picks_per_cm
		? Math.round(prod_meters * row.picks_per_cm * 100)
		: 0;
	frappe.model.set_value(cdt, cdn, 'total_picks', total_picks);

	frm.trigger('calculate_totals');
}
