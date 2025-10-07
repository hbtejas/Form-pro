import { createResource } from "frappe-ui";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { FormField } from "@/types/formfield";

export const useSubmissionForm = defineStore("submissionForm", () => {
  const formResource = ref<any>(null);
  const currentFormId = ref<string | null>(null);
  const isLoading = computed(() => formResource.value?.loading);
  const errors = ref<string[]>([]);
  const successSubmission = ref<number>(0);
  const inFormSubmission = ref<number>(1);

  const fields = computed({
    get() {
      if (!formResource.value?.data) return {};

      let _fields: Record<string, any> = {};
      formResource.value.data.fields.forEach((field: FormField) => {
        _fields[field.fieldname] = "";
        if (field.default) {
          _fields[field.fieldname] = field.default;
        }
      });

      return _fields;
    },

    set(value: any) {
      formResource.value.data.fields = value.map((field: FormField) => {
        return {
          ...field,
          value: value[field.fieldname],
        };
      });
    },
  });

  async function initialize(route: string) {
    currentFormId.value = route;
    formResource.value = createResource({
      url: "forms_pro.api.form.get_form_by_route",
      params: {
        route: route,
      },
      onSuccess() {
        inFormSubmission.value = 1;
      },
    });
    await formResource.value.fetch();
  }

  async function submitForm() {
    validateValues();
    if (errors.value.length > 0) {
      return;
    }

    const _submit_doc = createResource({
      url: "forms_pro.api.submission.submit_form_response",
      makeParams() {
        return {
          form_id: formResource.value.data.name,
          form_data: Object.entries(fields.value).map(([fieldname, value]) => ({
            fieldname: fieldname,
            value: value,
          })),
        };
      },
      onSuccess() {
        inFormSubmission.value = 0;
        successSubmission.value = 1;
      },
    });

    await _submit_doc.fetch();
  }

  function validateValues() {
    errors.value = [];
    formResource.value.data.fields.forEach((field: FormField) => {
      if (field.reqd && !fields.value[field.fieldname]) {
        errors.value.push(`${field.label} is required`);
      }
    });
  }

  return {
    formResource,
    currentFormId,
    fields,
    isLoading,
    errors,
    successSubmission,
    inFormSubmission,
    initialize,
    submitForm,
  };
});
