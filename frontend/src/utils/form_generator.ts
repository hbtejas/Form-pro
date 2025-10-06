import { createResource } from "frappe-ui";

export const createNewForm = async () => {
  const form = createResource({
    url: "forms_pro.utils.form_generator.create_form",
  });

  await form.fetch();
  return form.data;
};

export const validateFormRoute = async (
  curr_form_id: string,
  route: string,
) => {
  const route_exists = createResource({
    url: "frappe.client.get_count",
    makeParams() {
      return {
        doctype: "Form",
        filters: {
          name: ["!=", curr_form_id],
          route: route,
        },
      };
    },
  });

  await route_exists.fetch();
  return route_exists.data > 0;
};
