import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { getCollection } from '../firebase/api';
import { Service } from '../types';
import { SkeletonBox } from '../components/Skeleton';
import FullPageLoader from '../components/FullPageLoader';

import { useLoading } from '../context/LoadingContext';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInitialLoading, setIsPageLoading } = useLoading();

  useEffect(() => {
    const fetchServices = async () => {
      setIsPageLoading(true);
      try {
        const data = await getCollection<Service>('services');
        setServices(data);
      } finally {
        setLoading(false);
        setIsPageLoading(false);
      }
    };
    fetchServices();
  }, [setIsPageLoading]);

  if (isInitialLoading) {
    return <FullPageLoader />;
  }

  return (
    <div className="pt-24 pb-20 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          {loading ? (
            <>
              <SkeletonBox className="h-12 w-64 mx-auto bg-slate-200 dark:bg-slate-800 rounded-2xl" />
              <SkeletonBox className="h-6 w-full max-w-2xl mx-auto bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </>
          ) : (
            <>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-extrabold tracking-tight"
              >
                My <span className="text-indigo-600">Services</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg"
              >
                I help brands and businesses stand out in the digital age with creative solutions and modern technology.
              </motion.p>
            </>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                  <span className="text-2xl font-bold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-bold mb-4">{service.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;