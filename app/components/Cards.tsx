'use client';

import { motion } from 'framer-motion';

export function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl p-4 shadow-glow"
    >
      <p className="text-xs text-zinc-400">{title}</p>
      <p className="mt-1 text-2xl font-semibold text-white">{value}</p>
    </motion.div>
  );
}
