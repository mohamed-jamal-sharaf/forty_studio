// Forty Studio Permissions
// Sets application_name Select options dynamically

let APPS_OPTIONS = '';

frappe.ui.form.on('Forty Studio Permissions', {
    before_load: function(frm) {
        // Load apps synchronously before anything else
        if (!APPS_OPTIONS) {
            frappe.call({
                method: 'forty_studio.forty_studio_module.doctype.forty_studio_permissions.forty_studio_permissions.get_apps_for_select',
                async: false,
                callback: function(r) {
                    if (r.message) {
                        APPS_OPTIONS = r.message;
                    }
                }
            });
        }
    },

    setup: function(frm) {
        set_app_options(frm);
    },

    onload: function(frm) {
        set_app_options(frm);
    },

    refresh: function(frm) {
        set_app_options(frm);
        
        frm.set_intro(`
            <div style="padding: 12px; background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 8px; border-left: 4px solid #1565c0;">
                <h4 style="margin: 0 0 8px 0; color: #1565c0;">📋 Forty Studio Permissions</h4>
                <p style="margin: 4px 0; color: #333;"><strong>• Applications By Role:</strong> Which apps each role can access</p>
                <p style="margin: 4px 0; color: #333;"><strong>• Create Permission:</strong> Roles that can create files/folders</p>
                <p style="margin: 4px 0; color: #333;"><strong>• Delete Permission:</strong> Roles that can delete files/folders</p>
                <p style="margin: 8px 0 0; color: #666; font-size: 12px;"><em>System Manager and Administrator always have full access.</em></p>
            </div>
        `);
    }
});

frappe.ui.form.on('List Of Applications By Role', {
    form_render: function(frm, cdt, cdn) {
        set_app_options(frm);
    },
    
    list_of_applications_by_role_add: function(frm, cdt, cdn) {
        set_app_options(frm);
        // Clear auto-selected value
        frappe.model.set_value(cdt, cdn, 'application_name', '');
    }
});

function set_app_options(frm) {
    if (!APPS_OPTIONS) return;
    
    // Method 1: Update meta docfield
    let df = frappe.meta.get_docfield('List Of Applications By Role', 'application_name');
    if (df) {
        df.options = APPS_OPTIONS;
    }
    
    // Method 2: Update grid docfield property
    if (frm.fields_dict.list_of_applications_by_role && frm.fields_dict.list_of_applications_by_role.grid) {
        frm.fields_dict.list_of_applications_by_role.grid.update_docfield_property(
            'application_name',
            'options',
            APPS_OPTIONS
        );
    }
}