import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, MapPin, Mail, Phone, Loader2 } from 'lucide-react';
import { createDoc, getSingleDoc } from '../firebase/api';
import { Profile } from '../types';

import { useLoading } from '../context/LoadingContext';
import { useData } from '../context/DataContext';
import FullPageLoader from '../components/FullPageLoader';

const Contact: React.FC = () => {
  const { isInitialLoading, setIsPageLoading } = useLoading();
  const { profile } = useData();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setIsPageLoading(true);
    // Profile is already in DataContext, but we might want to ensure it's loaded 
    // or just let it be handled by the global initial load.
    // Since profile is now global, we don't need to fetch it here anymore for the email/phone.
    setIsPageLoading(false);
  }, [setIsPageLoading]);

  if (isInitialLoading) {
    return <FullPageLoader />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Capture user's local time
      const userLocalTime = new Date().toLocaleString();
      await createDoc('messages', {
        ...formData,
        sentAt: userLocalTime
      });
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      alert('Error sending message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16">

        {/* Info */}
        <div className="space-y-12">
          <header className="space-y-4">
            <h1 className="text-4xl font-extrabold">Let's <span className="text-indigo-600">Connect</span></h1>
            <p className="text-slate-500 dark:text-slate-400 text-lg">
              I'm always open to discussing new projects, creative ideas or opportunities to be part of your visions.
            </p>
          </header>

          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="font-bold">Email Me</h4>
                <p className="text-slate-500 dark:text-slate-400">{profile?.contactEmail || 'hello@asraf.dev'}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="font-bold">Call Me</h4>
                <p className="text-slate-500 dark:text-slate-400">{profile?.contactPhone || '+1 (555) 000-0000'}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="font-bold">Location</h4>
                <p className="text-slate-500 dark:text-slate-400">{profile?.contactLocation || 'Available Globally (Remote)'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Full Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Email Address</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                placeholder="How can I help you?"
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Send Message</>}
            </button>

            {success && (
              <p className="text-green-500 font-semibold text-center">
                Message sent successfully! I'll get back to you soon.
              </p>
            )}
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default Contact;