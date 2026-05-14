import { useState } from "react";
import { fetchCitizenByNIK } from "@/features/citizens/api";
import { useQuery } from "@tanstack/react-query";
import { Search, User, ArrowRight, Loader2, PlusCircle } from "lucide-react";
import { motion } from "motion/react";
import { CitizenFormModal } from "@/features/citizens/components/CitizenFormModal";
import { useCreateCitizen } from "@/features/citizens/hooks/useCitizens";
import { CitizenFormValues } from "@/features/citizens/types/schema";
import { Citizen } from "@/shared/types";
import toast from "react-hot-toast";

export const StepIdentify = ({ onNext }: { onNext: (citizen: Citizen) => void }) => {
  const [nik, setNik] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createMutation = useCreateCitizen();

  const { data: citizen, isFetching, refetch } = useQuery({
    queryKey: ["citizen-lookup", nik],
    queryFn: () => fetchCitizenByNIK(nik),
    enabled: false,
  });

  const isValidNikFormat = (val: string) => {
    if (val.length !== 16) return false;
    if (!/^\d+$/.test(val)) return false;
    const seventh = parseInt(val[6]);
    const ninth = parseInt(val[8]);
    return (seventh !== 8 && seventh !== 9) && (ninth === 0 || ninth === 1);
  };

  const handleSearch = () => {
    if (!isValidNikFormat(nik)) return;
    refetch();
  };

  const onSubmitNewCitizen = async (data: CitizenFormValues) => {
    try {
      const newCitizen = await createMutation.mutateAsync(data);
      setIsModalOpen(false);
      onNext(newCitizen); // Proceed with the newly created citizen
    } catch (error) {
      console.error(error);
      toast.error("Gagal menambahkan warga.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 mb-4">Identifikasi Pemohon</h3>
        <p className="text-sm text-slate-500 mb-6">Masukkan NIK pemohon untuk memulai pengajuan surat.</p>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Masukkan 16 digit NIK..."
              maxLength={16}
              value={nik}
              onChange={(e) => setNik(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={!isValidNikFormat(nik) || isFetching}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {isFetching ? <Loader2 className="animate-spin" size={18} /> : "Cari Warga"}
          </button>
        </div>
      </div>

      {citizen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-sm">
              <User size={24} />
            </div>
            <div>
              <p className="font-bold text-indigo-900">{citizen.fullName}</p>
              <p className="text-sm text-indigo-600">{citizen.nik}</p>
            </div>
          </div>
          <button
            onClick={() => onNext(citizen)}
            className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:shadow-md transition-all"
          >
            Lanjutkan
            <ArrowRight size={16} />
          </button>
        </motion.div>
      )}

      {citizen === null && !isFetching && nik.length === 16 && (
        <div className="p-6 bg-red-50 border border-red-100 rounded-2xl text-center">
          <p className="text-red-700 font-medium">NIK tidak ditemukan dalam database.</p>
          <p className="text-red-500 text-sm mt-1">Pastikan NIK sudah terdaftar di sistem data warga.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 inline-flex items-center gap-2 bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-red-50 transition-all"
          >
            <PlusCircle size={16} />
            Daftarkan Warga Baru
          </button>
        </div>
      )}

      <CitizenFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onSubmitNewCitizen}
        defaultValues={{ nik }}
      />
    </div>
  );
};
