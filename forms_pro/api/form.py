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
        "allow_incomplete": form.allow_incomplete,
    }


@frappe.whitelist()
def get_doctype_fields(doctype: str) -> dict:
    doctype = frappe.get_doc("DocType", doctype)
    fields = doctype.fields

    FIELDTYPES_TO_REMOVE = [
        "Section Break",
        "HTML",
        "Button",
        "Column Break",
        "Tab Break",
        "Barcode",
        "Dynamic Link",
        "Fold",
    ]

    fields = [field for field in fields if field.fieldtype not in FIELDTYPES_TO_REMOVE]

    return fields


@frappe.whitelist()
def get_doctype_list() -> list[str]:
    return frappe.db.get_list(
        "DocType",
        filters={"istable": 0},
        pluck="name",
        order_by="name",
        limit_page_length=99999,
    )
