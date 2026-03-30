<script setup lang="ts">
import { Button, ErrorMessage } from "@/components/ui";
import FileUploader from "@/components/ui/FileUploader.vue";
import { ref } from "vue";
import { Trash } from "lucide-vue-next";

const props = defineProps({
    field: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(["update:value"]);
const value = defineModel<string>();

const inPreview = ref(false);

const fileData = ref<any>(null);

const formatFileSize = (fileSize: number) => {
    if (fileSize < 1024) return `${fileSize} B`;
    if (fileSize < 1024 * 1024) return `${(fileSize / 1024).toFixed(2)} KB`;
    if (fileSize < 1024 * 1024 * 1024) return `${(fileSize / 1024 / 1024).toFixed(2)} MB`;
    return `${(fileSize / 1024 / 1024 / 1024).toFixed(2)} GB`;
};

const handleChange = (file: any) => {
    fileData.value = file;
    if (file.file_url) {
        emit("update:value", file.file_url);
    }
    inPreview.value = true;
};

const handleRemove = () => {
    fileData.value = null;
    emit("update:value", "");
    inPreview.value = false;
};
</script>
<template>
    <div class="flex gap-2 flex-col mt-2">
        <FileUploader
            v-if="!inPreview"
            :accept="props.field.options"
            @success="(file: any) => handleChange(file)"
        >
            <template #default="{ uploading, progress, error, openFileSelector }">
                <Button @click="openFileSelector()" :loading="uploading">
                    {{ uploading ? `Uploading ${progress}%` : "Upload" }}
                </Button>
                <ErrorMessage v-if="error">{{ error }}</ErrorMessage>
            </template>
        </FileUploader>
        <div v-if="inPreview" class="p-4 bg-white border rounded-md flex flex-col gap-2">
            <a :href="fileData?.file_url" target="_blank" class="text-sm font-medium">
                {{ fileData?.file_name }}
            </a>
            <span class="text-sm text-gray-500">
                {{ formatFileSize(fileData?.file_size || 0) }}
            </span>
            <Button
                variant="outline"
                label="Remove"
                @click="handleRemove"
            >
                <template #icon-left>
                    <Trash class="w-4 h-4" />
                </template>
            </Button>
        </div>
    </div>
</template>

