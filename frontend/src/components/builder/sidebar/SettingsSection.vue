<script setup lang="ts">
import {
	Button,
	Checkbox,
	Dialog,
	Input,
	TextEditor,
	Tooltip,
} from "@/components/ui"
import { useEditForm } from "@/stores/editForm"
import { validateFormRoute } from "@/utils/form_generator"
import { CircleCheck } from "lucide-vue-next"
import { ref, watch } from "vue"

const editFormStore = useEditForm()

const showValidateMsg = ref(false)
const routeExists = ref(false)

const validateRoute = async () => {
	routeExists.value = await validateFormRoute(
		editFormStore.currentFormId,
		editFormStore.formData.route,
	)
	showValidateMsg.value = true
}

watch(
	() => editFormStore.formData.allow_incomplete,
	(newVal) => {
		if (newVal) {
			editFormStore.formData.login_required = true
		}
	},
)

const inExpandedDescription = ref(false)
</script>
<template>
    <div class="space-y-4">
        <h3 class="text-lg font-bold">Settings</h3>
        <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold uppercase text-gray-500 tracking-wider">Linked DocType</label>
                <Input
                    v-model="editFormStore.formData.linked_doctype"
                    disabled
                />
            </div>
            <div class="flex flex-col gap-1">
                <label class="text-xs font-semibold uppercase text-gray-500 tracking-wider">Form ID</label>
                <Input
                    v-model="editFormStore.formData._id"
                    disabled
                />
            </div>

            <h5 class="text-sm font-bold mt-4 mb-1">Form Properties</h5>
            <div class="space-y-6">
                <div class="flex flex-col gap-1">
                    <label class="text-xs font-semibold uppercase text-gray-500 tracking-wider">Route</label>
                    <Input
                        v-model="editFormStore.formData.route"
                        placeholder="Set a unique route for the form."
                        @change="validateRoute()"
                    />
                </div>
                <div v-if="showValidateMsg" class="text-xs font-medium">
                    <span v-if="routeExists" class="text-red-500 flex items-center gap-1">
                        Route already exists
                    </span>
                    <span v-else class="text-green-500 flex items-center gap-1">
                        <CircleCheck class="w-4 h-4" /> Route is available</span
                    >
                </div>
                <Tooltip
                    text="Login is required when allow incomplete forms is enabled"
                >
                    <div class="flex flex-col gap-2">
                        <Checkbox
                            v-model="editFormStore.formData.login_required"
                            :disabled="editFormStore.formData.allow_incomplete"
                            label="Login Required"
                        />
                        <span class="text-xs text-gray-500 ml-6">
                            If enabled, the form will require the user to login to access it.
                        </span>
                    </div>
                </Tooltip>
                <div class="flex flex-col gap-2">
                    <Checkbox
                        v-model="editFormStore.formData.allow_incomplete"
                        label="Allow Incomplete Forms"
                    />
                    <span class="text-xs text-gray-500 ml-6">
                        If enabled, the form will allow users to create draft submissions.
                    </span>
                </div>
            </div>

            <h5 class="text-sm font-bold mt-4 mb-1">Success Page</h5>
            <div class="space-y-6">
                <div class="flex flex-col gap-1">
                    <label class="text-xs font-semibold uppercase text-gray-500 tracking-wider">Success Title</label>
                    <Input
                        v-model="editFormStore.formData.success_title"
                    />
                </div>
                <div class="flex flex-col gap-2">
                    <span class="text-xs font-semibold uppercase text-gray-500 tracking-wider">Success Description</span>
                    <TextEditor
                        v-model="editFormStore.formData.success_description"
                        placeholder="Write a description for the success page"
                    />
                    
                    <Dialog v-model="inExpandedDescription">
                        <div class="space-y-4 min-w-[500px]">
                            <h3 class="text-lg font-bold">Edit Success Description</h3>
                            <p class="text-sm text-gray-600">
                                Make your changes below. They'll be automatically saved.
                            </p>
                            <TextEditor
                                v-model="editFormStore.formData.success_description"
                                placeholder="Write a description for the success page"
                                class="min-h-[200px]"
                            />
                            <div class="flex justify-end pt-4">
                                <Button label="Close" variant="solid" @click="inExpandedDescription = false" />
                            </div>
                        </div>
                    </Dialog>
                    
                    <Button
                        label="Expand"
                        class="w-fit"
                        variant="outline"
                        @click="inExpandedDescription = true"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

