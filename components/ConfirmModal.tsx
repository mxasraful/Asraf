
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirm",
  type = 'warning'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 pointer-events-auto overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className={`p-3 rounded-2xl ${
                    type === 'danger' ? 'bg-red-50 text-red-500 dark:bg-red-900/20' : 
                    type === 'warning' ? 'bg-amber-50 text-amber-500 dark:bg-amber-900/20' : 
                    'bg-indigo-50 text-indigo-500 dark:bg-indigo-900/20'
                  }`}>
                    <AlertTriangle size={24} />
                  </div>
                  <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">{title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                    {message}
                  </p>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button 
                    onClick={onClose}
                    className="flex-1 py-3 px-4 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => { onConfirm(); onClose(); }}
                    className={`flex-1 py-3 px-4 rounded-xl text-white font-bold transition-all ${
                      type === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-500/20' : 
                      type === 'warning' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 
                      'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                    } shadow-lg`}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
