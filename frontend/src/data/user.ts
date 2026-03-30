import api from "@/utils/api";

export const userResource = {
  data: null as any,
  loading: false,
  fetch: async () => {
    try {
      const resp = await api.get("/user/current");
      userResource.data = resp.data;
    } catch (err) {
      userResource.data = null;
    }
  },
  promise: Promise.resolve(),
};

