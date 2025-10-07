<script setup>
import { useEditForm } from "@/stores/editForm";
import { formFields } from "@/utils/form_fields";
import { ref, computed } from "vue";

const componentMap = formFields.reduce((acc, field) => {
    acc[field.name] = field.component;
    return acc;
}, {});

const search = ref("");
const filteredFields = computed(() => {
    return editFormStore.doctypeFields.filter((field) => {
        return field.label.toLowerCase().includes(search.value.toLowerCase());
    });
});

const editFormStore = useEditForm();
</script>
<template>
    <div class="flex flex-col gap-2">
        <h3 class="text-lg font-medium">DocType Fields</h3>
        <p class="text-sm text-gray-500">Add fields from the DocType to the form.</p>
        <hr />
        <div class="flex flex-col gap-2">
            <FormControl
                v-model="search"
                type="search"
                variant="outline"
                placeholder="Search Fields"
            />
            <div v-for="field in filteredFields" :key="field.fieldname">
                <div
                    class="p-2 bg-gray-50 rounded flex flex-col gap-2 border border-gray-200 hover:border-gray-400 hover:cursor-grab transition-all relative group"
                >
                    <div class="text-sm">{{ field.label }}</div>
                    <component
                        class="pointer-events-none"
                        variant="outline"
                        :is="componentMap[field.fieldtype]"
                    />
                    <Button
                        class="absolute top-4 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        variant="outline"
                        icon="plus"
                        @click="editFormStore.addFieldFromDoctype(field)"
                    />
                </div>
            </div>
        </div>
    </div>
</template>
