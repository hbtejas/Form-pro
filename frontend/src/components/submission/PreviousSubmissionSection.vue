<script setup lang="ts">
import { useSubmissionForm } from "@/stores/submissionForm";
import { Button, Badge } from "@/components/ui";
import { formatDateTime } from "@/utils/date";
import {
    AccordionContent,
    AccordionHeader,
    AccordionItem,
    AccordionRoot,
    AccordionTrigger,
} from "reka-ui";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { ChevronUp, ChevronDown } from "lucide-vue-next";

const submissionFormStore = useSubmissionForm();
const router = useRouter();
const selectedValue = ref<string | string[] | undefined>("previous-submissions");
const isOpen = computed(() => !!selectedValue.value);
</script>
<template>
    <AccordionRoot v-model="selectedValue" class="form-container-simple" :collapsible="true">
        <AccordionItem value="previous-submissions">
            <AccordionHeader>
                <AccordionTrigger as="div" class="flex justify-between w-full cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
                    <div class="space-y-2 text-left">
                        <h2 class="text-2xl font-bold">Previous Submissions</h2>
                        <p class="text-base text-gray-600">
                            Here are your previous submissions for this form.
                        </p>
                    </div>
                    <Button variant="ghost">
                        <template #icon-left>
                            <ChevronUp v-if="isOpen" class="w-4 h-4" />
                            <ChevronDown v-else class="w-4 h-4" />
                        </template>
                    </Button>
                </AccordionTrigger>
            </AccordionHeader>
            <AccordionContent as="div" class="space-y-4 mt-4">
                <div
                    v-for="(submission, index) in submissionFormStore.userSubmissions"
                    :key="submission._id"
                    class="flex justify-between w-full items-center border p-4 rounded-lg bg-white shadow-sm"
                >
                    <div class="text-lg font-medium space-y-2 flex flex-col">
                        <h4>Submission #{{ index + 1 }}</h4>
                        <div class="flex gap-2 items-center">
                            <Badge
                                v-if="(submission as any).submission_status"
                                :label="(submission as any).submission_status"
                                variant="subtle"
                            />
                            <div
                                v-if="submission.updatedAt !== submission.createdAt"
                                class="flex items-center text-gray-500 text-sm gap-2"
                            >
                                <span> Modified {{ formatDateTime(submission.updatedAt) }} </span>
                                <span>•</span>
                                <span> Created {{ formatDateTime(submission.createdAt) }} </span>
                            </div>
                            <div v-else class="text-gray-500 text-sm">
                                <span> Created {{ formatDateTime(submission.createdAt) }} </span>
                            </div>
                        </div>
                    </div>
                    <Button
                        label="View"
                        variant="outline"
                        @click="
                            router.push(
                                `/p/${submissionFormStore.currentFormRoute}/edit/${submission._id}`
                            )
                        "
                    />
                </div>
            </AccordionContent>
        </AccordionItem>
    </AccordionRoot>
</template>

