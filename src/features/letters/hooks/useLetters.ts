import { useQuery } from "@tanstack/react-query";
import { fetchLetters } from "../api";

export const useLetters = () => {
  return useQuery({
    queryKey: ["letters"],
    queryFn: fetchLetters,
  });
};
