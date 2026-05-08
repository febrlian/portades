export interface TemplateField {
  id: string;
  name: string; // internal key (e.g. businessName)
  label: string; // Display label (e.g. Nama Usaha)
  type: "text" | "number" | "date" | "textarea" | "select";
  required: boolean;
  options?: string[]; // for select
}

export interface LetterTemplate {
  id: string;
  name: string; // e.g. Surat Keterangan Usaha
  description: string;
  headerContent: string; // Content for Kop Surat
  content: string; // The rich text/body of the letter
  fields: TemplateField[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
