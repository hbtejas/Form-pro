import frappe


class FormGenerator:
    def __init__(self, linked_doctype: str | None = None):
        self.doctype = None
        if linked_doctype:
            self.doctype = frappe.get_doc("DocType", linked_doctype)

    def generate(self):
        self._initialize_doctype()
        self._initialize_form_document()

    def _initialize_doctype(self):
        if self.doctype:
            return

        placeholder_doctype = frappe.new_doc("DocType")
        placeholder_doctype.name = self._generate_doctype_name()
        placeholder_doctype.module = "Forms Pro"
        placeholder_doctype.custom = True
        placeholder_doctype.track_changes = True
        placeholder_doctype.track_views = True
        placeholder_doctype.index_web_pages_for_search = False
        placeholder_doctype.insert(ignore_permissions=True)
        self.doctype = placeholder_doctype

    def _initialize_form_document(self):
        form_document = frappe.new_doc("Form")
        form_document.linked_doctype = self.doctype.name
        form_document.title = f"Form for {self.doctype.name}"
        form_document.insert(ignore_permissions=True)
        self.form_document = form_document

    def _generate_doctype_name(self):
        """
        Generate a unique DocType name with format: formspro_XXXXXX_YYYYYY
        where XXXXXX is a random 6-character string and YYYYYY is a serialized number
        """
        # Count existing formspro_* DocTypes from Forms Pro module
        count = frappe.db.count("DocType", filters={"module": "Forms Pro", "name": ["like", "formspro_%"]})

        # Next number is count + 1
        next_number = count + 1

        # Generate random 6-character string
        random_string = frappe.utils.random_string(6)

        # Format the name with random string and 6-digit padding
        doctype_name = f"formspro_{random_string}{next_number:06d}".lower()

        return doctype_name
