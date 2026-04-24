import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { getOrderedCollection } from '../firebase/api';
import { Project } from '../types';
import { ProjectSkeleton, SkeletonBox } from '../components/Skeleton';
import FullPageLoader from '../components/FullPageLoader';

import { useLoading } from '../context/LoadingContext';

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInitialLoading, setIsPageLoading } = useLoading();

  useEffect(() => {
    const fetchProjects = async () => {
      setIsPageLoading(true);
      try {
        const data = await getOrderedCollection<Project>('projects', 'createdAt');
        setProjects(data);
      } finally {
        setLoading(false);
        setIsPageLoading(false);
      }
    };
    fetchProjects();
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
                My Recent <span className="text-indigo-600">Projects</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg"
              >
                A showcase of my recent work, featuring web applications, design systems, and creative experiments.
              </motion.p>
            </>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ProjectSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
              >
                {/* Image Section */}
                <div className="aspect-video overflow-hidden relative">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <div className="flex gap-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 transition-colors"
                        >
                          <ExternalLink size={16} /> Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/20 transition-colors"
                        >
                          <Github size={16} /> Source
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-8 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 3 && (
                      <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">
                        +{project.techStack.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;