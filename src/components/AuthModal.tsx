import React, { useState } from 'react';
import {
  X,
  Lock,
  Mail,
  User as UserIcon,
  Phone,
  Shield,
  Store,
  ChefHat,
  ShoppingBag,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  LogOut,
  ArrowRight,
} from 'lucide-react';
import { authService } from '../services/authService';
import { backend } from '../services/mockBackend';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onLoginSuccess: (user: User) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
  onLogout,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'customer' | 'restaurant-owner'>('customer');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleLogin = async (e?: React.FormEvent, directEmail?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    const targetEmail = directEmail || email;

    if (!targetEmail.trim()) {
      setError('Please enter your email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.login({
        email: targetEmail,
        password: password || 'Password123!',
      });
      setSuccessMsg(`Welcome back, ${response.user.name}!`);
      setTimeout(() => {
        onLoginSuccess(response.user);
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    if (!name.trim() || !email.trim()) {
      setError('Please fill in your name and email address.');
      setLoading(false);
      return;
    }

    try {
      const response = await authService.register({
        name,
        email,
        phone,
        password: password || 'Password123!',
        password_confirmation: password || 'Password123!',
        role,
      });
      setSuccessMsg(`Account registered successfully! Welcome, ${response.user.name}.`);
      setTimeout(() => {
        onLoginSuccess(response.user);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const demoAccounts = [
    {
      role: 'Super Admin',
      name: 'Farhan Qureshi',
      email: 'superadmin@fastflow.local',
      icon: Shield,
      color: 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100',
    },
    {
      role: 'Platform Admin',
      name: 'Ayesha Khan',
      email: 'admin@fastflow.local',
      icon: Shield,
      color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
    },
    {
      role: 'Restaurant Owner',
      name: 'Tariq Mehmood (Urban Spoon)',
      email: 'owner.urbanspoon@fastflow.local',
      icon: Store,
      color: 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100',
    },
    {
      role: 'Restaurant Owner',
      name: 'Sara Danish (Green Bowl)',
      email: 'owner.greenbowl@fastflow.local',
      icon: Store,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100',
    },
    {
      role: 'Kitchen Staff',
      name: 'Hamza Ali (Lead)',
      email: 'staff.urbanspoon@fastflow.local',
      icon: ChefHat,
      color: 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100',
    },
    {
      role: 'Customer',
      name: 'Zainab Siddiqui',
      email: 'customer@fastflow.local',
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-sm">
              FF
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900">
                {mode === 'login' ? 'Sign In to Fastflow' : 'Create New Account'}
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                {mode === 'login' ? 'Access your dashboard, orders, or portal' : 'Join Fastflow marketplace'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current Active Account Strip */}
        <div className="bg-orange-50/70 px-5 py-2.5 border-b border-orange-100 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-orange-900 font-bold">Current Account:</span>
            <span className="font-semibold text-slate-800">{currentUser.name}</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-white text-orange-700 border border-orange-200">
              {currentUser.roles[0]}
            </span>
          </div>
          <button
            onClick={() => {
              onLogout();
              setSuccessMsg('Logged out successfully');
            }}
            className="text-rose-600 hover:text-rose-800 font-bold flex items-center space-x-1"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
              mode === 'login'
                ? 'border-orange-600 text-orange-600 bg-orange-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Log In (Sign In)
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 py-3 text-xs font-bold text-center border-b-2 transition ${
              mode === 'register'
                ? 'border-orange-600 text-orange-600 bg-orange-50/20'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. admin@fastflow.local"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password (e.g. password123)"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs flex items-center justify-center space-x-1.5"
              >
                <span>{loading ? 'Signing in...' : 'Sign In'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* 1-Click Demo Accounts */}
              <div className="pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Quick 1-Click Demo Login:
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {demoAccounts.map((account) => {
                    const Icon = account.icon;
                    return (
                      <button
                        key={account.email}
                        type="button"
                        onClick={() => {
                          setEmail(account.email);
                          handleLogin(undefined, account.email);
                        }}
                        className={`p-2 rounded-xl border text-left transition flex items-center space-x-2 ${account.color}`}
                      >
                        <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                        <div className="truncate">
                          <span className="block text-[11px] font-bold truncate">{account.role}</span>
                          <span className="block text-[9px] opacity-75 truncate">{account.name.split(' ')[0]}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (Optional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+92-300-1234567"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Account Role</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setRole('customer')}
                    className={`py-2 px-3 rounded-xl border font-bold transition flex items-center justify-center space-x-1.5 ${
                      role === 'customer'
                        ? 'bg-orange-50 border-orange-500 text-orange-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Customer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('restaurant-owner')}
                    className={`py-2 px-3 rounded-xl border font-bold transition flex items-center justify-center space-x-1.5 ${
                      role === 'restaurant-owner'
                        ? 'bg-orange-50 border-orange-500 text-orange-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Store className="w-3.5 h-3.5" />
                    <span>Restaurant Owner</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 characters"
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-orange-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-xs flex items-center justify-center space-x-1.5"
              >
                <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
