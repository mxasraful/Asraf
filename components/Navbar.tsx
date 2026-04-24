import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Sun, Moon, LayoutDashboard, LogIn } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { getOrderedCollection, getCollection } from '../firebase/api';
import { HeaderLink, Message } from '../types';

import { useData } from '../context/DataContext';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { navLinks } = useData();
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    if (user) {
      getCollection<Message>('messages').then(msgs => {
        setHasUnread(msgs.some(m => !m.isRead));
      }).catch(() => {});
    } else {
      setHasUnread(false);
    }
  }, [user]);

  return (
    <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              ASRAF
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} className={`text-sm font-semibold transition-colors ${location.pathname === link.path ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 hover:text-indigo-600 dark:text-slate-300'}`}>{link.name}</Link>
            ))}
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-800 mx-2"></div>
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300">{theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}</button>
            {user && (
              <Link to="/admin/dashboard" className="relative flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold transition-all">
                <LayoutDashboard size={16} /> Dashboard
                {hasUnread && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse"></span>}
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-full text-slate-600 dark:text-slate-300">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300 p-2">{isOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 space-y-2">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setIsOpen(false)} className={`block px-3 py-3 rounded-xl text-base font-semibold ${location.pathname === link.path ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'text-slate-600 dark:text-slate-300'}`}>{link.name}</Link>
          ))}
          <div className="pt-4 flex flex-col gap-3">
            {user && (
              <>
              <div className="relative">
                <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="block py-3 bg-indigo-600 text-white rounded-xl text-center font-bold">Dashboard</Link>
                {hasUnread && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white dark:border-slate-900 rounded-full animate-pulse pointer-events-none"></span>}
              </div>
              </>
            )}
          </div>
        </div>
      )}

    </nav>
  );
};

export default Navbar;