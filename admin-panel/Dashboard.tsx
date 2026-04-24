import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import {
  User as LucideUser, Book, Code2, FolderKanban, Briefcase, Mail,
  Plus, Trash2, Save, LogOut, Loader2,
  X, Check, Pencil,
  ExternalLink, Sun, Moon, Search, Menu, Upload,
  MousePointer2, Eye, EyeOff, Navigation as NavIcon, Phone, MapPin, Info,
  Clock, Calendar, Image as ImageIcon, Copy, MailOpen
} from 'lucide-react';
import {
  getSingleDoc, updateSingleDoc, getCollection,
  createDoc, removeDoc, updateExistingDoc, getOrderedCollection
} from '../firebase/api';
import { Profile, About, Skill, Project, Service, Message, SkillCategory, HeaderLink, MediaItem } from '../types';
import { useTheme } from '../context/ThemeContext';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

const DashboardNavbar: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400"
          >
            <Menu size={20} />
          </button>
          <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 w-64">
            <Search size={16} className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Quick search..."
              className="bg-transparent border-none outline-none text-sm w-full text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-semibold text-sm transition-colors"
          >
            <ExternalLink size={18} />
            <span className="hidden sm:inline">View Site</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors border border-slate-200 dark:border-slate-700"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

          <div className="flex items-center gap-3 pl-2">
            <div className="hidden lg:block text-right">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Administrator</p>
              <p className="text-sm font-bold truncate max-w-[150px]">{auth.currentUser?.email}</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-500/20">
              {auth.currentUser?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'about' | 'skills' | 'projects' | 'services' | 'messages' | 'navigation' | 'system' | 'media'>('profile');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalUnreadCount, setGlobalUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getCollection<Message>('messages').then(msgs => {
      setGlobalUnreadCount(msgs.filter(m => !m.isRead).length);
    }).catch(() => {});
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (error) {
      console.error("Sign out error:", error);
      showToast("Error signing out", "error");
    }
  };

  const TabButton = ({ id, label, icon: Icon, showBadge }: { id: typeof activeTab, label: string, icon: any, showBadge?: boolean }) => (
    <button
      onClick={() => {
        setActiveTab(id);
        setSidebarOpen(false);
      }}
      className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all ${activeTab === id
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
        : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400'
        }`}
    >
      <Icon size={20} />
      <span className="font-semibold">{label}</span>
      {showBadge && <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-pulse mt-0.5"></span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex relative">
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-6 flex flex-col gap-8 transition-transform duration-300
        md:sticky md:top-0 md:h-screen md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30">
              A
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">Asraf <span className="text-indigo-600">AdminPanel</span></h2>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 -mr-2 custom-scrollbar">
          <TabButton id="profile" label="Profile" icon={LucideUser} />
          <TabButton id="navigation" label="Navigation" icon={NavIcon} />
          <TabButton id="about" label="About" icon={Book} />
          <TabButton id="skills" label="Skills" icon={Code2} />
          <TabButton id="projects" label="Projects" icon={FolderKanban} />
          <TabButton id="services" label="Services" icon={Briefcase} />
          <TabButton id="messages" label="Messages" icon={Mail} showBadge={globalUnreadCount > 0} />
          <TabButton id="media" label="Media Manager" icon={ImageIcon} />
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all font-semibold mt-auto shrink-0"
        >
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="flex-1 p-6 md:p-8 lg:p-12 relative">
          {toast && (
            <div className={`fixed top-24 right-8 z-[100] p-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
              {toast.type === 'success' ? <Check size={20} /> : <X size={20} />}
              <span className="font-bold">{toast.message}</span>
            </div>
          )}

          <div className="max-w-4xl mx-auto pb-20">
            {activeTab === 'profile' && <ProfileForm showToast={showToast} />}
            {activeTab === 'navigation' && <NavigationList showToast={showToast} />}
            {activeTab === 'about' && <AboutForm showToast={showToast} />}
            {activeTab === 'skills' && <SkillsList showToast={showToast} />}
            {activeTab === 'projects' && <ProjectsList showToast={showToast} />}
            {activeTab === 'services' && <ServicesList showToast={showToast} />}
            {activeTab === 'messages' && <MessagesList showToast={showToast} updateGlobalUnreadCount={setGlobalUnreadCount} />}
            {activeTab === 'media' && <MediaManager showToast={showToast} />}
          </div>
        </main>
      </div>
    </div>
  );
};

// --- ProfileForm ---
const ProfileForm = ({ showToast }: { showToast: (m: string, t?: any) => void }) => {
  const [profile, setProfile] = useState<Profile>({
    fullName: '', nickName: '', role: '', shortBio: '', avatarUrl: '',
    githubUrl: '', twitterUrl: '', linkedinUrl: '', availabilityText: '👋 Available for new opportunities',
    heroGreeting: "I'm", heroRolePrefix: 'A Professional',
    contactEmail: '', contactPhone: '', contactLocation: '',
    heroPrimaryBtnText: 'View Work', heroPrimaryBtnLink: '#projects',
    heroSecondaryBtnText: "Let's Talk", heroSecondaryBtnLink: '#contact',
    showHeroButtons: true, footerText: ''
  });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getSingleDoc<Profile>('profile', 'info').then(data => {
      if (data) setProfile(prev => ({ ...prev, ...data }));
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateSingleDoc('profile', 'info', profile);
      showToast('Profile updated successfully!');
    } catch (err) {
      showToast('Permission denied.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) {
        showToast('Image too large. Please use an image under 800KB.', 'error');
        return;
      }
      const base64 = await fileToBase64(file);
      setProfile({ ...profile, avatarUrl: base64 });
    }
  };

  return (
    <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-12">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Manage Profile</h3>
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 p-1.5 rounded-xl">
          <button
            type="button"
            onClick={() => setProfile({ ...profile, showHeroButtons: !profile.showHeroButtons })}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all ${profile.showHeroButtons ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}
          >
            {profile.showHeroButtons ? <Eye size={16} /> : <EyeOff size={16} />}
            Hero Buttons
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-slate-100 dark:border-slate-700 bg-slate-50 shadow-inner">
            <img src={profile.avatarUrl || 'https://picsum.photos/seed/placeholder/200'} className="w-full h-full object-cover" alt="Profile" />
          </div>
          <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-full">
            <Upload size={24} />
            <span className="text-[10px] font-bold uppercase mt-1">Change Photo</span>
          </button>
        </div>
        <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
      </div>

      <div className="space-y-6">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <LucideUser size={14} /> Basic Information
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <input value={profile.heroGreeting || ''} onChange={e => setProfile({ ...profile, heroGreeting: e.target.value })} className="admin-input" placeholder="Hero Greeting (e.g. I'm)" />
          <input value={profile.fullName} onChange={e => setProfile({ ...profile, fullName: e.target.value })} className="admin-input" placeholder="Full Name" />
          <input value={profile.nickName} onChange={e => setProfile({ ...profile, nickName: e.target.value })} className="admin-input" placeholder="Nickname" />
          <input value={profile.availabilityText || ''} onChange={e => setProfile({ ...profile, availabilityText: e.target.value })} className="admin-input" placeholder="Availability Status (e.g. 👋 Available)" />
          <input value={profile.heroRolePrefix || ''} onChange={e => setProfile({ ...profile, heroRolePrefix: e.target.value })} className="admin-input" placeholder="Role Prefix (e.g. A Professional)" />
          <input value={profile.role} onChange={e => setProfile({ ...profile, role: e.target.value })} className="admin-input" placeholder="Professional Role" />
        </div>
        <textarea value={profile.shortBio} onChange={e => setProfile({ ...profile, shortBio: e.target.value })} rows={3} className="admin-input" placeholder="Short Bio" />
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-700">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Mail size={14} /> Contact Details
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400">Public Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input value={profile.contactEmail || ''} onChange={e => setProfile({ ...profile, contactEmail: e.target.value })} className="admin-input pl-10" placeholder="hello@asraf.dev" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input value={profile.contactPhone || ''} onChange={e => setProfile({ ...profile, contactPhone: e.target.value })} className="admin-input pl-10" placeholder="+1 (555) 000-0000" />
            </div>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-400">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input value={profile.contactLocation || ''} onChange={e => setProfile({ ...profile, contactLocation: e.target.value })} className="admin-input pl-10" placeholder="City, Country" />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-700">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Info size={14} /> Footer Content
        </h4>
        <textarea value={profile.footerText || ''} onChange={e => setProfile({ ...profile, footerText: e.target.value })} rows={3} className="admin-input" placeholder="Custom text for footer (e.g., specific copyright or short slogan)" />
      </div>

      <div className="space-y-6 pt-6 border-t border-slate-100 dark:border-slate-700">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <MousePointer2 size={14} /> Hero Buttons
        </h4>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-500">Primary Button (Indigo)</p>
            <input value={profile.heroPrimaryBtnText} onChange={e => setProfile({ ...profile, heroPrimaryBtnText: e.target.value })} className="admin-input" placeholder="Label (e.g., View Work)" />
            <input value={profile.heroPrimaryBtnLink} onChange={e => setProfile({ ...profile, heroPrimaryBtnLink: e.target.value })} className="admin-input" placeholder="Link (e.g., /projects)" />
          </div>
          <div className="space-y-4">
            <p className="text-sm font-bold text-slate-500">Secondary Button (Outline)</p>
            <input value={profile.heroSecondaryBtnText} onChange={e => setProfile({ ...profile, heroSecondaryBtnText: e.target.value })} className="admin-input" placeholder="Label (e.g., Let's Talk)" />
            <input value={profile.heroSecondaryBtnLink} onChange={e => setProfile({ ...profile, heroSecondaryBtnLink: e.target.value })} className="admin-input" placeholder="Link (e.g., /contact)" />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 dark:border-slate-700">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 mb-4">
          <ExternalLink size={14} /> Social Connections
        </h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400">GitHub Profile</label>
            <input value={profile.githubUrl || ''} onChange={e => setProfile({ ...profile, githubUrl: e.target.value })} className="admin-input" placeholder="https://github.com/..." />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400">X (Twitter) Profile</label>
            <input value={profile.twitterUrl || ''} onChange={e => setProfile({ ...profile, twitterUrl: e.target.value })} className="admin-input" placeholder="https://x.com/..." />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400">LinkedIn Profile</label>
            <input value={profile.linkedinUrl || ''} onChange={e => setProfile({ ...profile, linkedinUrl: e.target.value })} className="admin-input" placeholder="https://linkedin.com/..." />
          </div>
        </div>
      </div>

      <button disabled={loading} className="admin-btn-primary">
        {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
      </button>
    </form>
  );
};

// --- NavigationList ---
const NavigationList = ({ showToast }: { showToast: (m: string, t?: any) => void }) => {
  const [links, setLinks] = useState<HeaderLink[]>([]);
  const [newLink, setNewLink] = useState<{ name: string; path: string; order: number }>({ name: '', path: '', order: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchLinks = () => getOrderedCollection<HeaderLink>('navigation', 'order', 'asc').then(setLinks);
  useEffect(() => { fetchLinks(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.name || !newLink.path) return;
    setIsAdding(true);
    try {
      // Pass clean object to avoid type/spread issues
      const linkData = {
        name: newLink.name.trim(),
        path: newLink.path.trim(),
        order: Number(newLink.order) || 0
      };

      if (editingId) {
        await updateExistingDoc('navigation', editingId, linkData);
        showToast('Navigation link updated!');
      } else {
        await createDoc('navigation', linkData);
        showToast('Navigation link added!');
      }

      setNewLink({ name: '', path: '', order: (links.length + 1) });
      setEditingId(null);
      await fetchLinks();
    } catch (err: any) {
      console.error("Error adding navigation link:", err);
      // Show specific firebase error code if available
      const errorMessage = err.code ? `Error (${err.code}): ${err.message}` : (err.message || 'Check permissions');
      showToast(`Failed to add link: ${errorMessage}`, 'error');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await removeDoc('navigation', id);
      fetchLinks();
      showToast('Link removed');
    } catch (err: any) {
      showToast('Failed to remove link.', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-2xl font-bold">Manage Header Menu</h3>
        <p className="text-sm text-slate-500 mb-4">Control the navigation links visible in the website header.</p>
        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Link Name (e.g., Blog)"
            value={newLink.name}
            onChange={e => setNewLink({ ...newLink, name: e.target.value })}
            className="admin-input"
            required
          />
          <input
            placeholder="Path (e.g., /blog)"
            value={newLink.path}
            onChange={e => setNewLink({ ...newLink, path: e.target.value })}
            className="admin-input"
            required
          />
          <input
            type="number"
            placeholder="Order"
            value={newLink.order}
            onChange={e => setNewLink({ ...newLink, order: parseInt(e.target.value) || 0 })}
            className="admin-input"
          />
        </div>
        <div className="flex gap-2">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewLink({ name: '', path: '', order: links.length + 1 });
              }}
              className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
          )}
          <button disabled={isAdding} className="admin-btn-primary flex-1">
            {isAdding ? <Loader2 className="animate-spin" /> : (editingId ? <><Save size={18} /> Update Menu Item</> : <><Plus size={18} /> Add Menu Item</>)}
          </button>
        </div>
      </form>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Menu Items</span>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-700">
          {links.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No custom links. Default fallback links will be used.</div>
          ) : (
            links.map(link => (
              <div key={link.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded flex items-center justify-center font-bold text-sm">
                    {link.order}
                  </div>
                  <div>
                    <p className="font-bold">{link.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{link.path}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setNewLink({ name: link.name, path: link.path, order: link.order });
                      setEditingId(link.id!);
                    }}
                    className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                  >
                    <Pencil size={18} />
                  </button>
                  <button onClick={() => handleDelete(link.id!)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- AboutForm, SkillsList, ProjectsList, ServicesList, MessagesList, SystemPanel components
const AboutForm = ({ showToast }: { showToast: (m: string, t?: any) => void }) => {
  const [about, setAbout] = useState<About>({ description: '', education: '', experience: '' });
  const [loading, setLoading] = useState(false);
  useEffect(() => { getSingleDoc<About>('about', 'info').then(data => data && setAbout(data)); }, []);
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try { await updateSingleDoc('about', 'info', about); showToast('About section updated!'); }
    catch (err) { showToast('Error saving.', 'error'); }
    finally { setLoading(false); }
  };
  return (
    <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 space-y-6">
      <h3 className="text-2xl font-bold">Manage About Content</h3>
      <textarea value={about.description} onChange={e => setAbout({ ...about, description: e.target.value })} rows={8} className="admin-input" placeholder="Description" />
      <textarea value={about.education} onChange={e => setAbout({ ...about, education: e.target.value })} rows={4} className="admin-input" placeholder="Education" />
      <textarea value={about.experience} onChange={e => setAbout({ ...about, experience: e.target.value })} rows={4} className="admin-input" placeholder="Experience" />
      <button disabled={loading} className="admin-btn-primary">
        {loading ? <Loader2 className="animate-spin" /> : <><Save size={18} /> Save Changes</>}
      </button>
    </form>
  );
};

const SkillsList = ({ showToast }: { showToast: (m: string, t?: any) => void }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({ name: '', level: 80, category: SkillCategory.FRONTEND });
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchSkills = () => getCollection<Skill>('skills').then(setSkills);
  useEffect(() => { fetchSkills(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name) return;

    if (editingId) {
      await updateExistingDoc('skills', editingId, newSkill);
      showToast('Skill updated!');
    } else {
      await createDoc('skills', newSkill);
      showToast('Skill added!');
    }

    setNewSkill({ name: '', level: 80, category: SkillCategory.FRONTEND });
    setEditingId(null);
    fetchSkills();
  };

  const handleDelete = async (id: string) => { await removeDoc('skills', id); fetchSkills(); showToast('Skill deleted'); };

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-2xl font-bold">Manage Skills</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <input placeholder="Skill name" value={newSkill.name} onChange={e => setNewSkill({ ...newSkill, name: e.target.value })} className="admin-input" />
          <select value={newSkill.category} onChange={e => setNewSkill({ ...newSkill, category: e.target.value as SkillCategory })} className="admin-input">
            {Object.values(SkillCategory).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input type="number" value={newSkill.level} onChange={e => setNewSkill({ ...newSkill, level: parseInt(e.target.value) || 0 })} className="admin-input" />
        </div>
        <div className="flex gap-2">
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setNewSkill({ name: '', level: 80, category: SkillCategory.FRONTEND });
              }}
              className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Cancel
            </button>
          )}
          <button className="admin-btn-primary flex-1">
            {editingId ? <><Save size={18} /> Update Skill</> : <><Plus size={18} /> Add Skill</>}
          </button>
        </div>
      </form>
      <div className="grid gap-4">
        {skills.map(s => (
          <div key={s.id} className="p-4 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-between border border-slate-200 dark:border-slate-700 shadow-sm">
            <div><p className="font-bold">{s.name}</p><p className="text-xs text-indigo-500 font-bold uppercase">{s.category} • {s.level}%</p></div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setNewSkill({ ...s });
                  setEditingId(s.id!);
                }}
                className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
              >
                <Pencil size={18} />
              </button>
              <button onClick={() => handleDelete(s.id!)} className="p-2 text-red-500"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectsList = ({ showToast }: { showToast: (m: string, t?: any) => void }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Partial<Project>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProjects = () => getCollection<Project>('projects').then(setProjects);
  useEffect(() => { fetchProjects(); }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 800000) {
        showToast('Image too large. Please use an image under 800KB.', 'error');
        return;
      }
      const base64 = await fileToBase64(file);
      setEditing({ ...editing, imageUrl: base64 });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing.id) await updateExistingDoc('projects', editing.id, editing);
    else await createDoc('projects', editing);
    setShowForm(false);
    fetchProjects();
    showToast('Project saved!');
  };
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center"><h3 className="text-2xl font-bold">Projects</h3><button style={{ width: '200px', float: 'right' }} onClick={() => { setEditing({}); setShowForm(true); }} className="admin-btn-primary px-6"><Plus size={18} /> New Project</button></div>
      {showForm && (
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-indigo-500 space-y-4">
          <div className="flex flex-col items-center gap-4 mb-4">
            <div className="relative group">
              <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 bg-slate-50 shadow-inner">
                <img src={editing.imageUrl || 'https://picsum.photos/seed/placeholder/200'} className="w-full h-full object-cover" alt="Preview" />
              </div>
              <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center rounded-xl">
                <Upload size={20} />
                <span className="text-[10px] font-bold uppercase mt-1">Upload Image</span>
              </button>
            </div>
            <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
            <div className="w-full">
              <label className="text-xs font-bold text-slate-400 mb-1 block">Image URL</label>
              <input
                placeholder="Or paste image URL (https://...)"
                value={editing.imageUrl || ''}
                onChange={e => setEditing({ ...editing, imageUrl: e.target.value })}
                className="admin-input"
              />
            </div>
          </div>

          <input placeholder="Title" value={editing.title || ''} onChange={e => setEditing({ ...editing, title: e.target.value })} className="admin-input" />
          <textarea placeholder="Description" value={editing.description || ''} onChange={e => setEditing({ ...editing, description: e.target.value })} className="admin-input" />
          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Live URL (e.g., https://myapp.com)" value={editing.liveUrl || ''} onChange={e => setEditing({ ...editing, liveUrl: e.target.value })} className="admin-input" />
            <input placeholder="GitHub URL" value={editing.githubUrl || ''} onChange={e => setEditing({ ...editing, githubUrl: e.target.value })} className="admin-input" />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 font-bold rounded-xl">Cancel</button>
            <button className="admin-btn-primary flex-1">Save Project</button>
          </div>
        </form>
      )}
      <div className="grid gap-6">
        {projects.map(p => (
          <div key={p.id} className="p-4 bg-white dark:bg-slate-800 rounded-2xl flex gap-6 items-center border border-slate-200 dark:border-slate-700 shadow-sm">
            <img src={p.imageUrl} className="w-20 h-20 rounded-xl object-cover" alt={p.title} />
            <div className="flex-1">
              <div className="font-bold">{p.title}</div>
              <div className="text-xs text-slate-400 flex gap-2 mt-1">
                {p.liveUrl && <span className="flex items-center gap-1"><ExternalLink size={10} /> Live</span>}
                {p.githubUrl && <span className="flex items-center gap-1"><Code2 size={10} /> Code</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setEditing(p); setShowForm(true); }} className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"><Pencil size={18} /></button>
              <button onClick={() => removeDoc('projects', p.id!).then(fetchProjects)} className="text-red-500"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ServicesList = ({ showToast }: { showToast: (m: string, t?: any) => void }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [newS, setNewS] = useState<Partial<Service>>({});
  const [editingId, setEditingId] = useState<string | null>(null);

  const fetchServices = () => getCollection<Service>('services').then(setServices);
  useEffect(() => { fetchServices(); }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateExistingDoc('services', editingId, newS);
      showToast('Service updated!');
    } else {
      await createDoc('services', newS);
      showToast('Service added!');
    }
    setNewS({});
    setEditingId(null);
    fetchServices();
  };

  const handleDelete = async (id: string) => { await removeDoc('services', id); fetchServices(); showToast('Service deleted'); };

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
        <h3 className="text-2xl font-bold">Manage Services</h3>
        <input placeholder="Title" value={newS.title || ''} onChange={e => setNewS({ ...newS, title: e.target.value })} className="admin-input" />
        <textarea placeholder="Description" value={newS.description || ''} onChange={e => setNewS({ ...newS, description: e.target.value })} className="admin-input" />
        <div className="flex gap-2">
          {editingId && (
            <button
              type="button"
              onClick={() => { setEditingId(null); setNewS({}); }}
              className="flex-1 px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold rounded-xl"
            >
              Cancel
            </button>
          )}
          <button className="admin-btn-primary flex-1">
            {editingId ? <><Save size={18} /> Update Service</> : <><Plus size={18} /> Add Service</>}
          </button>
        </div>
      </form>
      <div className="grid gap-4">
        {services.map(s => (
          <div key={s.id} className="p-6 bg-white dark:bg-slate-800 rounded-2xl flex justify-between border border-slate-200 dark:border-slate-700">
            <div><h4 className="font-bold">{s.title}</h4><p className="text-sm mt-2">{s.description}</p></div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setNewS({ ...s }); setEditingId(s.id!); }} className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg"><Pencil size={18} /></button>
              <button onClick={() => handleDelete(s.id!)} className="text-red-500"><Trash2 size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MessagesList = ({ showToast, updateGlobalUnreadCount }: { showToast: (m: string, t?: any) => void, updateGlobalUnreadCount: (c: number) => void }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrderedCollection<Message>('messages', 'createdAt', 'desc')
      .then(setMessages)
      .finally(() => setLoading(false));
  }, []);

  const toggleReadStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateExistingDoc('messages', id, { isRead: !currentStatus });
      setMessages(messages.map(m => m.id === id ? { ...m, isRead: !currentStatus } : m));
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const unreadCount = messages.filter(m => !m.isRead).length;

  useEffect(() => {
    updateGlobalUnreadCount(unreadCount);
  }, [unreadCount, updateGlobalUnreadCount]);

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-indigo-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Received Messages</h3>
        <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-full">
          {unreadCount > 0 && <span className="mr-1">{unreadCount} Unread | </span>}
          {messages.length} Total
        </span>
      </div>

      {messages.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
          <Mail size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No messages yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map(m => (
            <div key={m.id} className={`group p-6 rounded-3xl shadow-sm hover:shadow-md transition-all relative overflow-hidden ${!m.isRead ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-2 border-indigo-500' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700'}`}>
              {!m.isRead && (
                <div className="absolute top-4 right-4 w-3 h-3 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]" title="Unread Message"></div>
              )}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <p className={`text-lg text-slate-900 dark:text-white ${!m.isRead ? 'font-extrabold' : 'font-bold'}`}>{m.name}</p>
                  <p className={`text-sm text-indigo-600 dark:text-indigo-400 ${!m.isRead ? 'font-bold' : 'font-medium'}`}>{m.email}</p>
                </div>
                <div className="flex items-center gap-2 pr-4 sm:pr-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-end gap-1">
                      <Calendar size={10} /> Submitted On
                    </p>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {m.sentAt || 'Unknown Date'}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleReadStatus(m.id!, !!m.isRead)}
                    className={`p-2 rounded-xl transition-all ${!m.isRead ? 'text-indigo-500 hover:bg-indigo-100 dark:hover:bg-indigo-900/40' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    title={m.isRead ? "Mark as unread" : "Mark as read"}
                  >
                    {!m.isRead ? <MailOpen size={20} /> : <Mail size={20} />}
                  </button>
                  <button
                    onClick={() => removeDoc('messages', m.id!).then(() => {
                      setMessages(messages.filter(msg => msg.id !== m.id));
                      showToast('Message deleted');
                    })}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                    title="Delete message"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 italic whitespace-pre-wrap leading-relaxed">
                  "{m.message}"
                </p>
              </div>

              {/* Mobile Time View */}
              <div className="mt-4 sm:hidden flex items-center gap-2 text-xs text-slate-400 font-medium">
                <Clock size={12} />
                <span>{m.sentAt}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


// --- MediaManager ---
const MediaManager = ({ showToast }: { showToast: (m: string, t?: any) => void }) => {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = () => {
    setLoading(true);
    getOrderedCollection<MediaItem>('media', 'createdAt', 'desc')
      .then(setMedia)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMedia(); }, []);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2000000) {
        showToast('File too large. Max 2MB.', 'error');
        return;
      }
      setUploading(true);
      try {
        const base64 = await fileToBase64(file);
        const mediaData: Partial<MediaItem> = {
          name: file.name,
          url: base64,
          type: file.type,
          size: file.size
        };
        await createDoc('media', mediaData);
        showToast('Media uploaded!');
        fetchMedia();
      } catch (err) {
        showToast('Upload failed.', 'error');
      } finally {
        setUploading(false);
      }
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    showToast('URL copied to clipboard!');
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      try {
        await removeDoc('media', id);
        showToast('Media deleted');
        setMedia(media.filter(m => m.id !== id));
      } catch (err) {
        showToast('Failed to delete.', 'error');
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold">Media Library</h3>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="admin-btn-primary w-48"
        >
          {uploading ? <Loader2 className="animate-spin" /> : <><Upload size={18} /> Upload Media</>}
        </button>
        <input type="file" ref={fileInputRef} onChange={onFileChange} className="hidden" accept="image/*" />
      </div>

      {loading ? (
        <div className="flex justify-center p-20"><Loader2 size={40} className="animate-spin text-indigo-500" /></div>
      ) : media.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700">
          <ImageIcon size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No media uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map(m => (
            <div key={m.id} className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all">
              <div className="aspect-square relative flex items-center justify-center bg-slate-50 dark:bg-slate-900">
                <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyToClipboard(m.url)}
                    className="p-2 bg-white text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Copy URL"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(m.id!)}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs font-bold truncate text-slate-700 dark:text-slate-300">{m.name}</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase">{(m.size! / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;