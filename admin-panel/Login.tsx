import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { LogIn, Loader2, ShieldCheck, AlertCircle, ArrowLeft } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Logged in successfully!');
      setTimeout(() => navigate('/admin/dashboard'), 1500);
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-6 py-12">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700">
          <div className="text-center space-y-4 mb-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mx-auto text-white shadow-xl shadow-indigo-500/20">
              <ShieldCheck size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                Admin Login
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm">
                Enter your credentials to manage your portfolio
              </p>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-2xl text-sm border border-red-100 dark:border-red-800/30 flex items-center gap-3">
              <AlertCircle size={18}/>
              {error}
            </div>
          )}
          
          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400 rounded-2xl text-sm border border-green-100 dark:border-red-800/30 flex items-center gap-3">
              <ShieldCheck size={18}/>
              {success}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input 
                required 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="admin-input" 
                placeholder="admin@example.com" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                required 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                className="admin-input" 
                placeholder="••••••••" 
              />
            </div>
            <button disabled={loading} className="admin-btn-primary">
              {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={18} /> Sign In</>}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-700">
             <Link 
               to="/" 
               className="w-full py-4 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-200 font-bold rounded-2xl flex items-center justify-center gap-2 transition-colors"
             >
                <ArrowLeft size={18} /> Back to Website
             </Link>
          </div>
        </div>
        
        <p className="text-center text-slate-400 text-sm">
          Protected area. Authorized access only.
        </p>
      </div>
    </div>
  );
};

export default Login;