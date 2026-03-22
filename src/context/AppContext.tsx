import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, HealthProfile, Product, CartItem, Order, Review, BlogPost, Notification } from '../types';

type Theme = 'light' | 'dark';
type Language = 'en' | 'ar';

type AppState = {
  user: User | null;
  users: User[];
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  sales: { date: string; amount: number; vendorId: string }[];
  notifications: Notification[];
  currentPage: string;
  selectedProduct: Product | null;
};

type AppContextType = {
  state: AppState;
  setUser: (user: User | null) => void;
  registerUser: (user: User) => void;
  setHealthProfile: (profile: HealthProfile | null) => void;
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addReview: (productId: string, review: Review) => void;
  toggleFavorite: (productId: string) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (paymentMethod: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  markNotificationRead: (notificationId: string) => void;
  navigate: (page: string, product?: Product) => void;
};

const defaultState: AppState = {
  user: null,
  users: [],
  products: [],
  cart: [],
  orders: [],
  sales: [],
  notifications: [],
  currentPage: 'landing',
  selectedProduct: null,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('fit_app_state_v3');
    let parsed = defaultState;
    if (saved) {
      try {
        parsed = { ...defaultState, ...JSON.parse(saved) };
      } catch (e) {
        parsed = defaultState;
      }
    }
    
    const savedProducts = localStorage.getItem('fit_products');
    if (savedProducts) {
      try {
        parsed.products = JSON.parse(savedProducts);
      } catch (e) {
        parsed.products = [];
      }
    } else {
      parsed.products = [];
    }
    
    return parsed;
  });

  useEffect(() => {
    localStorage.setItem('fit_app_state_v3', JSON.stringify({
      ...state,
      products: [] // Don't save products here to avoid duplication
    }));
    localStorage.setItem('fit_products', JSON.stringify(state.products));
  }, [state]);

  const setUser = (user: User | null) => setState((s) => ({ ...s, user }));
  
  const registerUser = (user: User) => setState((s) => ({
    ...s,
    users: [...s.users, user],
    user: user
  }));

  const setHealthProfile = (healthProfile: HealthProfile | null) => setState((s) => {
    if (!s.user) return s;
    const updatedUser = { ...s.user, healthProfile: healthProfile || undefined };
    return {
      ...s,
      user: updatedUser,
      users: s.users.map(u => u.id === updatedUser.id ? updatedUser : u)
    };
  });
  
  const addProduct = (product: Product) => setState((s) => {
    if (!s.user) return s;
    const newProduct = { ...product, vendorId: s.user.id, vendorEmail: s.user.email };
    return { ...s, products: [...s.products, newProduct] };
  });
  const updateProduct = (product: Product) => setState((s) => ({
    ...s,
    products: s.products.map((p) => (p.id === product.id ? product : p)),
  }));
  const deleteProduct = (productId: string) => setState((s) => ({
    ...s,
    products: s.products.filter((p) => p.id !== productId),
  }));

  const addReview = (productId: string, review: Review) => setState((s) => ({
    ...s,
    products: s.products.map((p) => 
      p.id === productId ? { ...p, reviews: [...p.reviews, review] } : p
    ),
  }));

  const toggleFavorite = (productId: string) => setState((s) => {
    if (!s.user) return s;
    const isFav = s.user.favorites.includes(productId);
    const newFavs = isFav 
      ? s.user.favorites.filter(id => id !== productId)
      : [...s.user.favorites, productId];
    return { ...s, user: { ...s.user, favorites: newFavs } };
  });

  const addToCart = (product: Product) => {
    setState((s) => {
      const existing = s.cart.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return s; // Cannot add more than stock
        return {
          ...s,
          cart: s.cart.map((item) =>
            item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      if (product.stock <= 0) return s;
      return { ...s, cart: [...s.cart, { product, quantity: 1 }] };
    });
  };

  const removeFromCart = (productId: string) => {
    setState((s) => ({
      ...s,
      cart: s.cart.filter((item) => item.product.id !== productId),
    }));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    setState((s) => {
      const product = s.products.find(p => p.id === productId);
      if (!product) return s;
      const validQuantity = Math.min(Math.max(1, quantity), product.stock);
      return {
        ...s,
        cart: s.cart.map((item) =>
          item.product.id === productId ? { ...item, quantity: validQuantity } : item
        ),
      };
    });
  };

  const clearCart = () => setState((s) => ({ ...s, cart: [] }));

  const placeOrder = (paymentMethod: string) => {
    setState((s) => {
      if (!s.user || s.cart.length === 0) return s;
      
      const total = s.cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      const newOrder: Order = {
        id: `ord_${Date.now()}`,
        userId: s.user.id,
        customerEmail: s.user.email,
        customerName: s.user.name,
        customerPhone: s.user.mobileNumber || 'Not provided',
        customerAddress: s.user.address || 'Not provided',
        customerLocation: s.user.deliveryLocation,
        items: [...s.cart],
        total,
        status: 'pending',
        paymentMethod,
        date: new Date().toISOString(),
      };

      const newNotifications: Notification[] = [];
      const newSalesEntries: { date: string; amount: number; vendorId: string }[] = [];
      const today = new Date().toISOString().split('T')[0];

      // Update sales count and stock for products
      const updatedProducts = s.products.map(p => {
        const cartItem = s.cart.find(ci => ci.product.id === p.id);
        if (cartItem) {
          const newStock = Math.max(0, p.stock - cartItem.quantity);
          const itemTotal = p.price * cartItem.quantity;
          
          newSalesEntries.push({
            date: today,
            amount: itemTotal,
            vendorId: p.vendorId
          });

          newNotifications.push({
            id: `notif_${Date.now()}_${p.id}`,
            userId: p.vendorId,
            message: `New Order! ${s.user?.name} bought ${cartItem.quantity}x ${p.name}`,
            date: new Date().toISOString(),
            read: false
          });

          return { 
            ...p, 
            salesCount: (p.salesCount || 0) + cartItem.quantity,
            stock: newStock,
            available: newStock > 0 ? p.available : false
          };
        }
        return p;
      });

      return {
        ...s,
        cart: [],
        orders: [newOrder, ...s.orders],
        sales: [...s.sales, ...newSalesEntries],
        products: updatedProducts,
        notifications: [...newNotifications, ...s.notifications]
      };
    });
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setState((s) => {
      const order = s.orders.find(o => o.id === orderId);
      if (!order) return s;

      const newNotification: Notification = {
        id: `notif_status_${Date.now()}_${orderId}`,
        userId: order.userId,
        message: `Your order ${orderId} is now ${status}!`,
        date: new Date().toISOString(),
        read: false
      };

      return {
        ...s,
        orders: s.orders.map(o => o.id === orderId ? { ...o, status } : o),
        notifications: [newNotification, ...s.notifications]
      };
    });
  };

  const markNotificationRead = (notificationId: string) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map(n => n.id === notificationId ? { ...n, read: true } : n)
    }));
  };

  const navigate = (page: string, product?: Product) => {
    setState((s) => ({ ...s, currentPage: page, selectedProduct: product || null }));
    window.scrollTo(0, 0);
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setUser,
        registerUser,
        setHealthProfile,
        addProduct,
        updateProduct,
        deleteProduct,
        addReview,
        toggleFavorite,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        updateOrderStatus,
        markNotificationRead,
        navigate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
