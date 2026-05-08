import { LetterTemplate } from "../types";

let mockTemplates: LetterTemplate[] = [
  {
    id: "uuid-template-1",
    name: "Surat Keterangan Usaha",
    description: "Template surat keterangan usaha bagi warga yang membutuhkan.",
    headerContent: `<div style="display: flex; align-items: center; border-bottom: 2px solid black; padding-bottom: 8px; margin-bottom: 16px;">
  <div style="margin-right: 16px; font-weight: bold; border: 1px solid #ccc; padding: 10px;">LOGO</div>
  <div style="flex: 1; text-align: center;">
    <h3 style="margin: 0; font-size: 18px; font-weight: bold;">PEMERINTAH KABUPATEN INDONESIA</h3>
    <h2 style="margin: 0; font-size: 20px; font-weight: bold;">KECAMATAN MAJU TERUS</h2>
    <h1 style="margin: 0; font-size: 22px; font-weight: bold;">DESA DIGITAL SEJAHTERA</h1>
    <p style="margin: 0; font-size: 12px;">Jl. Raya Utama No. 1, Desa Digital, Kec. Maju Terus, Kab. Indonesia</p>
  </div>
</div>`,
    isActive: true,
    content: `<div style="text-align: center; margin-bottom: 24px;">
  <h3 style="font-weight: bold; text-decoration: underline;">SURAT KETERANGAN USAHA</h3>
  <p>Nomor: _________</p>
</div>
<p>Yang bertanda tangan di bawah ini Kepala Desa ..., menerangkan bahwa: </p>
<table style="width: 100%; margin: 16px 0;">
  <tr><td style="width: 150px;">Nama</td><td>: {{fullName}}</td></tr>
  <tr><td>NIK</td><td>: {{nik}}</td></tr>
  <tr><td>Alamat</td><td>: {{address}}</td></tr>
</table>
<p>Adalah benar warga desa kami yang memiliki tempat usaha di wilayah desa kami, dengan rincian usaha sebagai berikut:</p>
<table style="width: 100%; margin: 16px 0;">
  <tr><td style="width: 150px;">Nama Usaha</td><td>: {{businessName}}</td></tr>
  <tr><td>Jenis Usaha</td><td>: {{businessType}}</td></tr>
</table>
<p>Demikian surat keterangan usaha ini dibuat agar dapat dipergunakan sebagaimana mestinya.</p>
<div style="text-align: right; margin-top: 48px;">
  <p>Kepala Desa,</p>
  <br/><br/><br/>
  <p style="font-weight: bold;">( ___________________ )</p>
</div>`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      { id: "f1", name: "businessName", label: "Nama Usaha", type: "text", required: true },
      { id: "f2", name: "businessType", label: "Jenis Usaha", type: "text", required: true },
      { id: "f3", name: "address", label: "Alamat Usaha", type: "textarea", required: true },
    ]
  },
  {
    id: "uuid-template-2",
    name: "Surat Pengantar Domisili",
    description: "Surat pengantar untuk keperluan administrasi kependudukan.",
    headerContent: `<div style="display: flex; align-items: center; border-bottom: 2px solid black; padding-bottom: 8px; margin-bottom: 16px;">
  <div style="margin-right: 16px; font-weight: bold; border: 1px solid #ccc; padding: 10px;">LOGO</div>
  <div style="flex: 1; text-align: center;">
    <h3 style="margin: 0; font-size: 18px; font-weight: bold;">PEMERINTAH KABUPATEN INDONESIA</h3>
    <h2 style="margin: 0; font-size: 20px; font-weight: bold;">KECAMATAN MAJU TERUS</h2>
    <h1 style="margin: 0; font-size: 22px; font-weight: bold;">DESA DIGITAL SEJAHTERA</h1>
    <p style="margin: 0; font-size: 12px;">Jl. Raya Utama No. 1, Desa Digital, Kec. Maju Terus, Kab. Indonesia</p>
  </div>
</div>`,
    isActive: true,
    content: `<div style="text-align: center; margin-bottom: 24px;">
  <h3 style="font-weight: bold; text-decoration: underline;">SURAT PENGANTAR DOMISILI</h3>
  <p>Nomor: _________</p>
</div>
<p>Yang bertanda tangan di bawah ini Ketua RT {{rt}} RW {{rw}} Desa ..., menerangkan bahwa: </p>
<table style="width: 100%; margin: 16px 0;">
  <tr><td style="width: 150px;">Nama</td><td>: {{fullName}}</td></tr>
  <tr><td>NIK</td><td>: {{nik}}</td></tr>
  <tr><td>Agama</td><td>: {{religion}}</td></tr>
  <tr><td>Pekerjaan</td><td>: {{occupation}}</td></tr>
</table>
<p>Orang tersebut di atas benar merupakan warga yang berdomisili di RT {{rt}} RW {{rw}}. Surat pengantar ini dibuat dengan keperluan: <strong>{{reason}}</strong>.</p>
<p>Demikian surat pengantar ini dibuat agar dapat dipergunakan sebagaimana mestinya.</p>
<div style="text-align: right; margin-top: 48px;">
  <p>Ketua RT {{rt}},</p>
  <br/><br/><br/>
  <p style="font-weight: bold;">( ___________________ )</p>
</div>`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    fields: [
      { id: "f4", name: "reason", label: "Keperluan", type: "text", required: true },
      { id: "f5", name: "destinationAddress", label: "Alamat Tujuan (jika pindah)", type: "textarea", required: false },
    ]
  }
];

export const fetchTemplates = async (): Promise<LetterTemplate[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [...mockTemplates];
};

export const createTemplate = async (template: Omit<LetterTemplate, "id" | "createdAt" | "updatedAt">): Promise<LetterTemplate> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newTemplate: LetterTemplate = {
    ...template,
    id: `template-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockTemplates = [newTemplate, ...mockTemplates];
  return newTemplate;
};

export const updateTemplate = async (id: string, template: Partial<LetterTemplate>): Promise<LetterTemplate> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = mockTemplates.findIndex(t => t.id === id);
  if (index === -1) throw new Error("Template not found");

  mockTemplates[index] = {
    ...mockTemplates[index],
    ...template,
    updatedAt: new Date().toISOString(),
  };
  return mockTemplates[index];
};

export const deleteTemplate = async (id: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  mockTemplates = mockTemplates.filter(t => t.id !== id);
};
