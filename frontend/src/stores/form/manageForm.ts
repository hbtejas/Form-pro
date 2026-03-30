import { defineStore } from "pinia";
import { ref, computed, reactive } from "vue";
import api from "@/utils/api";
import { toast } from "vue-sonner";

export type PermissionTypes = "read" | "write" | "share" | "submit";

export type AccessPermissions = {
  read: boolean;
  write: boolean;
  share: boolean;
  submit: boolean;
};

export type SharedAccessUser = {
  full_name: string;
  user_image: string | null;
  email: string;
  read: boolean;
  write: boolean;
  share: boolean;
  submit: boolean;
};

export const useManageForm = defineStore("manageForm", () => {
  const currentFormId = ref<string>("");
  const formData = ref<any>(null);
  const formFields = computed(() => formData.value?.fields || []);
  const formOwner = computed(() => formData.value?.owner || null);
  
  const formAccessResource = reactive({
    data: [] as SharedAccessUser[],
    loading: false,
    async fetch() {
      if (!currentFormId.value) return;
      this.loading = true;
      try {
        const resp = await api.get(`/forms/${currentFormId.value}/access`);
        this.data = resp.data;
      } catch (err) {
        this.data = [];
      } finally {
        this.loading = false;
      }
    }
  });

  const sharedAccessUsers = computed<SharedAccessUser[]>(() => formAccessResource.data);

  const userHasShareAccess = computed<boolean>(() => {
    const userEmail = localStorage.getItem("user_id");
    return formAccessResource.data?.find(
      (user: SharedAccessUser) => user.email === userEmail
    )?.share ?? false;
  });

  async function initialize(formId: string) {
    currentFormId.value = formId;
    try {
      const resp = await api.get(`/forms/${formId}`);
      formData.value = resp.data;
      await formAccessResource.fetch();
    } catch (err) {
      toast.error("Failed to load form details");
    }
  }

  async function addAccess(userId: string, access: AccessPermissions) {
    try {
      await api.post(`/forms/${currentFormId.value}/access`, { userId, ...access });
      await formAccessResource.fetch();
      toast.success("Access added successfully");
    } catch (err: any) {
      toast.error("Failed to give access to the user", { description: err.message });
    }
  }

  async function setPermission(userId: string, permission: PermissionTypes, value: boolean) {
    try {
      await api.patch(`/forms/${currentFormId.value}/access`, { userId, permission, value });
      await formAccessResource.fetch();
      toast.success("Permission set successfully");
    } catch (err: any) {
      toast.error("Failed to set permission", { description: err.message });
    }
  }

  async function removeAccess(userEmail: string) {
    try {
      await api.delete(`/forms/${currentFormId.value}/access/${userEmail}`);
      await formAccessResource.fetch();
      toast.success("Access removed successfully");
    } catch (err: any) {
      toast.error("Failed to remove access", { description: err.message });
    }
  }

  return {
    initialize,
    addAccess,
    setPermission,
    removeAccess,
    userHasShareAccess,
    formOwner,
    sharedAccessUsers,
    currentFormId,
    formData,
    formFields,
  };
});

