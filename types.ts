export interface Profile {
  id?: string;
  fullName: string;
  nickName: string;
  role: string;
  shortBio: string;
  avatarUrl: string;
  githubUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  availabilityText?: string;
  heroGreeting?: string;
  heroRolePrefix?: string;
  // Contact Info
  contactEmail?: string;
  contactPhone?: string;
  contactLocation?: string;
  // Hero Button Controls
  heroPrimaryBtnText?: string;
  heroPrimaryBtnLink?: string;
  heroSecondaryBtnText?: string;
  heroSecondaryBtnLink?: string;
  showHeroButtons?: boolean;
  // Footer specific
  footerText?: string;
}

export interface HeaderLink {
  id?: string;
  name: string;
  path: string;
  order: number;
}

export interface About {
  id?: string;
  description: string;
  education: string;
  experience: string;
}

export enum SkillCategory {
  FRONTEND = 'Frontend',
  BACKEND = 'Backend',
  TOOLS = 'Tools'
}

export interface Skill {
  id?: string;
  name: string;
  level: number;
  category: SkillCategory;
}

export interface Project {
  id?: string;
  title: string;
  description: string;
  techStack?: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  createdAt?: any;
}

export interface Service {
  id?: string;
  title: string;
  description: string;
  price?: string;
}

export interface Message {
  id?: string;
  name: string;
  email: string;
  message: string;
  sentAt?: string; // User's local time string
  isRead?: boolean;
  createdAt: any;   // Firestore server timestamp
}

export interface MediaItem {
  id?: string;
  name: string;
  url: string;
  type: string;
  size?: number;
  createdAt: any;
}