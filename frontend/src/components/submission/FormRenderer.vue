<script setup lang="ts">
import { ErrorMessage, LoadingIndicator, Button } from "@/components/ui";
import { useSubmissionForm } from "@/stores/submissionForm";
import FieldRenderer from "@/components/builder/FieldRenderer.vue";
import { computed } from "vue";
import { shouldFieldBeVisible, shouldFieldBeRequired } from "@/utils/conditionals";
import type { FormField } from "@/types/formfield";

const submissionFormStore = useSubmissionForm();

const props = withDefaults(
    defineProps<{
        disabled: boolean;
    }>(),
    {
        disabled: false,
    }
);

// Computed property to get visible fields based on conditional logic
// This will automatically update when form values change
const visibleFields = computed(() => {
    const fields = submissionFormStore.currentForm?.fields || [];
    return fields.filter((field: FormField) =>
        shouldFieldBeVisible(field, submissionFormStore.fields, fields)
    );
});

function handleSubmitForm() {
    submissionFormStore.submitForm();
}
</script>
<template>
    <div v-if="submissionFormStore.isLoading">
        <LoadingIndicator class="mx-auto my-auto w-5 h-5" />
    </div>
    <div v-if="submissionFormStore.inFormFillingState" class="flex flex-col gap-4">
        <div v-for="field in visibleFields" :key="field.fieldname">
            <FieldRenderer
                :disabled="disabled"
                v-model="submissionFormStore.fields[field.fieldname]"
                :field="{
                    ...field,
                    reqd: shouldFieldBeRequired(
                        field,
                        submissionFormStore.fields,
                        submissionFormStore.currentForm?.fields || []
                    ),
                }"
                :inEditMode="false"
            />
        </div>
        <hr />
        <ErrorMessage v-if="submissionFormStore.errors.length">
            {{ submissionFormStore.errors.join('\n') }}
        </ErrorMessage>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <slot name="actions">
                <Button
                    variant="solid"
                    @click="handleSubmitForm"
                    :loading="submissionFormStore.isLoading"
                >
                    Submit
                </Button>
            </slot>
        </div>
    </div>
</template>

