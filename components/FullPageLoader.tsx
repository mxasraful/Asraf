import React from 'react';

const FullPageLoader: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white dark:bg-slate-900">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-indigo-600/20 border-t-indigo-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-purple-600 rounded-full animate-spin-slow"></div>
            </div>

            <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
        </div>
    );
};

export default FullPageLoader;
