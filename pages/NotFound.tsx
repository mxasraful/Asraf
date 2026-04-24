import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-24 bg-white dark:bg-slate-900">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <h1 className="text-[12rem] font-black text-slate-100 dark:text-slate-800 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Page Not Found</h2>
            <p className="text-slate-500 dark:text-slate-400">Oops! The section you're looking for doesn't exist.</p>
          </div>
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-600 dark:text-slate-400 max-w-sm mx-auto"
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link 
            to="/" 
            className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            <Home size={20} /> Back to Home
          </Link>
          <button 
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-8 py-4 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
          >
            <ArrowLeft size={20} /> Go Back
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;