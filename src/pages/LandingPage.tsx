import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, ShieldCheck, Zap } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <section className="relative h-screen flex items-center justify-center bg-[#1B4332] text-white">
        <div className="text-center px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-[#D4AF37]"
          >
            FIT: Smart Health
          </motion.h1>
          <p className="text-xl md:text-2xl mb-10 text-white/90">
            Your AI-Powered Guide to Healthy Eating
          </p>
          <button className="bg-[#D4AF37] text-[#1B4332] px-10 py-4 rounded-full font-black text-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto">
            Get Started <ArrowRight size={24} />
          </button>
        </div>
      </section>
    </div>
  );
};
