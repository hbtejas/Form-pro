<script setup lang="ts">
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";
</script>
<template>
    <div class="flex flex-col gap-4 items-center">
        <DotLottieVue
            src="https://lottie.host/b9ba5ce8-d753-497a-946c-76e0da2ec22d/QcoLWNS7AP.lottie"
            autoplay
            :loop="false"
            :height="150"
            class="h-[150px]"
        />
        <h3 class="text-2xl font-bold">Form submitted successfully</h3>
        <p class="text-sm">Thank you for submitting the form. We will get back to you soon.</p>
    </div>
</template>
