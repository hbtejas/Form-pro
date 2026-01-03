<script setup lang="ts">
import FormBuilderHeader from "@/components/FormBuilderHeader.vue";
import FormBuilderSidebar from "@/components/FormBuilderSidebar.vue";
import FormBuilderContent from "@/components/FormBuilderContent.vue";
import FieldEditorSidebar from "@/components/FieldEditorSidebar.vue";
</script>
<template>
    <div class="flex flex-col">
        <FormBuilderHeader />
        <div class="flex gap-4 justify-between">
            <FormBuilderSidebar />
            <FormBuilderContent />
            <FieldEditorSidebar />
        </div>
    </div>
</template>
