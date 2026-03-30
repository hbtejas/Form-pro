<script setup lang="ts">
import { ref, computed } from "vue";
import { formFields, type FormFields } from "@/utils/form_fields";
import { Input, Button } from "@/components/ui";
import { useEditForm } from "@/stores/editForm";
import RenderField from "@/components/RenderField.vue";
import type { Component } from "vue";
import { Plus } from "lucide-vue-next";

const search = ref("");
const componentMap = formFields.reduce((acc: Record<string, Component>, field: FormFields) => {
    acc[field.name] = field.component;
    return acc;
}, {});

const filteredComponents = computed(() => {
    return Object.keys(componentMap).filter((component) =>
        component.toLowerCase().includes(search.value.toLowerCase())
    );
});

const editFormStore = useEditForm();
</script>
<template>
    <div class="space-y-4">
        <h3 class="text-lg font-bold">Add Fields</h3>
        <div class="flex flex-col gap-3">
            <Input
                v-model="search"
                type="search"
                placeholder="Search Fields"
            />
            <div v-for="component in filteredComponents" :key="component">
                <div
                    class="p-2 bg-gray-50 w-full rounded flex flex-col gap-2 border border-gray-200 hover:border-gray-400 transition-all relative group"
                >
                    <div class="text-sm font-medium">{{ component }}</div>
                    <RenderField class="pointer-events-none" :field="{ fieldtype: component }" />
                    <Button
                        class="absolute top-4 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1 rounded-full bg-white shadow-md border"
                        variant="outline"
                        @click="editFormStore.addField(component)"
                    >
                        <template #icon-left>
                            <Plus class="w-4 h-4" />
                        </template>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

