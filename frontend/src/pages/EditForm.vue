<template>
    <FormBuilderLayout />
</template>

<script setup lang="ts">
import FormBuilderLayout from "@/layouts/FormBuilderLayout.vue";
import { useRoute } from "vue-router";
import { useEditForm } from "@/stores/editForm";
import { watch } from "vue";

const route = useRoute();
const editFormStore = useEditForm();

// Set the form ID when the route changes
watch(
    () => route.params.id,
    (formId) => {
        if (formId && typeof formId === "string") {
            editFormStore.initialize(formId);
        }
    },
    { immediate: true }
);
</script>
