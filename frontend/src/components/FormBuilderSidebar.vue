<script setup lang="ts">
import { Settings, Plus, StretchHorizontal } from "lucide-vue-next";
import { ref, markRaw } from "vue";
import { Tooltip, Button } from "@/components/ui";
import AddFieldsSection from "@/components/builder/sidebar/AddFieldsSection.vue";
import SettingsSection from "@/components/builder/sidebar/SettingsSection.vue";
import DocTypeFieldsSection from "@/components/builder/sidebar/DoctypeFieldsSection.vue";

const sidebarSections = ref([
    {
        id: 0,
        label: "Settings",
        icon: Settings,
        section: markRaw(SettingsSection),
    },
    {
        id: 1,
        label: "Add Fields",
        icon: Plus,
        section: markRaw(AddFieldsSection),
    },
    {
        id: 2,
        label: "DocType Fields",
        icon: StretchHorizontal,
        section: markRaw(DocTypeFieldsSection),
    },
]);

const activeSection = ref(sidebarSections.value[1]);
</script>
<template>
    <div
        class="form-builder-sidebar bg-white h-[calc(100vh-3rem)] w-72 border-r sticky top-0 overflow-y-auto flex"
        data-form-builder-component="form-builder-sidebar"
    >
        <div class="h-full bg-inherit flex flex-col gap-2 p-2 border-r">
            <Tooltip
                v-for="section in sidebarSections"
                :key="section.id"
                :text="section.label"
            >
                <Button
                    @click="activeSection = section"
                    :variant="activeSection === section ? 'solid' : 'ghost'"
                >
                    <template #icon-left>
                        <component :is="section.icon" class="w-4 h-4" />
                    </template>
                </Button>
            </Tooltip>
        </div>
        <div class="flex flex-col gap-4 w-full p-4 overflow-x-hidden">
            <component :is="activeSection.section" />
        </div>
    </div>
</template>

