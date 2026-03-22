import React from 'react';
import { AppProvider, useAppContext } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { FibAssistant } from './components/FibAssistant';

import { LandingPage } from './pages/LandingPage';
import { LoginPage, RegisterPage } from './pages/AuthPages';
import { HealthQuizPage } from './pages/HealthQuizPage';
import { SmartShopPage } from './pages/SmartShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CustomerDashboardPage } from './pages/CustomerDashboardPage';
import { VendorDashboardPage } from './pages/VendorDashboardPage';
import { CartPage } from './pages/CartPage';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';

import { Footer } from './components/Footer';

const PageRouter = () => {
  const { state } = useAppContext();

  switch (state.currentPage) {
    case 'landing':
      return <LandingPage />;
    case 'login':
      return <LoginPage />;
    case 'register':
      return <RegisterPage />;
    case 'quiz':
      return <HealthQuizPage />;
    case 'marketplace':
    case 'shop':
      return <SmartShopPage />;
    case 'product':
      return <ProductDetailsPage />;
    case 'profile':
    case 'customer-dashboard':
      return <CustomerDashboardPage />;
    case 'vendor-dashboard':
      return <VendorDashboardPage />;
    case 'cart':
      return <CartPage />;
    case 'about':
      return <AboutPage />;
    case 'blog':
      return <BlogPage />;
    default:
      return <LandingPage />;
  }
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-cream text-gray-900 font-sans transition-colors duration-300">
        <Navbar />
        <main className="relative z-0">
          <PageRouter />
        </main>
        <Footer />
        <FibAssistant />
        <BottomNav />
      </div>
    </AppProvider>
  );
}
