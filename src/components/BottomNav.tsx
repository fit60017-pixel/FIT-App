import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Home, Store, ShoppingCart, User, LayoutDashboard } from 'lucide-react';

export const BottomNav = () => {
  const { state, navigate } = useAppContext();
  const cartItemCount = state.cart.reduce((acc, item) => acc + item.quantity, 0);

  const isVendor = state.user?.role === 'vendor';
  const dashboardRoute = isVendor ? 'vendor-dashboard' : 'customer-dashboard';

  const navItems = [
    { id: 'landing', icon: Home, label: 'Home' },
    { id: 'shop', icon: Store, label: 'Shop' },
    { id: 'cart', icon: ShoppingCart, label: 'Cart', badge: cartItemCount, hideForVendor: true },
    { id: state.user ? dashboardRoute : 'login', icon: isVendor ? LayoutDashboard : User, label: isVendor ? 'Dashboard' : 'Profile' },
  ];

  return (
    <div className="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 z-40 pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.filter(item => !(isVendor && item.hideForVendor)).map((item) => {
          const isActive = state.currentPage === item.id || (item.id === dashboardRoute && state.currentPage === 'login');
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                isActive ? 'text-primary' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              <div className="relative">
                <item.icon size={24} className={isActive ? 'fill-current opacity-20' : ''} />
                {item.badge && item.badge > 0 ? (
                  <span className="absolute -top-1 -right-2 bg-secondary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
