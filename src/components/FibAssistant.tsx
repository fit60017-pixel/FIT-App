import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { Bot, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { generateFibResponse } from '../services/geminiService';
import { Product } from '../types';

export const FibAssistant = () => {
  const { state } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [liveContext, setLiveContext] = useState('');
  const prevProductsRef = useRef<Product[]>([]);
  const deletedProductsRef = useRef<string[]>([]);

  // Watch for deleted products
  useEffect(() => {
    const currentIds = state.products.map(p => p.id);
    const prevIds = prevProductsRef.current.map(p => p.id);
    
    const deleted = prevProductsRef.current.filter(p => !currentIds.includes(p.id));
    if (deleted.length > 0) {
      deletedProductsRef.current = [...new Set([...deletedProductsRef.current, ...deleted.map(p => p.name)])];
    }
    
    prevProductsRef.current = state.products;
  }, [state.products]);

  // Update live context whenever products or profile changes
  useEffect(() => {
    const healthProfile = state.user?.healthProfile;
    const context = `
      SYSTEM: You are looking at a LIVE FEED of the FIT database.
      Available Products: ${JSON.stringify(state.products.map(p => ({ 
        id: p.id, 
        name: p.name, 
        price: p.price, 
        stock: p.stock, 
        available: p.available,
        salesCount: p.salesCount || 0,
        calories: p.calories,
        protein: p.protein,
        carbs: p.carbs,
        fats: p.fats,
        ingredients: p.description,
        tags: p.tags,
        allergens: p.allergens
      })))}.
      Recently Deleted Products: ${JSON.stringify(deletedProductsRef.current)}.
      User Health Profile: ${healthProfile ? JSON.stringify(healthProfile) : 'Not set'}.
      Current Page: ${state.currentPage}.
      
      RULES FOR STOCK & DELETIONS:
      1. If a user asks for a product in "Recently Deleted Products", say: "This item was just removed from our marketplace".
      2. If a product has stock <= 0 or available is false, inform the user it's out of stock and suggest the next best "Safe" alternative from the "Available Products" list that matches their health profile (Weight, Height, Allergies).
      3. When analyzing this product for a customer, strictly check this product's allergens list against the customer's health profile. Mark as Unsafe if any ingredient matches an allergy.
      4. Strictly list prices and ingredients exactly as they appear in the database.
      5. Identify best-selling products based on "salesCount". If a product has the highest salesCount in its category or overall, you can say: "This is our best-selling snack/item!".
    `;
    setLiveContext(context);
  }, [state.products, state.user?.healthProfile, state.currentPage]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = state.user
        ? `Hello ${state.user.name}, how can I help you with your health goals today?`
        : "Hello! I'm FIB, your personal health assistant. I'm currently connected to our live product feed. How can I help you?";
      setMessages([{ text: greeting, isUser: false }]);
    }
  }, [isOpen, state.user]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userQuery = input;
    setMessages((prev) => [...prev, { text: userQuery, isUser: true }]);
    setInput('');
    setIsLoading(true);

    const response = await generateFibResponse(userQuery, liveContext);
    
    setMessages((prev) => [...prev, { text: response, isUser: false }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-20 md:bottom-8 right-4 md:right-8 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-80 md:w-96 h-[450px] flex flex-col overflow-hidden border border-gray-100 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#1B4332] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="bg-[#FF9100] p-1.5 rounded-full">
                <Bot size={20} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">FIB Assistant</h3>
                <p className="text-xs text-green-200">Online | Ready to help</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.isUser
                      ? 'bg-[#1B4332] text-white rounded-tr-sm'
                      : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] p-3 rounded-2xl text-sm bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2 bg-gray-50 rounded-full px-4 py-2 border border-gray-200 focus-within:border-[#1B4332] focus-within:ring-1 focus-within:ring-[#1B4332] transition-all">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask FIB anything..."
                className="flex-1 bg-transparent outline-none text-sm text-gray-700 placeholder-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="text-[#FF9100] hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#1B4332] text-white p-4 rounded-full shadow-xl hover:bg-[#143325] hover:scale-105 transition-all duration-300 group relative"
        >
          <Bot size={28} />
          <span className="absolute -top-1 -right-1 bg-[#FF9100] rounded-full p-1 animate-pulse">
            <Sparkles size={12} className="text-white" />
          </span>
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-800 text-sm font-medium px-3 py-1.5 rounded-lg shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with FIB
          </div>
        </button>
      )}
    </div>
  );
};
