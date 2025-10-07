import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { createDocumentResource } from "frappe-ui";
import { FormField } from "@/types/formfield";
import { Form } from "@/types/form";
import { toast } from "vue-sonner";

function scrubFieldname(label: string) {
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_") // replace non-alphanumeric with underscores
    .replace(/^_+|_+$/g, "") // trim leading/trailing underscores
    .replace(/_{2,}/g, "_"); // collapse multiple underscores
}

export const useEditForm = defineStore("editForm", () => {
  const formResource = ref<any>(null);
  const currentFormId = ref<string | null>(null);
  const selectedField = ref<FormField | null>(null);
  const isUnsaved = computed(() => formResource.value?.isDirty || false);
  const isLoading = computed(() => formResource.value?.loading || false);
  const isPublished = computed(
    () => formResource.value?.doc?.is_published || false,
  );

  const isError = computed(() => formResource.value?.error || false);
  const formData = computed(() => formResource.value?.doc || null);
  const fields = computed(() => {
    return formResource.value?.doc?.fields || [];
  });
  const originalFormData = computed(
    () => formResource.value?.originalDoc || null,
  );

  function initialize(formId: string) {
    if (formId !== currentFormId.value) {
      currentFormId.value = formId;
      formResource.value = createDocumentResource({
        doctype: "Form",
        name: formId,
        transform: (doc: Form) => {
          return {
            ...doc,
            title: doc.title === "Untitled Form" ? "" : doc.title,
          };
        },
      });
    }
  }

  function reload() {
    if (formResource.value) {
      formResource.value.reload();
    }
  }

  function reset() {
    currentFormId.value = null;
    formResource.value = null;
  }

  function save() {
    if (formResource.value) {
      formResource.value.doc.fields.forEach((field: FormField) => {
        if (!field.fieldname || field.fieldname.trim() === "") {
          field.fieldname = scrubFieldname(field.label);
        }
      });

      return formResource.value.setValue.submit(
        {
          title: formResource.value.doc.title,
          fields: formResource.value.doc.fields,
          description: formResource.value.doc.description,
          route: formResource.value.doc.route,
          allow_incomplete: formResource.value.doc.allow_incomplete,
        },
        {
          onSuccess: () => {
            toast.success("Form Updated Successfully");
          },
          onError: (error: any) => {
            toast.error("Failed to Update Form", {
              description: error.message,
            });
          },
        },
      );
    }
    toast.error("No form resource available");
    return Promise.reject(new Error("No form resource available"));
  }

  function saveAndPublish() {
    if (formResource.value) {
      formResource.value.doc.is_published = 1;
      save();
    }
  }

  function togglePublish() {
    if (formResource.value?.doc) {
      formResource.value.setValue.submit(
        {
          is_published: !formResource.value.doc.is_published,
        },
        {
          onSuccess: () => {
            if (formResource.value.doc.is_published) {
              toast.success("Form published successfully");
            } else {
              toast.info("Form unpublished successfully");
            }
          },
          onError: () => {
            toast.error("Failed to publish form");
          },
        },
      );
    }
  }

  function updateFormData(data: Partial<Form>) {
    if (formResource.value?.doc) {
      Object.assign(formResource.value.doc, data);
    }
  }

  function addField(fieldtype: string) {
    if (formResource.value?.doc) {
      const newField: FormField = {
        idx: formResource.value.doc.fields.length + 1,
        fieldtype,
        label: "",
        fieldname: "",
        options: "",
        default: "",
        description: "",
      };

      formResource.value.doc.fields.push(newField);
    }
  }

  function removeField(field: FormField) {
    if (formResource.value?.doc?.fields) {
      formResource.value.doc.fields = formResource.value.doc.fields.filter(
        (f: FormField) => f !== field,
      );
    }
  }

  function selectField(field: FormField | null) {
    selectedField.value = field;
  }

  function updateField(originalField: FormField, updatedField: FormField) {
    if (formResource.value?.doc?.fields) {
      const fieldIndex = formResource.value.doc.fields.findIndex(
        (f: FormField) => f === originalField,
      );
      if (fieldIndex !== -1) {
        formResource.value.doc.fields[fieldIndex] = updatedField;
      }
    }
  }

  return {
    // State
    currentFormId,
    formResource,
    isUnsaved,

    // Computed
    originalFormData,
    isLoading,
    isError,
    formData,
    fields,
    selectedField,
    isPublished,

    // Actions
    initialize,
    reload,
    reset,
    save,
    saveAndPublish,
    togglePublish,
    updateFormData,
    addField,
    selectField,
    updateField,
    removeField,
  };
});
