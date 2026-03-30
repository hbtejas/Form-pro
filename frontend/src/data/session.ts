import api from "@/utils/api";
import router from "@/router";
import { computed, reactive } from "vue";

export type Session = {
  user: string | null;
  full_name: string | null;
  isLoggedIn: any;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const sessionData: Session = {
  user: localStorage.getItem("user_id"),
  full_name: localStorage.getItem("full_name"),
  isLoggedIn: computed(() => !!session.user),
  async login(email, password) {
    const resp = await api.post("/auth/login", {
      email: email.trim().toLowerCase(),
      password
    });
    const data = resp.data;

    // Store token and user info
    localStorage.setItem("token", data.token);
    localStorage.setItem("user_id", data.user_id);
    localStorage.setItem("full_name", data.full_name);

    session.user = data.user_id;
    session.full_name = data.full_name;

    router.replace("/");
  },
  async logout() {
    try {
      await api.post("/auth/logout");
    } catch (_) {}
    localStorage.clear();
    session.user = null;
    session.full_name = null;
    window.location.href = "/login";
  }
};

export const session = reactive<Session>(sessionData);
