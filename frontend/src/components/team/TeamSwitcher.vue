<script setup lang="ts">
import { useUser } from "@/stores/user";
import { Button, Input } from "@/components/ui";
import { ChevronsUpDown, Search, Plus } from "lucide-vue-next";
import { computed, inject, ref, onMounted, onUnmounted } from "vue";
import CreateTeamDialog from "@/components/team/CreateTeamDialog.vue";
import TeamSwitcherItem from "@/components/team/TeamSwitcherItem.vue";
import TeamLogo from "@/components/team/TeamLogo.vue";

const isSidebarCollapsed = inject("isSidebarCollapsed");

const showCreateTeamDialog = ref(false);
const searchQuery = ref("");
const userStore = useUser();
const isOpen = ref(false);
const switcherRef = ref<HTMLElement | null>(null);

const filteredTeams = computed(() => {
    return userStore.userTeams?.filter(
        (team) =>
            team._id !== userStore.currentTeam?._id &&
            team.team_name.toLowerCase().includes(searchQuery.value.trim().toLowerCase())
    ) ?? [];
});

function toggleDropdown() {
    isOpen.value = !isOpen.value;
}

function closeDropdown() {
    isOpen.value = false;
}

function handleTeamSwitch(team: any) {
    userStore.switchTeam(team);
    closeDropdown();
}

function handleClickOutside(event: MouseEvent) {
    if (switcherRef.value && !switcherRef.value.contains(event.target as Node)) {
        closeDropdown();
    }
}

onMounted(() => {
    document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener("click", handleClickOutside);
});
</script>
<template>
    <CreateTeamDialog v-if="showCreateTeamDialog" v-model="showCreateTeamDialog" />
    <div class="w-full relative" ref="switcherRef">
        <div v-if="userStore.currentTeam" 
            class="flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all border border-transparent hover:bg-gray-100 hover:border-gray-200"
            :class="{ 'bg-white shadow-sm border-gray-200': isOpen, 'px-1.5': isSidebarCollapsed }"
            @click="toggleDropdown"
        >
            <TeamLogo
                v-if="isSidebarCollapsed"
                :team-name="userStore.currentTeam?.team_name"
                :logo-url="userStore.currentTeam?.logo ?? null"
                class-names="h-8 w-8"
            />
            <div v-else class="flex items-center gap-2 justify-between w-full overflow-hidden">
                <TeamSwitcherItem
                    :label="userStore.currentTeam!.team_name"
                    :logo-url="userStore.currentTeam?.logo ?? null"
                    class="flex-1 truncate"
                />
                <ChevronsUpDown class="size-4 text-gray-400 shrink-0" />
            </div>
        </div>

        <!-- Dropdown Menu -->
        <div v-if="isOpen" 
            class="absolute left-0 bottom-full mb-2 w-72 bg-white rounded-xl border shadow-2xl z-50 overflow-hidden flex flex-col scale-in-center animate-in fade-in zoom-in duration-200"
        >
            <div class="p-3 border-b bg-gray-50/50">
                <Input
                    v-model="searchQuery"
                    placeholder="Search Team..."
                    @click.stop
                >
                    <template #prefix>
                        <Search class="size-4 text-gray-400" />
                    </template>
                </Input>
            </div>

            <div class="p-2 max-h-64 overflow-y-auto custom-scrollbar flex flex-col gap-1">
                <p class="px-2 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Switch Team</p>
                <div 
                    v-for="team in filteredTeams" 
                    :key="team._id"
                    class="p-2 w-full hover:bg-gray-50 cursor-pointer rounded-lg transition-colors flex items-center"
                    @click="handleTeamSwitch(team)"
                >
                    <TeamSwitcherItem
                        :label="team.team_name"
                        :logo-url="team.logo ?? null"
                    />
                </div>
                <div v-if="filteredTeams.length === 0" class="p-4 text-center text-xs text-gray-400 italic">
                    No other teams found
                </div>
            </div>

            <div class="p-2 border-t bg-gray-50/50">
                <Button
                    variant="ghost"
                    @click="showCreateTeamDialog = true; closeDropdown()"
                    class="w-full justify-start text-sm font-medium"
                >
                    <template #icon-left>
                        <Plus class="w-4 h-4" />
                    </template>
                    Create New Team
                </Button>
            </div>
        </div>
    </div>
</template>
