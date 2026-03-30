<script setup lang="ts">
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
import { useSubmissionForm } from "@/stores/submissionForm";
import { computed } from "vue";
import { TextEditor } from "@/components/ui";

const submissionFormStore = useSubmissionForm();

const isEmptyHtml = (html: string | null | undefined): boolean => {
    if (!html) return true;
    const textContent = html
        .replace(/<[^>]*>/g, "") // Remove all HTML tags
        .replace(/&nbsp;/g, " ") // Replace &nbsp; with space
        .replace(/\s+/g, " ") // Normalize whitespace
        .trim();

    return textContent.length === 0;
};

const successTitle = computed(() => {
    return submissionFormStore.currentForm?.success_title || "Success!";
});

const successDescription = computed(() => {
    const description = submissionFormStore.currentForm?.success_description;
    if (!description || isEmptyHtml(description)) {
        return "<p style='text-align: center;'>Thank you for submitting the form. We will get back to you soon.</p>";
    }
    return description;
});
</script>
<template>
    <div class="flex flex-col gap-4 items-center py-12">
        <DotLottieVue
            src="https://lottie.host/b9ba5ce8-d753-497a-946c-76e0da2ec22d/QcoLWNS7AP.lottie"
            autoplay
            :loop="false"
            :height="150"
            class="h-[150px]"
        />
        <h2 class="text-3xl font-bold text-center">{{ successTitle }}</h2>
        <TextEditor
            :model-value="successDescription"
            editor-class="h-fit !w-full form-description !px-0 max-w-full max-h-full"
            :editable="false"
        />
    </div>
</template>

