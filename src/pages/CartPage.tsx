import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, CreditCard, Wallet, Banknote, Smartphone, CheckCircle2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CartPage = () => {
  const { state, navigate, removeFromCart, updateCartQuantity, clearCart, placeOrder } = useAppContext();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'instapay' | 'vodafone' | 'cash'>('card');
  const [orderSuccess, setOrderSuccess] = useState(false);

  const subtotal = state.cart.reduce((acc, item) => acc + (item.product.price || 0) * item.quantity, 0);
  const totalCalories = state.cart.reduce((acc, item) => acc + (item.product.calories || 0) * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const total = subtotal + shipping;

  // Calculate a mock "Health Score" based on cart contents
  const healthScore = Math.max(0, 100 - (totalCalories / 2000) * 20);

  const handleCheckout = () => {
    if (!state.user) {
      navigate('login');
      return;
    }
    setIsCheckoutOpen(true);
  };

  const handlePlaceOrder = () => {
    placeOrder(total);
    setOrderSuccess(true);
    setTimeout(() => {
      setOrderSuccess(false);
      setIsCheckoutOpen(false);
      navigate('customer-dashboard');
    }, 3000);
  };

  if (state.cart.length === 0 && !orderSuccess) {
    return (
      <div className="min-h-screen bg-cream dark:bg-gray-900 flex flex-col items-center justify-center p-4 pb-24 md:pb-12">
        <div className="bg-white dark:bg-gray-800 p-12 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 text-center max-w-md w-full">
          <div className="bg-gray-50 dark:bg-gray-700 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag size={48} className="text-gray-300 dark:text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your cart is empty</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Looks like you haven't added any healthy snacks yet.</p>
          <button
            onClick={() => navigate('shop')}
            className="w-full bg-primary text-white font-bold py-4 rounded-xl hover:bg-primary-dark transition-all shadow-md"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pb-24 md:pb-12">
      <div className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-extrabold mb-2">Your Cart</h1>
          <p className="text-green-200 text-lg">{state.cart.length} items</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {state.cart.map((item) => (
              <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }} key={item.product.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row gap-6 items-center">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-32 h-32 object-cover rounded-2xl"
                />
                <div className="flex-1 w-full">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.product.name}</h3>
                    <p className="text-xl font-extrabold text-secondary">EGP {(item.product.price || 0) * item.quantity}</p>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{item.product.calories || 0} kcal per serving</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                      >
                        -
                      </button>
                      <span className="font-bold w-8 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-400 hover:text-red-500 p-2 transition-colors bg-red-50 dark:bg-red-900/20 rounded-xl"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-900 dark:text-white">EGP {subtotal || 0}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Shipping</span>
                  <span className="font-medium text-gray-900 dark:text-white">{shipping === 0 ? 'Free' : `EGP ${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-secondary text-right">Add EGP {500 - subtotal} more for free shipping!</p>
                )}
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-xl font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-3xl font-extrabold text-primary">EGP {total || 0}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-secondary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                Proceed to Checkout <ArrowRight size={20} />
              </button>
            </div>

            {/* Health Score Widget */}
            <div className="bg-primary p-8 rounded-3xl text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 opacity-10">
                <ShieldCheck size={120} className="-mt-4 -mr-4" />
              </div>
              <div className="relative z-10">
                <h4 className="text-lg font-bold mb-2 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-secondary" /> Cart Health Score
                </h4>
                <div className="flex items-end gap-2 mb-4">
                  <span className="text-5xl font-extrabold text-secondary">{isNaN(healthScore) ? 0 : Math.round(healthScore)}</span>
                  <span className="text-green-200 mb-1">/ 100</span>
                </div>
                <p className="text-sm text-green-100 leading-relaxed">
                  {healthScore > 80
                    ? "Excellent choices! Your cart is perfectly aligned with your health goals."
                    : "Good choices, but keep an eye on total calories. FIB suggests adding more fiber-rich snacks."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {isCheckoutOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              {orderSuccess ? (
                <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-24 h-24 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-6"
                  >
                    <CheckCircle2 size={48} className="text-primary" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Order Placed!</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">Your healthy snacks are on the way. Redirecting to your dashboard...</p>
                </div>
              ) : (
                <>
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h2>
                    <button onClick={() => setIsCheckoutOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-white dark:bg-gray-700 p-2 rounded-full shadow-sm">
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="p-6 overflow-y-auto flex-1">
                    <div className="mb-8">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Payment Method</h3>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          onClick={() => setPaymentMethod('card')}
                          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                            paymentMethod === 'card'
                              ? 'border-primary bg-primary/5 text-primary dark:text-primary-dark'
                              : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <CreditCard size={28} />
                          <span className="font-bold text-sm">Credit Card</span>
                        </button>
                        <button
                          onClick={() => setPaymentMethod('instapay')}
                          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                            paymentMethod === 'instapay'
                              ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                              : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <Wallet size={28} />
                          <span className="font-bold text-sm">InstaPay</span>
                        </button>
                        <button
                          onClick={() => setPaymentMethod('vodafone')}
                          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                            paymentMethod === 'vodafone'
                              ? 'border-red-600 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                              : 'border-gray-200 dark:border-gray-700 hover:border-red-300 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <Smartphone size={28} />
                          <span className="font-bold text-sm">Vodafone Cash</span>
                        </button>
                        <button
                          onClick={() => setPaymentMethod('cash')}
                          className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${
                            paymentMethod === 'cash'
                              ? 'border-green-600 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                              : 'border-gray-200 dark:border-gray-700 hover:border-green-300 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          <Banknote size={28} />
                          <span className="font-bold text-sm">Cash on Delivery</span>
                        </button>
                      </div>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Card Number</label>
                          <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
                            <input type="text" placeholder="MM/YY" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">CVV</label>
                            <input type="text" placeholder="123" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'instapay' && (
                      <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-4">
                        <Wallet size={48} className="mx-auto text-purple-600 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 mb-2">Send EGP {total || 0} to our InstaPay address:</p>
                        <p className="text-2xl font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 py-3 rounded-xl border border-purple-100 dark:border-purple-900/30">fit.store@instapay</p>
                      </div>
                    )}

                    {paymentMethod === 'vodafone' && (
                      <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-4">
                        <Smartphone size={48} className="mx-auto text-red-600 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 mb-2">Transfer EGP {total || 0} to our Vodafone Cash number:</p>
                        <p className="text-2xl font-bold text-red-600 bg-red-50 dark:bg-red-900/20 py-3 rounded-xl border border-red-100 dark:border-red-900/30">010 1234 5678</p>
                      </div>
                    )}

                    {paymentMethod === 'cash' && (
                      <div className="text-center py-6 animate-in fade-in slide-in-from-bottom-4">
                        <Banknote size={48} className="mx-auto text-green-600 mb-4" />
                        <p className="text-gray-600 dark:text-gray-400 text-lg">You will pay EGP {total || 0} upon delivery.</p>
                      </div>
                    )}
                  </div>

                  <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-gray-600 dark:text-gray-400 font-medium">Total to pay</span>
                      <span className="text-2xl font-extrabold text-primary">EGP {total || 0}</span>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      className="w-full bg-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary-dark transition-all shadow-lg"
                    >
                      Confirm & Pay <CheckCircle2 size={20} />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
