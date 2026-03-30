import type { FormField } from "@/types/formfield"
import api from "@/utils/api"
import {
	shouldFieldBeRequired,
	shouldFieldBeVisible,
} from "@/utils/conditionals"
import { useStorage } from "@vueuse/core"
import { defineStore } from "pinia"
import { computed, ref } from "vue"
import { toast } from "vue-sonner"

export type UserSubmission = {
	_id: string
	createdAt: string
	updatedAt: string
}

export const useSubmissionForm = defineStore("submissionForm", () => {
	const currentForm = ref<any>(null)
	const currentFormRoute = ref<string | null>(null)
	const isLoading = ref(false)
	const allowIncompleteForms = computed(
		() => currentForm.value?.allow_incomplete,
	)

	const currentFormId = computed(() => currentForm.value?._id)
	const formIsPublished = computed(() => currentForm.value?.is_published)

	const errors = ref<string[]>([])
	const inSuccessState = ref<boolean>(false)
	const inFormFillingState = ref<boolean>(true)

	const fields = ref<Record<string, any>>({})
	const userSubmissions = ref<UserSubmission[] | null>(null)

	function initializeFields() {
		if (!currentForm.value) return

		const _fields: Record<string, any> = {}
		for (const field of currentForm.value.fields) {
			_fields[field.fieldname] = field.default || ""
		}

		fields.value = _fields
	}

	async function initialize(routeOrId: string) {
		if (!routeOrId) return
		currentFormRoute.value = routeOrId
		isLoading.value = true
		try {
			const resp = await api.get(`/forms/public/${routeOrId}`)
			const data = resp.data
			currentForm.value = data
			initializeFields()

			const draftKey = `draft_submission_data_${data._id}`
			const draftData = useStorage(draftKey, {}, localStorage)
			if (draftData.value && Object.keys(draftData.value).length > 0) {
				fields.value = { ...fields.value, ...draftData.value }
			}
			inFormFillingState.value = true
		} catch (err: any) {
			toast.error("Failed to load form")
		} finally {
			isLoading.value = false
		}
	}

	async function submitForm(is_draft = false, ignore_validations = false) {
		if (!currentForm.value) return

		if (!ignore_validations) {
			validateValues()
			if (errors.value.length > 0) return
		}

		try {
			await api.post(`/forms/${currentForm.value._id}/submissions`, {
				values: fields.value,
			})
			clearDraft()
			if (is_draft) {
				toast.info("Draft saved successfully")
			} else {
				inFormFillingState.value = false
				inSuccessState.value = true
			}
		} catch (err: any) {
			toast.error("Failed to submit form")
			errors.value = [
				err.response?.data?.message || "Error while submitting form.",
			]
		}
	}

	function validateValues() {
		errors.value = []
		const allFields = currentForm.value?.fields || []
		for (const field of allFields) {
			if (!shouldFieldBeVisible(field, fields.value, allFields)) continue
			if (
				shouldFieldBeRequired(field, fields.value, allFields) &&
				!fields.value[field.fieldname]
			) {
				errors.value.push(`${field.label} is required`)
			}
		}
	}

	function clearDraft() {
		if (!currentForm.value) return
		localStorage.removeItem(`draft_submission_data_${currentForm.value._id}`)
	}

	return {
		currentForm,
		currentFormId,
		currentFormRoute,
		validateValues,
		fields,
		isLoading,
		allowIncompleteForms,
		errors,
		inSuccessState,
		inFormFillingState,
		userSubmissions,
		formIsPublished,
		initialize,
		submitForm,
	}
})
