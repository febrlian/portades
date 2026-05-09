import type { Citizen } from "../../../shared/types/index.ts";

let MOCK_CITIZENS: Citizen[] = [
  {
    id: "1",
    nik: "3273010101010001",
    fullName: "Ahmad Subarjo",
    address: "Jl. Desa No. 1",
    rt: "01",
    rw: "01",
    gender: "L",
    birthPlace: "Bandung",
    birthDate: "1980-05-15",
    religion: "Islam",
    occupation: "Petani",
    maritalStatus: "Kawin",
  },
  {
    id: "2",
    nik: "3273010101010002",
    fullName: "Siti Aminah",
    address: "Jl. Desa No. 2",
    rt: "02",
    rw: "01",
    gender: "P",
    birthPlace: "Bandung",
    birthDate: "1985-10-20",
    religion: "Islam",
    occupation: "Ibu Rumah Tangga",
    maritalStatus: "Kawin",
  },
];

export const fetchCitizens = async (filters?: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let filtered = [...MOCK_CITIZENS];
  if (filters?.search) {
    filtered = filtered.filter(c =>
      c.fullName.toLowerCase().includes(filters.search.toLowerCase())
    );
  }
  if (filters?.nik) {
    filtered = filtered.filter(c => c.nik.includes(filters.nik));
  }
  if (filters?.rt) {
    filtered = filtered.filter(c => c.rt === filters.rt);
  }
  if (filters?.rw) {
    filtered = filtered.filter(c => c.rw === filters.rw);
  }
  if (filters?.birthDateStart) {
    filtered = filtered.filter(c => new Date(c.birthDate) >= new Date(filters.birthDateStart));
  }
  if (filters?.birthDateEnd) {
    filtered = filtered.filter(c => new Date(c.birthDate) <= new Date(filters.birthDateEnd));
  }
  return filtered;
};

export const createCitizen = async (data: Omit<Citizen, "id">) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newCitizen = { ...data, id: Math.random().toString() };
  MOCK_CITIZENS.push(newCitizen);
  return newCitizen;
};

export const updateCitizen = async (id: string, data: Omit<Citizen, "id">) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const index = MOCK_CITIZENS.findIndex(c => c.id === id);
  if (index !== -1) {
    MOCK_CITIZENS[index] = { ...data, id };
    return MOCK_CITIZENS[index];
  }
  throw new Error("Not found");
};

export const fetchCitizenByNIK = async (nik: string) => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_CITIZENS.find(c => c.nik === nik) || null;
};
