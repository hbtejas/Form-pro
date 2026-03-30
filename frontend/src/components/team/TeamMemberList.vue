<script setup lang="ts">
import { ref } from "vue";
import { useTeam, type TeamMember } from "@/stores/team";
import { Checkbox, Tooltip, Button } from "@/components/ui";
import Avatar from "@/components/ui/Avatar.vue";
import InviteMemberDialog from "./InviteMemberDialog.vue";
import RemoveMemberDialog from "./RemoveMemberDialog.vue";
import { Plus, Trash, Crown } from "lucide-vue-next";

const teamStore = useTeam();
const openInviteMemberDialog = ref<boolean>(false);
const openRemoveMemberDialog = ref<boolean>(false);
const memberToRemove = ref<TeamMember | null>(null);

function handleMemberRemoval(row: TeamMember) {
    memberToRemove.value = row;
    openRemoveMemberDialog.value = true;
}
</script>
<template>
    <InviteMemberDialog v-if="openInviteMemberDialog" v-model="openInviteMemberDialog" />
    <RemoveMemberDialog v-if="openRemoveMemberDialog" v-model="openRemoveMemberDialog" :member="memberToRemove!" />
    <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center bg-white p-4 rounded-lg border shadow-sm">
            <h3 class="font-bold text-xl">Team Members</h3>
            <Button
                variant="solid"
                @click="openInviteMemberDialog = true"
                label="Invite Member"
            >
                <template #icon-left>
                    <Plus class="w-4 h-4" />
                </template>
            </Button>
        </div>
        
        <div class="bg-white rounded-lg border shadow-sm overflow-hidden">
            <table class="w-full">
                <thead class="bg-gray-50 border-b">
                    <tr>
                        <th class="text-left py-3 px-4 text-xs font-semibold uppercase text-gray-500">Name</th>
                        <th class="text-center py-3 px-4 text-xs font-semibold uppercase text-gray-500">Permissions</th>
                        <th class="text-right py-3 px-4 text-xs font-semibold uppercase text-gray-500">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="teamStore.teamMembers.length === 0">
                        <td colspan="3" class="py-12 text-center text-gray-500">
                            No team members added yet.
                        </td>
                    </tr>
                    <tr v-for="member in teamStore.teamMembers" :key="member.email" class="border-b last:border-b-0 hover:bg-gray-50 transition-colors">
                        <td class="py-3 px-4">
                            <div class="flex items-center gap-3">
                                <Avatar :userId="member.email" :label="member.full_name" />
                                <div class="flex flex-col">
                                    <span class="font-medium">{{ member.full_name }}</span>
                                    <span class="text-xs text-gray-500">{{ member.email }}</span>
                                </div>
                            </div>
                        </td>
                        <td class="py-3 px-4 text-center">
                            <div class="flex justify-center flex-col items-center gap-1">
                                <Checkbox
                                    v-if="!member.is_owner"
                                    :model-value="member.can_edit_team"
                                    @update:model-value="teamStore.toggleEditPermissionForMember(member.email)"
                                    label="Can Manage Team"
                                />
                                <div v-else class="flex items-center gap-1 text-xs text-amber-600 font-bold uppercase">
                                    <Crown class="w-3 h-3" /> Owner
                                </div>
                            </div>
                        </td>
                        <td class="py-3 px-4 text-right">
                            <Button
                                v-if="!member.is_owner"
                                variant="ghost"
                                @click="handleMemberRemoval(member)"
                            >
                                <template #icon-left>
                                    <Trash class="w-4 h-4 text-red-500" />
                                </template>
                            </Button>
                            <span v-else class="text-xs text-gray-400 italic">No actions</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

