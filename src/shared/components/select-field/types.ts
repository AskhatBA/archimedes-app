export interface SelectFieldOption {
  value: string;
  label: string;
  subtitle?: string;
}

export interface SelectFieldSection {
  title: string;
  options: SelectFieldOption[];
}
