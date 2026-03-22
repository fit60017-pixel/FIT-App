import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, HealthProfile, Product, CartItem, Order, Review, BlogPost, Notification } from '../types';
import { Mail, Lock, User as UserIcon, ArrowRight, Store, UserCircle, Phone, CreditCard, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Custom Mint Green Marker
const mintIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const LoginPage = () => {
  const { setUser, navigate, state } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Check if user exists in state.users
    const existingUser = state.users.find(u => u.email === email);
    
    if (!existingUser) {
      alert('Account not found. Please create an account first!');
      setError('Account not found. Please create an account first!');
      return;
    }

    if (existingUser.password !== password) {
      setError('Incorrect password. Please try again.');
      return;
    }

    if (existingUser.role !== role) {
      setError(`This account is registered as a ${existingUser.role}. Please select the correct role.`);
      return;
    }
    
    setUser(existingUser);
    navigate(role === 'vendor' ? 'vendor-dashboard' : 'customer-dashboard');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-cream dark:bg-gray-900 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 pb-24 md:pb-12"
    >
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary dark:text-primary-dark">
            Welcome Back to FIT
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Or{' '}
            <button onClick={() => navigate('register')} className="font-medium text-secondary hover:text-secondary-dark transition-colors">
              create a new account
            </button>
          </p>
        </div>
        
        {/* Role Selection */}
        <div className="flex gap-4 mt-6">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex-1 py-4 px-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
              role === 'customer' 
                ? 'border-primary bg-primary/5 text-primary' 
                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary/50'
            }`}
          >
            <UserCircle size={28} />
            <span className="font-bold">Customer</span>
          </button>
          <button
            type="button"
            onClick={() => setRole('vendor')}
            className={`flex-1 py-4 px-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
              role === 'vendor' 
                ? 'border-secondary bg-secondary/5 text-secondary' 
                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-secondary/50'
            }`}
          >
            <Store size={28} />
            <span className="font-bold">Vendor</span>
          </button>
        </div>

        <div className="relative mt-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with email</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                required
                className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white transition-all shadow-lg hover:shadow-xl ${
                role === 'vendor' ? 'bg-secondary hover:bg-secondary-dark focus:ring-secondary' : 'bg-primary hover:bg-primary-dark focus:ring-primary'
              }`}
            >
              Sign in
              <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                <ArrowRight className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
              </span>
            </button>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3">
            <button className="flex justify-center items-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-5 w-5" alt="Google" />
            </button>
            <button className="flex justify-center items-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <img src="https://www.svgrepo.com/show/303114/facebook-3.svg" className="h-5 w-5" alt="Facebook" />
            </button>
            <button className="flex justify-center items-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <img src="https://www.svgrepo.com/show/303113/apple-black.svg" className="h-5 w-5 dark:invert" alt="Apple" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const RegisterPage = () => {
  const { setUser, registerUser, navigate, state } = useAppContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'vendor'>('customer');
  const [mobileNumber, setMobileNumber] = useState('');
  const [nationalId, setNationalId] = useState('');
  const [address, setAddress] = useState('');
  const [storeName, setStoreName] = useState('');
  const [deliveryLocation, setDeliveryLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [error, setError] = useState('');

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        setDeliveryLocation(e.latlng);
      },
    });

    return deliveryLocation === null ? null : (
      <Marker position={deliveryLocation} icon={mintIcon} />
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!email || !password || !mobileNumber || !nationalId || !address) {
      setError('Please fill in all required fields');
      return;
    }
    if (nationalId.length !== 14 || !/^\d+$/.test(nationalId)) {
      setError('National ID must be exactly 14 digits');
      return;
    }
    if (role === 'vendor' && !storeName.trim()) {
      setError('Please enter your store/brand name');
      return;
    }
    if (role === 'customer' && !deliveryLocation) {
      setError('Please select your delivery location on the map');
      return;
    }
    
    // Check if user already exists
    if (state.users.some(u => u.email === email && u.role === role)) {
      setError('An account with this email already exists for this role');
      return;
    }

    const newUser: User = { 
      id: `u_${Date.now()}`, 
      name, 
      email, 
      password,
      role, 
      favorites: [],
      mobileNumber,
      nationalId,
      address,
      storeName: role === 'vendor' ? storeName : undefined,
      deliveryLocation: role === 'customer' ? deliveryLocation : undefined
    };
    
    registerUser(newUser);
    
    if (role === 'customer') {
      navigate('quiz');
    } else {
      navigate('vendor-dashboard');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-cream dark:bg-gray-900 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 pb-24 md:pb-12"
    >
      <div className="max-w-4xl w-full space-y-8 bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-primary dark:text-primary-dark">
            Join FIT Today
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <button onClick={() => navigate('login')} className="font-medium text-secondary hover:text-secondary-dark transition-colors">
              Sign in
            </button>
          </p>
        </div>

        {/* Role Selection */}
        <div className="flex gap-4 mt-6 max-w-md mx-auto">
          <button
            onClick={() => setRole('customer')}
            className={`flex-1 py-4 px-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
              role === 'customer' 
                ? 'border-primary bg-primary/5 text-primary' 
                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary/50'
            }`}
          >
            <UserCircle size={28} />
            <span className="font-bold">Customer</span>
          </button>
          <button
            onClick={() => setRole('vendor')}
            className={`flex-1 py-4 px-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
              role === 'vendor' 
                ? 'border-secondary bg-secondary/5 text-secondary' 
                : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-secondary/50'
            }`}
          >
            <Store size={28} />
            <span className="font-bold">Vendor</span>
          </button>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && <div className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100">{error}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              {role === 'vendor' && (
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Store className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm transition-all"
                    placeholder="Store / Brand Name"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                  />
                </div>
              )}

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  required
                  className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  maxLength={14}
                  className={`appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 border ${nationalId.length > 0 && nationalId.length !== 14 ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} bg-white dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all`}
                  placeholder="National ID (14 digits)"
                  value={nationalId}
                  onChange={(e) => setNationalId(e.target.value.replace(/\D/g, ''))}
                />
                {nationalId.length > 0 && nationalId.length !== 14 && (
                  <p className="text-red-500 text-[10px] mt-1 ml-2 font-bold uppercase">Must be 14 digits</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute top-4 left-3 pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <textarea
                  required
                  rows={3}
                  className="appearance-none rounded-xl relative block w-full px-3 py-4 pl-10 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 placeholder-gray-500 text-gray-900 dark:text-white focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-all"
                  placeholder="Detailed Address (Street, Building, Apartment...)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>

              {role === 'customer' && (
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MapPin className="text-primary" size={16} /> Select Delivery Location
                  </label>
                  <div className="h-[200px] w-full rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 relative z-10">
                    <MapContainer center={[30.0444, 31.2357]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <LocationMarker />
                    </MapContainer>
                  </div>
                  {deliveryLocation && (
                    <p className="text-[10px] text-primary font-bold">
                      Location Captured: {deliveryLocation.lat.toFixed(4)}, {deliveryLocation.lng.toFixed(4)}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-xl text-white transition-all shadow-lg hover:shadow-xl ${
                role === 'vendor' ? 'bg-secondary hover:bg-secondary-dark focus:ring-secondary' : 'bg-primary hover:bg-primary-dark focus:ring-primary'
              }`}
            >
              Create Account
              <span className="absolute right-0 inset-y-0 flex items-center pr-3">
                <ArrowRight className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
              </span>
            </button>
          </div>
        </form>

        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">Or join with</span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 max-w-md mx-auto">
            <button className="flex justify-center items-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <img src="https://www.svgrepo.com/show/355037/google.svg" className="h-5 w-5" alt="Google" />
            </button>
            <button className="flex justify-center items-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <img src="https://www.svgrepo.com/show/303114/facebook-3.svg" className="h-5 w-5" alt="Facebook" />
            </button>
            <button className="flex justify-center items-center py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <img src="https://www.svgrepo.com/show/303113/apple-black.svg" className="h-5 w-5 dark:invert" alt="Apple" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

