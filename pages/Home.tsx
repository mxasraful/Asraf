import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, Github, Linkedin,
  ExternalLink, CheckCircle2, Mail, MapPin, Send, Loader2,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { XIcon } from '../components/XIcon';
import { getSingleDoc, getCollection, getOrderedCollection, createDoc } from '../firebase/api';
import { Profile, About, Project, Service } from '../types';

import { useLoading } from '../context/LoadingContext';
import { useData } from '../context/DataContext';
import FullPageLoader from '../components/FullPageLoader';

const SectionHeader = ({ title, subtitle, highlight }: { title: string, subtitle: string, highlight?: string }) => (
  <div className="text-center space-y-4 mb-16">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-extrabold tracking-tight"
    >
      {title} <span className="text-indigo-600">{highlight}</span>
    </motion.h2>
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-lg"
    >
      {subtitle}
    </motion.p>
  </div>
);

const Home: React.FC = () => {
  const { profile } = useData();
  const [about, setAbout] = useState<About | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const { isInitialLoading, setIsPageLoading } = useLoading();

  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [contactLoading, setContactLoading] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsPageLoading(true);
      try {
        const [aData, prData, sData] = await Promise.all([
          getSingleDoc<About>('about', 'info'),
          getOrderedCollection<Project>('projects', 'createdAt'),
          getCollection<Service>('services')
        ]);
        setAbout(aData);
        setProjects(prData);
        setServices(sData);
      } catch (err) {
        console.error("Failed to load home data:", err);
      } finally {
        setLoading(false);
        setIsPageLoading(false);
      }
    };
    fetchAllData();
  }, [setIsPageLoading]);

  if (isInitialLoading) {
    return <FullPageLoader />;
  }

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    try {
      // Capture user's local time
      const userLocalTime = new Date().toLocaleString();
      await createDoc('messages', {
        ...formData,
        sentAt: userLocalTime,
        isRead: false
      });
      setContactSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setContactSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      alert('Error sending message.');
    } finally {
      setContactLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

  if (!profile) return null;

  return (
    <div className="bg-white dark:bg-slate-900 overflow-x-hidden">

      {/* 1. HERO SECTION */}
      <section className="min-h-screen flex items-center pt-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 py-12 lg:py-24">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-8"
          >
            {profile.availabilityText && (
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-sm font-semibold">
                {profile.availabilityText}
              </div>
            )}
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight">
                {profile.heroGreeting || "I'm"} <span className="text-indigo-600 dark:text-indigo-400">{profile.fullName}</span>
              </h1>
              <h2 className="text-2xl lg:text-3xl text-slate-600 dark:text-slate-400 font-medium">
                {profile.heroRolePrefix || "A Professional"} <span className="border-b-2 border-indigo-500">{profile.role}</span>
              </h2>
              <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg leading-relaxed">
                {profile.shortBio}
              </p>
            </div>

            {/* SAFE DYNAMIC BUTTONS */}
            {profile.showHeroButtons !== false && (
              <div className="flex flex-wrap gap-4">
                <Link
                  to={profile.heroPrimaryBtnLink || '#projects'}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  {profile.heroPrimaryBtnText || 'View Work'} <ArrowRight size={20} />
                </Link>
                <Link
                  to={profile.heroSecondaryBtnLink || '#contact'}
                  className="px-8 py-4 border-2 border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-xl font-bold transition-all"
                >
                  {profile.heroSecondaryBtnText || "Let's Talk"}
                </Link>
              </div>
            )}

            <div className="flex items-center gap-6 pt-4 text-slate-400">
              {profile.githubUrl && (
                <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors"><Github size={24} /></a>
              )}
              {profile.twitterUrl && (
                <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors"><XIcon size={24} /></a>
              )}
              {profile.linkedinUrl && (
                <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors"><Linkedin size={24} /></a>
              )}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative group flex-shrink-0"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative w-72 h-72 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl">
              <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. ABOUT SECTION */}
      <section id="about" className="py-24 px-6 bg-slate-50 dark:bg-slate-800/20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-indigo-600 font-bold uppercase tracking-widest">About Me</h3>
              <h2 className="text-4xl font-extrabold leading-tight">Crafting Digital Experiences with <span className="text-indigo-600">Passion</span></h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                {about?.description || "I am a web developer focused on building high-performance, accessible, and beautiful websites."}
              </p>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-2xl text-indigo-600">2+</h4>
                  <p className="text-slate-500 text-sm uppercase font-bold tracking-tighter">Years Experience</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-2xl text-indigo-600">20+</h4>
                  <p className="text-slate-500 text-sm uppercase font-bold tracking-tighter">Projects Completed</p>
                </div>
              </div>
              <Link to="/about" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:gap-4 transition-all">
                Read Full Story <ChevronRight size={20} />
              </Link>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid gap-6"
            >
              <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h4 className="font-bold text-xl mb-2 flex items-center gap-3">🎓 Education</h4>
                <p className="text-slate-500 dark:text-slate-400">{about?.education || "Self-taught Developer"}</p>
              </div>
              <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <h4 className="font-bold text-xl mb-2 flex items-center gap-3">💼 Experience</h4>
                <p className="text-slate-500 dark:text-slate-400">{about?.experience || "Freelance Developer"}</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. PROJECTS PREVIEW SECTION */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Featured"
            highlight="Projects"
            subtitle="A selection of my recent works that showcase my technical abilities and problem-solving skills."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-indigo-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-indigo-600 rounded-full hover:scale-110 transition-transform">
                        <ExternalLink size={20} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <h3 className="text-2xl font-bold">{project.title}</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map(tech => (
                      <span key={tech} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">{tech}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/projects" className="inline-flex items-center gap-3 px-8 py-4 border-2 border-indigo-600 text-indigo-600 dark:text-indigo-400 font-bold rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
              See All Projects <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. SERVICES PREVIEW SECTION */}
      <section id="services" className="py-24 px-6 bg-slate-50 dark:bg-slate-800/20">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="My"
            highlight="Services"
            subtitle="I provide a variety of high-quality web development services to help you build and scale your business."
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.slice(0, 3).map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-6">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed mb-6">{service.description}</p>
                {service.price && <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest">{service.price}</p>}
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Link to="/services" className="inline-flex items-center gap-3 text-indigo-600 font-bold hover:gap-4 transition-all">
              View All Services <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. CONTACT SECTION */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            title="Get In"
            highlight="Touch"
            subtitle="Have a project in mind or just want to say hello? Drop me a message below!"
          />

          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">Contact Information</h3>
                <p className="text-slate-500 dark:text-slate-400">Feel free to reach out via email, phone, or the contact form. I'll get back to you as soon as possible.</p>
              </div>
              <div className="space-y-6">
                <div className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <Mail className="text-indigo-600" size={24} />
                  <div>
                    <h4 className="font-bold">Email</h4>
                    <p className="text-slate-500">{profile.contactEmail || 'hello@asraf.dev'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                  <MapPin className="text-indigo-600" size={24} />
                  <div>
                    <h4 className="font-bold">Location</h4>
                    <p className="text-slate-500">{profile.contactLocation || 'Available Globally (Remote)'}</p>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-xl"
            >
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Name</label>
                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Email</label>
                    <input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500" placeholder="john@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold uppercase tracking-wider text-slate-400">Message</label>
                  <textarea required rows={4} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 resize-none" placeholder="Tell me about your project..." />
                </div>
                <button disabled={contactLoading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all">
                  {contactLoading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Send Message</>}
                </button>
                {contactSuccess && <p className="text-green-500 text-center font-bold">Thank you! Message sent.</p>}
              </form>
            </motion.div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;