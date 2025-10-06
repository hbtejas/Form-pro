<script setup lang="ts">
import { Badge, Popover, Tooltip } from "frappe-ui";
import { ChevronDown, CloudCheck } from "lucide-vue-next";
import { Button } from "frappe-ui";
import { useEditForm } from "@/stores/editForm";
import Logo from "@/assets/Logo.vue";

const editFormStore = useEditForm();
</script>
<template>
    <header
        class="form-builder-header flex justify-between items-center py-2 px-4 border-b h-[3rem] transition-all duration-300"
        data-form-builder-component="form-builder-header"
    >
        <Popover>
            <template #target="{ togglePopover }">
                <button class="flex items-center gap-1" @click="togglePopover">
                    <Logo />
                    <ChevronDown class="w-5 h-5" />
                </button>
            </template>
            <template #body-main>
                <div class="flex flex-col gap-2 bg-white rounded-lg p-2">
                    <Button
                        label="Go to dashboard"
                        icon-left="arrow-left"
                        variant="ghost"
                        route="/"
                    />
                </div>
            </template>
        </Popover>
        <div class="flex items-center gap-2">
            <Badge
                v-if="editFormStore.isUnsaved"
                variant="subtle"
                label="Unsaved"
                theme="orange"
                size="sm"
            />
            <Tooltip v-else text="Form is published" placement="bottom">
                <CloudCheck class="w-4 h-4 text-gray-500" />
            </Tooltip>
            <h3 class="text-base font-medium text-gray-600 text-center">
                {{ editFormStore.originalFormData?.title || "Untitled Form" }}
            </h3>
            <div class="flex items-center">
                <span v-if="editFormStore.originalFormData?.route" class="text-base text-gray-600">
                    /{{ editFormStore.originalFormData?.route }}
                </span>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <Button
                v-if="editFormStore.isUnsaved"
                label="Save"
                variant="solid"
                @click="editFormStore.save"
                :loading="editFormStore.formResource?.loading"
            />
            <Button
                v-else
                label="Publish"
                icon-left="globe"
                variant="solid"
                @click="editFormStore.togglePublish"
            />
        </div>
    </header>
</template>
