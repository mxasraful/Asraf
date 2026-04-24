
import React from 'react';

export const SkeletonBox: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`animate-pulse bg-slate-200 dark:bg-slate-800 rounded ${className}`} />
);

export const ProjectSkeleton: React.FC = () => (
  <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
    <SkeletonBox className="h-48 w-full" />
    <div className="p-4 space-y-3">
      <SkeletonBox className="h-6 w-3/4" />
      <SkeletonBox className="h-4 w-full" />
      <SkeletonBox className="h-4 w-5/6" />
      <div className="flex gap-2">
        <SkeletonBox className="h-8 w-16" />
        <SkeletonBox className="h-8 w-16" />
      </div>
    </div>
  </div>
);
