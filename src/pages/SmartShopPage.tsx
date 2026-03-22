import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product } from '../types';
import { Search, Filter, ShieldCheck, ShoppingCart, CheckCircle2, MilkOff, NutOff, CandyOff, Edit, Trash2, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const SmartShopPage = () => {
  const { state, navigate, addToCart, toggleFavorite } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAllergensFree, setSelectedAllergensFree] = useState<string[]>([]);

  const filteredProducts = useMemo(() => {
    let filtered = state.products;

    // Apply Search
    if (searchQuery) {
      filtered = filtered.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Apply Tags Filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(p => selectedTags.every(tag => p.tags.includes(tag)));
    }

    // Apply Allergens Free Filter
    if (selectedAllergensFree.length > 0) {
      filtered = filtered.filter(p => selectedAllergensFree.every(allergen => !p.allergens.includes(allergen)));
    }

    return filtered;
  }, [state.products, searchQuery, selectedTags, selectedAllergensFree]);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
    setToast(`Added ${product.name} to cart`);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pb-24 md:pb-12 transition-colors duration-300">
      {/* Header */}
      <div className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold mb-4"
          >
            Smart Shop
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-green-100 text-lg max-w-2xl"
          >
            {state.user?.healthProfile
              ? "FIB has filtered these products specifically for your health profile. Look for the 'FIB Verified' badge!"
              : "Discover Egypt's finest healthy snacks. Take the Health Quiz for personalized recommendations."}
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 flex gap-4 max-w-xl"
          >
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border-transparent rounded-xl leading-5 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-secondary sm:text-sm transition-all shadow-sm"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`p-3 rounded-xl transition-colors border ${showFilters ? 'bg-white/20 border-white/40' : 'bg-white/10 hover:bg-white/20 border-white/20'}`}
            >
              <Filter className="h-5 w-5 text-white" />
            </button>
          </motion.div>

          {/* Filters Section */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 sm:p-6 space-y-4 max-w-xl">
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Health Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {['vegan', 'keto', 'sugar-free', 'organic', 'gluten-free'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                            selectedTags.includes(tag) 
                              ? 'bg-secondary text-white border-secondary' 
                              : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Allergen Free</h3>
                    <div className="flex flex-wrap gap-2">
                      {['dairy', 'nuts', 'eggs', 'soy', 'seafood', 'gluten'].map(allergen => (
                        <button
                          key={allergen}
                          onClick={() => setSelectedAllergensFree(prev => prev.includes(allergen) ? prev.filter(a => a !== allergen) : [...prev, allergen])}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                            selectedAllergensFree.includes(allergen) 
                              ? 'bg-secondary text-white border-secondary' 
                              : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          {allergen.charAt(0).toUpperCase() + allergen.slice(1)} Free
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {state.products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400">No products available yet. FIB is waiting for Vendors to stock the shelves!</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 dark:text-gray-400">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product, index) => {
              const healthProfile = state.user?.healthProfile;
              
              const checkCompatibility = (profile: any, prod: Product) => {
                let isBlocked = false;
                let blockReasons: string[] = [];

                if (!profile) return { isBlocked, blockReasons };

                if (profile.chronicDiseases.includes('diabetes') && (prod.sugars > 5 || prod.tags.includes('high-sugar') || prod.tags.includes('sweet')) && !prod.tags.includes('sugar-free')) {
                  isBlocked = true;
                  blockReasons.push('Contains Sugar - Not for Diabetics');
                }
                
                if (profile.allergies.includes('nuts') && prod.allergens.includes('nuts')) {
                  isBlocked = true;
                  blockReasons.push('Contains Nuts - Not for Nut Allergy');
                }
                
                if (profile.chronicDiseases.includes('hypertension') && (prod.tags.includes('high-sodium') || prod.tags.includes('salty'))) {
                  isBlocked = true;
                  blockReasons.push('High in Sodium - Not for Hypertension');
                }

                if ((profile.chronicDiseases.includes('celiac') || profile.allergies.includes('gluten')) && prod.allergens.includes('gluten')) {
                  isBlocked = true;
                  blockReasons.push('Contains Gluten - Not for Celiac/Gluten Allergy');
                }

                if (profile.allergies.includes('dairy') && prod.allergens.includes('dairy')) {
                  isBlocked = true;
                  blockReasons.push('Contains Dairy - Not for Dairy Allergy');
                }

                return { isBlocked, blockReasons };
              };

              const { isBlocked, blockReasons } = checkCompatibility(healthProfile, product);

              const isFibVerified = healthProfile && !isBlocked && product.tags.some(tag => 
                ((healthProfile.chronicDiseases.includes('celiac') || healthProfile.allergies.includes('gluten')) && tag === 'gluten-free') ||
                (healthProfile.chronicDiseases.includes('diabetes') && tag === 'sugar-free')
              );
              
              const isDairyFree = !product.allergens.includes('dairy');
              const isNutFree = !product.allergens.includes('nuts');
              const isSugarFree = product.tags.includes('sugar-free');
              const isOwner = state.user?.email === product.vendorEmail;
              const isFavorite = state.user?.favorites.includes(product.id);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate('product', product)}
                  className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 cursor-pointer group flex flex-col relative"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className={`w-full h-full object-cover transition-transform duration-500 ${isBlocked ? 'grayscale opacity-50' : 'group-hover:scale-105'}`}
                    />
                    
                    {isBlocked && (
                      <div className="absolute inset-0 bg-red-900/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-white p-4 text-center">
                        <ShieldCheck size={32} className="text-red-300 mb-2" />
                        <span className="font-bold text-lg mb-1">Medical Block</span>
                        <span className="text-sm font-medium">{blockReasons.join(' • ')}</span>
                      </div>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!state.user) {
                          navigate('login');
                          return;
                        }
                        toggleFavorite(product.id);
                      }}
                      className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md transition-all z-30 ${
                        isFavorite 
                          ? 'bg-red-500 text-white shadow-lg scale-110' 
                          : 'bg-white/80 dark:bg-gray-900/80 text-gray-400 hover:text-red-500 hover:scale-110'
                      }`}
                    >
                      <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
                    </button>
                    {isFibVerified && (
                      <div className="absolute top-4 left-4 bg-mint text-primary-dark text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg z-30">
                        <ShieldCheck size={14} className="text-primary-dark" /> FIB Verified
                      </div>
                    )}
                    <div className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-bold px-2 py-1 rounded-lg shadow-sm z-30">
                      {product.calories} kcal
                    </div>
                  </div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-1">{product.name}</h3>
                      <div className="flex flex-col items-end">
                        <span className="text-lg font-extrabold text-secondary whitespace-nowrap ml-4">EGP {product.price}</span>
                        {product.stock > 0 && product.stock < 10 && (
                          <span className="text-[10px] font-bold text-red-500 animate-pulse">Limited Quantity!</span>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4 flex-1">{product.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {isDairyFree && (
                         <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-1 rounded-md">
                           <MilkOff size={12} /> Dairy-Free
                         </div>
                      )}
                      {isNutFree && (
                         <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 px-2 py-1 rounded-md">
                           <NutOff size={12} /> Nut-Free
                         </div>
                      )}
                      {isSugarFree && (
                         <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded-md">
                           <CandyOff size={12} /> Sugar-Free
                         </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.tags.filter(t => t !== 'sugar-free').slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] font-bold uppercase tracking-wider bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleAddToCart(e, product)}
                        disabled={!product.available || product.stock <= 0 || isBlocked}
                        className={`flex-1 border font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors group/btn ${
                          product.available && product.stock > 0 && !isBlocked
                            ? 'bg-cream dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-primary dark:text-primary-light hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white hover:border-primary dark:hover:border-primary'
                            : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <ShoppingCart size={18} className={product.available && product.stock > 0 && !isBlocked ? "group-hover/btn:scale-110 transition-transform" : ""} />
                        {isBlocked ? 'Incompatible' : (product.available && product.stock > 0 ? 'Add to Cart' : 'Out of Stock')}
                      </button>

                      {isOwner && (
                        <div className="flex gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate('vendor-dashboard'); }}
                            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-colors"
                            title="Edit Product"
                          >
                            <Edit size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-24 md:bottom-10 left-1/2 bg-primary text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 z-50"
          >
            <CheckCircle2 size={20} className="text-secondary" />
            <span className="font-medium">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
