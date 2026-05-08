import * as z from "zod";

export const citizenSchema = z.object({
  nik: z.string()
    .length(16, "NIK harus 16 digit")
    .regex(/^\d+$/, "NIK harus berupa angka saja")
    .refine((val) => {
      const seventhDigit = parseInt(val[6]);
      const ninthDigit = parseInt(val[8]);
      const isSeventhValid = seventhDigit !== 8 && seventhDigit !== 9;
      const isNinthValid = ninthDigit === 0 || ninthDigit === 1;
      return isSeventhValid && isNinthValid;
    }, "Format NIK tidak valid (Cek digit ke-7 dan ke-9)"),
  fullName: z.string().min(3, "Nama minimal 3 karakter"),
  address: z.string().min(5, "Alamat minimal 5 karakter"),
  rt: z.string().min(1, "RT harus diisi").max(3),
  rw: z.string().min(1, "RW harus diisi").max(3),
  gender: z.enum(["L", "P"]),
  birthPlace: z.string().min(2, "Tempat lahir harus diisi"),
  birthDate: z.string().min(1, "Tanggal lahir harus diisi").refine((val) => {
    const inputDate = new Date(val);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    const minDate = new Date("1900-01-01");
    minDate.setHours(0, 0, 0, 0);
    return inputDate <= today && inputDate >= minDate;
  }, "Tanggal lahir tidak valid (tidak boleh di masa depan atau sebelum tahun 1900)"),
  religion: z.string().min(1, "Agama harus diisi"),
  occupation: z.string().min(1, "Pekerjaan harus diisi"),
  maritalStatus: z.string().min(1, "Status perkawinan harus diisi"),
});

export type CitizenFormValues = z.infer<typeof citizenSchema>;
