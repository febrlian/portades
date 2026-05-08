import React, { useState, useEffect } from "react";
import { StepIdentify } from "./steps/StepIdentify";
import { motion, AnimatePresence } from "motion/react";
import { FileText, CheckCircle, ArrowLeft, Loader2, Printer } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useForm } from "react-hook-form";
import { useTemplates } from "@/features/templates/hooks/useTemplates";
import { LetterTemplate } from "@/features/templates/types";

const steps = ["Identifikasi", "Isi Formulir", "Review", "Selesai"];

export const LetterCreationWizard = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [citizen, setCitizen] = useState<any>(null);
  const { data: templates = [], isLoading: isLoadingTemplates } = useTemplates();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<any>({
    defaultValues: {
      purpose: "",
      dynamicData: {}
    }
  });

  const selectedTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  useEffect(() => {
    if (templates.length > 0 && !selectedTemplateId) {
      setSelectedTemplateId(templates[0].id);
      setValue("letterType", templates[0].name);
    }
  }, [templates, selectedTemplateId, setValue]);

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const template = templates.find(t => t.id === e.target.value);
    if (template) {
      setSelectedTemplateId(template.id);
      setValue("letterType", template.name);
      setValue("dynamicData", {}); // Reset dynamic data on template change
    }
  };

  const dynamicDataWatch = watch("dynamicData");

  const handleCitizenFound = (data: any) => {
    setCitizen(data);
    setCurrentStep(1);
  };

  const onFormSubmit = (data: any) => {
    console.log("Form Data:", data);
    setCurrentStep(2);
  };

  const renderTemplateContent = () => {
    if (!selectedTemplate?.content) return "";
    let headerHtml = selectedTemplate.headerContent || "";
    let bodyHtml = selectedTemplate.content;

    const replaceVars = (html: string) => {
      let result = html;
      // Replace citizen data
      if (citizen) {
        const citizenMap: Record<string, any> = {
          fullName: citizen.fullName,
          nik: citizen.nik,
          nokk: citizen.nokk,
          address: citizen.address,
          placeOfBirth: citizen.placeOfBirth,
          dateOfBirth: citizen.dateOfBirth,
          gender: citizen.gender === 'L' ? 'Laki-laki' : 'Perempuan',
          religion: citizen.religion,
          occupation: citizen.occupation,
          rt: citizen.rt,
          rw: citizen.rw,
          rt_rw: `RT. ${citizen.rt} / RW. ${citizen.rw}`,
        };

        Object.keys(citizenMap).forEach(key => {
          result = result.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), citizenMap[key] || '');
        });
      }

      // Replace form data
      const purpose = watch("purpose");
      result = result.replace(new RegExp(`{{\\s*reason\\s*}}`, 'g'), purpose || '');

      if (dynamicDataWatch && selectedTemplate.fields) {
        selectedTemplate.fields.forEach(field => {
          const val = dynamicDataWatch[field.name] || '';
          result = result.replace(new RegExp(`{{\\s*${field.name}\\s*}}`, 'g'), val);
        });
      }
      return result;
    };

    return `
      <div class="letter-header">${replaceVars(headerHtml)}</div>
      <div class="letter-body">${replaceVars(bodyHtml)}</div>
    `;
  };

  if (isLoadingTemplates) {
    return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-500" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3 dark:text-white">
          <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg dark:bg-indigo-900/30 dark:text-indigo-400">
            <FileText size={24} />
          </div>
          Pengajuan Surat Baru
        </h1>
        <p className="text-slate-500 text-sm mt-1 ml-12 dark:text-slate-400">Pilih warga dan lengkapi data pengajuan berdasarkan template</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between mb-12 px-4">
        {steps.map((label, index) => (
          <div key={label} className="flex flex-col items-center relative flex-1">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10",
              currentStep >= index ? "bg-indigo-600 text-white" : "bg-slate-200 text-slate-500 dark:bg-slate-800"
            )}>
              {currentStep > index ? <CheckCircle size={20} /> : <span className="text-sm font-bold">{index + 1}</span>}
            </div>
            <span className={cn(
              "text-[10px] uppercase tracking-wider font-bold mt-2 text-center",
              currentStep >= index ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-slate-500"
            )}>
              {label}
            </span>
            {index < steps.length - 1 && (
              <div className={cn(
                "absolute h-1 top-5 left-1/2 w-full -z-0",
                currentStep > index ? "bg-indigo-600" : "bg-slate-200 dark:bg-slate-800"
              )} />
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {currentStep === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <StepIdentify onNext={handleCitizenFound} />
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <form onSubmit={handleSubmit(onFormSubmit)} className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
               <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Detail Pengajuan</h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(0)}
                  className="text-indigo-600 dark:text-indigo-400 text-sm font-bold flex items-center gap-1 hover:text-indigo-700 transition-colors"
                >
                  <ArrowLeft size={14} /> Ganti Warga
                </button>
               </div>

               <div className="space-y-6">
                 <div>
                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pilih Template Surat</label>
                   <select
                    value={selectedTemplateId}
                    onChange={handleTemplateChange}
                    className="w-full mt-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                   >
                     {templates.filter(t => t.isActive).map(t => (
                       <option key={t.id} value={t.id}>{t.name}</option>
                     ))}
                   </select>
                 </div>

                 {/* Dynamic Fields */}
                 {selectedTemplate?.fields?.length > 0 && (
                   <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                     <h4 className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Field Khusus: {selectedTemplate.name}</h4>
                     {selectedTemplate.fields.map(field => (
                       <div key={field.id}>
                         <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                           {field.label} {field.required && <span className="text-red-500">*</span>}
                         </label>

                         {field.type === "textarea" ? (
                           <textarea
                             {...register(`dynamicData.${field.name}`, { required: field.required })}
                             className="w-full mt-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                           />
                         ) : field.type === "select" ? (
                           <select
                             {...register(`dynamicData.${field.name}`, { required: field.required })}
                             className="w-full mt-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                           >
                             <option value="">Pilih opsi...</option>
                             {field.options?.map(opt => (
                               <option key={opt} value={opt}>{opt}</option>
                             ))}
                           </select>
                         ) : (
                           <input
                             type={field.type}
                             {...register(`dynamicData.${field.name}`, { required: field.required })}
                             className="w-full mt-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                           />
                         )}
                       </div>
                     ))}
                   </motion.div>
                 )}

                 <div>
                   <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Keperluan / Keterangan Tambahan</label>
                   <textarea
                     {...register("purpose", { required: "Keperluan wajib diisi" })}
                     rows={3}
                     placeholder="Contoh: Mengajukan kredit bank atau syarat melamar kerja"
                     className="w-full mt-1 px-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                   />
                   {errors.purpose && <p className="text-xs text-red-500 mt-1">{String(errors.purpose.message)}</p>}
                 </div>

                 <div className="pt-4">
                   <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 dark:shadow-none"
                   >
                     Review Pengajuan & Cetak
                   </button>
                 </div>
               </div>
            </form>
          </motion.div>
        )}

        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
             <div className="lg:col-span-4 space-y-6">
               <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                 <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Ringkasan</h3>
                 <div className="space-y-4 text-sm">
                   <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                     <span className="text-slate-500">Nama Pemohon</span>
                     <span className="font-bold text-slate-900 dark:text-white">{citizen?.fullName}</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                     <span className="text-slate-500">NIK</span>
                     <span className="font-mono text-slate-900 dark:text-white">{citizen?.nik}</span>
                   </div>
                   <div className="flex justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                     <span className="text-slate-500">Template</span>
                     <span className="font-bold text-indigo-600 dark:text-indigo-400">{selectedTemplate?.name}</span>
                   </div>
                 </div>

                 <div className="mt-8 flex flex-col gap-3">
                   <button
                    onClick={() => {
                      window.print();
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none"
                   >
                     <Printer size={18} /> Cetak Langsung
                   </button>
                   <button
                    onClick={() => setCurrentStep(3)}
                    className="w-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                   >
                     Simpan & Selesai
                   </button>
                   <button
                    onClick={() => setCurrentStep(1)}
                    className="w-full border border-slate-200 dark:border-slate-700 py-3 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                   >
                     Kembali Edit
                   </button>
                 </div>
               </div>
             </div>

             <div className="lg:col-span-8">
               <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 md:p-12 min-h-[A4] text-black">
                 {/* This wrapper ensures printing styles */}
                 <div
                   className="print-preview"
                   dangerouslySetInnerHTML={{ __html: renderTemplateContent() }}
                 />
               </div>
             </div>
          </motion.div>
        )}

        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 px-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className="w-20 h-20 bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Pengajuan Berhasil Disimpan!</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Nomor pengajuan Anda: <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">REQ-{(new Date()).getFullYear()}-{Math.floor(Math.random()*1000).toString().padStart(4, '0')}</span></p>
            <p className="text-sm text-slate-400 mt-1">Anda dapat memantau status pengajuan di menu Arsip.</p>

            <button
              onClick={() => window.location.href = "/"}
              className="mt-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-all"
            >
              Kembali ke Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
