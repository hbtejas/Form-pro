<script setup lang="ts">
import ImageUploader from "@/components/ImageUploader/ImageUploader.vue"
import TeamLogo from "@/components/team/TeamLogo.vue"
import { Button, Dialog, ErrorMessage, Input } from "@/components/ui"
import { useUser } from "@/stores/user"
import { Plus, Upload, X } from "lucide-vue-next"
import { reactive, ref, watch } from "vue"
import * as z from "zod"

const user = useUser()
const model = defineModel<boolean>({
	type: Boolean,
	required: true,
})

const formErrors = ref<string>("")

const formSchema = z.object({
	team_name: z
		.string()
		.min(2, "Team name must be at least 2 characters long")
		.max(140, "Team name must be less than 140 characters long"),
	logo_url: z.string().optional(),
})

type Form = z.infer<typeof formSchema>

const form = reactive<Form>({
	team_name: "",
	logo_url: undefined,
})

watch(
	() => form,
	(newVal) => {
		const result = formSchema.safeParse(newVal)
		if (!result.success) {
			formErrors.value = result.error.issues
				.map((issue) => issue.message)
				.join(", ")
		} else {
			formErrors.value = ""
		}
	},
	{ deep: true },
)

function createTeam() {
	const result = formSchema.safeParse(form)
	if (!result.success) {
		formErrors.value = result.error.issues
			.map((issue) => issue.message)
			.join(", ")
		return
	}
	formErrors.value = ""
	user.createTeam(form.team_name, form.logo_url)
	model.value = false
}

function setTeamLogo(file: any) {
	form.logo_url = file.file_url
}

function removeTeamLogo() {
	form.logo_url = undefined
}
</script>
<template>
    <Dialog v-model="model">
        <div class="flex flex-col gap-6 min-w-[400px]">
            <div class="flex items-center gap-3">
                <div class="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Plus class="w-6 h-6" />
                </div>
                <h3 class="text-xl font-bold">Create New Team</h3>
            </div>

            <div class="flex flex-col items-center gap-6 p-6 rounded-xl bg-gray-50 border border-dashed border-gray-300">
                <div class="relative group">
                    <Button
                        v-if="form.logo_url"
                        variant="solid"
                        class="!p-1 !h-6 !w-6 absolute -top-2 -right-2 rounded-full z-10 shadow-lg"
                        @click="removeTeamLogo"
                    >
                        <template #icon-left>
                            <X class="w-3 h-3" />
                        </template>
                    </Button>
                    <div class="p-1 bg-white rounded-full shadow-sm">
                        <TeamLogo
                            :team-name="form.team_name || 'Team'"
                            class-names="h-20 w-20 rounded-full border-2 border-gray-100"
                            :logo-url="form.logo_url ?? null"
                        />
                    </div>
                </div>

                <div class="text-center space-y-1">
                    <p class="text-xs font-bold text-gray-500 uppercase tracking-wider">Team Logo</p>
                    <ImageUploader
                        :crop-dimensions="{ width: 400, height: 400 }"
                        @success="(file) => setTeamLogo(file)"
                    >
                        <template #default="{ uploading, progress, error, openFileSelector }">
                            <ErrorMessage v-if="error">{{ error }}</ErrorMessage>
                            <Button
                                variant="ghost"
                                size="sm"
                                class="text-blue-600 hover:text-blue-700 font-medium"
                                @click="openFileSelector"
                                :loading="uploading"
                            >
                                <template #icon-left>
                                    <Upload class="w-3 h-3" />
                                </template>
                                {{ uploading ? `Uploading ${progress}%` : "Upload Custom Logo" }}
                            </Button>
                        </template>
                    </ImageUploader>
                </div>
            </div>

            <div class="space-y-4">
                <div class="space-y-1">
                    <label class="text-sm font-semibold text-gray-700">Team Name</label>
                    <Input
                        v-model="form.team_name"
                        placeholder="e.g. Design Team, Marketing"
                        autofocus
                    />
                </div>
                
                <ErrorMessage v-if="formErrors">
                    {{ formErrors }}
                </ErrorMessage>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t">
                <Button label="Cancel" variant="outline" @click="model = false" />
                <Button 
                    variant="solid" 
                    :disabled="formErrors !== '' || !form.team_name" 
                    @click="createTeam"
                >
                    Create Team
                </Button>
            </div>
        </div>
    </Dialog>
</template>
