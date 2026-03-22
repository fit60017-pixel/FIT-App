import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ShoppingCart, User, Home, Store, Info, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
// التعديل هنا: غيرنا motion/react لـ framer-motion
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const { state, navigate, setUser } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // حلينا مشكلة لو الـ state.cart لسه متمسحش أو مش موجود
  const cartItemCount = state.cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const handleLogout = () => {
    setUser(null);
    navigate('landing');
  };

  const isVendor = state.user?.role === 'vendor';

  return (
    <nav className="bg-[#1B4332] text-white sticky top-0 z-50 mb-0 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button onClick={() => navigate('landing')} className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tighter text-[#D4AF37]">FIT</span>
              <span className="hidden sm:block text-sm font-medium opacity-80">Food Intelligence Tech</span>
            </button>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <button onClick={() => navigate('landing')} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1"><Home size={18}/> Home</button>
            <button onClick={() => navigate('shop')} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1"><Store size={18}/> Shop</button>
            <button onClick={() => navigate('blog')} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1"><Info size={18}/> Blog</button>

            {!isVendor && (
              <button onClick={() => navigate('cart')} className="relative hover:text-[#D4AF37] transition-colors border-l border-white/20 pl-6">
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#1B4332] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}

            {state.user ? (
              <div className="flex items-center gap-4 border-l border-white/20 pl-6">
                <button onClick={() => navigate(isVendor ? 'vendor-dashboard' : 'customer-dashboard')} className="flex items-center gap-2 hover:text-[#D4AF37] transition-colors">
                  {isVendor ? <LayoutDashboard size={20} /> : <User size={20} />}
                  <span className="font-medium">{state.user.name}</span>
                </button>
                <button onClick={handleLogout} className="text-red-300 hover:text-red-400 transition-colors">
                  <LogOut size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4 border-l border-white/20 pl-6">
                <button onClick={() => navigate('login')} className="hover:text-[#D4AF37] transition-colors">Login</button>
                <button onClick={() => navigate('register')} className="bg-[#D4AF37] text-[#1B4332] px-4 py-2 rounded-full font-medium hover:bg-opacity-90 transition-colors">
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden gap-4">
            {!isVendor && (
              <button onClick={() => navigate('cart')} className="relative hover:text-[#D4AF37] transition-colors">
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-[#1B4332] text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </button>
            )}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white hover:text-[#D4AF37]">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-[#081C15] border-t border-white/10 overflow-hidden"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              <button onClick={() => { navigate('landing'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md hover:bg-[#1B4332] hover:text-[#D4AF37]">Home</button>
              <button onClick={() => { navigate('shop'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md hover:bg-[#1B4332] hover:text-[#D4AF37]">Shop</button>
              <button onClick={() => { navigate('blog'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md hover:bg-[#1B4332] hover:text-[#D4AF37]">Blog</button>
              {state.user ? (
                <>
                  <button onClick={() => { navigate(isVendor ? 'vendor-dashboard' : 'customer-dashboard'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md hover:bg-[#1B4332] hover:text-[#D4AF37]">Dashboard</button>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md text-red-300 hover:bg-[#1B4332]">Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => { navigate('login'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md hover:bg-[#1B4332] hover:text-[#D4AF37]">Login</button>
                  <button onClick={() => { navigate('register'); setIsMenuOpen(false); }} className="block w-full text-left px-3 py-2 rounded-md hover:bg-[#1B4332] hover:text-[#D4AF37]">Sign Up</button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
