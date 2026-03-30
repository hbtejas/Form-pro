<script setup lang="ts">
import { Button, Checkbox } from "@/components/ui"
import Avatar from "@/components/ui/Avatar.vue"
import { useManageForm } from "@/stores/form/manageForm"
import type { PermissionTypes } from "@/stores/form/manageForm"
import { Plus, ShieldCheck, Trash } from "lucide-vue-next"
import { ref } from "vue"
import RemoveAccessModal from "./RemoveAccessModal.vue"
import ShareAccessModal from "./ShareAccessModal.vue"

const manageFormStore = useManageForm()
const openModal = ref(false)
const openRemoveAccessModal = ref(false)
const selectedUserToRemove = ref<string | null>(null)

function showRemoveAccessModal(email: string) {
	selectedUserToRemove.value = email
	openRemoveAccessModal.value = true
}

function setPermission(
	email: string,
	permission: PermissionTypes,
	value: boolean,
) {
	manageFormStore.setPermission(email, permission, value)
}
</script>
<template>
    <ShareAccessModal v-if="openModal" v-model="openModal" />
    <RemoveAccessModal
        v-if="openRemoveAccessModal"
        v-model="openRemoveAccessModal"
        :selected-user-to-remove="selectedUserToRemove!"
    />
    <div v-if="manageFormStore.sharedAccessUsers" class="flex flex-col gap-6 bg-white p-6 rounded-lg border shadow-sm">
        <div class="flex justify-between items-center">
            <div class="space-y-1">
                <h3 class="text-xl font-bold text-gray-900">Manage Access</h3>
                <p class="text-sm text-gray-500">
                    Control who can see, edit, or share this form within your team.
                </p>
            </div>
            <Button variant="solid" @click="openModal = true">
                <template #icon-left>
                    <Plus class="w-4 h-4" />
                </template>
                Share Access
            </Button>
        </div>

        <div class="overflow-hidden border rounded-lg">
            <table class="w-full text-sm">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="py-3 px-4 text-left font-semibold text-gray-700">User</th>
                        <th class="py-3 px-4 text-center font-semibold text-gray-700">Read</th>
                        <th class="py-3 px-4 text-center font-semibold text-gray-700">Write</th>
                        <th class="py-3 px-4 text-center font-semibold text-gray-700">Share</th>
                        <th class="py-3 px-4 text-right font-semibold text-gray-700">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in manageFormStore.sharedAccessUsers" :key="user.email" class="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                        <td class="py-3 px-4">
                            <div class="flex items-center gap-3">
                                <Avatar :userId="user.email" :label="user.full_name" />
                                <div class="flex flex-col">
                                    <span class="font-medium text-gray-900">{{ user.full_name }}</span>
                                    <span v-if="user.email === manageFormStore.formOwner" class="text-[10px] bg-amber-100 text-amber-700 font-bold px-1.5 py-0.5 rounded uppercase tracking-wider w-fit mt-0.5">
                                        Owner
                                    </span>
                                </div>
                            </div>
                        </td>
                        <td class="py-3 px-4 text-center">
                            <Checkbox 
                                :model-value="user.read" 
                                :disabled="user.email === manageFormStore.formOwner"
                                @update:model-value="setPermission(user.email, 'read', $event)"
                            />
                        </td>
                        <td class="py-3 px-4 text-center">
                            <Checkbox 
                                :model-value="user.write" 
                                :disabled="user.email === manageFormStore.formOwner"
                                @update:model-value="setPermission(user.email, 'write', $event)"
                            />
                        </td>
                        <td class="py-3 px-4 text-center">
                            <Checkbox 
                                :model-value="user.share" 
                                :disabled="user.email === manageFormStore.formOwner"
                                @update:model-value="setPermission(user.email, 'share', $event)"
                            />
                        </td>
                        <td class="py-3 px-4 text-right">
                            <Button 
                                v-if="user.email !== manageFormStore.formOwner"
                                variant="ghost" 
                                @click="showRemoveAccessModal(user.email)"
                            >
                                <template #icon-left>
                                    <Trash class="w-4 h-4 text-red-500" />
                                </template>
                            </Button>
                            <ShieldCheck v-else class="w-5 h-5 text-amber-500 ml-auto mr-2" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
