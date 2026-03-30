<script setup lang="ts">
import { useEditForm } from "@/stores/editForm";
import { ref, watch, computed } from "vue";
import {
    ConditionalLogic,
    ConditionalOperators,
    type Condition,
    Actions,
} from "@/types/conditional-render.types";
import { EllipsisVertical, Trash, Workflow, Zap, Plus } from "lucide-vue-next";
import { Input, Popover, Select, Button } from "@/components/ui";
import type { FormField } from "@/types/formfield";


const editFormStore = useEditForm();

const conditionalLogic = ref<ConditionalLogic | null>(null);
const isUpdatingFromStore = ref(false);

// Helper function to parse conditional_logic value
const parseConditionalLogic = (
    value: string | ConditionalLogic | undefined
): ConditionalLogic | null => {
    if (!value) return null;
    if (typeof value === "string") {
        try {
            return JSON.parse(value) as ConditionalLogic;
        } catch (e) {
            console.error("Failed to parse conditional_logic:", e);
            return null;
        }
    }
    return value as ConditionalLogic;
};

// Helper function to stringify conditionalLogic
const stringifyConditionalLogic = (value: ConditionalLogic | null): string | undefined => {
    if (!value) return undefined;
    return JSON.stringify(value);
};

// Watch for changes in selectedField.conditional_logic from external sources
watch(
    () => editFormStore.selectedField?.conditional_logic,
    (newValue) => {
        // Prevent infinite loop - don't update if we're the ones updating the store
        if (isUpdatingFromStore.value) return;

        const parsed = parseConditionalLogic(newValue);
        conditionalLogic.value = parsed;
    },
    { immediate: true }
);

// Watch conditionalLogic and update selectedField.conditional_logic whenever it changes
watch(
    conditionalLogic,
    (newValue) => {
        if (!editFormStore.selectedField) return;

        // Set flag to prevent infinite loop
        isUpdatingFromStore.value = true;

        try {
            if (conditionalLogic.value?.conditions.length === 0) {
                editFormStore.selectedField.conditional_logic = "";
            } else {
                editFormStore.selectedField.conditional_logic =
                    stringifyConditionalLogic(newValue);
            }
        } finally {
            // Reset flag after a microtask to allow the other watcher to process
            setTimeout(() => {
                isUpdatingFromStore.value = false;
            }, 0);
        }
    },
    { deep: true }
);

const addCondition = () => {
    if (!conditionalLogic.value) {
        conditionalLogic.value = {
            conditions: [],
            action: Actions.ShowField,
            target_field: null,
        } as ConditionalLogic;
    }

    conditionalLogic.value.conditions.push({
        fieldname: "",
        operator: ConditionalOperators.Is,
        value: "",
    } as Condition);
};

const removeCondition = (index: number) => {
    if (!conditionalLogic.value) return;
    conditionalLogic.value.conditions.splice(index, 1);
};

const availableFieldOptions = computed(() => {
    return editFormStore.fields.map((field: FormField) => ({
        label: field.label,
        value: field.fieldname,
    }));
});

const operatorOptions = computed(() => {
    return Object.values(ConditionalOperators).map((operator) => ({
        label: operator,
        value: operator,
    }));
});

const actionOptions = computed(() => {
    return Object.values(Actions).map((action) => ({
        label: action,
        value: action,
    }));
});

const showValueInput = (operator: ConditionalOperators) => {
    return (
        operator !== ConditionalOperators.IsEmpty &&
        operator !== ConditionalOperators.IsNotEmpty &&
        operator !== ConditionalOperators.IsSet
    );
};
</script>
<template>
    <div class="flex flex-col gap-2">
        <label class="block text-xs text-ink-gray-5">Conditional Logic</label>
        <div
            v-if="conditionalLogic && conditionalLogic.conditions.length > 0"
            class="p-3 bg-gray-50 border rounded flex flex-col gap-4"
        >
            <div
                v-for="(condition, index) in conditionalLogic?.conditions"
                :key="index"
                class="flex flex-col gap-2 p-2 border rounded bg-white"
            >
                <div class="flex items-center justify-between gap-2">
                    <div class="flex items-center gap-2 text-gray-500 text-sm">
                        <Workflow class="w-4 h-4" />
                        <span>When</span>
                    </div>
                    <Popover>
                        <template #target="{ togglePopover }">
                            <Button
                                variant="ghost"
                                @click="togglePopover"
                            >
                                <template #icon-left>
                                    <EllipsisVertical class="w-4 h-4" />
                                </template>
                            </Button>
                        </template>
                        <template #body>
                            <div class="bg-white border rounded shadow-lg p-1 z-50">
                                <Button
                                    variant="ghost"
                                    @click="removeCondition(index)"
                                    label="Remove"
                                >
                                    <template #icon-left>
                                        <Trash class="w-4 h-4 text-red-500" />
                                    </template>
                                </Button>
                            </div>
                        </template>
                    </Popover>
                </div>
                <Select
                    placeholder="Select Field"
                    :options="availableFieldOptions"
                    v-model="condition.fieldname"
                />
                <Select
                    placeholder="Select Operator"
                    :options="operatorOptions"
                    v-model="condition.operator"
                />
                <Input
                    v-if="showValueInput(condition.operator)"
                    placeholder="Value"
                    v-model="condition.value"
                />
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-2 text-gray-500 text-sm mt-2">
                <Zap class="w-4 h-4" />
                <span>Then</span>
            </div>
            <Select
                placeholder="Select Action"
                :options="actionOptions"
                v-model="conditionalLogic.action"
            />
            <Select
                placeholder="Select Field"
                :options="availableFieldOptions"
                v-model="conditionalLogic.target_field"
            />
        </div>
        <Button
            v-if="!conditionalLogic || conditionalLogic?.conditions.length === 0"
            variant="outline"
            @click="addCondition"
            label="Add Condition"
        >
            <template #icon-left>
                <Plus class="w-4 h-4" />
            </template>
        </Button>

    </div>
</template>
