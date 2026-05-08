export type Role = "warga" | "operator" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  nik?: string;
  phone?: string;
}

export interface Citizen {
  id: string;
  nik: string;
  fullName: string;
  address: string;
  rt: string;
  rw: string;
  gender: "L" | "P";
  birthPlace: string;
  birthDate: string;
  religion: string;
  occupation: string;
  maritalStatus: string;
  familyId?: string;
}

export interface Family {
  id: string;
  kkNumber: string;
  headOfFamily: string;
  address: string;
  rt: string;
  rw: string;
  members: Citizen[];
}

export interface Letter {
  id: string;
  type: string;
  citizenId: string;
  status: "draft" | "pending" | "processing" | "completed" | "rejected";
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
