<script setup lang="ts">
import "vue-sonner/style.css";
import { Toaster } from "vue-sonner";
</script>

<template>
    <div>
        <router-view />
    </div>
    <Toaster theme="system" />
</template>
