<script setup>
import { FormControl } from "frappe-ui";
import { useEditForm } from "@/stores/editForm";
import { validateFormRoute } from "@/utils/form_generator";
import { ref } from "vue";
import { CircleCheck } from "lucide-vue-next";

const editFormStore = useEditForm();

const showValidateMsg = ref(false);
const routeExists = ref(false);

const validateRoute = async () => {
    routeExists.value = await validateFormRoute(
        editFormStore.formData.name,
        editFormStore.formData.route
    );
    showValidateMsg.value = true;
};
</script>
<template>
    <div class="space-y-4">
        <h3 class="text-lg font-medium">Settings</h3>
        <div class="flex flex-col gap-3">
            <FormControl
                label="Linked DocType"
                variant="outline"
                type="text"
                v-model="editFormStore.formData.linked_doctype"
                disabled
            />
            <FormControl
                label="Form ID"
                variant="outline"
                type="text"
                v-model="editFormStore.formData.name"
                disabled
            />

            <h5 class="text-sm font-medium mt-3">Form Properties</h5>
            <div class="space-y-1">
                <FormControl
                    required
                    label="Route"
                    variant="outline"
                    type="text"
                    v-model="editFormStore.formData.route"
                    description="Set a unique route for the form."
                    @change="validateRoute()"
                />
                <div v-if="showValidateMsg" class="text-xs font-medium">
                    <span v-if="routeExists" class="text-red-500 flex items-center gap-1">
                        Route already exists
                    </span>
                    <span v-else class="text-green-500 flex items-center gap-1">
                        <CircleCheck class="w-4 h-4" /> Route is available</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>
