import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "../api";
import { useAuthStore } from "@/shared/store/auth";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/shared/lib/utils";
import { toast } from "sonner";

const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = ({ onToggleMode }: { onToggleMode: () => void }) => {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: (data) => {
      login(data.user, data.token);
      if (data.user.role === 'warga') {
        navigate("/letters");
      } else {
        navigate("/");
      }
    },
    onError: (error: any) => {
      toast.error("Gagal masuk", { description: error.message || "Terjadi kesalahan" });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700" htmlFor="email">Email</label>
        <input
          {...register("email")}
          id="email"
          className={cn(
            "w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all",
            errors.email ? "border-red-500" : "border-slate-200"
          )}
          placeholder="admin@desa.id"
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
        {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {mutation.isPending && <Loader2 className="animate-spin" size={18} />}
        {mutation.isPending ? "Logging in..." : "Login"}
      </button>

      <p className="text-center text-sm text-slate-500 mt-4">
        Belum punya akun?{" "}
        <button type="button" onClick={onToggleMode} className="text-indigo-600 font-medium hover:underline">
          Daftar di sini
        </button>
      </p>

      <div className="text-center mt-6 p-4 bg-indigo-50 rounded-lg">
        <p className="text-xs text-indigo-700 font-medium">Demo Access:</p>
        <p className="text-[10px] text-indigo-600 mt-1">admin@desa.id / password (Admin)</p>
        <p className="text-[10px] text-indigo-600">warga@desa.id / password (Warga)</p>
      </div>
    </form>
  );
};
