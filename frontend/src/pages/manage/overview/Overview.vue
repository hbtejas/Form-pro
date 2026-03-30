<script setup lang="ts">
import AccessSection from "@/components/form/manage/AccessSection.vue";
import DescriptionSection from "@/components/form/manage/DescriptionSection.vue";
import { useManageForm } from "@/stores/form/manageForm";
import { FileText, CaseLower, Lock } from "lucide-vue-next";
import { formatPrettyDate } from "@/utils/date";
import { TabButtons, LoadingText, Badge, Button } from "@/components/ui";
import Avatar from "@/components/ui/Avatar.vue";
import { useQueryParam } from "@/composables/useQueryParam";

const manageFormStore = useManageForm();

const tabs = [
    {
        label: "Description",
        icon: CaseLower,
        value: "description",
    },
    {
        label: "Access",
        icon: Lock,
        value: "shared",
    },
] as any[];

const validTabValues = tabs.map((t) => t.value);
const selectedTab = useQueryParam<string>("tab", "description", validTabValues);
</script>

<template>
    <div v-if="!manageFormStore.formData">
        <LoadingText />
    </div>
    <div v-else>
        <div class="flex flex-col gap-3">
            <Badge
                v-if="manageFormStore.formData?.is_published"
                class="w-fit"
                theme="green"
            >
                Published
            </Badge>

            <div class="flex gap-3 justify-between items-center">
                <div class="flex gap-3 items-center text-ink-gray-8">
                    <FileText class="w-6 h-6" />
                    <h2 class="text-3xl font-bold">{{ manageFormStore.formData?.title }}</h2>
                </div>
                <div class="flex gap-3">
                    <Button
                        @click="
                            $router.push({
                                name: 'Edit Form',
                                params: { id: manageFormStore.formData?._id },
                            })
                        "
                        class="w-24"
                        label="Edit"
                        variant="solid"
                    />
                </div>
            </div>
            <div class="flex flex-col gap-2 text-ink-gray-5">
                <div class="flex gap-2 items-center text-xs">
                    <p>Modified {{ formatPrettyDate(manageFormStore.formData?.updatedAt) }}</p>
                    <span>•</span>
                    <p>Created {{ formatPrettyDate(manageFormStore.formData?.createdAt) }} by</p>
                    <Avatar :userId="manageFormStore.formData?.owner" />
                </div>
            </div>
            <TabButtons class="w-fit mb-2" :options="tabs" v-model="selectedTab" />
            <DescriptionSection v-if="selectedTab === 'description'" />
            <AccessSection v-if="selectedTab === 'shared'" />
        </div>
    </div>
</template>

