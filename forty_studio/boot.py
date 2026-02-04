import frappe

def set_app_data_map(bootinfo):
    """Bridge app_data (list) to app_data_map (dict) for newer JS assets"""
    if not bootinfo.get("app_data_map") and bootinfo.get("app_data"):
        bootinfo.app_data_map = {}
        for app in bootinfo.app_data:
            app_name = app.get("app_name")
            bootinfo.app_data_map[app_name] = app
