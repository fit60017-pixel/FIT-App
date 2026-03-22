export type Role = 'customer' | 'vendor';

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  password?: string;
  avatar?: string;
  favorites: string[]; // Product IDs
  mobileNumber?: string;
  nationalId?: string;
  address?: string;
  storeName?: string;
  deliveryLocation?: { lat: number; lng: number };
  healthProfile?: HealthProfile;
};

export type HealthProfile = {
  allergies: string[]; // nuts, dairy, eggs, gluten, etc.
  chronicDiseases: string[]; // diabetes, ibs, celiac, hypertension
  fitnessGoals: string; // weight loss, muscle gain, maintenance
  activityLevel: string; // sedentary, moderate, active
  weight: number;
  height: number;
  bmi?: number;
};

export type Review = {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
};

export type Product = {
  id: string;
  vendorId: string;
  vendorEmail: string;
  vendorName: string;
  vendorLocation: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  image: string;
  weightSize: string; // e.g., 50g, 200ml
  calories: number;
  protein: number;
  carbs: number;
  fibers: number;
  sugars: number;
  fats: number;
  saturatedFats: number;
  unsaturatedFats: number;
  allergens: string[]; // contains: nuts, dairy, eggs, gluten, soy, seafood
  tags: string[]; // vegan, keto, sugar-free, organic
  reviews: Review[];
  salesCount: number;
  createdAt: string;
  expiryDate: string;
  stock: number;
  available: boolean;
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  date: string;
  read: boolean;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type Order = {
  id: string;
  userId: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerLocation?: { lat: number; lng: number };
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  paymentMethod: string;
  date: string;
};

export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  date: string;
  author: string;
};
