import React from 'react';
import { Leaf, ShieldCheck, Heart, Users } from 'lucide-react';
import { motion } from 'motion/react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pb-24 md:pb-12 transition-colors duration-300">
      {/* Hero Section */}
      <div className="bg-primary text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight"
          >
            Our Mission at <span className="text-secondary">FIT</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-green-100 font-light leading-relaxed"
          >
            To empower everyone to make smarter, healthier food choices through the power of Artificial Intelligence.
          </motion.p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">The Story Behind FIT</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              FIT (Food Intelligence Tech) was born out of a simple frustration: finding truly healthy, locally-sourced snacks that fit specific medical needs was nearly impossible.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              We combined our passion for nutrition with cutting-edge AI to create FIB, an assistant that doesn't just recommend food, but understands your body's unique requirements.
            </p>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-96 rounded-3xl overflow-hidden shadow-2xl"
          >
            <img
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=1600"
              alt="Our Team"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-8">
              <p className="text-white font-bold text-xl">Proudly Built for Health</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Core Values */}
      <div className="bg-white dark:bg-gray-800 py-24 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">Our Core Values</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">What drives us every single day.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, title: 'Safety First', desc: 'Rigorous vetting of every product for medical compliance.' },
              { icon: Leaf, title: '100% Natural', desc: 'No artificial preservatives, colors, or hidden sugars.' },
              { icon: Users, title: 'Community', desc: 'Supporting local farmers and health brands.' },
              { icon: Heart, title: 'Empathy', desc: 'Understanding the struggles of living with dietary restrictions.' }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-cream dark:bg-gray-700 p-8 rounded-3xl text-center border border-gray-100 dark:border-gray-600 hover:shadow-xl transition-all"
              >
                <div className="bg-secondary/10 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-6">
                  <value.icon size={28} className="text-secondary" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
