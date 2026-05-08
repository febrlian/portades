import { useState } from "react";
import { useTemplates, useDeleteTemplate } from "../hooks/useTemplates";
import { FileText, Plus, Edit, Trash2, CheckCircle, XCircle, Eye, X } from "lucide-react";
import { motion } from "motion/react";
import { cn } from "@/shared/lib/utils";
import { TemplateFormModal } from "../components/TemplateFormModal";
import { LetterTemplate } from "../types";

export const TemplateListPage = () => {
  const { data: templates, isLoading } = useTemplates();
  const deleteMutation = useDeleteTemplate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<LetterTemplate | undefined>(undefined);
  const [previewTemplate, setPreviewTemplate] = useState<LetterTemplate | null>(null);

  const generatePreviewContent = (template: LetterTemplate) => {
    let html = template.headerContent ? `<div class="mb-6">${template.headerContent}</div>${template.content}` : template.content;
    template.fields.forEach((field) => {
      const mockValue = `<span class="bg-indigo-100 text-indigo-700 font-medium px-1 rounded">[Sample ${field.label}]</span>`;
      html = html.replace(new RegExp(`{{${field.name}}}`, "g"), mockValue);
    });
    return html;
  };

  const handleCreate = () => {
    setEditingTemplate(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (template: LetterTemplate) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Apakah anda yakin ingin menghapus template ini?")) {
      await deleteMutation.mutateAsync(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Template Surat</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Kelola format dan field surat</p>
        </div>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 dark:shadow-none"
        >
          <Plus size={18} />
          Tambah Template
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
           {[1, 2].map(i => (
             <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse h-32" />
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates?.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col"
            >
              <div className="p-6 flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    template.isActive ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                  )}>
                    <FileText size={20} />
                  </div>
                  <div className={cn(
                    "px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg",
                    template.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
                  )}>
                    {template.isActive ? "Aktif" : "Nonaktif"}
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-1">{template.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4">{template.description}</p>

                <div className="flex flex-wrap gap-2">
                  {template.fields.slice(0, 3).map(field => (
                    <span key={field.id} className="text-xs px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md border border-slate-100 dark:border-slate-700">
                      {field.label}
                    </span>
                  ))}
                  {template.fields.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-md border border-slate-100 dark:border-slate-700">
                      +{template.fields.length - 3} field
                    </span>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 p-4 flex justify-end gap-2 bg-slate-50/50 dark:bg-slate-800/10 rounded-b-2xl">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                  title="Preview Template"
                >
                  <Eye size={18} />
                </button>
                <button
                  onClick={() => handleEdit(template)}
                  className="p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                  title="Edit Template"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  disabled={deleteMutation.isPending}
                  className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                  title="Hapus Template"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </motion.div>
          ))}

          {templates?.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
              <FileText className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
              <p className="text-slate-500 dark:text-slate-400 font-medium">Belum ada template surat.</p>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <TemplateFormModal
          isOpen={isModalOpen}
          initialData={editingTemplate}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {previewTemplate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setPreviewTemplate(null)}
          />
          <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold dark:text-white">Preview Template</h2>
                <p className="text-sm text-slate-500">{previewTemplate.name}</p>
              </div>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <X className="text-slate-400" />
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-12">
              <div
                className="max-w-3xl mx-auto bg-white text-slate-900 p-8 shadow-sm min-h-[500px] print:shadow-none prose max-w-none"
                dangerouslySetInnerHTML={{ __html: generatePreviewContent(previewTemplate) }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
