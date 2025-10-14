<script setup>
import { computed } from "vue";
import { Asterisk } from "lucide-vue-next";
import { watch } from "vue";
import RenderField from "../RenderField.vue";

const props = defineProps({
    field: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["update:field"]);

// Create a computed property for two-way binding
const fieldData = computed({
    get() {
        return props.field;
    },
    set(value) {
        emit("update:field", value);
    },
});

function handleFieldLength(event) {
    if (event.key === "Enter") {
        event.preventDefault();
    }
    event.target.style.width = (event.target.value.length + 1) * 8 + "px";
}

const getClasses = computed(() => {
    switch (fieldData.value.fieldtype) {
        case "Text Editor":
            return "w-fit";
        case "Switch":
            return "w-[calc(100%-3rem)] flex gap-1 justify-between";
        case "Checkbox":
            return "w-[calc(100%-3rem)] flex gap-2 ";
        default:
            return "w-[calc(100%-3rem)] flex flex-col gap-1";
    }
});
</script>
<template>
    <div :class="getClasses" v-if="fieldData.fieldtype == 'Switch'">
        <div class="flex flex-col gap-1">
            <div class="flex gap-2 items-start">
                <input
                    placeholder="Label"
                    type="text"
                    v-model="fieldData.label"
                    class="bg-transparent border-none outline-none text-base focus:ring-0 w-fit px-0 py-1"
                />
                <Asterisk v-if="fieldData.reqd" class="w-4 h-4 text-red-400" />
            </div>
            <small class="text-gray-500">
                {{ fieldData.description }}
            </small>
        </div>
        <RenderField :field="fieldData" class="pointer-events-none" />
    </div>
    <div :class="getClasses" v-else-if="fieldData.fieldtype == 'Checkbox'">
        <RenderField :field="fieldData" class="pointer-events-none mt-1" />
        <div class="flex flex-col">
            <div class="flex gap-2 items-start">
                <input
                    placeholder="Label"
                    type="text"
                    v-model="fieldData.label"
                    class="bg-transparent border-none outline-none text-base focus:ring-0 w-fit px-0 py-1"
                />
                <Asterisk v-if="fieldData.reqd" class="w-4 h-4 text-red-400" />
            </div>
            <small class="text-gray-500">
                {{ fieldData.description }}
            </small>
        </div>
    </div>
    <div v-else :class="getClasses">
        <div class="flex gap-2 items-start">
            <input
                placeholder="Label"
                type="text"
                v-model="fieldData.label"
                class="bg-transparent border-none outline-none text-base focus:ring-0 w-fit px-0 py-1"
            />
            <Asterisk v-if="fieldData.reqd" class="w-4 h-4 text-red-400" />
        </div>
        <RenderField :field="fieldData" class="pointer-events-none" />
        <small class="text-gray-500">
            {{ fieldData.description }}
        </small>
    </div>
</template>
