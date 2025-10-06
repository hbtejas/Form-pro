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
];
