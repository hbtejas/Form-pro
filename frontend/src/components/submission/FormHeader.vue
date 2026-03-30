<script setup lang="ts">
import { useSubmissionForm } from "@/stores/submissionForm";
import { LoadingIndicator, TextEditor } from "@/components/ui";

const submissionFormStore = useSubmissionForm();
</script>
<template>
    <div v-if="submissionFormStore.isLoading">
        <LoadingIndicator />
    </div>
    <div v-if="submissionFormStore.currentForm" class="flex flex-col gap-4 text-gray-800">
        <h1 class="text-3xl font-bold">
            {{ submissionFormStore.currentForm.title }}
        </h1>
        <TextEditor
            :model-value="submissionFormStore.currentForm.description"
            editor-class="h-fit !w-full form-description !px-0 max-w-full max-h-full"
            :editable="false"
        />
        <hr />
    </div>
</template>

