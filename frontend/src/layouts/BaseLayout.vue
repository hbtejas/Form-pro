<template>
    <div class="flex h-screen w-full">
        <Sidebar
            :header="{
                title: 'Forms Pro',
                subtitle: session.full_name,
                menuItems: menuItems,
            }"
            :sections="sidebarSections"
        >
            <template #header-logo>
                <div
                    class="font-instrument font-bold bg-surface-white rounded border border-outline-gray-1 py-[2px]"
                >
                    F.
                </div>
            </template>
        </Sidebar>
        <slot></slot>
    </div>
</template>
<script setup>
import { session } from "@/data/session";
import { ref, computed } from "vue";
import { Sidebar } from "frappe-ui";
import { LayoutDashboard } from "lucide-vue-next";
import toggleTheme from "@/utils/theme";

const menuItems = computed(() => {
    return [
        // {
        // 	label: "Toggle Theme",
        // 	icon: "moon",
        // 	onClick: toggleTheme,
        // },
        {
            label: "Log out",
            icon: "log-out",
            onClick: session.logout.submit,
        },
    ];
});

const sidebarSections = ref([
    {
        label: "",
        items: [
            {
                label: "Dashboard",
                to: "/",
                isActive: true,
                icon: LayoutDashboard,
            },
        ],
    },
    // {
    // 	label: "",
    // 	items: [
    // 		{
    // 			label: "Submissions",
    // 			to: "/submissions",
    // 		},
    // 	],
    // },
]);
</script>
