<script setup lang="ts">
import { ref } from 'vue';
import api from '@/utils/api';
import { Button } from '@/components/ui';

const props = defineProps(['accept']);
const emit = defineEmits(['success', 'failure']);

const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const progress = ref(0);
const error = ref('');

const openFileSelector = () => {
    fileInput.value?.click();
};

const handleFileChange = async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return;

    uploading.value = true;
    progress.value = 0;
    error.value = '';

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await api.post('/files/upload', formData, {
            onUploadProgress: (progressEvent) => {
                progress.value = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
            },
        });
        emit('success', response.data);
    } catch (err: any) {
        error.value = err.response?.data?.message || 'Upload failed';
        emit('failure', err);
    } finally {
        uploading.value = false;
        target.value = '';
    }
};
</script>

<template>
    <div>
        <input 
            type="file" 
            ref="fileInput" 
            class="hidden" 
            :accept="props.accept" 
            @change="handleFileChange" 
        />
        <slot v-bind="{ uploading, progress, error, openFileSelector }" />
    </div>
</template>
