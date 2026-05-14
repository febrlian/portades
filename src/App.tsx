import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/dashboard/pages/DashboardPage";
import { CitizenListPage } from "@/features/citizens/pages/CitizenListPage";
import { LetterCreationWizard } from "@/features/letters/create/LetterCreationWizard";
import { ArchivePage } from "@/features/archive/pages/ArchivePage";
import { SettingsPage } from "@/features/settings/pages/SettingsPage";
import { TemplateListPage } from "@/features/templates/pages/TemplateListPage";
import { Layout } from "@/shared/components/Layout";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { FeaturePlaceholder } from "@/shared/components/FeaturePlaceholder";
import { Toaster } from "sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout><DashboardPage /></Layout>} path="/" />
            <Route element={<Layout><CitizenListPage /></Layout>} path="/citizens" />
            <Route element={<Layout><LetterCreationWizard /></Layout>} path="/letters" />
            <Route element={<Layout><ArchivePage /></Layout>} path="/archive" />
            <Route element={<Layout><TemplateListPage /></Layout>} path="/templates" />
            <Route element={<Layout><SettingsPage /></Layout>} path="/settings" />

            {/* Kewilayahan */}
            <Route element={<Layout><FeaturePlaceholder title="Peta Wilayah" description="Sistem Informasi Geografis batas wilayah desa." /></Layout>} path="/geographic/map" />
            <Route element={<Layout><FeaturePlaceholder title="Peta Fasum" description="Lokasi fasilitas umum dan sosial di desa." /></Layout>} path="/geographic/facilities" />

            {/* Pemerintahan */}
            <Route element={<Layout><FeaturePlaceholder title="Produk Hukum" description="Daftar Peraturan Desa dan Keputusan Kepala Desa." /></Layout>} path="/gov/law" />
            <Route element={<Layout><FeaturePlaceholder title="Struktur Pemdes" description="Bagan organisasi Pemerintah Desa." /></Layout>} path="/gov/structure" />
            <Route element={<Layout><FeaturePlaceholder title="BPD" description="Informasi Badan Permusyawaratan Desa." /></Layout>} path="/gov/bpd" />
            <Route element={<Layout><FeaturePlaceholder title="RT/RW" description="Data pengurus Rukun Tetangga dan Rukun Warga." /></Layout>} path="/gov/neighborhood" />

            {/* Kalender & Publikasi */}
            <Route element={<Layout><FeaturePlaceholder title="Kalender Desa" description="Agenda kegiatan dan jadwal penting desa." /></Layout>} path="/calendar" />
            <Route element={<Layout><FeaturePlaceholder title="Berita Desa" description="Kabar terbaru seputar kegiatan dan informasi desa." /></Layout>} path="/pub/news" />
            <Route element={<Layout><FeaturePlaceholder title="Artikel" description="Tulisan edukatif dan informasi mendalam." /></Layout>} path="/pub/articles" />
            <Route element={<Layout><FeaturePlaceholder title="Dokumentasi" description="Galeri foto dan video kegiatan desa." /></Layout>} path="/pub/documentation" />
            <Route element={<Layout><FeaturePlaceholder title="Laporan" description="Laporan transparansi dan kinerja pemerintah desa." /></Layout>} path="/pub/reports" />
            <Route element={<Layout><FeaturePlaceholder title="Pengumuman" description="Informasi dan pengumuman resmi pemerintah desa." /></Layout>} path="/pub/announcements" />
            <Route element={<Layout><FeaturePlaceholder title="Notulensi Rapat" description="Catatan hasil musyawarah dan rapat desa." /></Layout>} path="/pub/meetings" />

            {/* Kelembagaan */}
            <Route element={<Layout><FeaturePlaceholder title="Pengairan" description="Lembaga pengelola irigasi dan air bersih." /></Layout>} path="/org/irrigation" />
            <Route element={<Layout><FeaturePlaceholder title="Karang Taruna" description="Organisasi kepemudaan tingkat desa." /></Layout>} path="/org/youth" />
            <Route element={<Layout><FeaturePlaceholder title="Gapoktan" description="Gabungan Kelompok Tani." /></Layout>} path="/org/farmers" />
            <Route element={<Layout><FeaturePlaceholder title="Gerbangmas" description="Gerakan pembangunan masyarakat." /></Layout>} path="/org/gerbangmas" />
            <Route element={<Layout><FeaturePlaceholder title="PKK" description="Pemberdayaan Kesejahteraan Keluarga." /></Layout>} path="/org/pkk" />
            <Route element={<Layout><FeaturePlaceholder title="Rukem" description="Lembaga rukun kematian." /></Layout>} path="/org/rukem" />
            <Route element={<Layout><FeaturePlaceholder title="Tokoh Masyarakat" description="Informasi tokoh masyarakat desa." /></Layout>} path="/org/community-leaders" />
            <Route element={<Layout><FeaturePlaceholder title="Tokoh Agama" description="Informasi tokoh agama desa." /></Layout>} path="/org/religious-leaders" />
            <Route element={<Layout><FeaturePlaceholder title="Tokoh Pemuda" description="Informasi tokoh pemuda desa." /></Layout>} path="/org/youth-leaders" />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
