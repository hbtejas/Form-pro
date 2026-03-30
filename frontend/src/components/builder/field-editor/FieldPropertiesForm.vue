<script setup lang="ts">
import { useEditForm } from "@/stores/editForm";
import { Input, Checkbox, Select, Textarea } from "@/components/ui";
import { FormField, FormFieldTypes } from "@/types/formfield";
import { computed } from "vue";
import type { Component } from "vue";
import ConditionalLogicSection from "./ConditionalLogicSection.vue";

const editFormStore = useEditForm();

type FieldProperty = {
    fieldname: keyof FormField;
    component: Component;
    props: Record<string, any>;
};

const fieldProperties = computed(() => {
    return [
        {
            fieldname: "label",
            component: Input,
            props: {
                placeholder: "Label",
            },
        },
        {
            fieldname: "fieldname",
            component: Input,
            props: {
                placeholder: "Fieldname",
            },
        },
        {
            fieldname: "fieldtype",
            component: Select,
            props: {
                options: Object.values(FormFieldTypes),
            },
        },
        {
            fieldname: "reqd",
            component: Checkbox,
            props: {
                label: "Mandatory",
            },
        },
        {
            fieldname: "hidden",
            component: Checkbox,
            props: {
                label: "Hidden",
            },
        },
        {
            fieldname: "description",
            component: Textarea,
            props: {
                placeholder: "Description",
            },
        },
        {
            fieldname: "options",
            component: Textarea,
            props: {
                placeholder: "Options",
            },
        },
        {
            fieldname: "default",
            component: Input,
            props: {
                placeholder: "Default Value",
            },
        },
        {
            fieldname: "conditional_logic",
            component: ConditionalLogicSection,
            props: {},
        },
    ] as any[];
});
</script>
<template>
    <div
        class="flex flex-col gap-6 p-4 w-full"
        data-form-builder-component="field-properties-form"
    >
        <div class="flex flex-col gap-1">
            <h3 class="text-lg font-bold">Edit Properties</h3>
            <p class="text-sm text-gray-500">Configure field behavior and display</p>
        </div>
        <hr />
        <template v-if="editFormStore.selectedField">
            <template v-for="property in fieldProperties" :key="property.fieldname">
                <div class="flex flex-col gap-2">
                    <label class="text-xs font-semibold uppercase text-gray-500 tracking-wider">
                        {{ property.fieldname }}
                    </label>
                    <component
                        :is="property.component"
                        v-model="editFormStore.selectedField[property.fieldname]"
                        v-bind="property.props"
                    />
                </div>
            </template>
        </template>
    </div>
</template>

