import React, { useState, useEffect } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2, Plus, Trash2, GripVertical, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, Type, Image as ImageIcon, FileText } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useCreateTemplate, useUpdateTemplate } from "../hooks/useTemplates";
import { LetterTemplate, TemplateField } from "../types";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import UnderlineExtension from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';

const templateSchema = z.object({
  name: z.string().min(3, "Nama template wajib diisi"),
  description: z.string().min(5, "Deskripsi wajib diisi"),
  headerContent: z.string().min(10, "Kop surat wajib diisi"),
  content: z.string().min(10, "Template / redaksi surat wajib diisi"),
  isActive: z.enum(["true", "false"]),
  fields: z.array(z.object({
    id: z.string(),
    name: z.string().min(2, "Key wajib diisi"),
    label: z.string().min(2, "Label wajib diisi"),
    type: z.enum(["text", "number", "date", "textarea", "select"]),
    required: z.enum(["true", "false"]),
    options: z.string().optional(),
  })).min(1, "Minimal 1 field"),
});

type TemplateFormValues = z.infer<typeof templateSchema>;

const TiptapEditor = ({ value, onChange, placeholder }: { value: string; onChange: (val: string) => void; placeholder?: string }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      UnderlineExtension,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Ketik di sini...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
      <div className="flex flex-wrap items-center gap-1 p-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700", editor.isActive('bold') && "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40")}>
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700", editor.isActive('italic') && "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40")}>
          <Italic size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700", editor.isActive('underline') && "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40")}>
          <Underline size={16} />
        </button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700", editor.isActive({ textAlign: 'left' }) && "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40")}>
          <AlignLeft size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700", editor.isActive({ textAlign: 'center' }) && "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40")}>
          <AlignCenter size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700", editor.isActive({ textAlign: 'right' }) && "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40")}>
          <AlignRight size={16} />
        </button>
        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700", editor.isActive('bulletList') && "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40")}>
          <List size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={cn("p-2 rounded hover:bg-slate-200 dark:hover:bg-slate-700", editor.isActive('heading', { level: 3 }) && "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40")}>
          <Type size={16} />
        </button>
      </div>
      <EditorContent editor={editor} className="p-4 min-h-[150px] focus:outline-none prose dark:prose-invert max-w-none" />
    </div>
  );
};

export const TemplateFormModal = ({
  isOpen,
  onClose,
  initialData
}: {
  isOpen: boolean;
  onClose: () => void;
  initialData?: LetterTemplate;
}) => {
  const [activeTab, setActiveTab] = useState<"info" | "header" | "content">("info");
  const createMutation = useCreateTemplate();
  const updateMutation = useUpdateTemplate();

  const { register, control, handleSubmit, watch, setValue, formState: { errors } } = useForm<TemplateFormValues>({
    resolver: zodResolver(templateSchema),
    defaultValues: initialData ? {
      name: initialData.name,
      description: initialData.description,
      headerContent: initialData.headerContent || "",
      content: initialData.content || "",
      isActive: initialData.isActive ? "true" : "false",
      fields: initialData.fields.map(f => ({
        ...f,
        required: f.required ? "true" : "false",
        options: f.options ? f.options.join(", ") : undefined
      }))
    } : {
      name: "",
      description: "",
      headerContent: `<div style="display: flex; align-items: center; border-bottom: 2px solid black; padding-bottom: 8px; margin-bottom: 16px;">
  <div style="margin-right: 16px; font-weight: bold; border: 1px solid #ccc; padding: 10px;">LOGO</div>
  <div style="flex: 1; text-align: center;">
    <h3 style="margin: 0; font-size: 18px; font-weight: bold;">PEMERINTAH KABUPATEN INDONESIA</h3>
    <h2 style="margin: 0; font-size: 20px; font-weight: bold;">KECAMATAN MAJU TERUS</h2>
    <h1 style="margin: 0; font-size: 22px; font-weight: bold;">DESA DIGITAL SEJAHTERA</h1>
    <p style="margin: 0; font-size: 12px;">Jl. Raya Utama No. 1, Desa Digital, Kec. Maju Terus, Kab. Indonesia</p>
  </div>
</div>`,
      content: `<div style="text-align: center; margin-bottom: 24px;">\n  <h3 style="font-weight: bold; text-decoration: underline;">JUDUL SURAT</h3>\n  <p>Nomor: _________</p>\n</div>\n<p>Yang bertanda tangan di bawah ini:</p>\n<table style="width: 100%; margin: 16px 0;">\n  <tr><td style="width: 150px;">Nama</td><td>: {{fullName}}</td></tr>\n  <tr><td>NIK</td><td>: {{nik}}</td></tr>\n</table>\n<p>Isi surat...</p>`,
      isActive: "true",
      fields: [{ id: `f-${Date.now()}`, name: "", label: "", type: "text", required: "true" }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "fields",
  });

  const headerContentWatch = watch("headerContent");
  const contentWatch = watch("content");
  const customFieldsWatch = watch("fields");

  const isPending = createMutation.isPending || updateMutation.isPending;

  const insertVariable = (variable: string) => {
    // Basic insertion logic - we could improve this to insert at cursor if possible with Tiptap
    // but for simplicity we current add it at the end or tell user to copy paste
  };

  const onSubmit = async (data: TemplateFormValues) => {
    try {
      const formattedData = {
        name: data.name,
        description: data.description,
        headerContent: data.headerContent,
        content: data.content,
        isActive: data.isActive === "true",
        fields: data.fields.map(f => ({
          ...f,
          required: f.required === "true",
          options: f.options ? f.options.split(",").map(s => s.trim()).filter(Boolean) : undefined
        })) as TemplateField[]
      };

      if (initialData) {
        await updateMutation.mutateAsync({ id: initialData.id, data: formattedData });
      } else {
        await createMutation.mutateAsync(formattedData);
      }
      onClose();
    } catch (error) {
      console.error(error);
      alert("Terjadi kesalahan");
    }
  };

  const citizenVariables = [
    { label: "Nama Lengkap", key: "fullName" },
    { label: "NIK", key: "nik" },
    { label: "Pekerjaan", key: "occupation" },
    { label: "Alamat", key: "address" },
    { label: "RT/RW", key: "rt_rw" },
    { label: "Tempat Lahir", key: "placeOfBirth" },
    { label: "Tanggal Lahir", key: "dateOfBirth" },
    { label: "Alasan", key: "reason" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 shrink-0">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                     <FileText size={20} />
                   </div>
                   <h2 className="text-xl font-black dark:text-white uppercase tracking-tight">{initialData ? "Edit Template Surat" : "Buat Template Surat Baru"}</h2>
                </div>
                <div className="flex gap-6 mt-2 border-b border-slate-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab("info")}
                    className={cn(
                      "pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2",
                      activeTab === "info" ? "text-indigo-600 border-indigo-600" : "text-slate-500 border-transparent hover:text-slate-700"
                    )}
                  >
                    1. Info & Field
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("header")}
                    className={cn(
                      "pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2",
                      activeTab === "header" ? "text-indigo-600 border-indigo-600" : "text-slate-500 border-transparent hover:text-slate-700"
                    )}
                  >
                    2. Kop Surat (Header)
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("content")}
                    className={cn(
                      "pb-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2",
                      activeTab === "content" ? "text-indigo-600 border-indigo-600" : "text-slate-500 border-transparent hover:text-slate-700"
                    )}
                  >
                    3. Redaksi Surat
                  </button>
                </div>
              </div>
              <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors self-start">
                <X className="text-slate-400" size={24} />
              </button>
            </div>

            <form id="template-form" onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-6 md:p-10 space-y-8 flex-1">
              {activeTab === "info" && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-10">
                  <div className="space-y-6">
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-6">Informasi Dasar</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Nama Surat</label>
                          <input {...register("name")} className={cn("input-base", errors.name && "border-red-500")} placeholder="Cth: Surat Keterangan Usaha" />
                          {errors.name && <p className="text-[10px] text-red-500 px-1">{errors.name.message}</p>}
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Status Aktif</label>
                          <select {...register("isActive")} className="input-base">
                            <option value="true">Aktif (Tersedia untuk Operator)</option>
                            <option value="false">Nonaktif (Sembunyikan)</option>
                          </select>
                        </div>
                        <div className="space-y-1 md:col-span-2">
                          <label className="text-[10px] font-black uppercase text-slate-400 px-1 tracking-widest">Deskripsi Template</label>
                          <textarea {...register("description")} rows={2} className={cn("input-base", errors.description && "border-red-500")} placeholder="Berikan penjelasan singkat mengenai kegunaan surat ini..." />
                          {errors.description && <p className="text-[10px] text-red-500 px-1">{errors.description.message}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Field Kustom Pengajuan</h3>
                      <button
                        type="button"
                        onClick={() => append({ id: `f-${Date.now()}`, name: "", label: "", type: "text", required: "true" })}
                        className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 bg-indigo-50 dark:bg-indigo-900/30 px-4 py-2 rounded-xl transition-all"
                      >
                        <Plus size={14} /> Tambah Field Baru
                      </button>
                    </div>

                    <div className="space-y-4">
                      {fields.map((field, index) => (
                        <div key={field.id} className="group p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-6 items-start hover:shadow-lg transition-all border-l-4 border-l-indigo-500">
                          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-tighter">Label Pertanyaan</label>
                              <input {...register(`fields.${index}.label`)} className="w-full text-sm font-bold px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg focus:outline-none border-transparent focus:border-indigo-500" placeholder="E.g. Nama Usaha" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-tighter">Key Var ({"{{"}...{"}}"})</label>
                              <input {...register(`fields.${index}.name`)} className="w-full text-sm font-mono px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg focus:outline-none border-transparent focus:border-indigo-500" placeholder="businessName" />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-tighter">Tipe Input</label>
                              <select {...register(`fields.${index}.type`)} className="w-full text-sm font-bold px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg focus:outline-none border-transparent focus:border-indigo-500">
                                <option value="text">Baris Teks</option>
                                <option value="number">Angka</option>
                                <option value="date">Tanggal</option>
                                <option value="textarea">Paragraf</option>
                                <option value="select">Pilihan (Dropdown)</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] font-bold uppercase text-slate-500 tracking-tighter">Wajib Isi?</label>
                              <select {...register(`fields.${index}.required`)} className="w-full text-sm font-bold px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg focus:outline-none border-transparent focus:border-indigo-500">
                                <option value="true">Ya</option>
                                <option value="false">Tidak</option>
                              </select>
                            </div>
                            <div className="space-y-1">
                               <label className="text-[10px] font-bold uppercase text-slate-500 tracking-tighter">Opsi (Pisah Koma)</label>
                               <input {...register(`fields.${index}.options`)} className="w-full text-sm px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg focus:outline-none border-transparent focus:border-indigo-500 disabled:opacity-50" disabled={watch(`fields.${index}.type`) !== "select"} placeholder="Opsional..." />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            disabled={fields.length === 1}
                            className="mt-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-colors disabled:opacity-0"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      ))}
                      {errors.fields && <p className="text-xs text-red-500">{errors.fields.message}</p>}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "header" && (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                  <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl border border-slate-800 mb-6">
                    <h4 className="text-sm font-black uppercase text-indigo-400 mb-2">Desain Kop Surat (Header)</h4>
                    <p className="text-xs">Rancang bagian atas surat di sini. Kop surat ini akan muncul di setiap pengajuan surat menggunakan template ini.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-12">
                      <Controller
                        name="headerContent"
                        control={control}
                        render={({ field }) => (
                          <TiptapEditor
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Desain Kop Surat di sini..."
                          />
                        )}
                      />
                      {errors.headerContent && <p className="text-xs text-red-500 mt-2">{errors.headerContent.message}</p>}
                    </div>

                    <div className="lg:col-span-12">
                      <h4 className="text-[10px] font-black uppercase text-slate-500 mb-4 tracking-widest px-1">Live Preview Kop Surat</h4>
                      <div className="p-10 bg-white border-2 border-dashed border-slate-200 rounded-2xl min-h-[150px]">
                        <div dangerouslySetInnerHTML={{ __html: headerContentWatch }} className="print-preview" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "content" && (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-full space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                    {/* Left side: Variables helper */}
                    <div className="lg:col-span-3 space-y-6">
                      <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                        <h4 className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 mb-4 tracking-widest">Variabel Warga</h4>
                        <div className="space-y-1.5">
                          {citizenVariables.map(v => (
                            <button
                              key={v.key}
                              type="button"
                              onClick={() => {
                                // Variable insertion logic is complex with Tiptap,
                                // usually we'd add it to a sidebar for user to copy
                                navigator.clipboard.writeText(`{{${v.key}}}`);
                              }}
                              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-lg hover:border-indigo-500 border border-transparent shadow-sm transition-all text-left"
                            >
                              <span>{v.label}</span>
                              <code className="text-indigo-600 dark:text-indigo-400">{"{{"}{v.key}{"}}"}</code>
                            </button>
                          ))}
                        </div>

                        <h4 className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 mt-8 mb-4 tracking-widest">Variabel Field Baru</h4>
                        <div className="space-y-1.5">
                          {customFieldsWatch?.map((f: any) => f.name && (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => navigator.clipboard.writeText(`{{${f.name}}}`)}
                              className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 rounded-lg hover:border-indigo-500 border border-transparent shadow-sm transition-all text-left"
                            >
                              <span className="truncate">{f.label || "Field"}</span>
                              <code className="text-indigo-600 dark:text-indigo-400">{"{{"}{f.name}{"}}"}</code>
                            </button>
                          ))}
                          {(!customFieldsWatch || customFieldsWatch.filter((f: any) => f.name).length === 0) && (
                            <p className="text-[10px] text-slate-400 italic">Belum ada field kustom.</p>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-6 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                          * Klik variabel untuk menyalin kode, lalu paste di editor.
                        </p>
                      </div>
                    </div>

                    {/* Right side: Editor */}
                    <div className="lg:col-span-9 space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1">Redaksi / Paragraf Surat</label>
                        <Controller
                          name="content"
                          control={control}
                          render={({ field }) => (
                            <TiptapEditor
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Ketik isi surat di sini..."
                            />
                          )}
                        />
                        {errors.content && <p className="text-xs text-red-500">{errors.content.message}</p>}
                      </div>

                      <div className="space-y-4 pt-6 mt-10 border-t border-slate-100 dark:border-slate-800">
                        <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Preview Akhir (Kasar)</h4>
                        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-3xl min-h-[500px] flex justify-center">
                          <div className="w-[21cm] p-[2cm] bg-white text-black shadow-2xl rounded-sm print-preview overflow-hidden scale-90 origin-top transform">
                            <div dangerouslySetInnerHTML={{ __html: headerContentWatch }} className="mb-8" />
                            <div dangerouslySetInnerHTML={{ __html: contentWatch }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </form>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex gap-4 shrink-0 bg-slate-50/50 dark:bg-slate-800/10 rounded-b-3xl">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-4 border border-slate-200 dark:border-slate-700 rounded-2xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Batal
              </button>
              <button
                form="template-form"
                type="submit"
                disabled={isPending}
                className="flex-1 px-4 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-xl shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending && <Loader2 className="animate-spin" size={18} />}
                {isPending ? "Menyimpan Template..." : "Simpan & Publikasikan Template"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
