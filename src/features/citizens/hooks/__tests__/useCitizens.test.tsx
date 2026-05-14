import { describe, it, beforeEach } from "node:test";
import assert from "node:assert";
import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCitizens, useCreateCitizen, useUpdateCitizen } from "../useCitizens.ts";
import "global-jsdom/register";

describe("Citizen Hooks", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  describe("useCitizens", () => {
    it("should fetch citizens", async () => {
      const { result } = renderHook(() => useCitizens({}), { wrapper });

      assert.strictEqual(result.current.isLoading, true);

      await waitFor(() => {
        assert.strictEqual(result.current.isSuccess, true);
      }, { timeout: 2000 });

      assert.ok((result.current as any).data);
      assert.strictEqual(((result.current as any).data as any)?.length >= 2, true);
    });

    it("should refetch with filters", async () => {
      const { result } = renderHook(() => useCitizens({ nik: "3273010101010001" }), { wrapper });

      await waitFor(() => {
        assert.strictEqual(result.current.isSuccess, true);
      }, { timeout: 2000 });

      assert.ok((result.current as any).data);
      assert.strictEqual(((result.current as any).data as any)?.length, 1);
      assert.strictEqual(((result.current as any).data as any)?.[0].nik, "3273010101010001");
    });
  });

  describe("useCreateCitizen", () => {
    it("should create a citizen and invalidate citizens query", async () => {
      let invalidateCalled = false;
      queryClient.invalidateQueries = async (filters: any) => {
        if (filters?.queryKey?.[0] === "citizens") {
          invalidateCalled = true;
        }
      };

      const { result } = renderHook(() => useCreateCitizen(), { wrapper });

      const newCitizenData = {
        nik: "3273010101010003",
        fullName: "Budi Santoso",
        address: "Jl. Baru No. 3",
        rt: "03",
        rw: "01",
        gender: "L" as const,
        birthPlace: "Jakarta",
        birthDate: "1990-01-01",
        religion: "Islam",
        occupation: "Wiraswasta",
        maritalStatus: "Belum Kawin",
      };

      result.current.mutate(newCitizenData);

      await waitFor(() => {
        assert.strictEqual(result.current.isSuccess, true);
      }, { timeout: 2000 });

      assert.strictEqual(invalidateCalled, true);
      assert.ok((result.current as any).data);
      assert.strictEqual(((result.current as any).data as any)?.fullName, "Budi Santoso");
    });
  });

  describe("useUpdateCitizen", () => {
    it("should update a citizen and invalidate citizens query", async () => {
      let invalidateCalled = false;
      queryClient.invalidateQueries = async (filters: any) => {
        if (filters?.queryKey?.[0] === "citizens") {
          invalidateCalled = true;
        }
      };

      const { result } = renderHook(() => useUpdateCitizen(), { wrapper });

      const updatedCitizenData = {
        nik: "3273010101010001",
        fullName: "Ahmad Subarjo Updated",
        address: "Jl. Desa No. 1",
        rt: "01",
        rw: "01",
        gender: "L" as const,
        birthPlace: "Bandung",
        birthDate: "1980-05-15",
        religion: "Islam",
        occupation: "Petani",
        maritalStatus: "Kawin",
      };

      result.current.mutate({ id: "1", data: updatedCitizenData });

      await waitFor(() => {
        assert.strictEqual(result.current.isSuccess, true);
      }, { timeout: 2000 });

      assert.strictEqual(invalidateCalled, true);
      assert.ok((result.current as any).data);
      assert.strictEqual(((result.current as any).data as any)?.fullName, "Ahmad Subarjo Updated");
    });
  });
});
