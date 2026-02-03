# -*- coding: utf-8 -*-
# Copyright (c) 2024, Capital Project
# Forty Studio - File Explorer with Permission Controls

import frappe
from frappe import _
from frappe.model.document import Document
import os
import shutil
from datetime import datetime


class FortyStudio(Document):
    pass


def get_user_roles():
    """Get current user's roles"""
    return frappe.get_roles(frappe.session.user)


def get_allowed_apps_for_user():
    """Get list of apps the current user can access based on their roles"""
    user_roles = get_user_roles()

    if "System Manager" in user_roles or "Administrator" in user_roles:
        return None  # None means all apps

    try:
        permissions_doc = frappe.get_single("Forty Studio Permissions")

        if not permissions_doc.list_of_applications_by_role:
            return []

        allowed_apps = set()
        for row in permissions_doc.list_of_applications_by_role:
            if row.role in user_roles and row.application_name:
                allowed_apps.add(row.application_name)

        return list(allowed_apps)
    except Exception:
        return []


def can_user_create():
    """Check if current user can create files and folders"""
    user_roles = get_user_roles()

    if "System Manager" in user_roles or "Administrator" in user_roles:
        return True

    try:
        permissions_doc = frappe.get_single("Forty Studio Permissions")

        if not permissions_doc.list_of_role_can_create_files_and_folder:
            return False

        for row in permissions_doc.list_of_role_can_create_files_and_folder:
            if row.role in user_roles:
                return True

        return False
    except Exception:
        return False


def can_user_delete():
    """Check if current user can delete files and folders"""
    user_roles = get_user_roles()

    if "System Manager" in user_roles or "Administrator" in user_roles:
        return True

    try:
        permissions_doc = frappe.get_single("Forty Studio Permissions")

        if not permissions_doc.list_of_role_can_delete_files_and_folder:
            return False

        for row in permissions_doc.list_of_role_can_delete_files_and_folder:
            if row.role in user_roles:
                return True

        return False
    except Exception:
        return False


def can_user_access_app(app_name):
    """Check if current user can access a specific app"""
    allowed_apps = get_allowed_apps_for_user()

    if allowed_apps is None:
        return True

    return app_name in allowed_apps


@frappe.whitelist()
def get_user_permissions():
    """Get current user's permissions for the UI"""
    allowed_apps = get_allowed_apps_for_user()

    return {
        "can_create": can_user_create(),
        "can_delete": can_user_delete(),
        "allowed_apps": allowed_apps,
        "is_admin": allowed_apps is None
    }


@frappe.whitelist()
def get_installed_apps():
    """Get list of installed Frappe apps filtered by user permissions - returns newline string for Select field"""
    try:
        all_apps = frappe.get_installed_apps()
        allowed_apps = get_allowed_apps_for_user()

        if allowed_apps is None:
            # Admin - return all apps
            return "\n".join(sorted(all_apps))

        # Filter apps based on permissions
        filtered_apps = [app for app in all_apps if app in allowed_apps]
        return "\n".join(sorted(filtered_apps))

    except Exception as e:
        frappe.log_error(f"Error getting installed apps: {str(e)}")
        return ""


def get_app_path(app_name):
    """Get the full path to an app directory"""
    # frappe.get_app_path("frappe") returns something like /bench/apps/frappe/frappe
    # We need to go up two levels to get /bench/apps, then add the app_name
    frappe_module_path = frappe.get_app_path("frappe")  # e.g., /home/user/frappe-bench/apps/frappe/frappe
    apps_dir = os.path.dirname(os.path.dirname(frappe_module_path))  # e.g., /home/user/frappe-bench/apps
    return os.path.join(apps_dir, app_name)


def validate_path(app_name, file_path):
    """Validate that the path is within the app directory"""
    app_path = get_app_path(app_name)
    full_path = os.path.join(app_path, file_path) if file_path else app_path
    real_path = os.path.realpath(full_path)

    if not real_path.startswith(os.path.realpath(app_path)):
        frappe.throw(_("Invalid path: Access denied"))

    return real_path


@frappe.whitelist()
def list_app_folder_files(app_name, path=""):
    """List files and folders in the specified path"""
    if not can_user_access_app(app_name):
        frappe.throw(_("You don't have permission to access this application"))

    try:
        app_path = get_app_path(app_name)
        target_path = validate_path(app_name, path)

        if not os.path.exists(target_path):
            frappe.log_error(f"Path does not exist: {target_path}")
            return []

        if not os.path.isdir(target_path):
            frappe.log_error(f"Path is not a directory: {target_path}")
            return []

        items = []
        for item in os.listdir(target_path):
            # Skip hidden files and __pycache__
            if item.startswith('.') or item == '__pycache__':
                continue

            item_path = os.path.join(target_path, item)
            relative_path = os.path.relpath(item_path, app_path)
            is_dir = os.path.isdir(item_path)

            file_info = {
                "name": item,
                "path": relative_path,
                "is_dir": is_dir,
                "is_file": not is_dir
            }

            if not is_dir:
                try:
                    file_info["size"] = os.path.getsize(item_path)
                except:
                    file_info["size"] = 0

            items.append(file_info)

        return items

    except Exception as e:
        frappe.log_error(f"Error listing files: {str(e)}")
        return []


@frappe.whitelist()
def read_file_content(app_name, file_path):
    """Read the content of a file"""
    if not can_user_access_app(app_name):
        frappe.throw(_("You don't have permission to access this application"))

    try:
        full_path = validate_path(app_name, file_path)

        if not os.path.exists(full_path):
            frappe.throw(_("File not found"))

        if os.path.isdir(full_path):
            frappe.throw(_("Cannot read directory as file"))

        with open(full_path, 'r', encoding='utf-8', errors='replace') as f:
            return f.read()

    except UnicodeDecodeError:
        frappe.throw(_("Cannot read binary file"))
    except Exception as e:
        frappe.log_error(f"Error reading file: {str(e)}")
        frappe.throw(_("Error reading file: {0}").format(str(e)))


def create_backup(app_name, file_path):
    """Create a backup of a file before modifying it"""
    try:
        full_path = validate_path(app_name, file_path)

        if not os.path.exists(full_path) or os.path.isdir(full_path):
            return None

        file_dir = os.path.dirname(full_path)
        file_name = os.path.basename(full_path)
        backup_dir = os.path.join(file_dir, '.backups')

        if not os.path.exists(backup_dir):
            os.makedirs(backup_dir)

        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_name = f"{file_name}.{timestamp}.bak"
        backup_path = os.path.join(backup_dir, backup_name)

        shutil.copy2(full_path, backup_path)
        return backup_path

    except Exception as e:
        frappe.log_error(f"Error creating backup: {str(e)}")
        return None


@frappe.whitelist()
def write_file_content_with_backup(app_name, file_path, content, password):
    """Write content to a file with backup"""
    if not can_user_access_app(app_name):
        frappe.throw(_("You don't have permission to access this application"))

    if password != "save_and_edit":
        frappe.throw(_("Invalid confirmation code"))

    try:
        full_path = validate_path(app_name, file_path)

        if os.path.exists(full_path):
            create_backup(app_name, file_path)

        with open(full_path, 'w', encoding='utf-8') as f:
            f.write(content)

        return {"success": True, "message": _("File saved successfully")}

    except Exception as e:
        frappe.log_error(f"Error writing file: {str(e)}")
        frappe.throw(_("Error writing file: {0}").format(str(e)))


@frappe.whitelist()
def create_new_file(app_name, folder_path, file_name, password):
    """Create a new file"""
    if not can_user_access_app(app_name):
        frappe.throw(_("You don't have permission to access this application"))

    if not can_user_create():
        frappe.throw(_("You don't have permission to create files"))

    if password != "save_and_edit":
        frappe.throw(_("Invalid confirmation code"))

    try:
        app_path = get_app_path(app_name)
        target_dir = validate_path(app_name, folder_path)

        if not file_name or '/' in file_name or '\\' in file_name:
            frappe.throw(_("Invalid file name"))

        full_path = os.path.join(target_dir, file_name)

        if os.path.exists(full_path):
            frappe.throw(_("File already exists"))

        with open(full_path, 'w', encoding='utf-8') as f:
            f.write("")

        relative_path = os.path.relpath(full_path, app_path)
        return {"success": True, "message": _("File created successfully"), "file_path": relative_path}

    except Exception as e:
        frappe.log_error(f"Error creating file: {str(e)}")
        frappe.throw(_("Error creating file: {0}").format(str(e)))


@frappe.whitelist()
def create_new_folder(app_name, parent_path, folder_name, password):
    """Create a new folder"""
    if not can_user_access_app(app_name):
        frappe.throw(_("You don't have permission to access this application"))

    if not can_user_create():
        frappe.throw(_("You don't have permission to create folders"))

    if password != "save_and_edit":
        frappe.throw(_("Invalid confirmation code"))

    try:
        target_dir = validate_path(app_name, parent_path)

        if not folder_name or '/' in folder_name or '\\' in folder_name:
            frappe.throw(_("Invalid folder name"))

        full_path = os.path.join(target_dir, folder_name)

        if os.path.exists(full_path):
            frappe.throw(_("Folder already exists"))

        os.makedirs(full_path)
        return {"success": True, "message": _("Folder created successfully")}

    except Exception as e:
        frappe.log_error(f"Error creating folder: {str(e)}")
        frappe.throw(_("Error creating folder: {0}").format(str(e)))


@frappe.whitelist()
def delete_file(app_name, file_path, password):
    """Delete a file"""
    if not can_user_access_app(app_name):
        frappe.throw(_("You don't have permission to access this application"))

    if not can_user_delete():
        frappe.throw(_("You don't have permission to delete files"))

    if password != "sure_delete":
        frappe.throw(_("Invalid confirmation code"))

    try:
        full_path = validate_path(app_name, file_path)

        if not os.path.exists(full_path):
            frappe.throw(_("File not found"))

        if os.path.isfile(full_path):
            create_backup(app_name, file_path)
            os.remove(full_path)
        else:
            shutil.rmtree(full_path)

        return {"success": True, "message": _("Deleted successfully")}

    except Exception as e:
        frappe.log_error(f"Error deleting file: {str(e)}")
        frappe.throw(_("Error deleting: {0}").format(str(e)))


@frappe.whitelist()
def rename_item(app_name, old_path, new_name, password):
    """Rename a file or folder"""
    if not can_user_access_app(app_name):
        frappe.throw(_("You don't have permission to access this application"))

    if password != "save_and_edit":
        frappe.throw(_("Invalid confirmation code"))

    try:
        app_path = get_app_path(app_name)
        full_path = validate_path(app_name, old_path)

        if not os.path.exists(full_path):
            frappe.throw(_("Item not found"))

        if not new_name or '/' in new_name or '\\' in new_name:
            frappe.throw(_("Invalid name"))

        parent_dir = os.path.dirname(full_path)
        new_path = os.path.join(parent_dir, new_name)

        if os.path.exists(new_path):
            frappe.throw(_("An item with this name already exists"))

        if os.path.isfile(full_path):
            create_backup(app_name, old_path)

        os.rename(full_path, new_path)

        relative_path = os.path.relpath(new_path, app_path)
        return {"success": True, "message": _("Renamed successfully"), "new_path": relative_path}

    except Exception as e:
        frappe.log_error(f"Error renaming: {str(e)}")
        frappe.throw(_("Error renaming: {0}").format(str(e)))


@frappe.whitelist()
def list_file_backups(app_name, file_path):
    """List all backups for a specific file"""
    if not can_user_access_app(app_name):
        frappe.throw(_("You don't have permission to access this application"))

    try:
        full_path = validate_path(app_name, file_path)
        file_dir = os.path.dirname(full_path)
        file_name = os.path.basename(full_path)
        backup_dir = os.path.join(file_dir, '.backups')

        if not os.path.exists(backup_dir):
            return []

        backups = []
        for item in os.listdir(backup_dir):
            if item.startswith(file_name + '.') and item.endswith('.bak'):
                backup_path = os.path.join(backup_dir, item)

                try:
                    timestamp_str = item.replace(file_name + '.', '').replace('.bak', '')
                    timestamp = datetime.strptime(timestamp_str, '%Y%m%d_%H%M%S')
                    formatted_time = timestamp.strftime('%Y-%m-%d %H:%M:%S')
                except:
                    formatted_time = "Unknown"

                size = os.path.getsize(backup_path)
                backups.append({
                    "filename": item,
                    "timestamp": formatted_time,
                    "size": size,
                    "size_formatted": format_file_size(size)
                })

        backups.sort(key=lambda x: x['filename'], reverse=True)
        return backups

    except Exception as e:
        frappe.log_error(f"Error listing backups: {str(e)}")
        return []


@frappe.whitelist()
def read_backup_content(app_name, file_path, backup_filename):
    """Read the content of a backup file"""
    if not can_user_access_app(app_name):
        frappe.throw(_("You don't have permission to access this application"))

    try:
        full_path = validate_path(app_name, file_path)
        file_dir = os.path.dirname(full_path)
        backup_dir = os.path.join(file_dir, '.backups')
        backup_path = os.path.join(backup_dir, backup_filename)

        # Security check
        if not os.path.realpath(backup_path).startswith(os.path.realpath(backup_dir)):
            frappe.throw(_("Invalid backup path"))

        if not os.path.exists(backup_path):
            frappe.throw(_("Backup not found"))

        with open(backup_path, 'r', encoding='utf-8', errors='replace') as f:
            return f.read()

    except Exception as e:
        frappe.log_error(f"Error reading backup: {str(e)}")
        frappe.throw(_("Error reading backup: {0}").format(str(e)))


@frappe.whitelist()
def restore_backup(app_name, file_path, backup_filename, password):
    """Restore a file from backup"""
    if not can_user_access_app(app_name):
        frappe.throw(_("You don't have permission to access this application"))

    if password != "save_and_edit":
        frappe.throw(_("Invalid confirmation code"))

    try:
        full_path = validate_path(app_name, file_path)
        file_dir = os.path.dirname(full_path)
        backup_dir = os.path.join(file_dir, '.backups')
        backup_path = os.path.join(backup_dir, backup_filename)

        if not os.path.realpath(backup_path).startswith(os.path.realpath(backup_dir)):
            frappe.throw(_("Invalid backup path"))

        if not os.path.exists(backup_path):
            frappe.throw(_("Backup not found"))

        if os.path.exists(full_path):
            create_backup(app_name, file_path)

        shutil.copy2(backup_path, full_path)
        return {"success": True, "message": _("File restored successfully")}

    except Exception as e:
        frappe.log_error(f"Error restoring backup: {str(e)}")
        frappe.throw(_("Error restoring backup: {0}").format(str(e)))


def format_file_size(size):
    """Format file size in human readable format"""
    if size < 1024:
        return f"{size} B"
    elif size < 1024 * 1024:
        return f"{size / 1024:.1f} KB"
    else:
        return f"{size / (1024 * 1024):.1f} MB"