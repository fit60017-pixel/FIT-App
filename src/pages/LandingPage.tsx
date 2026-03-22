import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowRight, Leaf, ShieldCheck, Zap, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SLIDES = [
  {
    image: 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=1920',
    title: 'Premium Health Snacks',
    subtitle: 'Roasted Almonds & Walnuts for peak performance.'
  },
  {
    image: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&q=80&w=1920',
    title: 'Pure Cocoa Bliss',
    subtitle: 'Glistening dark chocolate, healthy and guilt-free.'
  },
  {
    image: 'https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?auto=format&fit=crop&q=80&w=1920',
    title: 'Natural Energy',
    subtitle: 'Fresh oat and mixed berries granola bowls.'
  }
];

export const LandingPage = () => {
  const { navigate } = useAppContext();
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pb-20 md:pb-0 transition-colors duration-300">
      {/* Hero Slider Section */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden bg-black">
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 z-0"
          >
            <img 
              src={SLIDES[currentSlide].image} 
              alt={SLIDES[currentSlide].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pointer-events-auto">
            <motion.div
              key={`text-${currentSlide}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <h1 className="text-5xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl tracking-tight">
                {SLIDES[currentSlide].title}
              </h1>
              <p className="text-xl md:text-3xl text-white/90 mb-10 font-light drop-shadow-lg max-w-2xl mx-auto">
                {SLIDES[currentSlide].subtitle}
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => navigate('quiz')}
                  className="bg-primary text-secondary-dark px-10 py-5 rounded-full font-black text-xl hover:bg-primary-dark hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2 border-2 border-primary-dark/20"
                >
                  Start Your Journey <ArrowRight size={24} />
                </button>
                <button
                  onClick={() => navigate('shop')}
                  className="bg-white/10 backdrop-blur-md border-2 border-white/30 text-white px-10 py-5 rounded-full font-black text-xl hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  Shop Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Slider Controls */}
        <div className="absolute bottom-10 left-0 right-0 z-30 flex justify-center gap-4">
          {SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition-all ${currentSlide === idx ? 'bg-primary w-10' : 'bg-white/50'}`}
            />
          ))}
        </div>

        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-all hidden md:block"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-black/20 text-white hover:bg-black/40 backdrop-blur-sm transition-all hidden md:block"
        >
          <ChevronRight size={32} />
        </button>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">How FIT Works</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Three simple steps to a healthier, smarter lifestyle tailored just for you.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { icon: Leaf, title: '1. Build Your Profile', desc: 'Take our 5-step medical wizard to tell us about your allergies, goals, and preferences.' },
              { icon: Zap, title: '2. Get AI Recommendations', desc: 'FIB, our AI assistant, filters out what harms you and highlights what heals you.' },
              { icon: ShieldCheck, title: '3. Shop Safely', desc: 'Look for the "FIB Verified" badge on products that perfectly match your health profile.' }
            ].map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-cream dark:bg-gray-700 p-8 rounded-3xl text-center hover:shadow-xl transition-all border border-gray-100 dark:border-gray-600"
              >
                <div className="bg-primary/10 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6">
                  <step.icon size={32} className="text-primary dark:text-primary-light" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{step.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials & Brand */}
      <section className="py-24 bg-cream dark:bg-gray-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-primary rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-12">Trusted by 10,000+ Egyptians</h2>
              
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {[
                  { name: 'Ahmed M.', text: '"As a diabetic, finding safe snacks was a nightmare. FIT changed my life. The FIB Verified badge gives me peace of mind."' },
                  { name: 'Sarah K.', text: '"The AI recommendations are spot on. I love the local Egyptian healthy brands they feature. Proudly Made in Egypt!"' }
                ].map((test, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-md p-8 rounded-2xl text-left border border-white/20">
                    <div className="flex text-secondary mb-4">
                      {[...Array(5)].map((_, i) => <Star key={i} size={20} fill="currentColor" />)}
                    </div>
                    <p className="text-lg font-light italic mb-6">"{test.text}"</p>
                    <p className="font-bold">— {test.name}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-16 pt-8 border-t border-white/20 inline-block">
                <p className="text-sm font-medium tracking-widest uppercase text-green-200">Proudly Made in Egypt 🇪🇬</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};
