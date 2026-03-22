import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { ArrowLeft, ShoppingCart, ShieldCheck, Heart, Share2, Info, Zap, CheckCircle2, Calendar, MapPin, Store, AlertTriangle, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { analyzeProductSafety } from '../services/geminiService';

export const ProductDetailsPage = () => {
  const { state, navigate, addToCart } = useAppContext();
  const product = state.selectedProduct;
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<{ verdict: 'Safe' | 'Caution' | 'Unsafe'; score: number; explanation: string } | null>(null);

  useEffect(() => {
    if (!product) {
      navigate('shop');
    }
  }, [product, navigate]);

  if (!product) {
    return null;
  }

  const handleScanWithFIB = async () => {
    if (!state.user) {
      setToast('Please log in to use FIB analysis');
      return;
    }
    
    setIsAnalyzing(true);
    try {
      const result = await analyzeProductSafety(product, state.user);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      setToast('FIB analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setToast(`Added ${quantity} ${product.name} to cart`);
    setTimeout(() => setToast(null), 3000);
  };

  const checkCompatibility = (profile: any, prod: any) => {
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

  const { isBlocked, blockReasons } = checkCompatibility(state.user?.healthProfile, product);

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pb-24 md:pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('shop')}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light transition-colors mb-8 font-medium"
        >
          <ArrowLeft size={20} /> Back to Shop
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row"
        >
          {/* Image Gallery */}
          <div className="md:w-1/2 relative h-96 md:h-auto">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover ${isBlocked ? 'grayscale opacity-50' : ''}`}
            />
            {isBlocked && (
              <div className="absolute inset-0 bg-red-900/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-white p-4 text-center">
                <ShieldCheck size={48} className="text-red-300 mb-4" />
                <span className="font-bold text-2xl mb-2">Medical Block</span>
                <span className="text-lg font-medium">{blockReasons.join(' • ')}</span>
              </div>
            )}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
              <button className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-md">
                <Heart size={20} />
              </button>
              <button className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-gray-700 transition-all shadow-md">
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-primary font-bold uppercase tracking-widest text-sm mb-1">{product.brand}</p>
                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-2">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <div className="text-secondary font-bold text-2xl">
                    EGP {product.price}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">
                    {product.weightSize}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <span key={tag} className="text-xs font-bold uppercase tracking-wider bg-green-50 dark:bg-green-900/20 text-primary dark:text-primary-light px-3 py-1.5 rounded-lg border border-green-100 dark:border-green-900/30">
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Full Ingredients</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {product.allergens.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Allergen Warnings</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.allergens.map(allergen => (
                      <span key={allergen} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold border border-red-100 dark:border-red-900/30 flex items-center gap-1">
                        <AlertTriangle size={12} /> Contains {allergen}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Nutritional Facts Grid */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-3xl p-6 mb-8 border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Info size={20} className="text-primary" /> Nutritional Facts <span className="text-xs font-normal text-gray-500">(per serving)</span>
              </h3>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Calories</p>
                  <p className="text-xl font-black text-gray-900 dark:text-white">{product.calories}</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Protein</p>
                  <p className="text-xl font-black text-secondary">{product.protein}g</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Carbs</p>
                  <p className="text-xl font-black text-blue-500">{product.carbs}g</p>
                </div>
                <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                  <p className="text-xs text-gray-500 mb-1">Fats</p>
                  <p className="text-xl font-black text-orange-500">{product.fats}g</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Fibers:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{product.fibers}g</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Sugars:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{product.sugars}g</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Sat. Fats:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{product.saturatedFats}g</span>
                  </div>
                  <div className="flex justify-between text-gray-600 dark:text-gray-400">
                    <span>Unsat. Fats:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{product.unsaturatedFats}g</span>
                  </div>
                </div>
              </div>
            </div>

            {/* FIB Analysis Section */}
            <div className="mb-8">
              {!analysis ? (
                <button
                  onClick={handleScanWithFIB}
                  disabled={isAnalyzing}
                  className="w-full py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-bold rounded-2xl shadow-lg shadow-primary/20 flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform disabled:opacity-70"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      FIB is Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Scan with FIB AI Analysis
                    </>
                  )}
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-6 rounded-3xl border-2 ${
                    analysis.verdict === 'Safe' 
                      ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                      : analysis.verdict === 'Caution'
                      ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                      : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className={`p-2 rounded-xl ${
                        analysis.verdict === 'Safe' ? 'bg-primary' : analysis.verdict === 'Caution' ? 'bg-yellow-500' : 'bg-red-500'
                      } text-white`}>
                        <ShieldCheck size={20} />
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white">FIB Safety Verdict: <span className={
                        analysis.verdict === 'Safe' ? 'text-primary' : analysis.verdict === 'Caution' ? 'text-yellow-600' : 'text-red-600'
                      }>{analysis.verdict}</span></h4>
                    </div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">
                      {analysis.score}%
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed italic">
                    "{analysis.explanation}"
                  </p>
                  <button 
                    onClick={() => setAnalysis(null)}
                    className="mt-4 text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest"
                  >
                    Re-scan
                  </button>
                </motion.div>
              )}
            </div>

            {/* Vendor & Trust Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
                  <Store size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Vendor</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{product.vendorName}</p>
                  <p className="text-[10px] text-gray-500 flex items-center gap-1"><MapPin size={10} /> {product.vendorLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl">
                  <Calendar size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expiry Date</p>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{product.expiryDate}</p>
                  <p className="text-[10px] text-gray-500">Freshness Guaranteed</p>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-8 flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                  {product.stock > 0 ? `${product.stock} pieces left in stock` : 'Out of Stock'}
                </span>
              </div>
              {product.stock < 5 && product.stock > 0 && (
                <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter animate-pulse">Low Stock!</span>
              )}
            </div>

            {/* Actions */}
            <div className="mt-auto flex flex-col sm:flex-row gap-4">
              <div className="flex items-center justify-between border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 bg-gray-50 dark:bg-gray-700 sm:w-1/3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={!product.available || product.stock <= 0}
                  className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  -
                </button>
                <span className="font-bold text-xl w-8 text-center text-gray-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={!product.available || product.stock <= 0 || quantity >= product.stock}
                  className="text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light p-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  +
                </button>
              </div>
              <button
                onClick={handleAddToCart}
                disabled={!product.available || product.stock <= 0 || isBlocked}
                className={`flex-1 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg ${
                  product.available && product.stock > 0 && !isBlocked
                    ? 'bg-primary text-white hover:bg-primary-dark hover:shadow-xl hover:-translate-y-1'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                <ShoppingCart size={20} />
                {isBlocked ? 'Incompatible' : (product.available && product.stock > 0 ? `Add to Cart — EGP ${(product.price || 0) * quantity}` : 'Out of Stock')}
              </button>
            </div>
          </div>
        </motion.div>
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
