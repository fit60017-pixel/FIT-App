import React from 'react';
import { motion } from 'framer-motion'; // تأكد إنها framer-motion
import { ArrowRight } from 'lucide-react';

export const LandingPage = () => {
  return (
    <section className="h-screen flex items-center justify-center bg-[#1B4332] text-white">
      <motion.div initial={{ y: 20 }} animate={{ y: 0 }} className="text-center">
        <h1 className="text-6xl font-bold text-[#D4AF37] mb-4">FIT: Smart Health</h1>
        <button className="bg-[#D4AF37] text-[#1B4332] px-8 py-3 rounded-full font-bold">Get Started</button>
      </motion.div>
    </section>
  );
};
