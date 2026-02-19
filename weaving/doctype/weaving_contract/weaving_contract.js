frappe.ui.form.on('Weaving Contract', {
    refresh: function(frm) {
        // Set status indicator
        if (frm.doc.docstatus === 1) {
            frm.page.set_indicator(frm.doc.custom_status === 'Open' ? __('Open') : __('Closed'),
                frm.doc.custom_status === 'Open' ? 'green' : 'red');
        }

        // Add Close Contract button when submitted and Open
        if (frm.doc.docstatus === 1 && frm.doc.custom_status === 'Open') {
            frm.add_custom_button(__('Close Contract'), function() {
                frappe.confirm(__('Are you sure you want to close this Weaving Contract?'), function() {
                    frappe.call({
                        method: 'frappe.client.set_value',
                        args: {
                            doctype: 'Weaving Contract',
                            name: frm.doc.name,
                            fieldname: 'custom_status',
                            value: 'Close'
                        },
                        callback: function(r) {
                            frm.reload_doc();
                        }
                    });
                });
            }, __('Actions'));
        }
    },

    fabric_qty: function(frm) {
        frm.trigger('calculate_totals');
    },

    calculate_totals: function(frm) {
        let total_consumption = 0;
        let total_yarn = 0;
        let total_bags = 0;

        (frm.doc.bom_items || []).forEach(function(row) {
            let yarn_qty = (row.consumption || 0) * (frm.doc.fabric_qty || 0);
            frappe.model.set_value(row.doctype, row.name, 'yarn_qty', yarn_qty);

            let required_bags = 0;
            if (yarn_qty && row.lbs_per_bag) {
                required_bags = Math.ceil(yarn_qty / row.lbs_per_bag);
            }
            frappe.model.set_value(row.doctype, row.name, 'required_bags', required_bags);

            total_consumption += (row.consumption || 0);
            total_yarn += yarn_qty;
            total_bags += required_bags;
        });

        frm.set_value('total_consumption', total_consumption);
        frm.set_value('total_yarn', total_yarn);
        frm.set_value('total_bags', total_bags);
    }
});

frappe.ui.form.on('BOM Items', {
    consumption: function(frm, cdt, cdn) {
        frm.trigger('calculate_totals');
    },
    lbs_per_bag: function(frm, cdt, cdn) {
        frm.trigger('calculate_totals');
    },
    yarn_count: function(frm, cdt, cdn) {
        // UOM is auto-fetched via fetch_from
    },
    bom_items_remove: function(frm) {
        frm.trigger('calculate_totals');
    }
});
