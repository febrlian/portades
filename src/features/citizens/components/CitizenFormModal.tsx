import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { citizenSchema, CitizenFormValues } from "../types/schema";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CitizenFormValues) => Promise<void>;
  defaultValues?: Partial<CitizenFormValues>;
  isEditing?: boolean;
}

export const CitizenFormModal = ({ isOpen, onClose, onSubmit, defaultValues, isEditing }: Props) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CitizenFormValues>({
    resolver: zodResolver(citizenSchema),
    defaultValues: defaultValues || { gender: "L", maritalStatus: "Belum Kawin" }
  });

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
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold dark:text-white">{isEditing ? "Edit Data Warga" : "Tambah Warga Baru"}</h2>
                <p className="text-sm text-slate-500">{isEditing ? "Perbarui informasi warga" : "Lengkapi formulir di bawah ini"}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X className="text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">NIK (16 Digit)</label>
                  <input
                    {...register("nik")}
                    maxLength={16}
                    inputMode="numeric"
                    className={cn("input-base font-mono", errors.nik && "border-red-500")}
                    placeholder="32730..."
                  />
                  {errors.nik && <p className="text-[10px] text-red-500 px-1">{errors.nik.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">Nama Lengkap</label>
                  <input {...register("fullName")} className={cn("input-base", errors.fullName && "border-red-500")} />
                  {errors.fullName && <p className="text-[10px] text-red-500 px-1">{errors.fullName.message}</p>}
                </div>

                <div className="md:col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">Alamat (Jalan/Gang)</label>
                  <textarea {...register("address")} rows={2} className={cn("input-base", errors.address && "border-red-500")} />
                  {errors.address && <p className="text-[10px] text-red-500 px-1">{errors.address.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">RT</label>
                  <input {...register("rt")} placeholder="01" className={cn("input-base", errors.rt && "border-red-500")} />
                  {errors.rt && <p className="text-[10px] text-red-500 px-1">{errors.rt.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">RW</label>
                  <input {...register("rw")} placeholder="01" className={cn("input-base", errors.rw && "border-red-500")} />
                  {errors.rw && <p className="text-[10px] text-red-500 px-1">{errors.rw.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">Jenis Kelamin</label>
                  <select {...register("gender")} className="input-base">
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">Tempat Lahir</label>
                  <input {...register("birthPlace")} className={cn("input-base", errors.birthPlace && "border-red-500")} />
                  {errors.birthPlace && <p className="text-[10px] text-red-500 px-1">{errors.birthPlace.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">Tanggal Lahir</label>
                  <input type="date" {...register("birthDate")} className={cn("input-base", errors.birthDate && "border-red-500")} />
                  {errors.birthDate && <p className="text-[10px] text-red-500 px-1">{errors.birthDate.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">Agama</label>
                  <input {...register("religion")} className={cn("input-base", errors.religion && "border-red-500")} />
                  {errors.religion && <p className="text-[10px] text-red-500 px-1">{errors.religion.message}</p>}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">Pekerjaan</label>
                  <input {...register("occupation")} className={cn("input-base", errors.occupation && "border-red-500")} />
                  {errors.occupation && <p className="text-[10px] text-red-500 px-1">{errors.occupation.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">Status Marital</label>
                  <select {...register("maritalStatus")} className={cn("input-base", errors.maritalStatus && "border-red-500")}>
                    <option value="Belum Kawin">Belum Kawin</option>
                    <option value="Kawin">Kawin</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
                  {errors.maritalStatus && <p className="text-[10px] text-red-500 px-1">{errors.maritalStatus.message}</p>}
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 dark:shadow-none flex items-center justify-center gap-2"
                >
                  {isSubmitting && <Loader2 className="animate-spin" size={18} />}
                  {isSubmitting ? "Menyimpan..." : "Simpan Data"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
