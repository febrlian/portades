import { useState } from "react";
import { LoginForm } from "../components/LoginForm";
import { RegisterForm } from "../components/RegisterForm";
import { motion, AnimatePresence } from "motion/react";

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={isLogin ? "login" : "register"}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-md w-full bg-white rounded-2xl shadow-xl shadow-indigo-100 p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900">
              {isLogin ? "Selamat Datang" : "Daftar Akun Baru"}
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              {isLogin ? "Masuk ke Portal Desa Digital" : "Lengkapi form untuk mendaftar Portal Desa Digital"}
            </p>
          </div>

          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
