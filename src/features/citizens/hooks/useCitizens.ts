import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchCitizens, createCitizen, updateCitizen, fetchCitizenByNIK } from "../api";
import { Citizen } from "@/shared/types";

export const useCitizens = (filters: {
  search?: string;
  nik?: string;
  rt?: string;
  rw?: string;
  birthDateStart?: string;
  birthDateEnd?: string;
}) => {
  return useQuery({
    queryKey: ["citizens", filters],
    queryFn: () => fetchCitizens(filters),
  });
};

export const useCreateCitizen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Citizen, "id">) => createCitizen(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["citizens"] });
    },
  });
};

export const useUpdateCitizen = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Omit<Citizen, "id"> }) => updateCitizen(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["citizens"] });
    },
  });
};
