import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Shield, User, Zap } from 'lucide-react';
import { api } from '../services/api';
import LogoDoku from '../components/LogoDoku';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.login({ username, password });
      const { token, user } = response.data;

      api.setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('user_role', user.role);

      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-900/50 to-orange-500  flex items-center justify-center p-4 font-sans selection:bg-orange-500/30 overflow-hidden">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-600/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="mb-8"></div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl"></div>

          {/* Logo Replacement */}
          <div className="flex justify-center mb-14 scale-150">
            <LogoDoku size="w-64" showText={true} />
          </div>

          <div className="mb-10 text-center">
            <h2 className="text-2xl font-light text-white mb-2 tracking-tight">
              Welcome <span className="italic font-serif text-orange-500">Back</span>
            </h2>
            <p className="text-gray-400 text-lg">Credentials required for login</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-xs text-center animate-shake">
                {error}
              </div>
            )}

            {/* Input Group: Username */}
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-orange-500 transition-colors">
                  <User size={18} strokeWidth={1.5} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-2xl py-4 pl-14 pr-5 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                  placeholder="Username"
                />
              </div>
            </div>

            {/* Input Group: Password */}
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-300 group-focus-within:text-orange-500 transition-colors">
                  <Lock size={18} strokeWidth={1.5} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 focus:border-orange-500/50 rounded-2xl py-4 pl-14 pr-14 text-white text-sm placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-300 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
                </button>
              </div>
              <div className="flex justify-end px-1">
                <a href="#" className="text-[10px] uppercase tracking-widest font-bold text-gray-300 hover:text-white transition-colors">Recovery?</a>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-5 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 bg-orange-500 hover:bg-white hover:text-black text-white shadow-2xl shadow-orange-500/20 transition-all duration-500 disabled:opacity-50 mt-4 group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Identify <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-300 text-xs uppercase tracking-widest">
              Need access? <a href="#" className="text-white font-bold hover:text-orange-300 transition-colors">Contact</a>
            </p>
          </div>
        </div>

        {/* Footer Security Badge */}
        <div className="flex items-center justify-center gap-3 mt-10">
          <div className="h-px w-8 bg-white/10"></div>
          <Zap size={14} className="text-orange-500" />
          <p className="text-gray-200 text-[10px] uppercase tracking-[0.3em] font-medium">
            Precision Fitness Plan
          </p>
          <div className="h-px w-8 bg-white/10"></div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
