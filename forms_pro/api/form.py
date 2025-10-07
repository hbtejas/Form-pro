import frappe


@frappe.whitelist(allow_guest=True)
def get_form_by_route(route: str) -> dict:
    form_id = frappe.db.get_value("Form", {"route": route}, pluck="name")
    return get_form(form_id)


@frappe.whitelist(allow_guest=True)
def get_form(form_id: str) -> dict:
    form = frappe.get_doc(
        "Form",
        form_id,
    )
    return {
        "name": form.name,
        "title": form.title,
        "description": form.description,
        "fields": form.fields,
        "route": form.route,
        "is_published": form.is_published,
    }
