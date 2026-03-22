import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { Product, Order } from '../types';
import { Store, Plus, TrendingUp, TrendingDown, Download, Package, DollarSign, Activity, Settings, LogOut, ChevronRight, CheckCircle2, Bot, Trash2, Edit, ToggleLeft, ToggleRight, Bell, ShoppingBag, ShieldAlert, Eye, X, Info, Calendar, Phone, MapPin, User, Nut, Bean, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const mintIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: #98FF98; width: 12px; height: 12px; border-radius: 50%; border: 2px solid #002B1B; box-shadow: 0 0 10px rgba(152, 255, 152, 0.5);"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

export const VendorDashboardPage = () => {
  const { state, navigate, setUser, addProduct, updateProduct, deleteProduct, updateOrderStatus, markNotificationRead } = useAppContext();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'add-product' | 'insights' | 'orders'>('overview');
  const [toast, setToast] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [viewProduct, setViewProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orderSort, setOrderSort] = useState<'date' | 'status'>('date');

  useEffect(() => {
    if (!state.user || state.user.role !== 'vendor') {
      navigate('login');
    }
  }, [state.user, navigate]);

  if (!state.user) return null;

  const vendorProducts = state.products.filter(p => p.vendorEmail === state.user?.email);
  const totalSales = vendorProducts.reduce((acc, p) => acc + ((p.salesCount || 0) * (p.price || 0)), 0);
  const totalItemsSold = vendorProducts.reduce((acc, p) => acc + (p.salesCount || 0), 0);

  // Process sales data for the current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const salesData = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const amount = state.sales
      .filter(s => s.vendorId === state.user?.id && s.date === dateStr)
      .reduce((acc, s) => acc + s.amount, 0);
    return { name: day.toString(), sales: amount };
  });

  const currentMonthSales = state.sales
    .filter(s => {
      const d = new Date(s.date);
      return s.vendorId === state.user?.id && d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    })
    .reduce((acc, s) => acc + s.amount, 0);

  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
  const lastMonthSales = state.sales
    .filter(s => {
      const d = new Date(s.date);
      return s.vendorId === state.user?.id && d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
    })
    .reduce((acc, s) => acc + s.amount, 0);

  const growth = lastMonthSales === 0 ? (currentMonthSales > 0 ? 100 : 0) : ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100;
  const monthName = now.toLocaleString('default', { month: 'long' });

  const handleLogout = () => {
    setUser(null);
    navigate('landing');
  };

  const handleExport = () => {
    setToast('Generating Sales Report...');
    
    // Create CSV content
    const headers = ['Product Name', 'Price (EGP)', 'Ingredients', 'Total Units Sold', 'Total Revenue (EGP)'];
    const rows = vendorProducts.map(p => [
      p.name,
      p.price,
      `"${p.description.replace(/"/g, '""')}"`,
      p.salesCount || 0,
      (p.salesCount || 0) * (p.price || 0)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
    
    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `FIT_Sales_Report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => setToast(null), 3000);
  };

  const unreadNotifications = state.notifications.filter(n => n.userId === state.user?.id && !n.read);

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pb-24 md:pb-12">
      {/* Header */}
      <div className="bg-primary text-white py-12 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center text-4xl font-bold shadow-xl border-4 border-white/20">
              <Store size={40} />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold mb-1">{state.user.name} Vendor Portal</h1>
              <p className="text-green-200 text-lg flex items-center gap-2">
                <Activity size={18} /> Active Seller
              </p>
            </div>
          </div>
          
          {/* Notification Bell */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors relative"
            >
              <Bell size={24} />
              {unreadNotifications.length > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs font-bold flex items-center justify-center rounded-full border-2 border-primary">
                  {unreadNotifications.length}
                </span>
              )}
            </button>
            
            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50">
                <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                  <span className="text-xs text-gray-500">{unreadNotifications.length} unread</span>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {state.notifications.filter(n => n.userId === state.user?.id).length > 0 ? (
                    state.notifications.filter(n => n.userId === state.user?.id).map(notification => (
                      <div 
                        key={notification.id} 
                        className={`p-4 border-b border-gray-50 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                        onClick={() => markNotificationRead(notification.id)}
                      >
                        <p className={`text-sm ${!notification.read ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.date).toLocaleString()}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                      <Bell size={24} className="mx-auto mb-2 opacity-50" />
                      <p>No new notifications</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-900 dark:text-white">Vendor Menu</h3>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center justify-between p-4 transition-colors text-left ${activeTab === 'overview' ? 'bg-primary/5 text-primary dark:text-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp size={20} className={activeTab === 'overview' ? 'text-primary' : 'text-gray-400'} />
                    <span className="font-medium">Overview</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === 'overview' ? 'text-primary' : 'text-gray-400'} />
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center justify-between p-4 transition-colors text-left ${activeTab === 'orders' ? 'bg-primary/5 text-primary dark:text-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag size={20} className={activeTab === 'orders' ? 'text-primary' : 'text-gray-400'} />
                    <span className="font-medium">Orders</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === 'orders' ? 'text-primary' : 'text-gray-400'} />
                </button>
                <button 
                  onClick={() => setActiveTab('products')}
                  className={`w-full flex items-center justify-between p-4 transition-colors text-left ${activeTab === 'products' ? 'bg-primary/5 text-primary dark:text-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <Package size={20} className={activeTab === 'products' ? 'text-primary' : 'text-gray-400'} />
                    <span className="font-medium">My Products</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === 'products' ? 'text-primary' : 'text-gray-400'} />
                </button>
                <button 
                  onClick={() => setActiveTab('add-product')}
                  className={`w-full flex items-center justify-between p-4 transition-colors text-left ${activeTab === 'add-product' ? 'bg-primary/5 text-primary dark:text-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <Plus size={20} className={activeTab === 'add-product' ? 'text-primary' : 'text-gray-400'} />
                    <span className="font-medium">Add Product</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === 'add-product' ? 'text-primary' : 'text-gray-400'} />
                </button>
                <button 
                  onClick={() => setActiveTab('insights')}
                  className={`w-full flex items-center justify-between p-4 transition-colors text-left ${activeTab === 'insights' ? 'bg-primary/5 text-primary dark:text-primary' : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <div className="flex items-center gap-3">
                    <Bot size={20} className={activeTab === 'insights' ? 'text-primary' : 'text-gray-400'} />
                    <span className="font-medium">AI Insights</span>
                  </div>
                  <ChevronRight size={16} className={activeTab === 'insights' ? 'text-primary' : 'text-gray-400'} />
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
          <div className="md:col-span-3 space-y-8">
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="text-secondary" /> Dashboard Overview
                  </h2>
                  <button onClick={handleExport} className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Download size={16} /> Export Excel
                  </button>
                </div>

                {/* Stats Grid */}
                <div className="grid sm:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mb-4 text-primary">
                      <DollarSign size={24} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Revenue</p>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white">EGP {totalSales.toLocaleString()}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/50 rounded-full flex items-center justify-center mb-4 text-secondary">
                      <Package size={24} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Items Sold</p>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{totalItemsSold}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mb-4 text-blue-600">
                      <Store size={24} />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Active Products</p>
                    <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{vendorProducts.length}</p>
                  </div>
                </div>

                {/* Analytics Section */}
                <div className="flex flex-col gap-12">
                  <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden min-h-[450px]">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Sales Performance</h3>
                        <p className="text-sm text-gray-500">{monthName} {currentYear}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Monthly Revenue</p>
                        <p className="text-2xl font-black text-primary">EGP {currentMonthSales.toLocaleString()}</p>
                        <div className={`flex items-center justify-end gap-1 text-sm font-bold mt-1 ${growth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {growth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                          {Math.abs(growth).toFixed(1)}% {growth >= 0 ? 'higher' : 'lower'} than last month
                        </div>
                      </div>
                    </div>
                    <div className="h-[300px] w-full min-w-0">
                      <ResponsiveContainer width="100%" height="100%" debounce={100} aspect={2}>
                        <LineChart data={salesData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            stroke="#6b7280" 
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            label={{ value: 'Day of Month', position: 'insideBottom', offset: -5, fontSize: 10 }}
                          />
                          <YAxis 
                            stroke="#6b7280" 
                            fontSize={10}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `EGP ${value}`}
                          />
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            formatter={(value: number) => [`EGP ${value.toLocaleString()}`, 'Revenue']}
                            labelFormatter={(label) => `Day ${label}`}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#98FF98" 
                            strokeWidth={4} 
                            dot={{ r: 4, fill: '#2D6A4F', strokeWidth: 2, stroke: '#fff' }} 
                            activeDot={{ r: 6, fill: '#98FF98', stroke: '#2D6A4F', strokeWidth: 2 }} 
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Inventory Health</h3>
                    <div className="h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      <div className="space-y-6">
                        {vendorProducts.slice(0, 10).map(p => (
                          <div key={p.id}>
                            <div className="flex justify-between text-sm mb-2">
                              <span className="font-medium text-gray-700 dark:text-gray-300">{p.name}</span>
                              <span className={`font-bold ${p.stock < 10 ? 'text-red-500' : 'text-primary'}`}>{p.stock} in stock</span>
                            </div>
                            <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${p.stock < 10 ? 'bg-red-500' : 'bg-primary'}`}
                                style={{ width: `${Math.min(100, (p.stock / 50) * 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                        {vendorProducts.length === 0 && (
                          <div className="h-[200px] flex items-center justify-center text-gray-500 bg-gray-50/50 dark:bg-gray-700/30 rounded-2xl border border-dashed border-gray-200 dark:border-gray-600">
                            <p className="font-medium">No products to track.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'add-product' && (
              <ProductForm 
                onSuccess={() => {
                  setToast('Product added successfully!');
                  setActiveTab('products');
                  setTimeout(() => setToast(null), 3000);
                }} 
              />
            )}

            {activeTab === 'products' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Package className="text-primary" /> My Products
                  </h2>
                  <button onClick={() => setActiveTab('add-product')} className="bg-primary text-white px-4 py-2 rounded-xl font-bold hover:bg-primary-dark transition-colors flex items-center gap-2">
                    <Plus size={16} /> Add New
                  </button>
                </div>

                {vendorProducts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 text-sm">
                          <th className="py-4 font-medium">Product</th>
                          <th className="py-4 font-medium">Price</th>
                          <th className="py-4 font-medium">Stock</th>
                          <th className="py-4 font-medium">Sales</th>
                          <th className="py-4 font-medium">Status</th>
                          <th className="py-4 font-medium text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                        {vendorProducts.map(product => (
                          <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                            <td className="py-4 flex items-center gap-3">
                              <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                              <span className="font-bold text-gray-900 dark:text-white">{product.name}</span>
                            </td>
                            <td className="py-4 text-gray-600 dark:text-gray-300 font-medium">EGP {product.price || 0}</td>
                            <td className="py-4 text-gray-600 dark:text-gray-300 font-medium">{product.stock || 0}</td>
                            <td className="py-4 text-gray-600 dark:text-gray-300 font-medium">{product.salesCount || 0}</td>
                            <td className="py-4">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => updateProduct({...product, available: !product.available})}
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${
                                    product.available ? 'bg-primary' : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                  title={product.available ? "Mark Unavailable" : "Mark Available"}
                                >
                                  <span
                                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                                      product.available ? 'translate-x-5' : 'translate-x-1'
                                    }`}
                                  />
                                </button>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                  product.available && product.stock > 0
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400'
                                    : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400'
                                }`}>
                                  {product.available ? (product.stock > 0 ? 'Active' : 'Out of Stock') : 'Unavailable'}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="flex items-center gap-1 mr-2 opacity-40">
                                  <Nut size={14} className="text-primary" />
                                  <Bean size={14} className="text-secondary" />
                                </div>
                                <button 
                                  onClick={() => setViewProduct(product)}
                                  className="p-2 text-gray-500 hover:text-primary transition-colors"
                                  title="View Details"
                                >
                                  <Eye size={20} />
                                </button>
                                <button 
                                  className="p-2 text-gray-500 hover:text-primary transition-colors"
                                  title="Edit Product"
                                  onClick={() => setEditingProduct(product)}
                                >
                                  <Edit size={20} />
                                </button>
                                <button 
                                  onClick={() => setProductToDelete(product)}
                                  className="p-2 text-red-500 hover:text-red-700 transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">You haven't added any products yet.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="text-primary" /> Order Management
                  </h2>
                  <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-2 rounded-xl border border-gray-100 dark:border-gray-700">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-2">Sort By:</span>
                    <select 
                      value={orderSort}
                      onChange={(e) => setOrderSort(e.target.value as 'date' | 'status')}
                      className="bg-transparent border-none text-sm font-bold text-gray-700 dark:text-gray-200 focus:ring-0 cursor-pointer"
                    >
                      <option value="date">Latest Date</option>
                      <option value="status">Status Priority</option>
                    </select>
                  </div>
                </div>

                {state.orders.length > 0 ? (
                  <div className="space-y-6">
                    {[...state.orders]
                      .filter(order => order.items.some(item => item.product.vendorId === state.user?.id))
                      .sort((a, b) => {
                        if (orderSort === 'status') {
                          const statusPriority: Record<string, number> = {
                            'pending': 1,
                            'processing': 2,
                            'shipped': 3,
                            'delivered': 4
                          };
                          return statusPriority[a.status] - statusPriority[b.status];
                        }
                        return new Date(b.date).getTime() - new Date(a.date).getTime();
                      })
                      .map(order => {
                        // Filter items in this order that belong to this vendor
                        const vendorItems = order.items.filter(item => item.product.vendorId === state.user?.id);
                        
                        const orderTotal = vendorItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

                      return (
                        <div key={order.id} className="border border-gray-200 dark:border-gray-700 rounded-2xl p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Order ID: {order.id}</p>
                              <p className="font-bold text-gray-900 dark:text-white mt-1">
                                {new Date(order.date).toLocaleString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              <select id="order-status"
                                value={order.status}
                                onChange={(e) => updateOrderStatus(order.id, e.target.value as Order['status'])}
                                className="bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
                              >
                                <option value="pending">Pending</option>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                              </select>
                            </div>
                          </div>

                          {/* Customer Info Section */}
                          <div className="mb-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                              <User size={14} /> Customer Information
                            </h4>
                            <div className="grid sm:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-gray-500 dark:text-gray-400 font-medium">Name:</span>
                                  <span className="text-gray-900 dark:text-white font-bold">{order.customerName}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-gray-500 dark:text-gray-400 font-medium">Phone:</span>
                                  <a href={`tel:${order.customerPhone}`} className="text-primary font-bold flex items-center gap-1 hover:underline">
                                    <Phone size={14} /> {order.customerPhone}
                                  </a>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-start gap-2 text-sm">
                                  <MapPin size={14} className="text-gray-400 mt-0.5" />
                                  <div>
                                    <span className="text-gray-500 dark:text-gray-400 font-medium block">Delivery Address:</span>
                                    <span className="text-gray-900 dark:text-white font-medium">{order.customerAddress}</span>
                                  </div>
                                </div>
                                {order.customerLocation && (
                                  <div className="mt-2 space-y-2">
                                    <div className="h-24 w-full rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative">
                                      <MapContainer 
                                        center={[order.customerLocation.lat, order.customerLocation.lng]} 
                                        zoom={15} 
                                        style={{ height: '100%', width: '100%' }}
                                        dragging={false}
                                        zoomControl={false}
                                        scrollWheelZoom={false}
                                        doubleClickZoom={false}
                                        touchZoom={false}
                                        attributionControl={false}
                                      >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker position={[order.customerLocation.lat, order.customerLocation.lng]} icon={mintIcon} />
                                      </MapContainer>
                                      {/* Overlay to prevent interaction */}
                                      <div className="absolute inset-0 z-[1000] cursor-default" />
                                    </div>
                                    <div className="flex items-center justify-between text-[10px] text-gray-500">
                                      <div className="flex items-center gap-1">
                                        <MapPin size={10} />
                                        <span>{order.customerLocation.lat.toFixed(4)}, {order.customerLocation.lng.toFixed(4)}</span>
                                      </div>
                                      <a 
                                        href={`https://www.google.com/maps?q=${order.customerLocation.lat},${order.customerLocation.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-primary font-bold hover:underline"
                                      >
                                        Open Google Maps
                                      </a>
                                    </div>
                                  </div>

                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="divide-y divide-gray-100 dark:divide-gray-700">
                            {vendorItems.map((item, index) => (
                              <div key={index} className="py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <img src={item.product.image} alt={item.product.name} className="w-10 h-10 rounded-lg object-cover" />
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{item.product.name}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.quantity}</p>
                                  </div>
                                </div>
                                <p className="font-bold text-gray-900 dark:text-white">
                                  EGP {item.product.price * item.quantity}
                                </p>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                            <span className="font-medium text-gray-500 dark:text-gray-400">Vendor Total</span>
                            <span className="text-xl font-bold text-primary">EGP {orderTotal}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <ShoppingBag size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">No orders received yet.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'insights' && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-6">
                  <div className="bg-secondary p-3 rounded-2xl">
                    <Bot size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">FIB Vendor Insights</h2>
                    <p className="text-gray-500 dark:text-gray-400">AI-powered recommendations to boost your sales.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/30 flex gap-4">
                    <TrendingUp className="text-blue-500 shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-2">Market Trend Alert</h4>
                      <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                        Searches for "Gluten-Free" and "Keto" snacks have increased by 45% this month. Consider adding these tags to your existing products if applicable, or developing new lines to meet this demand.
                      </p>
                    </div>
                  </div>

                  {vendorProducts.some(p => p.stock < 10) && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-2xl border border-red-100 dark:border-red-900/30 flex gap-4">
                      <ShieldAlert className="text-red-500 shrink-0" size={24} />
                      <div>
                        <h4 className="font-bold text-red-900 dark:text-red-300 mb-2">Inventory Alert: Low Stock</h4>
                        <p className="text-red-800 dark:text-red-200 text-sm leading-relaxed">
                          Some of your top-selling products are running low. FIB suggests increasing stock for: {vendorProducts.filter(p => p.stock < 10).map(p => p.name).join(', ')} to avoid missing out on potential sales.
                        </p>
                      </div>
                    </div>
                  )}

                  {vendorProducts.length > 0 && vendorProducts[0].salesCount < 50 && (
                    <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex gap-4">
                      <Activity className="text-orange-500 shrink-0" size={24} />
                      <div>
                        <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-2">Low Performing Product: {vendorProducts[0].name}</h4>
                        <div className="text-orange-800 dark:text-orange-200 text-sm leading-relaxed">
                          This product has lower sales compared to category averages. FIB Suggests:
                          <ul className="list-disc ml-5 mt-2 space-y-1">
                            <li>Update the product image to a higher resolution lifestyle shot.</li>
                            <li>Highlight the protein content in the description.</li>
                            <li>Consider a 10% promotional discount for first-time buyers.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 z-50">
          <CheckCircle2 size={20} className="text-secondary" />
          <span className="font-medium">{toast}</span>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl">
            <ProductForm 
              initialProduct={editingProduct}
              onCancel={() => setEditingProduct(null)}
              onSuccess={() => {
                setEditingProduct(null);
                setToast('Product updated successfully!');
                setTimeout(() => setToast(null), 3000);
              }}
            />
          </div>
        </div>
      )}

      {/* Product Details Modal */}
      {viewProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700"
          >
            <div className="relative h-48 sm:h-64">
              <img src={viewProduct.image} alt={viewProduct.name} className="w-full h-full object-cover" />
              <button 
                onClick={() => setViewProduct(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-primary-light font-bold uppercase tracking-widest text-xs mb-1">{viewProduct.brand}</p>
                <h3 className="text-2xl font-bold text-white">{viewProduct.name}</h3>
                <div className="flex items-center gap-3">
                  <p className="text-green-300 font-bold">EGP {viewProduct.price}</p>
                  <span className="text-gray-300 text-xs bg-white/10 px-2 py-0.5 rounded-md backdrop-blur-sm">{viewProduct.weightSize}</span>
                </div>
              </div>
            </div>

            <div className="p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Full Ingredients</h4>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{viewProduct.description}</p>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Info size={16} className="text-primary" /> Nutrition Facts (per serving)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Calories</p>
                    <p className="text-xl font-black text-primary">{viewProduct.calories}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Protein</p>
                    <p className="text-xl font-black text-secondary">{viewProduct.protein}g</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Carbs</p>
                    <p className="text-xl font-black text-blue-500">{viewProduct.carbs}g</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-2xl shadow-sm text-center">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Fats</p>
                    <p className="text-xl font-black text-orange-500">{viewProduct.fats}g</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1">
                    <span className="text-gray-500">Fibers:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{viewProduct.fibers}g</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1">
                    <span className="text-gray-500">Sat. Fats:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{viewProduct.saturatedFats}g</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1">
                    <span className="text-gray-500">Sugars:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{viewProduct.sugars}g</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-1">
                    <span className="text-gray-500">Unsat. Fats:</span>
                    <span className="font-bold text-gray-900 dark:text-white">{viewProduct.unsaturatedFats}g</span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ShieldAlert size={16} className="text-red-500" /> Allergens
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {viewProduct.allergens.length > 0 ? (
                      viewProduct.allergens.map(allergen => (
                        <span key={allergen} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-full text-xs font-bold capitalize border border-red-100 dark:border-red-900/30">
                          {allergen}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 italic">No allergens listed</span>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-primary" /> Dietary Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {viewProduct.tags.length > 0 ? (
                      viewProduct.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-green-50 dark:bg-green-900/20 text-primary dark:text-green-400 rounded-full text-xs font-bold capitalize border border-green-100 dark:border-green-900/30">
                          {tag}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-gray-500 italic">No tags listed</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Expiry Date</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{viewProduct.expiryDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Package size={16} className="text-gray-400" />
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">Current Stock</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{viewProduct.stock} units</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-700 flex justify-end">
              <button 
                onClick={() => setViewProduct(null)}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Deletion Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 text-center"
          >
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600 border-4 border-red-500/20">
              <Trash2 size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Delete Product?</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Are you sure you want to delete <span className="font-bold text-red-500">"{productToDelete.name}"</span>? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button 
                onClick={() => setProductToDelete(null)}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  deleteProduct(productToDelete.id);
                  setProductToDelete(null);
                  setToast('Product deleted successfully');
                }}
                className="flex-1 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const ProductForm = ({ onSuccess, initialProduct, onCancel }: { onSuccess: () => void, initialProduct?: Product, onCancel?: () => void }) => {
  const { state, addProduct, updateProduct } = useAppContext();
  const [formData, setFormData] = useState({
    name: initialProduct?.name || '',
    brand: initialProduct?.brand || '',
    description: initialProduct?.description || '',
    price: initialProduct?.price?.toString() || '',
    image: initialProduct?.image || '',
    weightSize: initialProduct?.weightSize || '',
    calories: initialProduct?.calories?.toString() || '',
    protein: initialProduct?.protein?.toString() || '',
    carbs: initialProduct?.carbs?.toString() || '',
    fibers: initialProduct?.fibers?.toString() || '',
    sugars: initialProduct?.sugars?.toString() || '',
    fats: initialProduct?.fats?.toString() || '',
    saturatedFats: initialProduct?.saturatedFats?.toString() || '',
    unsaturatedFats: initialProduct?.unsaturatedFats?.toString() || '',
    stock: initialProduct?.stock?.toString() || '',
    expiryDate: initialProduct?.expiryDate || '',
    vendorLocation: initialProduct?.vendorLocation || '',
  });
  const [allergens, setAllergens] = useState<string[]>(initialProduct?.allergens || []);
  const [tags, setTags] = useState<string[]>(initialProduct?.tags || []);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);

  const generateAIImages = async () => {
    if (!formData.name) {
      alert("Please enter a product name first.");
      return;
    }

    setIsGeneratingImages(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompts = [
        `High-quality, professional studio close-up shot of ${formData.name} (${formData.brand}), vibrant lighting, 4k resolution`,
        `Lifestyle shot of ${formData.name} being enjoyed in a healthy setting, natural lighting, high-end photography`,
        `Professional packaging detail shot of ${formData.name}, clean background, commercial photography style`
      ];

      const newImages: string[] = [];

      for (const prompt of prompts) {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "1:1",
            },
          },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            newImages.push(`data:image/png;base64,${part.inlineData.data}`);
          }
        }
      }

      setGeneratedImages(newImages);
    } catch (error) {
      console.error("Error generating images:", error);
      alert("Failed to generate images. Please try again.");
    } finally {
      setIsGeneratingImages(false);
    }
  };

  const ALLERGEN_OPTIONS = ['nuts', 'dairy', 'eggs', 'gluten', 'soy', 'seafood'];
  const TAG_OPTIONS = ['vegan', 'keto', 'sugar-free', 'high-protein', 'organic'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!state.user) return;

    const productData: Product = {
      id: initialProduct?.id || `p_${Date.now()}`,
      vendorId: initialProduct?.vendorId || state.user.id,
      vendorEmail: initialProduct?.vendorEmail || state.user.email,
      vendorName: initialProduct?.vendorName || state.user.name,
      vendorLocation: formData.vendorLocation || state.user.address || 'Cairo, Egypt',
      brand: formData.brand,
      name: formData.name,
      description: formData.description,
      price: Number(formData.price) || 0,
      image: formData.image || 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&q=80&w=800',
      weightSize: formData.weightSize || '50g',
      calories: Number(formData.calories) || 0,
      protein: Number(formData.protein) || 0,
      carbs: Number(formData.carbs) || 0,
      fibers: Number(formData.fibers) || 0,
      sugars: Number(formData.sugars) || 0,
      fats: Number(formData.fats) || 0,
      saturatedFats: Number(formData.saturatedFats) || 0,
      unsaturatedFats: Number(formData.unsaturatedFats) || 0,
      allergens,
      tags,
      reviews: initialProduct?.reviews || [],
      salesCount: initialProduct?.salesCount || 0,
      createdAt: initialProduct?.createdAt || new Date().toISOString(),
      expiryDate: formData.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      stock: Number(formData.stock) || 0,
      available: initialProduct ? initialProduct.available : true,
    };

    if (initialProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    onSuccess();
  };

  const toggleArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    setter(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className={`bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 ${onCancel ? 'max-h-[80vh] overflow-y-auto custom-scrollbar' : ''}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        {initialProduct ? <Edit className="text-primary" /> : <Plus className="text-primary" />} 
        {initialProduct ? 'Edit Product' : 'Add New Product'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Basic Information</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Product Name</label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Brand Name</label>
              <input required type="text" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price (EGP)</label>
              <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Weight / Size (e.g., 50g, 200ml)</label>
              <input required type="text" value={formData.weightSize} onChange={e => setFormData({...formData, weightSize: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Initial Stock Quantity</label>
              <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Expiry Date</label>
              <input required type="date" value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vendor Location / Store Address</label>
              <input required type="text" value={formData.vendorLocation} onChange={e => setFormData({...formData, vendorLocation: e.target.value})} placeholder="e.g., Maadi, Cairo" className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary"></textarea>
            </div>
            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL (Unsplash recommended)</label>
                <button 
                  type="button" 
                  onClick={generateAIImages}
                  disabled={isGeneratingImages}
                  className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary-dark transition-colors disabled:opacity-50"
                >
                  {isGeneratingImages ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                  {isGeneratingImages ? 'Generating...' : 'Generate with AI'}
                </button>
              </div>
              <input type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} placeholder="https://images.unsplash.com/..." className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
              
              {generatedImages.length > 0 && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Select an AI Generated Image</p>
                  <div className="grid grid-cols-3 gap-3">
                    {generatedImages.map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setFormData({...formData, image: img})}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${formData.image === img ? 'border-primary ring-2 ring-primary/20' : 'border-transparent hover:border-gray-300'}`}
                      >
                        <img src={img} alt={`Generated ${idx}`} className="w-full h-full object-cover" />
                        {formData.image === img && (
                          <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                            <CheckCircle2 size={24} className="text-primary" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nutrition Facts */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2">Nutrition Facts (per serving)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Calories</label>
              <input required type="number" value={formData.calories} onChange={e => setFormData({...formData, calories: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Protein (g)</label>
              <input required type="number" value={formData.protein} onChange={e => setFormData({...formData, protein: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Carbs (g)</label>
              <input required type="number" value={formData.carbs} onChange={e => setFormData({...formData, carbs: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fats (g)</label>
              <input required type="number" value={formData.fats} onChange={e => setFormData({...formData, fats: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Fibers (g)</label>
              <input required type="number" value={formData.fibers} onChange={e => setFormData({...formData, fibers: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sugars (g)</label>
              <input required type="number" value={formData.sugars} onChange={e => setFormData({...formData, sugars: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sat. Fats (g)</label>
              <input required type="number" value={formData.saturatedFats} onChange={e => setFormData({...formData, saturatedFats: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unsat. Fats (g)</label>
              <input required type="number" value={formData.unsaturatedFats} onChange={e => setFormData({...formData, unsaturatedFats: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary focus:border-primary" />
            </div>
          </div>
        </div>

        {/* Allergens & Tags */}
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">Contains Allergens</h3>
            <div className="flex flex-wrap gap-3">
              {ALLERGEN_OPTIONS.map(allergen => (
                <button
                  key={allergen}
                  type="button"
                  onClick={() => toggleArrayItem(setAllergens, allergen)}
                  className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors border-2 ${
                    allergens.includes(allergen)
                      ? 'bg-[#98FF98] text-[#002B1B] border-[#002B1B]'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  {allergen}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-gray-700 pb-2 mb-4">Dietary Tags</h3>
            <div className="flex flex-wrap gap-3">
              {TAG_OPTIONS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleArrayItem(setTags, tag)}
                  className={`px-4 py-2 rounded-full text-sm font-bold capitalize transition-colors border-2 ${
                    tags.includes(tag)
                      ? 'bg-green-50 dark:bg-green-900/30 text-primary dark:text-green-400 border-green-200 dark:border-green-800'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-green-200'
                  }`}
                >
                  {tag.replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          {onCancel && (
            <button type="button" onClick={onCancel} className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold py-4 rounded-xl hover:bg-gray-200 transition-all">
              Cancel
            </button>
          )}
          <button type="submit" className={`flex-[2] ${initialProduct ? 'bg-primary text-secondary-dark' : 'bg-primary text-white'} font-bold py-4 rounded-xl hover:opacity-90 transition-all shadow-lg flex justify-center items-center gap-2`}>
            {initialProduct ? <CheckCircle2 size={20} /> : <Plus size={20} />} 
            {initialProduct ? 'Save Changes' : 'Publish Product to Smart Shop'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};
