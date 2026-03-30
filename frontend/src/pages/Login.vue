<script setup lang="ts">
import { Button, Input } from "@/components/ui"
import { session } from "@/data/session"
import { ref } from "vue"
import { toast } from "vue-sonner"

const email = ref("")
const password = ref("")
const loading = ref(false)

const handleLogin = async () => {
	if (!email.value || !password.value) {
		toast.error("Please enter email and password")
		return
	}
	loading.value = true
	try {
		await session.login(email.value, password.value)
	} catch (err) {
		toast.error("Invalid credentials")
	} finally {
		loading.value = false
	}
}
</script>

<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-50">
        <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md space-y-6">
            <h1 class="text-2xl font-bold text-center">Forms Pro</h1>
            <p class="text-gray-500 text-center">Login to your account</p>
            <div class="space-y-4">
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium">Email</label>
                    <Input v-model="email" placeholder="email@example.com" type="email" />
                </div>
                <div class="flex flex-col gap-1">
                    <label class="text-sm font-medium">Password</label>
                    <Input v-model="password" placeholder="••••••••" type="password" />
                </div>
                <Button 
                    class="w-full" 
                    variant="solid" 
                    label="Login" 
                    :loading="loading" 
                    @click="handleLogin" 
                />
            </div>
        </div>
    </div>
</template>
