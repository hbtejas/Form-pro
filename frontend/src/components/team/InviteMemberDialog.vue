<script setup lang="ts">
import { ref } from "vue";
import * as z from "zod";
import {
    Dialog,
    Input as FormControl,
    ErrorMessage,
    Button,
} from "@/components/ui";
import Avatar from "@/components/ui/Avatar.vue";
import { useTeam } from "@/stores/team";
import { toast } from "vue-sonner";
import api from "@/utils/api";
import { Plus, Send, Trash } from "lucide-vue-next";

const team = useTeam();

const inviteEmails = ref<string[]>([]);
const emailInput = ref("");
const emailInputError = ref<string>("");

const emailSchema = z.string().email();

function addInviteEmail() {
    const trimmed = emailInput.value.trim();
    if (!trimmed) return;
    const result = emailSchema.safeParse(trimmed);
    if (!result.success) {
        emailInputError.value = "Invalid email address";
        return;
    }
    if (inviteEmails.value.includes(result.data)) {
        emailInputError.value = "Email already added";
        return;
    }
    inviteEmails.value.push(result.data);
    emailInput.value = "";
    emailInputError.value = "";
}

function removeInviteEmail(email: string) {
    inviteEmails.value = inviteEmails.value.filter((e) => e !== email);
}

const isSending = ref(false);

async function sendInvitationEmails() {
    if (inviteEmails.value.length === 0) return;
    isSending.value = true;
    try {
        await api.post(`/teams/${team.currentTeam?._id}/invite`, {
            emails: inviteEmails.value,
        });
        toast.success("Invitations sent successfully");
        open.value = false;
        inviteEmails.value = [];
    } catch (error: any) {
        toast.error("Failed to send invitations", {
            description: error.response?.data?.message || error.message,
        });
    } finally {
        isSending.value = false;
    }
}

const open = defineModel<boolean>({ required: true, default: false });
</script>
<template>
    <Dialog v-model="open">
        <div class="flex flex-col gap-6 min-w-[400px]">
            <h3 class="text-xl font-bold">Invite members to your team</h3>
            
            <div class="flex flex-col gap-4">
                <div class="flex items-end gap-2">
                    <div class="flex-1 space-y-1">
                        <label class="text-sm font-semibold uppercase text-gray-500 tracking-wider">Invite by Email</label>
                        <FormControl
                            v-model="emailInput"
                            type="email"
                            placeholder="Enter email and press Enter"
                            @keydown.enter.prevent="addInviteEmail"
                        />
                    </div>
                    <Button variant="outline" @click="addInviteEmail">
                        <template #icon-left>
                            <Plus class="w-4 h-4" />
                        </template>
                        Add
                    </Button>
                </div>
                
                <ErrorMessage v-if="emailInputError">
                    {{ emailInputError }}
                </ErrorMessage>

                <div v-if="inviteEmails.length" class="space-y-3">
                    <span class="text-xs font-bold uppercase text-gray-500 tracking-wider">Recipients</span>
                    <ul class="flex flex-col gap-2 max-h-[200px] overflow-y-auto pr-2">
                        <li v-for="email in inviteEmails" :key="email" class="flex items-center gap-2 p-2 bg-gray-50 rounded-lg border">
                            <Avatar :userId="email" size="sm" />
                            <span class="text-sm font-medium flex-1 truncate">{{ email }}</span>
                            <Button
                                variant="ghost"
                                @click="removeInviteEmail(email)"
                            >
                                <template #icon-left>
                                    <Trash class="w-4 h-4 text-red-500" />
                                </template>
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t">
                <Button label="Cancel" variant="outline" @click="open = false" />
                <Button 
                    variant="solid" 
                    :disabled="inviteEmails.length === 0" 
                    :loading="isSending"
                    @click="sendInvitationEmails"
                >
                    <template #icon-left>
                        <Send class="w-4 h-4" />
                    </template>
                    Send Invitations
                </Button>
            </div>
        </div>
    </Dialog>
</template>

