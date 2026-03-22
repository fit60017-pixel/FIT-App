import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { User, Activity, ShieldAlert, Heart, Settings, LogOut, ChevronRight, Package, Trash2, ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';

export const CustomerDashboardPage = () => {
  const { state, navigate, setUser, toggleFavorite, addToCart, setHealthProfile } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'preferences'>('overview');

  useEffect(() => {
    if (!state.user || state.user.role !== 'customer') {
      navigate('login');
    }
  }, [state.user, navigate]);

  if (!state.user) return null;

  const handleLogout = () => {
    setUser(null);
    navigate('landing');
  };

  const favoriteProducts = state.products.filter(p => state.user?.favorites.includes(p.id));
  const myOrders = state.orders.filter(order => order.customerEmail === state.user?.email);
  const healthProfile = state.user?.healthProfile;

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pb-24 md:pb-12">
      {/* Header */}
      <div className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-6">
          <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-white/20">
            {state.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold mb-1">Welcome, {state.user.name}</h1>
            <p className="text-mint text-lg flex items-center gap-2">
              <ShieldAlert size={18} /> Health Profile Active
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white">Dashboard Menu</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center justify-between p-4 transition-colors text-left ${activeTab === 'overview' ? 'bg-primary/5 text-primary dark:text-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <Activity size={20} className={activeTab === 'overview' ? 'text-primary' : 'text-gray-400'} />
                    <span className="font-medium">Overview</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === 'overview' ? 'text-primary' : 'text-gray-400'} />
                </button>
                <button 
                  onClick={() => setActiveTab('favorites')}
                  className={`w-full flex items-center justify-between p-4 transition-colors text-left ${activeTab === 'favorites' ? 'bg-primary/5 text-primary dark:text-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <Heart size={20} className={activeTab === 'favorites' ? 'text-primary' : 'text-gray-400'} />
                    <span className="font-medium">Favorites</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === 'favorites' ? 'text-primary' : 'text-gray-400'} />
                </button>
                <button 
                  onClick={() => setActiveTab('preferences')}
                  className={`w-full flex items-center justify-between p-4 transition-colors text-left ${activeTab === 'preferences' ? 'bg-primary/5 text-primary dark:text-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <Settings size={20} className={activeTab === 'preferences' ? 'text-primary' : 'text-gray-400'} />
                    <span className="font-medium">Preferences</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === 'preferences' ? 'text-primary' : 'text-gray-400'} />
                </button>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="w-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/30"
            >
              <LogOut size={20} />
              Log Out
            </button>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-12">
                {/* Body Metrics Section */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Activity className="text-primary" /> Body Metrics
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-12">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Weight (kg)</label>
                      </div>
                      <input 
                        type="number" 
                        min="40" 
                        max="200" 
                        value={healthProfile?.weight || ''} 
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          const heightInMeters = (healthProfile?.height || 0) / 100;
                          const bmi = heightInMeters > 0 ? parseFloat((val / (heightInMeters * heightInMeters)).toFixed(1)) : undefined;
                          setHealthProfile(healthProfile ? { ...healthProfile, weight: val, bmi } : {
                            dietaryPreference: 'none',
                            allergies: [],
                            goals: [],
                            weight: val,
                            height: 0,
                            activityLevel: 'moderate',
                            bmi
                          });
                        }}
                        className="w-full px-4 py-3 bg-[#FDFBF7] dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter weight in kg"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Height (cm)</label>
                      </div>
                      <input 
                        type="number" 
                        min="100" 
                        max="250" 
                        value={healthProfile?.height || ''} 
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          const heightInMeters = val / 100;
                          const weight = healthProfile?.weight || 0;
                          const bmi = heightInMeters > 0 && weight > 0 ? parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1)) : undefined;
                          setHealthProfile(healthProfile ? { ...healthProfile, height: val, bmi } : {
                            dietaryPreference: 'none',
                            allergies: [],
                            goals: [],
                            weight: 0,
                            height: val,
                            activityLevel: 'moderate',
                            bmi
                          });
                        }}
                        className="w-full px-4 py-3 bg-[#FDFBF7] dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Enter height in cm"
                      />
                    </div>
                  </div>
                </div>

                {/* Health Overview */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Activity className="text-secondary" /> Health Overview
                    </h2>
                    <button onClick={() => navigate('quiz')} className="text-sm font-medium text-primary hover:underline">
                      Edit Profile
                    </button>
                  </div>
                  
                  {healthProfile ? (
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl border border-gray-100 dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Daily Calorie Limit</p>
                        <p className="text-3xl font-extrabold text-primary dark:text-primary-dark">
                          {((healthProfile.weight || 0) * 24 * (healthProfile.activityLevel === 'active' ? 1.5 : 1.2)).toFixed(0)} kcal
                        </p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-2xl border border-gray-100 dark:border-gray-600">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">BMI</p>
                        <p className="text-3xl font-extrabold text-secondary">
                          {healthProfile.height ? ((healthProfile.weight || 0) / Math.pow(healthProfile.height / 100, 2)).toFixed(1) : '0.0'}
                        </p>
                      </div>
                      <div className="sm:col-span-2 bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
                        <p className="text-sm text-red-500 dark:text-red-400 font-medium mb-3 flex items-center gap-2">
                          <ShieldAlert size={16} /> Medical Tags & Allergies
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {healthProfile.chronicDiseases.map(disease => (
                            <span key={disease} className="bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 px-3 py-1 rounded-full text-sm font-bold capitalize">{disease}</span>
                          ))}
                          {healthProfile.allergies.map(allergy => (
                            <span key={allergy} className="bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 px-3 py-1 rounded-full text-sm font-bold capitalize">Allergy: {allergy}</span>
                          ))}
                          {healthProfile.chronicDiseases.length === 0 && healthProfile.allergies.length === 0 && (
                            <span className="text-gray-500 dark:text-gray-400 italic">No medical conditions reported.</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't completed your health profile yet.</p>
                      <button onClick={() => navigate('quiz')} className="bg-secondary text-white px-6 py-2 rounded-full font-bold hover:bg-secondary-dark transition-colors">
                        Take the Quiz
                      </button>
                    </div>
                  )}
                </div>

                {/* Recent Orders */}
                <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <Package className="text-primary" /> Recent Orders
                  </h2>
                  {myOrders.length > 0 ? (
                    <div className="space-y-4">
                      {myOrders.map(order => (
                        <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 dark:border-gray-700 rounded-2xl">
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">Order {order.id}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-secondary">EGP {order.total}</p>
                            <div className="flex flex-col items-end gap-1">
                              <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'processing' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status}
                              </span>
                              <div className="flex gap-1 mt-1">
                                <div className={`h-1 w-4 rounded-full ${['pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-primary' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 w-4 rounded-full ${['processing', 'shipped', 'delivered'].includes(order.status) ? 'bg-primary' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 w-4 rounded-full ${['shipped', 'delivered'].includes(order.status) ? 'bg-primary' : 'bg-gray-200'}`}></div>
                                <div className={`h-1 w-4 rounded-full ${['delivered'].includes(order.status) ? 'bg-primary' : 'bg-gray-200'}`}></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 dark:bg-gray-700 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
                      <Package size={48} className="mx-auto text-gray-300 dark:text-gray-500 mb-4" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No orders yet.</p>
                      <button onClick={() => navigate('shop')} className="mt-4 text-primary font-bold hover:underline">
                        Start Shopping
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'favorites' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Heart className="text-red-500" /> Your Favorites
                </h2>
                {favoriteProducts.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-6">
                    {favoriteProducts.map(product => (
                      <div key={product.id} className="flex gap-4 p-4 border border-gray-100 dark:border-gray-700 rounded-2xl">
                        <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-xl" />
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{product.name}</h3>
                          <p className="text-secondary font-bold">EGP {product.price}</p>
                          <div className="mt-2 flex gap-2">
                            <button onClick={() => addToCart(product)} className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
                              <ShoppingCart size={16} />
                            </button>
                            <button onClick={() => toggleFavorite(product.id)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Heart size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">You haven't saved any favorites yet.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'preferences' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                  <Settings className="text-gray-500" /> Account Preferences
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Notifications</label>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="emailNotif" className="w-5 h-5 rounded text-primary focus:ring-primary" defaultChecked />
                      <label htmlFor="emailNotif" className="text-gray-600 dark:text-gray-400">Receive weekly health tips and offers</label>
                    </div>
                  </div>
                  <hr className="border-gray-100 dark:border-gray-700" />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Data Privacy</label>
                    <div className="flex items-center gap-3">
                      <input type="checkbox" id="dataPrivacy" className="w-5 h-5 rounded text-primary focus:ring-primary" defaultChecked />
                      <label htmlFor="dataPrivacy" className="text-gray-600 dark:text-gray-400">Allow FIB AI to use my health data for personalized recommendations</label>
                    </div>
                  </div>
                  <button className="mt-4 bg-primary text-white px-6 py-2 rounded-xl font-bold hover:bg-primary-dark transition-colors">
                    Save Preferences
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
