<script setup>
import { formFields } from "@/utils/form_fields";
const props = defineProps({
    field: {
        type: Object,
        required: true,
    },
});

const getComponent = (type) => {
    return formFields.find((field) => field.name === type)?.component;
};
</script>
<template>
    <component :is="getComponent(props.field.fieldtype)" :field="props.field" variant="outline" />
</template>
