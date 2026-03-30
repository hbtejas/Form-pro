import api from "@/utils/api";
import router from "@/router";
import { computed, reactive } from "vue";
import { userResource } from "./user";

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
    const resp = await api.post("/auth/login", { email, password });
    const data = resp.data;
    localStorage.setItem("user_id", data.user_id);
    localStorage.setItem("full_name", data.full_name);
    session.user = data.user_id;
    session.full_name = data.full_name;
    await userResource.fetch();
    router.replace("/");
  },
  async logout() {
    await api.post("/auth/logout");
    localStorage.clear();
    session.user = null;
    session.full_name = null;
    window.location.href = "/login";
  }
};

export const session = reactive<Session>(sessionData);


