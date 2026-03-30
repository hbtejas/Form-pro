<script setup lang="ts">
import FormRenderer from "@/components/submission/FormRenderer.vue"
import PageHeader from "@/components/submission/PageHeader.vue"
import { Alert, Badge, Button, LoadingText } from "@/components/ui"
import { useEditSubmission } from "@/stores/editSubmission"
import { useSubmissionForm } from "@/stores/submissionForm"
import { formatDateTime } from "@/utils/date"
import { CircleDashed } from "lucide-vue-next"
import { computed, watch } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const submissionFormStore = useSubmissionForm()
const editSubmissionStore = useEditSubmission()

submissionFormStore.initialize(route.params.route as string)
watch(
	() => submissionFormStore.currentForm,
	() => {
		if (submissionFormStore.currentForm) {
			editSubmissionStore.initialize(route.params.submissionId as string)
		}
	},
	{ immediate: true },
)

watch(
	() => editSubmissionStore.submission,
	() => {
		if (editSubmissionStore.submission) {
			const submissionData = editSubmissionStore.submission.data || {}
			for (const key of Object.keys(submissionFormStore.fields)) {
				const matchingField = submissionData[key]
				if (matchingField !== undefined) {
					submissionFormStore.fields[key] = matchingField
				}
			}
		}
	},
	{ immediate: true },
)

const isDirty = computed(() => {
	if (!editSubmissionStore.submission) return false
	const submissionData = editSubmissionStore.submission.data || {}
	return Object.keys(submissionFormStore.fields).some((key) => {
		return submissionFormStore.fields[key] !== submissionData[key]
	})
})
</script>
<template>
    <LoadingText v-if="editSubmissionStore.isLoading" class="mx-auto my-auto w-5 h-5" />
    <div v-else>
        <div class="p-8 bg-surface-gray-1 min-h-svh space-y-12">
            <PageHeader />
            <div class="mx-auto max-w-screen-md space-y-6">
                <Button
                    label="Go to Submission Page"
                    variant="ghost"
                    @click="$router.push(`/p/${submissionFormStore.currentForm?.route}`)"
                />
                <div class="space-y-3">
                    <h2 class="text-lg font-bold">Edit Submission</h2>
                    <h3 class="text-xl font-medium">
                        {{ submissionFormStore.currentForm?.title }}
                    </h3>
                    <Badge
                        theme="blue"
                    >
                        {{ submissionFormStore.formIsPublished ? 'Live' : 'Closed' }}
                    </Badge>
                </div>
                <hr />
                <div class="space-y-3">
                    <h3 class="text-lg font-medium">Submission Details</h3>
                    <div class="flex gap-2 items-center text-sm text-ink-gray-6">
                        <span>Status</span>
                        <Badge
                            :theme="editSubmissionStore.isDraft ? 'gray' : 'green'"
                        >
                            {{ editSubmissionStore.submission?.status }}
                        </Badge>
                    </div>
                    <div class="text-sm text-ink-gray-6">
                        Submission ID:
                        <span class="font-mono">
                            {{ editSubmissionStore.submission?._id }}
                        </span>
                    </div>
                </div>
                <Alert
                    v-if="!submissionFormStore.formIsPublished"
                    title="Form is closed!"
                    theme="blue"
                >
                    This form is no longer live. You can no longer edit your submission.
                </Alert>
                <div class="form-container-simple">
                    <FormRenderer :disabled="!submissionFormStore.formIsPublished">
                        <template #actions>
                            <div v-if="!submissionFormStore.formIsPublished">
                                <span class="text-xs">
                                    Actions are disabled because the form is no longer live.
                                </span>
                            </div>
                            <template v-else>
                                <Button
                                    v-if="editSubmissionStore.isDraft && isDirty"
                                    label="Update"
                                    @click="
                                        () => {
                                            submissionFormStore.validateValues();
                                            if (submissionFormStore.errors.length > 0) {
                                                return;
                                            }
                                            editSubmissionStore.updateForm(
                                                submissionFormStore.fields
                                            );
                                        }
                                    "
                                    :loading="editSubmissionStore.isLoading"
                                />
                                <Button
                                    v-if="editSubmissionStore.isDraft && !isDirty"
                                    label="Submit"
                                    :disabled="isDirty"
                                    variant="solid"
                                    @click="
                                        () => {
                                            submissionFormStore.validateValues();
                                            if (submissionFormStore.errors.length > 0) {
                                                return;
                                            }
                                            editSubmissionStore.submitForm();
                                        }
                                    "
                                    :loading="editSubmissionStore.isLoading"
                                />
                                <Button
                                    v-if="editSubmissionStore.isSubmitted"
                                    label="Convert to draft"
                                    :icon-left="CircleDashed"
                                    @click="editSubmissionStore.convertToDraft"
                                />
                            </template>
                        </template>
                    </FormRenderer>
                </div>
            </div>
        </div>
    </div>
</template>

