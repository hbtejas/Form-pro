import { Form } from "@/types/form"
import type { FormField, FormFieldTypes } from "@/types/formfield"
import api from "@/utils/api"
import { mapDoctypeFieldForForm } from "@/utils/form_fields"
import { defineStore } from "pinia"
import { computed, reactive, ref } from "vue"
import { toast } from "vue-sonner"

function scrubFieldname(label: string) {
	return label
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "_")
		.replace(/^_+|_+$/g, "")
		.replace(/_{2,}/g, "_")
}

export const useEditForm = defineStore("editForm", () => {
	const currentFormId = ref<string | null>(null)
	const formData = ref<any>(null)
	const selectedField = ref<FormField | null>(null)
	const isLoading = ref(false)
	const isUnsaved = ref(false)
	const doctypeFields = ref<any>([])

	const isPublished = computed(() => formData.value?.is_published || false)
	const fields = computed(() => formData.value?.fields || [])

	async function getDoctypeFields() {
		if (formData.value?.linked_doctype) {
			try {
				const resp = await api.get("/doctypes/fields", {
					params: { doctype: formData.value.linked_doctype },
				})
				doctypeFields.value = resp.data.map((field: any) => ({
					...field,
					fieldtype: mapDoctypeFieldForForm(field.fieldtype),
				}))
			} catch (err) {
				doctypeFields.value = []
			}
		}
	}

	async function initialize(formId: string) {
		if (formId !== currentFormId.value) {
			currentFormId.value = formId
			isLoading.value = true
			try {
				const resp = await api.get(`/forms/${formId}`)
				formData.value = {
					...resp.data,
					title: resp.data.title === "Untitled Form" ? "" : resp.data.title,
				}
				await getDoctypeFields()
			} catch (err) {
				toast.error("Failed to load form")
			} finally {
				isLoading.value = false
			}
		}
	}

	async function reload() {
		if (currentFormId.value) {
			await initialize(currentFormId.value)
		}
	}

	function reset() {
		currentFormId.value = null
		formData.value = null
	}

	async function save() {
		if (formData.value) {
			formData.value.fields.forEach((field: FormField, index: number) => {
				field.idx = index + 1
				if (!field.fieldname || field.fieldname.trim() === "") {
					field.fieldname = scrubFieldname(field.label)
				}
			})

			try {
				const resp = await api.patch(
					`/forms/${currentFormId.value}`,
					formData.value,
				)
				formData.value = resp.data
				isUnsaved.value = false
				toast.success("Form Updated Successfully")
			} catch (err: any) {
				toast.error("Failed to Update Form", { description: err.message })
			}
		}
	}

	async function togglePublish() {
		if (formData.value) {
			try {
				const newStatus = !formData.value.is_published
				const resp = await api.patch(`/forms/${currentFormId.value}`, {
					is_published: newStatus,
				})
				formData.value = resp.data
				toast.success(
					newStatus
						? "Form published successfully"
						: "Form unpublished successfully",
				)
			} catch (err) {
				toast.error("Failed to update publish status")
			}
		}
	}

	function addField(fieldtype: string) {
		if (formData.value) {
			const newField: FormField = {
				idx: formData.value.fields.length + 1,
				fieldtype: fieldtype as FormFieldTypes,
				label: "",
				fieldname: "",
				options: "",
				default: "",
				description: "",
			}
			formData.value.fields.push(newField)
			isUnsaved.value = true
		}
	}

	function addFieldFromDoctype(field: any) {
		if (formData.value) {
			const _newField: FormField = {
				idx: formData.value.fields.length + 1,
				fieldtype: field.fieldtype,
				label: field.label,
				fieldname: field.fieldname,
				options: field.options,
				default: field.default,
				description: field.description,
			}
			formData.value.fields.push(_newField)
			isUnsaved.value = true
		}
	}

	function removeField(field: FormField) {
		if (formData.value?.fields) {
			formData.value.fields = formData.value.fields.filter(
				(f: FormField) => f !== field,
			)
			isUnsaved.value = true
		}
	}

	function selectField(field: FormField | null) {
		selectedField.value = field
	}

	function updateField(originalField: FormField, updatedField: FormField) {
		if (formData.value?.fields) {
			const fieldIndex = formData.value.fields.findIndex(
				(f: FormField) => f === originalField,
			)
			if (fieldIndex !== -1) {
				formData.value.fields[fieldIndex] = updatedField
				isUnsaved.value = true
			}
		}
	}

	return {
		currentFormId,
		isUnsaved,
		isLoading,
		formData,
		fields,
		selectedField,
		isPublished,
		doctypeFields,
		initialize,
		reload,
		reset,
		save,
		togglePublish,
		addField,
		addFieldFromDoctype,
		selectField,
		updateField,
		removeField,
	}
})
