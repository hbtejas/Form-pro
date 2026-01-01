import router from "@/router";
import { createResource } from "frappe-ui";
import { computed, ComputedRef, reactive } from "vue";

import { userResource } from "./user";

type Resource<T = any> = ReturnType<typeof createResource<T>>;

export type Session = {
  user: string | null;
  full_name: string | null;
  isLoggedIn: ComputedRef<boolean>;
  login: Resource<any>;
  logout: Resource<any>;
};

export function sessionUser() {
  const cookies = new URLSearchParams(document.cookie.split("; ").join("&"));
  let _sessionUser = cookies.get("user_id");
  if (_sessionUser === "Guest") {
    _sessionUser = null;
  }
  return _sessionUser;
}

function fullName() {
  const cookies = new URLSearchParams(document.cookie.split("; ").join("&"));
  let _fullName = cookies.get("full_name");
  return _fullName;
}

export const session = reactive<Session>({
  login: createResource({
    url: "login",
    makeParams({ email, password }: { email: string; password: string }) {
      return {
        usr: email,
        pwd: password,
      };
    },
    onSuccess(data: { default_route?: string }) {
      userResource.reload();
      session.user = sessionUser();
      session.login.reset();
      router.replace(data.default_route || "/");
    },
  }),
  logout: createResource({
    url: "logout",
    onSuccess() {
      userResource.reset();
      session.user = sessionUser();
      window.location.href = `/login?redirect-to=/forms`;
    },
  }),
  user: sessionUser(),
  full_name: fullName(),
  isLoggedIn: computed((): boolean => !!session.user),
} as Session);
