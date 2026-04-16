import api from "@/utils/api"
import { defineStore } from "pinia"
import { computed, reactive, ref } from "vue"
import { toast } from "vue-sonner"

export const useEditSubmission = defineStore("editSubmission", () => {
	const submissionId = ref<string | null>(null)
	const submissionData = ref<any>(null)

	const submission = computed(() => submissionData.value)
	const isDraft = computed(() => submission.value?.status === "Draft")
	const isSubmitted = computed(() => submission.value?.status === "Submitted")

	const isLoading = ref(false)

	async function initialize(id: string) {
		isLoading.value = true
		submissionId.value = id
		try {
			const resp = await api.get(`/submissions/${id}`)
			submissionData.value = resp.data
		} catch (err) {
			toast.error("Failed to load submission")
		} finally {
			isLoading.value = false
		}
	}

	async function convertToDraft() {
		try {
			const resp = await api.patch(`/submissions/${submissionId.value}`, {
				status: "Draft",
			})
			submissionData.value = resp.data
			toast.success("Submission converted to draft")
		} catch (err) {
			toast.error("Failed to convert submission to draft")
		}
	}

	async function updateForm(data: Record<string, any>) {
		try {
			const resp = await api.patch(`/submissions/${submissionId.value}`, {
				data,
			})
			submissionData.value = resp.data
			toast.success("Your response has been updated")
		} catch (err) {
			toast.error("Failed to update your response!")
			throw err
		}
	}

	async function updateAndSubmitForm(data: Record<string, any>) {
		try {
			await updateForm(data)
			await submitForm()
		} catch (error) {
			console.error("Error updating form before submission:", error)
		}
	}

	async function submitForm() {
		try {
			const resp = await api.patch(`/submissions/${submissionId.value}`, {
				status: "Submitted",
			})
			submissionData.value = resp.data
			toast.success("Successfully submitted your response!")
		} catch (err) {
			toast.error("Failed to submit!")
		}
	}

	return {
		submission,
		isLoading,
		submissionId,
		initialize,
		isDraft,
		isSubmitted,
		convertToDraft,
		updateForm,
		updateAndSubmitForm,
		submitForm,
	}
})
