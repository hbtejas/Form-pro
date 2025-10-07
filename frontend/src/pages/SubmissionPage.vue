<script setup lang="ts">
import { useRoute } from "vue-router";
import { useSubmissionForm } from "@/stores/submissionForm";
import FormHeader from "@/components/submission/FormHeader.vue";
import FormRenderer from "@/components/submission/FormRenderer.vue";

const route = useRoute();
const submissionFormStore = useSubmissionForm();
submissionFormStore.initialize(route.params.route as string);
</script>
<template>
    <div class="p-8">
        <div
            class="space-y-4 shadow-[0_0_10px_0_rgba(0,0,0,0.1)] bg-secondary border rounded-lg p-6 max-w-screen-md mx-auto mt-16"
        >
            <div class="space-y-4" v-if="submissionFormStore.inFormSubmission">
                <FormHeader />
                <FormRenderer />
            </div>
            <SuccessSection v-if="submissionFormStore.successSubmission" />
        </div>

        <div class="z-10 absolute bottom-0 right-0 p-8">
            <div class="flex flex-col items-end text-gray-800">
                <span class="text-xs">Built on</span>
                <span class="font-instrument text-xl">Forms Pro</span>
            </div>
        </div>
    </div>
</template>
