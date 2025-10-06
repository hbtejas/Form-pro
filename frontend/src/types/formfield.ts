export interface FormField {
  label: string;
  fieldname: string;
  fieldtype: string;
  description?: string;
  reqd?: boolean;
  options?: string;
  default?: string;
  idx?: number;
}
