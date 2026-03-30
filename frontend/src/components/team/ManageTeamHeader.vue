<script setup lang="ts">
import ImageUploader from "@/components/ImageUploader/ImageUploader.vue"
import TeamLogo from "@/components/team/TeamLogo.vue"
import { Button, ErrorMessage, Input } from "@/components/ui"
import { useTeam } from "@/stores/team"
import { Check, Edit2, Upload, X } from "lucide-vue-next"
import { ref, watch } from "vue"

const teamStore = useTeam()

const teamName = ref(teamStore.currentTeam?.team_name ?? "")
const isEditing = ref(false)

watch(
	() => teamStore.currentTeam?.team_name,
	(val) => {
		teamName.value = val ?? ""
	},
)

function onSubmit() {
	const trimmed = teamName.value?.trim()
	if (!trimmed || trimmed === teamStore.currentTeam?.team_name) {
		isEditing.value = false
		return
	}
	teamStore.save({ team_name: trimmed })
	isEditing.value = false
}

function cancel() {
	teamName.value = teamStore.currentTeam?.team_name ?? ""
	isEditing.value = false
}
</script>
<template>
    <div class="flex flex-col md:flex-row gap-6 w-full bg-white p-6 rounded-lg border shadow-sm">
        <div class="flex flex-col gap-4 items-center justify-center">
            <TeamLogo
                class-names="h-24 w-24 rounded-full border-4 border-gray-100 shadow-inner"
                :team-name="teamStore.currentTeam?.team_name || 'Team'"
                :logo-url="teamStore.currentTeam?.logo ?? null"
            />
            <ImageUploader
                :crop-dimensions="{ width: 400, height: 400 }"
                @success="(file) => teamStore.save({ logo: (file as any).file_url })"
            >
                <template #default="{ uploading, progress, error, openFileSelector }">
                    <ErrorMessage v-if="error">
                        {{ error }}
                    </ErrorMessage>
                    <Button
                        variant="outline"
                        :loading="uploading"
                        @click="openFileSelector"
                        class="w-full"
                    >
                        <template #icon-left>
                            <Upload class="w-4 h-4" />
                        </template>
                        {{
                            teamStore.currentTeam?.logo
                                ? 'Change'
                                : uploading
                                ? `Uploading ${progress}%`
                                : 'Upload Logo'
                        }}
                    </Button>
                </template>
            </ImageUploader>
        </div>
        <div class="flex-1 flex flex-col justify-center">
            <label class="text-xs font-bold uppercase text-gray-500 tracking-widest mb-1">Team Name</label>
            <div v-if="!isEditing" class="flex items-center gap-3">
                <h1 class="text-3xl font-bold text-gray-900">{{ teamStore.currentTeam?.team_name }}</h1>
                <Button variant="ghost" @click="isEditing = true">
                    <template #icon-left>
                        <Edit2 class="w-4 h-4 text-gray-400" />
                    </template>
                </Button>
            </div>
            <div v-else class="flex flex-col gap-3 max-w-md">
                <Input
                    v-model="teamName"
                    placeholder="Enter team name..."
                    autofocus
                    @keyup.enter="onSubmit"
                    @keyup.esc="cancel"
                />
                <div class="flex gap-2">
                    <Button variant="solid" @click="onSubmit">
                        <template #icon-left>
                            <Check class="w-4 h-4" />
                        </template>
                        Save
                    </Button>
                    <Button variant="outline" @click="cancel">
                        <template #icon-left>
                            <X class="w-4 h-4" />
                        </template>
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>

