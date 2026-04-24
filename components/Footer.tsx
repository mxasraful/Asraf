import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Github, Linkedin, Mail, Heart } from 'lucide-react';
import { getSingleDoc, getOrderedCollection } from '../firebase/api';
import { Profile, HeaderLink } from '../types';
import { XIcon } from './XIcon';

import { useData } from '../context/DataContext';

const Footer: React.FC = () => {
  const { profile, navLinks } = useData();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const currentYear = new Date().getFullYear();

  return (
    <footer className={`bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors ${isHome ? 'pt-16' : 'pt-8'} pb-8 px-6`}>
      <div className="max-w-7xl mx-auto">
        {/* Only show top sections on Home Page */}
        {isHome && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-6">
              <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                {profile?.fullName?.toUpperCase() || 'ASRAF'}
              </Link>
              <p className="text-slate-500 dark:text-slate-400 max-w-sm leading-relaxed">
                {profile?.footerText || profile?.shortBio || 'Professional Web Developer specializing in modern, high-performance web applications and digital experiences.'}
              </p>
              <div className="flex items-center gap-4 text-slate-400">
                {profile?.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors">
                    <Github size={20} />
                  </a>
                )}
                {profile?.twitterUrl && (
                  <a href={profile.twitterUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors">
                    <XIcon size={20} />
                  </a>
                )}
                {profile?.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500 transition-colors">
                    <Linkedin size={20} />
                  </a>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">Navigation</h4>
              <ul className="space-y-3">
                {navLinks.map((link) => (
                  <li key={link.path}><Link to={link.path} className="text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">{link.name}</Link></li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <h4 className="text-sm font-bold uppercase tracking-widest text-slate-900 dark:text-white">Get in Touch</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-500 dark:text-slate-400">
                  <Mail size={18} className="text-indigo-500" />
                  <span>{profile?.contactEmail || 'hello@asraf.dev'}</span>
                </li>
                <li>
                  <Link to="/contact" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
                    Hire Me
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Minimal Footer Bar for all pages */}
        <div className={`${isHome ? 'pt-8 border-t border-slate-100 dark:border-slate-800' : ''} flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400`}>
          <p>© {currentYear} {profile?.fullName || 'Asraful'}. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart size={14} className="text-red-500 fill-red-500" /> using React & Firebase
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;