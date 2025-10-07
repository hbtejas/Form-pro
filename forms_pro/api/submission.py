import frappe


@frappe.whitelist(allow_guest=True)
def submit_form_response(form_id: str, form_data: list[dict]):
    form = frappe.get_doc("Form", form_id)
    linked_doctype = form.linked_doctype

    submission = frappe.new_doc(linked_doctype)
    for data in form_data:
        submission.set(data["fieldname"], data["value"])
    submission.insert(ignore_permissions=True)

    return submission.name
