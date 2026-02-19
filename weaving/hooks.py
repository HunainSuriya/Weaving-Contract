app_name = "weaving"
app_title = "Weaving"
app_publisher = "Your Company"
app_description = "Weaving Module for ERPNext"
app_icon = "octicon octicon-file-directory"
app_color = "grey"
app_email = "admin@example.com"
app_license = "MIT"

# App includes
# ----------------------------------------------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/weaving/css/weaving.css"
# app_include_js = "/assets/weaving/js/weaving.js"

# DocType Class
# ---------------
# Override standard doctype classes
# override_doctype_class = {
# 	"ToDo": "custom_app.overrides.CustomToDo"
# }

# Document Events
# ---------------
# Hook on document methods and events
doc_events = {
    "Weaving Contract": {
        "before_save": "weaving.weaving.doctype.weaving_contract.weaving_contract.before_save",
    },
    "Shift": {
        "validate": "weaving.weaving.doctype.shift.shift.validate",
    },
    "Loom Production": {
        "validate": "weaving.weaving.doctype.loom_production.loom_production.validate",
        "before_save": "weaving.weaving.doctype.loom_production.loom_production.before_save",
    }
}

# Scheduled Tasks
# ---------------
# scheduler_events = {}

# Testing
# -------
# before_tests = "weaving.install.before_tests"

# Overriding Methods
# ------------------------------
# override_whitelisted_methods = {}

# each overriding function accepts a `data` argument; max allowed return value size is 6MB
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "weaving.event.get_events"
# }

# Permission query conditions for client-side
# -------------------------------------------
# permission_query_conditions = {}

# Function Map
# ------------------
# fixtures = []
