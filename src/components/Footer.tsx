import React from 'react';
import { Facebook, Instagram, Linkedin, MapPin, Mail, Phone } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Footer = () => {
  const { state, navigate } = useAppContext();
  const isArabic = state.language === 'ar';

  return (
    <>
      {/* Contact Us Section */}
      <section className="bg-cream dark:bg-gray-900 py-16 border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {isArabic ? 'تواصل معنا' : 'Get in Touch'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {isArabic ? 'نحن هنا لمساعدتك. أرسل لنا رسالة وسنرد عليك في أقرب وقت.' : 'We are here to help. Send us a message and we will get back to you.'}
            </p>
          </div>
          <form className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic ? 'الاسم الكامل' : 'Full Name'}
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-[#FDFBF7] dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder={isArabic ? 'أدخل اسمك الكامل' : 'Enter your full name'}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
                </label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-[#FDFBF7] dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder={isArabic ? 'أدخل بريدك الإلكتروني' : 'Enter your email address'}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {isArabic ? 'الرسالة' : 'Message'}
              </label>
              <textarea
                rows={4}
                className="w-full px-4 py-3 bg-[#FDFBF7] dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder={isArabic ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'}
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-colors shadow-md"
            >
              {isArabic ? 'إرسال الرسالة' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Global Footer */}
      <footer className="bg-primary text-white pt-16 pb-24 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Column 1: Logo & Slogan */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center transform rotate-12">
                  <span className="text-primary font-black text-xl -rotate-12">F</span>
                </div>
                <span className="text-2xl font-black tracking-tight">FIT</span>
              </div>
              <p className="text-green-100/80 text-sm">
                {isArabic ? 'تمكين رحلتك الصحية مع خيارات ذكية وآمنة.' : 'Empowering your health journey with smart, safe choices.'}
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-secondary">{isArabic ? 'روابط سريعة' : 'Quick Links'}</h3>
              <ul className="space-y-3">
                <li>
                  <button onClick={() => navigate('landing')} className="text-green-100/80 hover:text-white transition-colors">
                    {isArabic ? 'الرئيسية' : 'Home'}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('shop')} className="text-green-100/80 hover:text-white transition-colors">
                    {isArabic ? 'المنتجات' : 'Products'}
                  </button>
                </li>
                <li>
                  <button onClick={() => navigate('about')} className="text-green-100/80 hover:text-white transition-colors">
                    {isArabic ? 'معلومات عنا' : 'About Us'}
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact Info */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-secondary">{isArabic ? 'معلومات الاتصال' : 'Contact Info'}</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-green-100/80">
                  <Phone size={20} className="shrink-0 mt-0.5" />
                  <span>+20 123 456 7890</span>
                </li>
                <li className="flex items-start gap-3 text-green-100/80">
                  <Mail size={20} className="shrink-0 mt-0.5" />
                  <span>support@fit.com</span>
                </li>
                <li className="flex items-start gap-3 text-green-100/80">
                  <MapPin size={20} className="shrink-0 mt-0.5" />
                  <span>{isArabic ? 'الشيخ زايد، الجيزة' : 'Sheikh Zayed, Giza'}</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Socials */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-secondary">{isArabic ? 'تابعنا' : 'Follow Us'}</h3>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all">
                  <Facebook size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all">
                  <Instagram size={20} />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all">
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/20 text-center text-green-100/60 text-sm">
            <p>© 2026 FIT - All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
};
