import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HealthQuizPage = () => {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center p-4">
      <div className="max-w-xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#1B4332] p-8 text-white">
          <h2 className="text-2xl font-bold text-[#D4AF37]">Medical Wizard</h2>
          <p className="opacity-80">Step {step} of 5</p>
        </div>
        
        <div className="p-10 min-h-[300px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div 
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full text-center"
            >
              {step === 1 ? (
                <div>
                  <h3 className="text-2xl font-bold mb-6 text-gray-900">Any allergies?</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {['Nuts', 'Dairy', 'Gluten', 'Soy'].map(item => (
                      <button key={item} className="p-4 rounded-xl border-2 border-gray-100 hover:border-[#1B4332] transition-all font-bold">
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ) : step === 5 ? (
                <div>
                  <CheckCircle2 size={64} className="mx-auto text-[#1B4332] mb-4" />
                  <h3 className="text-2xl font-bold">All Ready!</h3>
                </div>
              ) : (
                <div className="text-gray-400">Next medical assessment step...</div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="p-6 bg-gray-50 flex justify-between">
          <button onClick={() => setStep(s => Math.max(1, s-1))} className="flex items-center gap-2 font-bold text-gray-500">
            <ArrowLeft size={20} /> Back
          </button>
          <button onClick={() => setStep(s => Math.min(5, s+1))} className="bg-[#1B4332] text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2">
            {step === 5 ? 'Finish' : 'Next'} <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
