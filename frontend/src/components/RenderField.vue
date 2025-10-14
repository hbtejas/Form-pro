<script setup>
import { formFields } from "@/utils/form_fields";
import { computed } from "vue";
const props = defineProps({
    field: {
        type: Object,
        required: true,
    },
});

const getComponent = computed(() => {
    return formFields.find((field) => field.name === props.field.fieldtype);
});
</script>
<template>
    <component :is="getComponent.component" :field="props.field" v-bind="getComponent.props" />
</template>
