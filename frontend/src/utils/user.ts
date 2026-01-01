import { createResource } from "frappe-ui";

export type GetUserBasicResponse = {
  full_name: string;
  user_image: string | null;
};

export async function getUser(userId: string) {
  const userData = createResource({
    url: "forms_pro.api.user.get_user",
    params: {
      user: userId,
    },
  });

  await userData.fetch();
  return userData.data;
}
