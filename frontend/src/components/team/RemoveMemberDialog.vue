<script setup lang="ts">
import { Button, Dialog } from "@/components/ui"
import { useTeam } from "@/stores/team"
import type { TeamMember } from "@/stores/team"
import { AlertTriangle } from "lucide-vue-next"
import { toast } from "vue-sonner"

const teamStore = useTeam()
const open = defineModel<boolean>({ required: true, default: false })
const member = defineModel<TeamMember | null>("member", {
	required: true,
	default: null,
})

function removeMember() {
	if (!member.value) {
		toast.error("No member selected")
		return
	}
	teamStore.removeMemberFromTeam(member.value.email)
	member.value = null
	open.value = false
}
</script>
<template>
    <Dialog v-model="open">
        <div class="flex flex-col gap-6 p-2">
            <div class="flex items-center gap-3 text-amber-600">
                <AlertTriangle class="w-6 h-6" />
                <h3 class="text-xl font-bold">Confirm Removal</h3>
            </div>
            
            <div class="text-gray-700">
                Are you sure you want to remove
                <span class="font-bold text-gray-900">{{ member?.full_name }}</span> from the team?
                This action cannot be undone.
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t">
                <Button label="Cancel" variant="outline" @click="open = false" />
                <Button 
                    variant="solid" 
                    label="Remove Member"
                    @click="removeMember"
                />
            </div>
        </div>
    </Dialog>
</template>

