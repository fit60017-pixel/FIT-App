import React from 'react';
import { useAppContext } from '../context/AppContext';
import { BookOpen, Clock, ArrowRight, User, Tag } from 'lucide-react';
import { motion } from 'motion/react';

const BLOG_POSTS = [
  {
    id: 1,
    title: 'The Truth About Artificial Sweeteners',
    excerpt: 'Are they really better than sugar? We break down the latest scientific research on how artificial sweeteners affect your gut microbiome.',
    category: 'Nutrition',
    author: 'Dr. Sarah Jenkins',
    readTime: '5 min read',
    date: 'Oct 12, 2023',
    image: 'https://images.unsplash.com/photo-1550828520-4cb496926fc9?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    title: 'Managing IBS with a Low FODMAP Diet',
    excerpt: 'A comprehensive guide to understanding FODMAPs, identifying your triggers, and planning meals that keep your digestive system happy.',
    category: 'Gut Health',
    author: 'Michael Chen, RD',
    readTime: '8 min read',
    date: 'Oct 05, 2023',
    image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    title: 'Pre-Workout Snacks for Optimal Performance',
    excerpt: 'Fuel your body right before hitting the gym. Discover the perfect balance of carbs and protein to maximize your energy levels.',
    category: 'Fitness',
    author: 'Alex Rivera',
    readTime: '4 min read',
    date: 'Sep 28, 2023',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 4,
    title: 'Understanding Gluten Sensitivity vs. Celiac Disease',
    excerpt: 'What is the difference? Learn about the symptoms, diagnosis processes, and how to manage a gluten-free lifestyle safely.',
    category: 'Medical',
    author: 'Dr. Emily Stone',
    readTime: '6 min read',
    date: 'Sep 15, 2023',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
  }
];

export const BlogPage = () => {
  const { navigate } = useAppContext();

  return (
    <div className="min-h-screen bg-cream dark:bg-gray-900 pb-24 md:pb-12">
      {/* Header */}
      <div className="bg-primary text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
          <BookOpen size={300} />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">FIT Health Blog</h1>
            <p className="text-green-100 text-lg md:text-xl max-w-2xl">
              Expert insights, nutritional advice, and wellness tips to help you make informed decisions about your health.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Post */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden mb-12 flex flex-col md:flex-row group cursor-pointer hover:shadow-md transition-shadow"
        >
          <div className="md:w-1/2 h-64 md:h-auto relative overflow-hidden">
            <img 
              src={BLOG_POSTS[0].image} 
              alt={BLOG_POSTS[0].title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              Featured
            </div>
          </div>
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
              <span className="flex items-center gap-1"><Tag size={14} /> {BLOG_POSTS[0].category}</span>
              <span className="flex items-center gap-1"><Clock size={14} /> {BLOG_POSTS[0].readTime}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 group-hover:text-primary transition-colors">
              {BLOG_POSTS[0].title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
              {BLOG_POSTS[0].excerpt}
            </p>
            <div className="flex items-center justify-between mt-auto">
              <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User size={16} className="text-gray-500 dark:text-gray-400" />
                </div>
                {BLOG_POSTS[0].author}
              </div>
              <button className="text-primary font-bold flex items-center gap-1 hover:gap-2 transition-all">
                Read More <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Recent Posts Grid */}
        <div className="mb-8 flex justify-between items-end">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Articles</h3>
          <div className="flex gap-2">
            {['All', 'Nutrition', 'Fitness', 'Medical'].map((cat, i) => (
              <button 
                key={cat}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  i === 0 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.slice(1).map((post, index) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + (index * 0.1) }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group cursor-pointer hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white text-xs font-bold px-3 py-1 rounded-full">
                  {post.category}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400 mb-3">
                  <span>{post.date}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-6 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {post.author}
                  </span>
                  <button className="text-primary hover:text-primary-dark transition-colors">
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
