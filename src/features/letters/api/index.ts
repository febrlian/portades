import { Letter } from "@/shared/types";

const MOCK_LETTERS: Letter[] = [
  {
    id: "1",
    type: "Surat Keterangan Usaha",
    citizenId: "1",
    status: "pending",
    data: { businessName: "Warung Berkah" },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    type: "Surat Keterangan Domisili",
    citizenId: "2",
    status: "completed",
    data: { reason: "Pindah kerja" },
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const fetchLetters = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_LETTERS;
};

export const fetchLettersByCitizenId = async (citizenId: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_LETTERS.filter(l => l.citizenId === citizenId);
};

export const createLetterApi = async (data: any) => {
  await new Promise(resolve => setTimeout(resolve, 1500));
  const newLetter = { ...data, id: Math.random().toString(36).substr(2, 9), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
  MOCK_LETTERS.push(newLetter);
  return { success: true, id: newLetter.id };
};
