import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // تأكد إنها framer-motion
import { ArrowLeft, ArrowRight } from 'lucide-react';

export const HealthQuizPage = () => {
  const [step, setStep] = useState(1);
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF7]">
       <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
             <h2 className="text-2xl font-bold">Step {step}</h2>
          </motion.div>
       </AnimatePresence>
    </div>
  );
};
