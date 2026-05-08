import React from "react";
import { motion } from "motion/react";
import { Construction } from "lucide-react";

export const FeaturePlaceholder = ({ title, description }: { title: string; description: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mb-6">
        <Construction size={40} />
      </div>
      <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{title}</h2>
      <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto">{description}</p>

      <div className="mt-10 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl">
        <p className="text-sm text-amber-700 dark:text-amber-400 font-medium">Fitur ini sedang dalam pengembangan oleh tim SITEDESA.</p>
      </div>
    </motion.div>
  );
};
