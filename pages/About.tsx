import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Briefcase, Code } from 'lucide-react';
import { getSingleDoc, getCollection } from '../firebase/api';
import { About, Skill, SkillCategory } from '../types';
import { SkeletonBox } from '../components/Skeleton';
import FullPageLoader from '../components/FullPageLoader';

import { useLoading } from '../context/LoadingContext';

const AboutPage: React.FC = () => {
  const [about, setAbout] = useState<About | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInitialLoading, setIsPageLoading } = useLoading();

  useEffect(() => {
    const fetchData = async () => {
      setIsPageLoading(true);
      try {
        const [aboutData, skillsData] = await Promise.all([
          getSingleDoc<About>('about', 'info'),
          getCollection<Skill>('skills')
        ]);
        setAbout(aboutData);
        setSkills(skillsData);
      } finally {
        setLoading(false);
        setIsPageLoading(false);
      }
    };
    fetchData();
  }, [setIsPageLoading]);

  if (isInitialLoading) {
    return <FullPageLoader />;
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          {/* Intro Skeleton */}
          <div className="space-y-6">
            <SkeletonBox className="h-12 w-48" />
            <div className="space-y-3">
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-full" />
              <SkeletonBox className="h-4 w-2/3" />
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <SkeletonBox className="h-8 w-40" />
              <SkeletonBox className="h-32 w-full rounded-2xl" />
            </div>
            <div className="space-y-6">
              <SkeletonBox className="h-8 w-40" />
              <SkeletonBox className="h-32 w-full rounded-2xl" />
            </div>
          </div>

          {/* Skills Skeleton */}
          <div className="space-y-8">
            <SkeletonBox className="h-10 w-64 mx-auto" />
            <div className="grid gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="space-y-4">
                  <SkeletonBox className="h-6 w-32" />
                  <div className="grid sm:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map((j) => (
                      <SkeletonBox key={j} className="h-20 w-full rounded-xl" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const categories = Object.values(SkillCategory);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto space-y-16">

        {/* Intro */}
        <section className="space-y-6">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-4xl font-extrabold"
          >
            About <span className="text-indigo-600">Me</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 text-lg leading-relaxed whitespace-pre-wrap"
          >
            {about?.description || 'No description available yet.'}
          </motion.div>
        </section>

        {/* Education & Experience */}
        <div className="grid md:grid-cols-2 gap-12">
          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <BookOpen className="text-indigo-500" /> Education
            </h2>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 whitespace-pre-wrap text-slate-600 dark:text-slate-400">
              {about?.education || 'Education details coming soon.'}
            </div>
          </section>

          <section className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Briefcase className="text-indigo-500" /> Experience
            </h2>
            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 whitespace-pre-wrap text-slate-600 dark:text-slate-400">
              {about?.experience || 'Work experience details coming soon.'}
            </div>
          </section>
        </div>

        {/* Skills */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Skills & <span className="text-indigo-600">Technologies</span></h2>
          <div className="grid gap-8">
            {categories.map((cat) => (
              <div key={cat} className="space-y-4">
                <h3 className="text-xl font-semibold text-indigo-500">{cat}</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {skills
                    .filter(s => s.category === cat)
                    .map((skill, idx) => (
                      <motion.div
                        key={skill.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm"
                      >
                        <div className="flex justify-between mb-2">
                          <span className="font-medium">{skill.name}</span>
                          <span className="text-indigo-500 text-sm font-bold">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-indigo-500"
                          />
                        </div>
                      </motion.div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;