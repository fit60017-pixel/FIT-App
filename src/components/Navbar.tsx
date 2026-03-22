import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ShoppingCart, User, Home, Store, Info, LogOut, Menu, X, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion'; // تأكد إنها framer-motion

export const Navbar = () => {
  const { state, navigate, setUser } = useAppContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const cartItemCount = state.cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className="bg-[#1B4332] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 flex justify-between h-16 items-center">
        <button onClick={() => navigate('landing')} className="text-2xl font-bold text-[#D4AF37]">FIT</button>
        <div className="hidden md:flex space-x-6">
          <button onClick={() => navigate('landing')}>Home</button>
          <button onClick={() => navigate('about')}>About</button>
          <button onClick={() => navigate('quiz')}>Quiz</button>
        </div>
      </div>
    </nav>
  );
};
