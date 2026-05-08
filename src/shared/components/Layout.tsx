import React, { useEffect } from "react";
import { useAuthStore } from "@/shared/store/auth";
import { useThemeStore } from "@/shared/store/theme";
import { cn } from "@/shared/lib/utils";
import {
  LayoutDashboard,
  Users,
  FileText,
  Archive,
  Settings,
  LogOut,
  Menu,
  X,
  Newspaper,
  BookText,
  Camera,
  BarChart,
  ClipboardList,
  User as UserIcon,
  ChevronDown,
  Map,
  Gavel,
  Calendar,
  Layers,
  Home,
  Droplets,
  Sprout,
  Heart,
  Users2,
  TreePine,
  Briefcase
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";

interface SidebarItem {
  icon: any;
  label: string;
  href?: string;
  roles: string[];
  children?: { label: string; href: string; roles: string[] }[];
}

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", roles: ["warga", "operator", "admin"] },
  {
    icon: FileText,
    label: "Persuratan",
    roles: ["warga", "operator", "admin"],
    children: [
      { label: "Buat Surat Baru", href: "/letters", roles: ["warga", "operator", "admin"] },
      { label: "Template Surat", href: "/templates", roles: ["operator", "admin"] },
      { label: "Arsip Surat", href: "/archive", roles: ["operator", "admin"] },
    ]
  },
  {
    icon: Map,
    label: "Kewilayahan",
    roles: ["operator", "admin", "warga"],
    children: [
      { label: "Peta Wilayah", href: "/geographic/map", roles: ["operator", "admin", "warga"] },
      { label: "Peta Fasum", href: "/geographic/facilities", roles: ["operator", "admin", "warga"] },
    ]
  },
  {
    icon: Gavel,
    label: "Pemerintahan",
    roles: ["operator", "admin", "warga"],
    children: [
      { label: "Produk Hukum", href: "/gov/law", roles: ["operator", "admin", "warga"] },
      { label: "Struktur Pemdes", href: "/gov/structure", roles: ["operator", "admin", "warga"] },
      { label: "BPD", href: "/gov/bpd", roles: ["operator", "admin", "warga"] },
      { label: "RT/RW", href: "/gov/neighborhood", roles: ["operator", "admin", "warga"] },
    ]
  },
  {
    icon: Newspaper,
    label: "Publikasi",
    roles: ["operator", "admin", "warga"],
    children: [
      { label: "Kalender", href: "/calendar", roles: ["warga", "operator", "admin"] },
      { label: "Berita", href: "/pub/news", roles: ["operator", "admin", "warga"] },
      { label: "Artikel", href: "/pub/articles", roles: ["operator", "admin", "warga"] },
      { label: "Dokumentasi", href: "/pub/documentation", roles: ["operator", "admin", "warga"] },
      { label: "Laporan", href: "/pub/reports", roles: ["operator", "admin", "warga"] },
      { label: "Pengumuman", href: "/pub/announcements", roles: ["operator", "admin", "warga"] },
      { label: "Notulensi Rapat", href: "/pub/meetings", roles: ["operator", "admin", "warga"] },
    ]
  },
  {
    icon: Layers,
    label: "Kelembagaan",
    roles: ["operator", "admin", "warga"],
    children: [
      { label: "Pengairan", href: "/org/irrigation", roles: ["operator", "admin", "warga"] },
      { label: "Karang Taruna", href: "/org/youth", roles: ["operator", "admin", "warga"] },
      { label: "Gapoktan", href: "/org/farmers", roles: ["operator", "admin", "warga"] },
      { label: "Gerbangmas", href: "/org/gerbangmas", roles: ["operator", "admin", "warga"] },
      { label: "PKK", href: "/org/pkk", roles: ["operator", "admin", "warga"] },
      { label: "Rukem", href: "/org/rukem", roles: ["operator", "admin", "warga"] },
      { label: "Tokoh Masyarakat", href: "/org/community-leaders", roles: ["operator", "admin", "warga"] },
      { label: "Tokoh Agama", href: "/org/religious-leaders", roles: ["operator", "admin", "warga"] },
      { label: "Tokoh Pemuda", href: "/org/youth-leaders", roles: ["operator", "admin", "warga"] },
    ]
  },
  { icon: Users, label: "Warga", href: "/citizens", roles: ["operator", "admin"] },
  { icon: Settings, label: "Pengaturan", href: "/settings", roles: ["admin"] },
];

const NavItem = ({ item, user, pathname, onMobileClose }: { item: SidebarItem, user: any, pathname: string, onMobileClose?: () => void }) => {
  const [isOpen, setIsOpen] = React.useState(pathname.startsWith(item.href || "!!!"));
  const hasChildren = item.children && item.children.length > 0;

  // Update isOpen when pathname changes if it's a child of this item
  useEffect(() => {
    if (hasChildren && item.children?.some(child => pathname === child.href)) {
      setIsOpen(true);
    }
  }, [pathname, hasChildren, item.children]);

  const filteredChildren = item.children?.filter(child => user && child.roles.includes(user.role)) || [];
  if (hasChildren && filteredChildren.length === 0) return null;

  if (!hasChildren) {
    const isActive = pathname === item.href;
    return (
      <Link
        to={item.href!}
        onClick={onMobileClose}
        className={cn(
          "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
          isActive
            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
        )}
      >
        <item.icon size={18} />
        {item.label}
      </Link>
    );
  }

  const isChildActive = filteredChildren.some(child => pathname === child.href);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200",
          isChildActive
            ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20"
            : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400"
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon size={18} />
          {item.label}
        </div>
        <ChevronDown size={16} className={cn("transition-transform duration-200", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pl-10 space-y-1"
          >
            {filteredChildren.map((child) => {
              const isActive = pathname === child.href;
              return (
                <Link
                  key={child.href}
                  to={child.href}
                  onClick={onMobileClose}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400 bg-white dark:bg-slate-800 shadow-sm border border-indigo-100 dark:border-indigo-900/50"
                      : "text-slate-500 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400"
                  )}
                >
                  <div className={cn("w-1 h-1 rounded-full", isActive ? "bg-indigo-600 dark:bg-indigo-400" : "bg-slate-300 dark:bg-slate-700")} />
                  {child.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, logout } = useAuthStore();
  const { theme } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const filteredItems = sidebarItems.filter(item => user && item.roles.includes(user.role));

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex transition-colors duration-300">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-0 h-screen z-30">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black">D</span>
            </div>
            <div>
              <h1 className="text-sm font-black text-slate-900 dark:text-white tracking-tight uppercase">Desa Digital</h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Admin Portal</p>
            </div>
          </div>
          <ThemeToggle />
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {filteredItems.map((item, idx) => (
            <NavItem key={item.label || idx} item={item} user={user} pathname={location.pathname} />
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-4 border border-slate-100 dark:border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
              <UserIcon size={18} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all active:scale-95"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Topbar */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 z-50 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-black">D</span>
            </div>
            <h1 className="text-sm font-black text-slate-900 dark:text-white uppercase">Desa Digital</h1>
          </div>
          <div className="flex items-center gap-2">
             <ThemeToggle />
             <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-slate-400"
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="md:hidden fixed inset-0 top-16 bg-white dark:bg-slate-900 z-40 p-4 overflow-y-auto"
            >
               <nav className="space-y-1">
                {filteredItems.map((item, idx) => (
                  <NavItem key={item.label || idx} item={item} user={user} pathname={location.pathname} onMobileClose={() => setIsMobileMenuOpen(false)} />
                ))}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-4 w-full rounded-xl text-red-600 dark:text-red-400 font-bold border-t border-slate-100 dark:border-slate-800 mt-4 active:scale-95"
                >
                  <LogOut size={20} />
                  Logout
                </button>
               </nav>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 bg-slate-50 dark:bg-slate-950 overflow-x-hidden transition-colors duration-300">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
