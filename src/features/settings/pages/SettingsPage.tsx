import { useState } from "react";
import { User, Bell, Lock, Shield, Save } from "lucide-react";
import { useAuthStore } from "@/shared/store/auth";
import { useThemeStore } from "@/shared/store/theme";

export const SettingsPage = () => {
  const { user } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Pengaturan</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Kelola profil dan preferensi aplikasi</p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 p-4">
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "profile"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <User size={18} />
              Profil Pengguna
            </button>
            <button
              onClick={() => setActiveTab("preferences")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "preferences"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Bell size={18} />
              Preferensi
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "security"
                  ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Shield size={18} />
              Keamanan
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 md:p-8">
          {activeTab === "profile" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Informasi Profil</h3>

              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 text-2xl font-bold">
                  {user?.name?.charAt(0)}
                </div>
                <div>
                  <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    Ubah Foto
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">Nama Lengkap</label>
                  <input type="text" defaultValue={user?.name} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white dark:bg-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">Email</label>
                  <input type="email" defaultValue={user?.email} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 dark:bg-slate-800 dark:text-slate-300" disabled />
                  <p className="text-[10px] text-slate-500 mt-1 px-1">Email sistem tidak dapat diubah.</p>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">Peran</label>
                  <input type="text" defaultValue={user?.role.toUpperCase()} className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 dark:bg-slate-800 dark:text-slate-300 font-bold" disabled />
                </div>
              </div>
            </div>
          )}

          {activeTab === "preferences" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Tampilan & Notifikasi</h3>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-bold text-slate-900 dark:text-white block mb-2">Tema Tampilan</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => setTheme("light")}
                      className={`flex-1 py-3 border rounded-xl text-sm font-medium transition-all ${
                        theme === "light"
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 flex items-center justify-center gap-2"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      Terang
                    </button>
                    <button
                      onClick={() => setTheme("dark")}
                      className={`flex-1 py-3 border rounded-xl text-sm font-medium transition-all ${
                        theme === "dark"
                          ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center gap-2"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                    >
                      Gelap
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-sm">Notifikasi Email</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Terima email saat ada pembaruan status surat</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Keamanan Akun</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">Password Saat Ini</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white dark:bg-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">Password Baru</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white dark:bg-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-slate-400 px-1">Konfirmasi Password Baru</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-white dark:bg-slate-900 dark:text-white" />
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex justify-end">
            <button className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 dark:shadow-none">
              <Save size={18} />
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
