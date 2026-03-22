import React from 'react';
import { Leaf, ShieldCheck, Heart, Users } from 'lucide-react';
import { motion } from 'framer-motion'; // تأكد إنها framer-motion

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#FDFBF7]">
      <div className="bg-[#1B4332] py-20 text-center text-white">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-5xl font-bold text-[#D4AF37]">
          Our Mission
        </motion.h1>
      </div>
    </div>
  );
};
