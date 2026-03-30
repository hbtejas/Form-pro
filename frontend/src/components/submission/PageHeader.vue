<script setup lang="ts">
import { Button, Popover } from "@/components/ui"
import { session } from "@/data/session"
import api from "@/utils/api"
import { LogOut } from "lucide-vue-next"
import { onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import Avatar from "../ui/Avatar.vue"

const route = useRoute()
const brandLogo = ref<string | null>(null)
const websiteSettings = ref<any>(null)

async function fetchData() {
	try {
		const logoResp = await api.get("/settings/brand-logo")
		brandLogo.value = logoResp.data
		const settingsResp = await api.get("/settings/website-settings")
		websiteSettings.value = settingsResp.data
	} catch (err) {
		// Fallback
	}
}

onMounted(fetchData)

function redirectToLogin() {
	window.location.href = `/login?redirect-to=${route.fullPath}`
}
</script>
<template>
    <div class="max-w-screen-md mx-auto flex justify-between items-center py-4">
        <img v-if="brandLogo" :src="brandLogo" alt="Brand Logo" class="w-10 h-10 object-contain" />
        <div v-else class="text-xl font-bold">Forms Pro</div>
        <div>
            <Popover v-if="session.user">
                <template #target="{ togglePopover }">
                    <Button variant="ghost" @click="togglePopover">
                        <Avatar :userId="session.user._id" :label="session.user.fullName" size="lg" />
                    </Button>
                </template>
                <template #body>
                    <div class="flex flex-col gap-2 bg-white rounded-lg p-2 border shadow-lg z-50">
                        <Button
                            variant="ghost"
                            @click="session.logout()"
                            label="Log out"
                        >
                            <template #icon-left>
                                <LogOut class="w-4 h-4 text-red-500" />
                            </template>
                        </Button>
                    </div>
                </template>
            </Popover>
            <Button v-else-if="!websiteSettings?.disable_sign_up" @click="redirectToLogin">
                Login
            </Button>
        </div>
    </div>
</template>

