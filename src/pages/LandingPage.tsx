import React from 'react';
import { ArrowRight, Leaf, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

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
          <p className="text-xl md:text-2xl mb-10 text-white/90 font-light">
            Your AI-Powered Guide to Healthy Eating
          </p>
          <button className="bg-[#D4AF37] text-[#1B4332] px-10 py-4 rounded-full font-black text-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto shadow-2xl">
            Get Started <ArrowRight size={24} />
          </button>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12 text-center">
        {[
          { icon: Leaf, title: 'Natural Snacks', color: 'text-green-600' },
          { icon: ShieldCheck, title: 'FIB Verified', color: 'text-blue-600' },
          { icon: Zap, title: 'AI Recommendations', color: 'text-yellow-600' }
        ].map((feature, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10 }}
            className="p-8 bg-gray-50 rounded-3xl border border-gray-100 shadow-sm"
          >
            <feature.icon className={`mx-auto mb-6 ${feature.color}`} size={48} />
            <h3 className="text-2xl font-bold text-gray-900">{feature.title}</h3>
          </motion.div>
        ))}
      </section>
    </div>
  );
};
