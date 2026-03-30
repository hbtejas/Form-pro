<script setup lang="ts">
import { Badge, Popover, Tooltip, Button } from "@/components/ui";
import { ChevronDown, CloudCheck, ExternalLink, CloudOff, ArrowLeft, Globe } from "lucide-vue-next";
import { useEditForm } from "@/stores/editForm";
import { useRouter } from "vue-router";
import Logo from "@/assets/Logo.vue";

const router = useRouter();
const editFormStore = useEditForm();

const openFormSubmissionPage = () => {
    const route = editFormStore.formData?.route;
    if (!route) return;

    const routeRecord = router.getRoutes().find((r) => r.name === "Form Submission Page");
    if (!routeRecord) return;

    const path = routeRecord.path.replace(":route(.*)", route);
    const routeData = router.resolve(path);

    window.open(routeData.href, "_blank");
};
</script>
<template>
    <header
        class="form-builder-header flex justify-between items-center py-2 px-4 border-b h-[3rem] transition-all duration-300 bg-white"
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
                <div class="flex flex-col gap-2 bg-white rounded-lg p-2 border shadow-lg">
                    <Button
                        label="Go Back"
                        variant="ghost"
                        @click="
                            router.replace({
                                name: 'Manage Form',
                                params: {
                                    id: editFormStore.currentFormId,
                                },
                            })
                        "
                    >
                        <template #icon-left>
                            <ArrowLeft class="w-4 h-4" />
                        </template>
                    </Button>
                </div>
            </template>
        </Popover>
        <div class="flex items-center gap-2">
            <Badge
                v-if="editFormStore.isUnsaved"
                theme="orange"
            >
                Unsaved
            </Badge>
            <Tooltip
                v-else-if="editFormStore.isPublished"
                text="Form is published"
            >
                <CloudCheck class="w-4 h-4 text-gray-500" />
            </Tooltip>
            <Tooltip
                v-else
                text="Form is not published"
            >
                <CloudOff class="w-4 h-4 text-gray-500" />
            </Tooltip>
            <h3 class="text-base font-medium text-gray-600 text-center">
                {{ editFormStore.formData?.title || "Untitled Form" }}
            </h3>
            <div class="flex items-center gap-1">
                <span v-if="editFormStore.formData?.route" class="text-base text-gray-600">
                    /{{ editFormStore.formData?.route }}
                </span>
                <Tooltip text="Open in new tab">
                    <Button variant="ghost" @click="openFormSubmissionPage">
                        <ExternalLink class="w-4 h-4 text-gray-500" />
                    </Button>
                </Tooltip>
            </div>
        </div>
        <div class="flex items-center gap-2">
            <div v-if="editFormStore.isUnsaved">
                <Button
                    label="Save"
                    variant="solid"
                    @click="editFormStore.save"
                    :loading="editFormStore.isLoading"
                />
            </div>
            <Button
                v-else
                :label="editFormStore.isPublished ? 'Unpublish' : 'Publish'"
                :variant="editFormStore.isPublished ? 'outline' : 'solid'"
                :loading="editFormStore.isLoading"
                @click="editFormStore.togglePublish"
            >
                <template #icon-left v-if="!editFormStore.isPublished">
                    <Globe class="w-4 h-4" />
                </template>
            </Button>
        </div>
    </header>
</template>

