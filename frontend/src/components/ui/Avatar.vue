<script setup lang="ts">
import { Tooltip } from "@/components/ui"
import { getUser } from "@/utils/user"
import type { GetUserBasicResponse } from "@/utils/user"
import { computed, onMounted, ref } from "vue"

const props = withDefaults(
	defineProps<{
		userId: string
		label?: string
		size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl"
		shape?: "circle" | "square"
		className?: string
		disabled?: boolean
	}>(),
	{
		size: "md",
		shape: "circle",
		disabled: false,
	},
)

const user = ref<GetUserBasicResponse | null>(null)

const initials = computed(() => {
	const name = props.label || user.value?.full_name || props.userId || "?"
	return name
		.split(" ")
		.map((n) => n[0])
		.join("")
		.slice(0, 2)
		.toUpperCase()
})

const sizeClasses = {
	xs: "h-5 w-5 text-[8px]",
	sm: "h-6 w-6 text-[10px]",
	md: "h-8 w-8 text-xs",
	lg: "h-10 w-10 text-sm",
	xl: "h-12 w-12 text-base",
	"2xl": "h-16 w-16 text-lg",
	"3xl": "h-20 w-20 text-xl",
}

onMounted(async () => {
	if (props.userId && !props.label) {
		user.value = await getUser(props.userId)
	}
})
</script>

<template>
    <Tooltip
        :disabled="disabled"
        :text="label || user?.full_name || userId"
    >
        <div
            :class="[
                'flex items-center justify-center overflow-hidden bg-gray-200 font-bold text-gray-600 border border-gray-100 shadow-sm transition-transform hover:scale-105',
                shape === 'circle' ? 'rounded-full' : 'rounded-lg',
                sizeClasses[size],
                className
            ]"
        >
            <img
                v-if="user?.user_image"
                :src="user.user_image"
                class="h-full w-full object-cover"
                :alt="label || user?.full_name"
            />
            <span v-else>{{ initials }}</span>
        </div>
    </Tooltip>
</template>

