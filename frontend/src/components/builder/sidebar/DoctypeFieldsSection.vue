<script setup lang="ts">
import { Button, Input } from "@/components/ui"
import { useEditForm } from "@/stores/editForm"
import type { FormField } from "@/types/formfield"
import { type FormFields, formFields } from "@/utils/form_fields"
import { Plus } from "lucide-vue-next"
import { computed, ref } from "vue"
import type { Component } from "vue"

const componentMap = formFields.reduce(
	(acc: Record<string, Component>, field: FormFields) => {
		acc[field.name] = field.component
		return acc
	},
	{},
)

const search = ref("")
const filteredFields = computed(() => {
	return editFormStore.doctypeFields.filter((field: FormField) => {
		return field.label.toLowerCase().includes(search.value.toLowerCase())
	})
})

const editFormStore = useEditForm()
</script>
<template>
    <div class="flex flex-col gap-2">
        <h3 class="text-lg font-bold">DocType Fields</h3>
        <p class="text-sm text-gray-500">Add fields from the DocType to the form.</p>
        <hr />
        <div class="flex flex-col gap-2">
            <Input
                v-model="search"
                type="search"
                placeholder="Search Fields"
            />
            <div v-for="field in filteredFields" :key="field.fieldname">
                <div
                    class="p-2 bg-gray-50 rounded flex flex-col gap-2 border border-gray-200 hover:border-gray-400 hover:cursor-grab transition-all relative group"
                >
                    <div class="text-sm font-medium">{{ field.label }}</div>
                    <component
                        class="pointer-events-none"
                        :is="componentMap[field.fieldtype]"
                    />
                    <Button
                        class="absolute top-4 -right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 p-1 rounded-full bg-white shadow-md border"
                        variant="outline"
                        @click="editFormStore.addFieldFromDoctype(field)"
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

