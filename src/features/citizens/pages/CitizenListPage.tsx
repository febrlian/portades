import React, { useState } from "react";
import { useCitizens, useCreateCitizen, useUpdateCitizen } from "../hooks/useCitizens";
import { fetchLettersByCitizenId } from "../../letters/api";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, User, Plus, Filter, X, Loader2, Edit, FileText } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";
import { CitizenFormValues } from "../types/schema";
import { useAuthStore } from "@/shared/store/auth";
import { CitizenFormModal } from "../components/CitizenFormModal";
import { fetchCitizenByNIK } from "../api";

export const CitizenListPage = () => {
  const { user } = useAuthStore();
  const canModifyCitizens = user?.role === "admin" || user?.role === "operator";

  const [search, setSearch] = useState("");
  const [searchNik, setSearchNik] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({ rt: "", rw: "", birthDateStart: "", birthDateEnd: "" });
  const [editingCitizenId, setEditingCitizenId] = useState<string | null>(null);
  const [selectedCitizenForLetters, setSelectedCitizenForLetters] = useState<string | null>(null);
  const [modalInitialData, setModalInitialData] = useState<Partial<CitizenFormValues> | undefined>();

  const { data: citizens, isLoading } = useCitizens({ search, nik: searchNik, ...filters });
  const createMutation = useCreateCitizen();
  const updateMutation = useUpdateCitizen();

  const { data: letters, isLoading: isLettersLoading } = useQuery({
    queryKey: ["citizen-letters", selectedCitizenForLetters],
    queryFn: () => fetchLettersByCitizenId(selectedCitizenForLetters!),
    enabled: !!selectedCitizenForLetters,
  });

  const onSubmit = async (data: CitizenFormValues) => {
    // Check NIK uniqueness
    if (data.nik) {
      const existing = await fetchCitizenByNIK(data.nik);
      if (existing && existing.id !== editingCitizenId) {
        alert("NIK sudah terdaftar");
        return;
      }
    }

    try {
      if (editingCitizenId) {
        await updateMutation.mutateAsync({ id: editingCitizenId, data });
      } else {
        await createMutation.mutateAsync(data);
      }
      setIsModalOpen(false);
      setEditingCitizenId(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (e: React.MouseEvent, citizen: any) => {
    e.stopPropagation();
    setEditingCitizenId(citizen.id);
    setModalInitialData({
      nik: citizen.nik,
      fullName: citizen.fullName,
      address: citizen.address,
      rt: citizen.rt,
      rw: citizen.rw,
      gender: citizen.gender,
      birthPlace: citizen.birthPlace,
      birthDate: citizen.birthDate,
      religion: citizen.religion,
      occupation: citizen.occupation,
      maritalStatus: citizen.maritalStatus,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingCitizenId(null);
    setModalInitialData(undefined);
    setIsModalOpen(true);
  };

  const CitizenSkeleton = () => (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse">
      <div className="flex justify-between mb-4">
        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800" />
        <div className="w-20 h-6 bg-slate-100 dark:bg-slate-800 rounded" />
      </div>
      <div className="h-6 w-3/4 bg-slate-100 dark:bg-slate-800 rounded mb-2" />
      <div className="h-4 w-1/2 bg-slate-100 dark:bg-slate-800 rounded mb-4" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded" />
        <div className="h-8 w-full bg-slate-50 dark:bg-slate-800 rounded" />
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Data Warga</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Kelola data penduduk desa</p>
        </div>
        {canModifyCitizens && (
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 dark:shadow-none"
          >
            <Plus size={18} />
            Tambah Warga
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari Nama Lengkap..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white dark:bg-slate-900 dark:text-white"
            />
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari NIK..."
              value={searchNik}
              onChange={(e) => setSearchNik(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={cn(
            "flex items-center gap-2 px-4 py-3 border rounded-xl font-medium transition-colors",
            isFilterOpen
              ? "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400"
              : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50"
          )}
        >
          <Filter size={18} />
          Filter
        </button>
      </div>

      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl mb-6 shadow-sm"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1 md:col-span-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">RT</label>
                <input
                  type="text"
                  placeholder="01"
                  value={filters.rt}
                  onChange={(e) => setFilters(prev => ({ ...prev, rt: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1 md:col-span-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">RW</label>
                <input
                  type="text"
                  placeholder="01"
                  value={filters.rw}
                  onChange={(e) => setFilters(prev => ({ ...prev, rw: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1 md:col-span-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tanggal Lahir (Dari)</label>
                <input
                  type="date"
                  value={filters.birthDateStart}
                  onChange={(e) => setFilters(prev => ({ ...prev, birthDateStart: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="space-y-1 md:col-span-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Tanggal Lahir (Sampai)</label>
                <input
                  type="date"
                  value={filters.birthDateEnd}
                  onChange={(e) => setFilters(prev => ({ ...prev, birthDateEnd: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
              <div className="flex md:col-span-4 justify-end">
                <button
                  onClick={() => {
                    setFilters({ rt: "", rw: "", birthDateStart: "", birthDateEnd: "" });
                    setSearch("");
                    setSearchNik("");
                  }}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <CitizenSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {citizens?.map((citizen) => (
            <motion.div
              key={citizen.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -4, scale: 1.02 }}
              onClick={() => setSelectedCitizenForLetters(citizen.id)}
              className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900 transition-colors">
                  <User size={24} />
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider",
                    citizen.gender === 'L' ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" : "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400"
                  )}>
                    {citizen.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </span>
                  {canModifyCitizens && (
                    <button
                      onClick={(e) => handleEditClick(e, citizen)}
                      className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                  )}
                </div>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white truncate">{citizen.fullName}</h3>
              <p className="text-xs font-mono text-slate-400 dark:text-slate-500 mt-1">{citizen.nik}</p>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <MapPin size={14} className="text-slate-400" />
                  <span className="truncate">{citizen.address}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500 font-medium bg-slate-50 dark:bg-slate-800 p-2 rounded-lg">
                  <div>RT {citizen.rt}</div>
                  <div>RW {citizen.rw}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Citizen Modal */}
      <CitizenFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={onSubmit}
        defaultValues={modalInitialData}
        isEditing={!!editingCitizenId}
      />

      {/* Citizen Letters Modal */}
      <AnimatePresence>
        {selectedCitizenForLetters && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCitizenForLetters(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-6 md:p-8 max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold dark:text-white">Riwayat Pengajuan Surat</h2>
                  <p className="text-sm text-slate-500">Daftar surat yang diajukan oleh warga ini</p>
                </div>
                <button onClick={() => setSelectedCitizenForLetters(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <X className="text-slate-400" />
                </button>
              </div>

              <div className="flex-1 overflow-auto -mx-6 px-6">
                {isLettersLoading ? (
                  <div className="flex justify-center p-8">
                    <Loader2 className="animate-spin text-indigo-600" size={32} />
                  </div>
                ) : letters && letters.length > 0 ? (
                  <div className="space-y-4 pb-4">
                    {letters.map((letter) => (
                      <div key={letter.id} className="flex items-start gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                        <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 flex items-center justify-center text-indigo-600 shrink-0">
                          <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-900 dark:text-white truncate">{letter.type}</h4>
                          <p className="text-xs text-slate-500 mt-1">Diajukan pada {new Date(letter.createdAt).toLocaleDateString('id-ID')}</p>
                        </div>
                        <div className={cn(
                          "px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg shrink-0",
                          letter.status === "pending" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                          letter.status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                          "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                          {letter.status}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <FileText className="mx-auto text-slate-300 dark:text-slate-700 mb-3" size={48} />
                    <p className="text-slate-500 font-medium">Belum ada riwayat pengajuan surat</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
