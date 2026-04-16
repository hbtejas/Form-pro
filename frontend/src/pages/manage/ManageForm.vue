<script setup lang="ts">
import { Breadcrumbs } from "@/components/ui"
import BaseLayout from "@/layouts/BaseLayout.vue"
import { useManageForm } from "@/stores/form/manageForm"
import { ArrowLeft, LayoutGrid } from "lucide-vue-next"
import { computed, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

const manageFormStore = useManageForm()
const route = useRoute()
const router = useRouter()

watch(
	() => route.params.id,
	() => {
		manageFormStore.initialize(route.params.id as string)
	},
	{ immediate: true },
)

const sidebarSections = ref<any[]>([
	{
		items: [
			{
				label: "Go Back",
				icon: ArrowLeft,
				onClick: () => {
					router.replace("/")
				},
			},
		],
	},
	{
		label: "",
		items: [
			{
				label: "Overview",
				to: `/manage/${manageFormStore.currentFormId}/overview`,
				isActive: true,
				icon: LayoutGrid,
			},
		],
	},
])

const breadcrumbItems = computed(() => {
	const _items = [
		{
			label: "Manage Form",
			to: `/manage/${manageFormStore.currentFormId}`,
			isActive: true,
		},
	]

	for (const section of sidebarSections.value as any[]) {
		for (const item of section.items as any[]) {
			if (item.isActive) {
				_items.push({
					label: item.label,
					to: item.to,
					isActive: item.isActive,
				})
			}
		}
	}

	return _items
})
</script>
<template>
    <BaseLayout :sidebar-sections="sidebarSections">
        <div class="space-y-4 w-full bg-surface-white flex justify-center">
            <div class="max-w-screen-lg mx-auto w-full space-y-4">
                <Breadcrumbs :items="breadcrumbItems" />
                <RouterView />
            </div>
        </div>
    </BaseLayout>
</template>
