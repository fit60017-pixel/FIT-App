import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { HealthProfile } from '../types';
import { ArrowLeft, ArrowRight, CheckCircle2, HeartPulse, Activity, Target, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const HealthQuizPage = () => {
  const { state, setHealthProfile, navigate } = useAppContext();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<HealthProfile>(() => {
    if (state.user?.healthProfile) {
      return state.user.healthProfile;
    }
    const weight = 70;
    const height = 170;
    const heightInMeters = height / 100;
    const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    return {
      allergies: [],
      chronicDiseases: [],
      fitnessGoals: 'maintenance',
      activityLevel: 'moderate',
      weight,
      height,
      bmi,
    };
  });

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
    else {
      setHealthProfile(profile);
      navigate('customer-dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const toggleArrayItem = (key: 'allergies' | 'chronicDiseases', item: string) => {
    setProfile(prev => ({
      ...prev,
      [key]: prev[key].includes(item) 
        ? prev[key].filter(i => i !== item) 
        : [...prev[key], item]
    }));
  };

  const ALLERGIES = ['nuts', 'dairy', 'eggs', 'gluten', 'soy', 'seafood'];
  const DISEASES = ['diabetes', 'ibs', 'celiac', 'hypertension', 'pcos'];
  const GOALS = [
    { id: 'weight-loss', label: 'Weight Loss', desc: 'Burn fat and tone up' },
    { id: 'muscle-gain', label: 'Muscle Gain', desc: 'Build strength and mass' },
    { id: 'maintenance', label: 'Maintenance', desc: 'Stay healthy and active' }
  ];
  const ACTIVITY_LEVELS = [
    { id: 'sedentary', label: 'Sedentary', desc: 'Little to no exercise' },
    { id: 'moderate', label: 'Moderate', desc: 'Exercise 3-5 days/week' },
    { id: 'active', label: 'Active', desc: 'Exercise 6-7 days/week' }
  ];

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 pb-24 md:pb-12">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-primary p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <HeartPulse size={120} className="-mt-10 -mr-10" />
          </div>
          <h2 className="text-2xl font-bold relative z-10">The FIT Medical Wizard</h2>
          <p className="text-green-100 mt-2 relative z-10">Step {step} of 5</p>
          <div className="w-full bg-primary-dark rounded-full h-2 mt-4 relative z-10">
            <div
              className="bg-secondary h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 5) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-8 min-h-[400px] flex flex-col justify-center relative">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle className="text-secondary" size={28} />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Food Allergies</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Select any ingredients you are allergic to. FIB will automatically hide products containing these.</p>
                <div className="grid grid-cols-2 gap-4">
                  {ALLERGIES.map(allergy => (
                    <button
                      key={allergy}
                      onClick={() => toggleArrayItem('allergies', allergy)}
                      className={`p-4 rounded-2xl border-2 font-bold text-lg capitalize transition-all ${
                        profile.allergies.includes(allergy)
                          ? 'bg-[#98FF98] text-black border-black shadow-md border-4'
                          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                      }`}
                    >
                      {allergy}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Activity className="text-primary" size={28} />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Chronic Conditions</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Select any conditions that apply to you so FIB can curate your smart shop.</p>
                <div className="space-y-3">
                  {DISEASES.map(disease => (
                    <label
                      key={disease}
                      className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                        profile.chronicDiseases.includes(disease)
                          ? 'border-primary bg-primary/5 text-primary dark:text-primary-dark'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="hidden"
                        checked={profile.chronicDiseases.includes(disease)}
                        onChange={() => toggleArrayItem('chronicDiseases', disease)}
                      />
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 ${
                        profile.chronicDiseases.includes(disease) ? 'border-primary bg-primary' : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {profile.chronicDiseases.includes(disease) && <CheckCircle2 size={16} className="text-white" />}
                      </div>
                      <span className="text-lg font-bold capitalize">{disease}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="text-secondary" size={28} />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Fitness Goals</h3>
                </div>
                <div className="space-y-4">
                  {GOALS.map(goal => (
                    <label
                      key={goal.id}
                      className={`flex flex-col p-5 border-2 rounded-2xl cursor-pointer transition-all ${
                        profile.fitnessGoals === goal.id
                          ? 'border-secondary bg-secondary/5 text-secondary'
                          : 'border-gray-200 dark:border-gray-700 hover:border-secondary/50 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="goal"
                        className="hidden"
                        checked={profile.fitnessGoals === goal.id}
                        onChange={() => setProfile({ ...profile, fitnessGoals: goal.id })}
                      />
                      <span className="text-xl font-bold mb-1">{goal.label}</span>
                      <span className="text-sm opacity-80">{goal.desc}</span>
                    </label>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Body Metrics & Activity</h3>
                <div className="space-y-10">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Weight (kg)</label>
                      <input
                        type="number"
                        min="0"
                        value={profile.weight || ''}
                        onChange={(e) => {
                          const weight = Math.max(0, parseFloat(e.target.value) || 0);
                          const heightInMeters = (profile.height || 0) / 100;
                          const bmi = heightInMeters > 0 ? parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1)) : undefined;
                          setProfile({ ...profile, weight, bmi });
                        }}
                        className="w-full px-4 py-3 bg-[#FDFBF7] dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                        placeholder="Enter weight"
                      />
                    </div>

                    <div>
                      <label className="block text-lg font-bold text-gray-800 dark:text-gray-200 mb-2">Height (cm)</label>
                      <input
                        type="number"
                        min="0"
                        value={profile.height || ''}
                        onChange={(e) => {
                          const height = Math.max(0, parseFloat(e.target.value) || 0);
                          const heightInMeters = height / 100;
                          const bmi = heightInMeters > 0 && profile.weight > 0 ? parseFloat((profile.weight / (heightInMeters * heightInMeters)).toFixed(1)) : undefined;
                          setProfile({ ...profile, height, bmi });
                        }}
                        className="w-full px-4 py-3 bg-[#FDFBF7] dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
                        placeholder="Enter height"
                      />
                    </div>
                  </div>
                  
                  {profile.bmi && profile.bmi > 0 ? (
                    <div className="bg-primary/10 p-4 rounded-xl flex items-center justify-between border border-primary/20">
                      <span className="font-bold text-gray-800 dark:text-gray-200">Calculated BMI</span>
                      <span className="text-xl font-extrabold text-primary">{profile.bmi}</span>
                    </div>
                  ) : null}
                  
                  <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                    <label className="block text-lg font-bold text-gray-800 dark:text-gray-200 mb-4">Daily Activity Level</label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {ACTIVITY_LEVELS.map(level => (
                        <button
                          key={level.id}
                          onClick={() => setProfile({ ...profile, activityLevel: level.id })}
                          className={`p-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                            profile.activityLevel === level.id
                              ? 'bg-primary text-white border-primary shadow-lg scale-105'
                              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary/50'
                          }`}
                        >
                          {level.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-24 h-24 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={48} className="text-primary" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Profile Complete!</h3>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                  FIB has analyzed your medical data. We're ready to curate the perfect, safe healthy experience for you.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
              step === 1 ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <ArrowLeft size={20} /> Back
          </button>
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all shadow-md"
          >
            {step === 5 ? 'Go to Dashboard' : 'Next'} <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

