<script setup lang="ts">
import { Button, Checkbox, Dialog } from "@/components/ui"
import Avatar from "@/components/ui/Avatar.vue"
import { type SharedAccessUser, useManageForm } from "@/stores/form/manageForm"
import { type TeamMember, useTeam } from "@/stores/team"
import { Check, UserPlus, Users } from "lucide-vue-next"
import { computed, ref } from "vue"
import { toast } from "vue-sonner"

const teamStore = useTeam()
const manageFormStore = useManageForm()

const open = defineModel<boolean>({ required: true, default: false })

const sharedAccessUsers = computed(() => manageFormStore.sharedAccessUsers)

const teamMembersNotSharedWith = computed(() => {
	return teamStore.teamMembers.filter((member: TeamMember) => {
		return !sharedAccessUsers.value.some(
			(user: SharedAccessUser) => user.email === member.email,
		)
	})
})

const selectedUsers = ref<string[]>([])

const DEFAULT_ACCESS_PERMISSIONS = {
	read: true,
	write: true,
	share: true,
	submit: false,
} as const

const giveAccessToUsers = async () => {
	if (selectedUsers.value.length === 0) return
	for (const user of selectedUsers.value) {
		await manageFormStore.addAccess(user, DEFAULT_ACCESS_PERMISSIONS)
	}
	toast.success("Access given to users successfully")
	selectedUsers.value = []
	open.value = false
}

const giveAccessToAllTeamMembers = async () => {
	for (const member of teamMembersNotSharedWith.value) {
		await manageFormStore.addAccess(member.email, DEFAULT_ACCESS_PERMISSIONS)
	}
	toast.success("Access given to all team members successfully")
	selectedUsers.value = []
	open.value = false
}

function toggleUser(email: string) {
	if (selectedUsers.value.includes(email)) {
		selectedUsers.value = selectedUsers.value.filter((e) => e !== email)
	} else {
		selectedUsers.value.push(email)
	}
}
</script>
<template>
    <Dialog v-model="open">
        <div class="flex flex-col gap-6 min-w-[450px]">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Users class="w-6 h-6" />
                </div>
                <h3 class="text-xl font-bold text-gray-900">Share Access</h3>
            </div>

            <div class="space-y-4">
                <div class="flex justify-between items-center bg-gray-50 p-3 rounded-lg border">
                    <div class="flex flex-col">
                        <span class="text-sm font-bold text-gray-700">Team Members</span>
                        <span class="text-xs text-gray-500">{{ teamMembersNotSharedWith.length }} members not shared with</span>
                    </div>
                    <Button 
                        v-if="teamMembersNotSharedWith.length > 0"
                        variant="outline" 
                        @click="giveAccessToAllTeamMembers"
                    >
                        <template #icon-left>
                            <UserPlus class="w-4 h-4" />
                        </template>
                        All
                    </Button>
                </div>

                <div v-if="teamMembersNotSharedWith.length > 0" class="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    <div 
                        v-for="member in teamMembersNotSharedWith" 
                        :key="member.email"
                        @click="toggleUser(member.email)"
                        class="flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer hover:border-blue-400 hover:bg-blue-50/30"
                        :class="selectedUsers.includes(member.email) ? 'border-blue-500 bg-blue-50/50 ring-1 ring-blue-500' : 'bg-white'"
                    >
                        <Avatar :userId="member.email" :label="member.full_name" size="md" />
                        <div class="flex flex-col flex-1">
                            <span class="font-bold text-gray-900 text-sm">{{ member.full_name }}</span>
                            <span class="text-xs text-gray-500">{{ member.email }}</span>
                        </div>
                        <div 
                            class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                            :class="selectedUsers.includes(member.email) ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-200 bg-white'"
                        >
                            <Check v-if="selectedUsers.includes(member.email)" class="w-4 h-4" />
                        </div>
                    </div>
                </div>
                <div v-else class="py-12 text-center border-2 border-dashed rounded-xl bg-gray-50">
                    <p class="text-gray-500">All team members already have access.</p>
                </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t">
                <Button label="Cancel" variant="outline" @click="open = false" />
                <Button 
                    variant="solid" 
                    :disabled="selectedUsers.length === 0" 
                    @click="giveAccessToUsers"
                >
                    <template #icon-left>
                        <Check class="w-4 h-4" />
                    </template>
                    Share Access ({{ selectedUsers.length }})
                </Button>
            </div>
        </div>
    </Dialog>
</template>

