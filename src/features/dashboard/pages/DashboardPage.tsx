import { useAuthStore } from "@/shared/store/auth";
import { useCitizens } from "@/features/citizens/hooks/useCitizens";
import {
  Users,
  FileText,
  Clock,
  CheckCircle2,
  TrendingUp,
  Plus,
  Archive
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";

export const DashboardPage = () => {
  const { user } = useAuthStore();
  const { data: citizens } = useCitizens({});

  const stats = [
    { label: "Total Warga", value: citizens?.length || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/20" },
    { label: "Pengajuan Pending", value: 12, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-900/20" },
    { label: "Selesai Bulan Ini", value: 48, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/20" },
    { label: "Pertumbuhan", value: "+2.4%", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Selamat datang kembali, <span className="font-bold text-indigo-600 dark:text-indigo-400">{user?.name}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm"
          >
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-lg flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2 space-y-4">
           <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Aksi Cepat</h3>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
             <Link
              to="/letters"
              className="group p-6 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all"
             >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Plus size={20} />
                </div>
                <h4 className="font-bold">Buat Pengajuan</h4>
                <p className="text-xs text-indigo-100 mt-1">Ajukan surat keterangan atau pengantar baru</p>
             </Link>

             <Link
              to="/citizens"
              className="group p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:border-indigo-100 dark:hover:border-indigo-900 transition-all"
             >
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <Users size={20} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">List Warga</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Lihat dan kelola data kependudukan</p>
             </Link>

             <Link
              to="/archive"
              className="group p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm hover:border-indigo-100 dark:hover:border-indigo-900 transition-all"
             >
                <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg flex items-center justify-center mb-4 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  <Archive size={20} />
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white">Lihat Arsip Surat</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Kelola dokumen dan persuratan warga</p>
             </Link>
           </div>

           {/* Recent Activity Mock */}
           <div className="mt-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">Aktivitas Terakhir</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <FileText size={14} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 italic">Pengajuan Surat Keterangan Usaha</p>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500">Oleh <span className="font-bold">Budi Jatmiko</span> • 2 jam yang lalu</p>
                    </div>
                    <span className="px-2 py-1 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold rounded">PENDING</span>
                  </div>
                ))}
              </div>
           </div>
        </div>

        {/* Sidebar Mini */}
        <div className="space-y-6">
           <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">Informasi Desa</h3>
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 overflow-hidden relative group cursor-pointer">
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?auto=format&fit=crop&q=80&w=300"
                  alt="Desa"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="font-bold text-indigo-600 dark:text-indigo-400">Desa Sukamaju</span> adalah desa digital binaan tingkat provinsi tahun 2026.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800 flex justify-between text-[10px] font-bold text-slate-400 dark:text-slate-500">
                <span>KODE POS: 40123</span>
                <span>KEC: MEKARWANGI</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
