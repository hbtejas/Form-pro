<script setup lang="ts">
import { AlertCircle } from "lucide-vue-next";
</script>

<template>
    <div class="p-12 text-center space-y-6 bg-white rounded-2xl shadow-xl border border-gray-100 max-w-lg mx-auto transform transition-all hover:scale-[1.02]">
        <div class="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 animate-pulse">
            <AlertCircle class="w-10 h-10" />
        </div>
        <div class="space-y-2">
            <h2 class="text-2xl font-bold text-gray-900">Form Unpublished</h2>
            <p class="text-gray-500 leading-relaxed">
                This form is currently not accepting submissions. Please contact the form owner for more information.
            </p>
        </div>
        <div class="pt-4">
            <router-link to="/" class="text-blue-600 font-medium hover:underline flex items-center justify-center gap-2">
                Go to Dashboard
            </router-link>
        </div>
    </div>
</template>
