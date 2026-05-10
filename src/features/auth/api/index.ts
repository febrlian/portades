import { apiClient } from "@/shared/api/client";
import { User, Role } from "@/shared/types";

export interface RegisterCredentials {
  name: string;
  email: string;
  password?: string;
  role?: Role;
  nik: string;
}

export const registerApi = async (credentials: RegisterCredentials) => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay

  // Basic simulation of returning a user with token
  return {
    user: {
      id: Math.random().toString(),
      name: credentials.name,
      email: credentials.email,
      role: credentials.role || "warga",
      nik: credentials.nik,
    } as User,
    token: `mock-token-${credentials.email}`,
  };
};

export interface LoginCredentials {
  email: string;
  password?: string;
}

export const loginApi = async (credentials: LoginCredentials) => {
  // Mock login logic
  if (credentials.email === "admin@desa.id" && credentials.password === "password") {
    return {
      user: {
        id: "1",
        name: "Admin Desa",
        email: "admin@desa.id",
        role: "admin",
      } as User,
      token: "mock-token-admin",
    };
  }
  if (credentials.email === "warga@desa.id" && credentials.password === "password") {
    return {
      user: {
        id: "2",
        name: "Budi Warga",
        email: "warga@desa.id",
        role: "warga",
        nik: "1234567890123456",
      } as User,
      token: "mock-token-warga",
    };
  }
  throw new Error("Invalid credentials");
};
