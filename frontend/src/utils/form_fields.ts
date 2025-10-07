import {
  Checkbox,
  FormControl,
  DatePicker,
  DateRangePicker,
  DateTimePicker,
  FileUploader,
  Rating,
  Select,
  Switch,
  Textarea,
  TextEditor,
  TimePicker,
  Password,
} from "frappe-ui";

// Individual form field components as dictionaries
export const DataField = {
  component: FormControl,
  props: { type: "text" },
};

export const NumberField = {
  component: FormControl,
  props: { type: "number" },
};

export const EmailField = {
  component: FormControl,
  props: { type: "email" },
};

export const DateField = {
  component: DatePicker,
  props: {},
};

export const DateTimeField = {
  component: DateTimePicker,
  props: {},
};

export const DateRangeField = {
  component: DateRangePicker,
  props: {},
};

export const TimeField = {
  component: TimePicker,
  props: {},
};

export const PasswordField = {
  component: Password,
  props: {},
};

export const RatingField = {
  component: Rating,
  props: {},
};

export const SelectField = {
  component: Select,
};

export const SwitchField = {
  component: Switch,
  props: {},
};

export const TextareaField = {
  component: Textarea,
  props: {},
};

export const TextEditorField = {
  component: TextEditor,
  props: {},
};

export const CheckboxField = {
  component: Checkbox,
  props: {},
};

export const formFields = [
  { name: "Data", ...DataField },
  { name: "Number", ...NumberField },
  { name: "Email", ...EmailField },
  { name: "Date", ...DateField },
  { name: "Date Time", ...DateTimeField },
  { name: "Date Range", ...DateRangeField },
  { name: "Time Picker", ...TimeField },
  { name: "Password", ...PasswordField },
  { name: "Rating", ...RatingField },
  { name: "Select", ...SelectField },
  { name: "Switch", ...SwitchField },
  { name: "Textarea", ...TextareaField },
  { name: "Text Editor", ...TextEditorField },
  { name: "Checkbox", ...CheckboxField },
];

export const mapDoctypeFieldForForm = (fieldtype: string): string => {
  const FIELD_TYPE_MAP = {
    Autocomplete: "Data",
    Attach: "File Uploader",
    "Attach Image": "File Uploader",
    Barcode: "Barcode",
    Button: "Button",
    Check: "Checkbox",
    Code: "Code",
    Color: "Color",
    "Column Break": "Column Break",
    Currency: "Number",
    Data: "Data",
    Date: "Date",
    Datetime: "Date Time",
    Duration: "Duration",
    "Dynamic Link": "Dynamic Link",
    Float: "Number",
    Fold: "Fold",
    Geolocation: "Geolocation",
    Heading: "Heading",
    HTML: "HTML",
    "HTML Editor": "Text Editor",
    Icon: "Icon",
    Image: "Image",
    Int: "Number",
    JSON: "JSON",
    Link: "Link",
    "Long Text": "Textarea",
    "Markdown Editor": "Text Editor",
    Password: "Password",
    Percent: "Number",
    Phone: "Phone",
    "Read Only": "Read Only",
    Rating: "Rating",
    "Section Break": "Section Break",
    Select: "Select",
    Signature: "Signature",
    "Small Text": "Textarea",
    "Tab Break": "Tab Break",
    Table: "Table",
    "Table MultiSelect": "Table MultiSelect",
    Text: "Textarea",
    "Text Editor": "Text Editor",
    Time: "Time",
  };

  return FIELD_TYPE_MAP[fieldtype as keyof typeof FIELD_TYPE_MAP];
};
