import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { registerApi } from "../api";
import { useAuthStore } from "@/shared/store/auth";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
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
  role: z.enum(["warga", "operator", "admin"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const getPasswordStrength = (password: string) => {
  if (!password) return { label: "", color: "bg-slate-200", width: "0%" };
  let strength = 0;
  if (password.length >= 6) strength += 1;
  if (password.length >= 10) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;

  if (strength <= 2) return { label: "Lemah", color: "bg-red-500", width: "33%" };
  if (strength <= 4) return { label: "Sedang", color: "bg-amber-500", width: "66%" };
  return { label: "Kuat", color: "bg-emerald-500", width: "100%" };
};

export const RegisterForm = ({ onToggleMode }: { onToggleMode: () => void }) => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "warga" }
  });

  const passwordWatch = watch("password", "");
  const strength = getPasswordStrength(passwordWatch);

  const mutation = useMutation({
    mutationFn: registerApi,
    onSuccess: (data) => {
      login(data.user, data.token);
      if (data.user.role === 'warga') {
        navigate("/letters");
      } else {
        navigate("/");
      }
    },
    onError: (error: any) => {
      alert(error.message);
    },
  });

  const onSubmit = (data: RegisterFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="name">Nama Lengkap</label>
        <input
          {...register("name")}
          id="name"
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
            errors.name ? "border-red-500" : "border-slate-200"
          )}
          placeholder="Nama Lengkap"
        />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="nik">NIK (16 Digit)</label>
        <input
          {...register("nik")}
          id="nik"
          maxLength={16}
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-mono",
            errors.nik ? "border-red-500" : "border-slate-200"
          )}
          placeholder="32730..."
        />
        {errors.nik && <p className="text-xs text-red-500">{errors.nik.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
        <input
          {...register("email")}
          id="email"
          type="email"
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
            errors.email ? "border-red-500" : "border-slate-200"
          )}
          placeholder="warga@desa.id"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label>
        <input
          {...register("password")}
          id="password"
          type="password"
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
            errors.password ? "border-red-500" : "border-slate-200"
          )}
          placeholder="••••••••"
        />
        {passwordWatch && (
          <div className="mt-1.5 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-slate-400">Kekuatan Password</span>
              <span className={cn("text-[10px] font-bold uppercase", strength.color.replace('bg-', 'text-'))}>{strength.label}</span>
            </div>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={cn("h-full transition-all duration-500", strength.color)}
                style={{ width: strength.width }}
              />
            </div>
          </div>
        )}
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
      >
        {mutation.isPending && <Loader2 className="animate-spin" size={18} />}
        {mutation.isPending ? "Mendaftar..." : "Daftar Akun"}
      </button>

      <p className="text-center text-sm text-slate-500 mt-4">
        Sudah punya akun?{" "}
        <button type="button" onClick={onToggleMode} className="text-indigo-600 font-medium hover:underline">
          Masuk di sini
        </button>
      </p>
    </form>
  );
};
