<script setup lang="ts">
import { Dialog, Button } from "@/components/ui";
import { useManageForm } from "@/stores/form/manageForm";
import { AlertTriangle, Trash2, X } from "lucide-vue-next";

const manageFormStore = useManageForm();

const open = defineModel<boolean>({ required: true, default: false });
const selectedUserToRemove = defineModel<string | null>("selectedUserToRemove", {
    required: true,
    default: null,
});

function removeAccess() {
    if (!selectedUserToRemove.value) return;
    manageFormStore.removeAccess(selectedUserToRemove.value);
    open.value = false;
}
</script>
<template>
    <Dialog v-model="open">
        <div class="flex flex-col gap-6 p-2 max-w-md">
            <div class="flex items-center gap-3 text-red-600">
                <div class="p-2 bg-red-50 rounded-lg">
                    <AlertTriangle class="w-6 h-6" />
                </div>
                <h3 class="text-xl font-bold">Remove Access</h3>
            </div>
            
            <div class="text-gray-700 leading-relaxed">
                Are you sure you want to remove access for 
                <span class="font-bold text-gray-900 underline decoration-red-200">{{ selectedUserToRemove }}</span>? 
                This user will no longer be able to view or manage this form.
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" @click="open = false">
                    <template #icon-left>
                        <X class="w-4 h-4" />
                    </template>
                    Cancel
                </Button>
                <Button 
                    variant="solid" 
                    @click="removeAccess"
                >
                    <template #icon-left>
                        <Trash2 class="w-4 h-4" />
                    </template>
                    Remove Access
                </Button>
            </div>
        </div>
    </Dialog>
</template>

