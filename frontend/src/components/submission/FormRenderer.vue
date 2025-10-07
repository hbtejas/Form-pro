<script setup lang="ts">
import { ErrorMessage, LoadingIndicator } from "frappe-ui";
import { useSubmissionForm } from "@/stores/submissionForm";
import { formFields } from "@/utils/form_fields";

const submissionFormStore = useSubmissionForm();

const getComponent = (fieldtype: string) => {
    return formFields.find((field) => field.name === fieldtype)?.component;
};
</script>
<template>
    <div v-if="submissionFormStore.isLoading">
        <LoadingIndicator class="mx-auto my-auto w-5 h-5" />
    </div>
    <div v-if="submissionFormStore.inFormSubmission" class="flex flex-col gap-4">
        <div v-for="field in submissionFormStore.formResource.data?.fields" :key="field.fieldname">
            <component
                :is="getComponent(field.fieldtype)"
                v-model="submissionFormStore.fields[field.fieldname]"
                variant="outline"
                :label="field.label"
                :required="field.reqd"
                :options="field.options"
                :description="field.description"
                :default="field.default"
            />
        </div>
        <hr />
        <ErrorMessage :message="submissionFormStore.errors.join('\n')" />
        <div class="flex justify-end">
            <Button
                class="w-1/2"
                variant="solid"
                @click="
                    () => {
                        console.log('submitForm');
                        submissionFormStore.submitForm();
                    }
                "
                :loading="submissionFormStore.isLoading"
            >
                Submit
            </Button>
        </div>
    </div>
</template>
