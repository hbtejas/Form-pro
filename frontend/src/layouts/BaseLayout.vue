<template>
    <div class="flex h-screen w-full">
        <Sidebar
            :header="{
                title: sidebarHeader.title,
                subtitle: sidebarHeader.subtitle,
                menuItems: sidebarHeader.menuItems,
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
<script setup lang="ts">
import { session } from "@/data/session";
import { computed } from "vue";
import { Sidebar, type SidebarProps } from "frappe-ui";
import { LayoutDashboard, LogOut } from "lucide-vue-next";
import type { PropType } from "vue";

type SidebarSectionProps = NonNullable<SidebarProps["sections"]> extends (infer T)[] ? T : never;
type SidebarHeaderProps = NonNullable<SidebarProps["header"]>;

const props = defineProps({
    sidebarHeader: {
        type: Object as PropType<SidebarHeaderProps | null>,
        default: null,
    },
    sidebarSections: {
        type: Array as PropType<SidebarSectionProps[]>,
        default: () => [],
    },
});

const defaultSidebarMenuItems = computed(() => [
    {
        label: "Log out",
        icon: LogOut,
        onClick: session.logout.submit,
    },
]);

const sidebarHeader = computed(() => {
    if (props.sidebarHeader) {
        return props.sidebarHeader;
    }

    return {
        title: "Forms Pro",
        subtitle: session.full_name ?? undefined,
        menuItems: defaultSidebarMenuItems.value,
    };
});

const sidebarSections = computed((): SidebarSectionProps[] => {
    if (props.sidebarSections && props.sidebarSections.length > 0) {
        return props.sidebarSections;
    }

    const _sections: SidebarSectionProps[] = [
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
    ];

    return _sections;
});
</script>
