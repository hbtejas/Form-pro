<script setup lang="ts">
import "vue-sonner/style.css"
import { useUser } from "@/stores/user"
import { Toaster } from "vue-sonner"

const userStore = useUser()

if (localStorage.getItem("token")) {
	userStore.initialize()
}
</script>

<template>
    <div>
        <router-view />
    </div>
    <Toaster theme="system" />
</template>
