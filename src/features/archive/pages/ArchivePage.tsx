import { useState } from "react";
import { useLetters } from "../../letters/hooks/useLetters";
import { useCitizens } from "../../citizens/hooks/useCitizens";
import { Search, Filter, FileText, CheckCircle, XCircle, Clock, Archive, ChevronDown, ChevronUp, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/shared/lib/utils";

export const ArchivePage = () => {
  const { data: letters, isLoading: isLettersLoading } = useLetters();
  const { data: citizens, isLoading: isCitizensLoading } = useCitizens({});
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, completed, rejected
  const [expandedLetterId, setExpandedLetterId] = useState<string | null>(null);

  const archivedLetters = letters?.filter(letter => {
    const isCompletedOrRejected = letter.status === "completed" || letter.status === "rejected";
    const matchesStatus = statusFilter === "all" || letter.status === statusFilter;
    const matchesSearch = letter.type.toLowerCase().includes(search.toLowerCase());
    return isCompletedOrRejected && matchesStatus && matchesSearch;
  });

  const isLoading = isLettersLoading || isCitizensLoading;

  const toggleExpand = (id: string) => {
    setExpandedLetterId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Arsip Persuratan</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Riwayat surat yang telah selesai atau ditolak</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari jenis surat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white dark:bg-slate-900 dark:text-white"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white dark:bg-slate-900 dark:text-white"
        >
          <option value="all">Semua Status</option>
          <option value="completed">Selesai</option>
          <option value="rejected">Ditolak</option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
           {[1, 2, 3].map(i => (
             <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 animate-pulse h-24" />
           ))}
        </div>
      ) : (
        <div className="space-y-4">
          {archivedLetters && archivedLetters.length > 0 ? (
            archivedLetters.map((letter, index) => {
              const isExpanded = expandedLetterId === letter.id;
              const citizen = citizens?.find(c => c.id === letter.citizenId);

              return (
                <motion.div
                  key={letter.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden"
                >
                  <div
                    onClick={() => toggleExpand(letter.id)}
                    className="p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-full flex items-center justify-center shrink-0",
                        letter.status === "completed" ? "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400" :
                        "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      )}>
                        {letter.status === "completed" ? <CheckCircle size={24} /> : <XCircle size={24} />}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white">{letter.type}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                          <Clock size={12} />
                          Selesai pada: {new Date(letter.updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg",
                        letter.status === "completed" ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400" :
                        "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-400"
                      )}>
                        {letter.status === "completed" ? "Disetujui" : "Ditolak"}
                      </div>
                      <div className="text-slate-400">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-slate-100 dark:border-slate-800"
                      >
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/30">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Citizen Info */}
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <User size={16} className="text-indigo-500" />
                                Informasi Pemohon
                              </h4>
                              {citizen ? (
                                <div className="space-y-2 text-sm">
                                  <div className="flex flex-col">
                                    <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">Nama Lengkap</span>
                                    <span className="text-slate-900 dark:text-slate-300 font-medium">{citizen.fullName}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">NIK</span>
                                    <span className="text-slate-900 dark:text-slate-300 font-medium">{citizen.nik}</span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold">Alamat</span>
                                    <span className="text-slate-900 dark:text-slate-300 font-medium">{citizen.address}, RT {citizen.rt}/RW {citizen.rw}</span>
                                  </div>
                                </div>
                              ) : (
                                <p className="text-sm text-slate-500">Data pemohon tidak ditemukan.</p>
                              )}
                            </div>

                            {/* Letter Data Info */}
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                                <FileText size={16} className="text-indigo-500" />
                                Detail Surat
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                                <div className="flex flex-col md:col-span-2">
                                  <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">Tanggal Pengajuan</span>
                                  <span className="text-slate-900 dark:text-slate-300 font-medium px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                                    {new Date(letter.createdAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                  </span>
                                </div>
                                {letter.data && Object.keys(letter.data).length > 0 ? (
                                  Object.entries(letter.data).map(([key, value]) => (
                                    <div key={key} className="flex flex-col">
                                      <span className="text-slate-500 dark:text-slate-400 text-xs uppercase font-bold mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                      <span className="text-slate-900 dark:text-slate-300 font-medium px-3 py-2 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-700">
                                        {String(value)}
                                      </span>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-slate-500 text-sm md:col-span-2">Tidak ada detail tambahan.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
               <Archive className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
               <p className="text-slate-500 dark:text-slate-400 font-medium">Tidak ada arsip yang ditemukan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
