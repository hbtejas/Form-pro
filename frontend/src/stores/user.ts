import type { ThemePreferenceType } from "@/utils/theme";
import setTheme from "@/utils/theme";
import api from "@/utils/api";
import { defineStore } from "pinia";
import { ref } from "vue";
import { toast } from "vue-sonner";

export type UserTeam = {
  _id: string; // MERN use _id
  name: string;
  team_name: string;
  logo: string | null;
  is_current: boolean;
};

export const useUser = defineStore("user", () => {
  const user = ref<any>(null);
  const userTeams = ref<UserTeam[]>([]);
  const currentTeam = ref<UserTeam | null>(null);
  const isLoading = ref(false);

  async function fetchUser() {
    try {
      const response = await api.get("/user/current");
      user.value = response.data;
    } catch (err) {
      user.value = null;
    }
  }

  async function fetchUserTeams() {
    try {
      const response = await api.get("/teams");
      userTeams.value = response.data;
      const _currTeam = userTeams.value.find((team) => team.is_current);
      if (!_currTeam) {
        if (userTeams.value.length > 0) {
          setCurrentTeam(userTeams.value[0]);
        }
      } else {
        setCurrentTeam(_currTeam);
      }
    } catch (err: any) {
      toast.error("Failed to fetch user teams", {
        description: err.message,
      });
    }
  }

  async function initialize() {
    isLoading.value = true;
    await Promise.all([fetchUser(), fetchUserTeams()]);
    isLoading.value = false;
  }

  function setCurrentTeam(team: UserTeam) {
    currentTeam.value = team;
  }

  async function switchTeam(team: UserTeam) {
    try {
      await api.post(`/teams/switch/${team._id || team.name}`);
      await fetchUserTeams();
      toast.success("Team switched successfully");
    } catch (err: any) {
      toast.error("Failed to switch team", {
        description: err.message,
      });
    }
  }

  async function createTeam(teamName: string, logoUrl: string | undefined) {
    try {
      await api.post("/teams", {
        team_name: teamName,
        logo_url: logoUrl,
      });
      await fetchUserTeams();
      toast.success("Team created successfully");
    } catch (err: any) {
      toast.error("Failed to create team", {
        description: err.message,
      });
    }
  }

  async function toggleThemePreference(theme: ThemePreferenceType) {
    setTheme(theme);
    try {
      await api.post("/user/theme", { theme });
      await fetchUser();
    } catch (err) {
      console.error("Failed to save theme preference");
    }
  }

  return {
    user,
    userTeams,
    currentTeam,
    isLoading,
    initialize,
    fetchUser,
    fetchUserTeams,
    setCurrentTeam,
    createTeam,
    switchTeam,
    toggleThemePreference,
  };
});

