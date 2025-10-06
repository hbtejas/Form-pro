import { FormField } from "./formfield";

export interface Form {
  name: string;
  title: string;
  description?: string;
  fields?: FormField[];
  [key: string]: any;
}
