import click
import frappe


def after_install() -> None:
    try:
        create_forms_pro_roles()
    except Exception as e:
        click.secho(f"Error creating Forms Pro roles: {e}", bold=True, fg="red")
        raise


def create_forms_pro_roles() -> None:
    click.secho("Creating Forms Pro roles 📝", bold=True)

    if frappe.db.exists("Role", "Forms Pro User"):
        click.secho("Forms Pro roles already exist ✅", bold=True)
        return

    roles = [
        {
            "role_name": "Forms Pro User",
        },
    ]

    for role in roles:
        frappe.get_doc(
            {
                "doctype": "Role",
                "role_name": role.get("role_name"),
                "desk_access": role.get("desk_access", 0),
            }
        ).insert()

    click.secho("Forms Pro roles created ✅", bold=True)
