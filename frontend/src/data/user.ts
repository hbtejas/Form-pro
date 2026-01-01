import router from "@/router";
import { createResource } from "frappe-ui";

export const userResource = createResource({
  url: "frappe.auth.get_logged_user",
  cache: "User",
  onError(error: any) {
    if (error && error.exc_type === "AuthenticationError") {
      router.push({ name: "LoginPage" });
    }
  },
});
