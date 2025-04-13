export interface FormField {
  name: string;
  label: string;
  type: "text" | "number" | "select";
  required: boolean;
  options?: string[];
}

export type FormData = {
  [key: string]: string | number;
};
