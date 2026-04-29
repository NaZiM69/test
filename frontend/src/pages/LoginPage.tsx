import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Mail, Lock, Eye, EyeOff, ArrowRight, Shield, User } from 'lucide-react';
import { api } from '../services/api';
import FloatingChat from '../components/client/FloatingChat';

const LoginPage: React.FC = () => {
  const [role, setRole] = useState<'ADMIN' | 'CLIENT'>('CLIENT');
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
      
      // Basic role-based redirection
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
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 font-sans selection:bg-blue-500/30">
      {/* Background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[25%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[25%] -right-[10%] w-[50%] h-[50%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 mb-4 group cursor-pointer">
            <Dumbbell className="text-white group-hover:rotate-12 transition-transform duration-300" size={32} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">
            IRON<span className="text-blue-500">CORE</span>
          </h1>
          <p className="text-gray-400 mt-2 text-sm font-medium uppercase tracking-widest">Fitness Management</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden relative">
          {/* Top decorative line */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${role === 'ADMIN' ? 'from-purple-500 to-blue-500' : 'from-blue-500 to-cyan-500'} transition-all duration-500`}></div>

          {/* Role Toggle */}
          <div className="flex p-1 bg-black/40 rounded-2xl mb-8 relative">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-xl transition-all duration-300 ease-out ${role === 'ADMIN' ? 'translate-x-[calc(100%+0px)]' : 'translate-x-0'}`}
            ></div>
            <button 
              onClick={() => setRole('CLIENT')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold relative z-10 transition-colors ${role === 'CLIENT' ? 'text-white' : 'text-gray-500 hover:text-gray-400'}`}
            >
              <User size={16} /> Client
            </button>
            <button 
              onClick={() => setRole('ADMIN')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold relative z-10 transition-colors ${role === 'ADMIN' ? 'text-white' : 'text-gray-500 hover:text-gray-400'}`}
            >
              <Shield size={16} /> Admin
            </button>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {role === 'ADMIN' ? 'Welcome Admin' : 'Member Login'}
            </h2>
            <p className="text-gray-400 text-sm">Enter your credentials to access your dashboard.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm animate-shake">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/30 border border-white/5 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="Enter your username"
                />
              </div>
            </div>


            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors">Forgot Password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/30 border border-white/5 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-12 text-white placeholder-gray-600 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all"
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${
                role === 'ADMIN' 
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-lg shadow-purple-500/20' 
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg shadow-blue-500/20'
              } text-white mt-4`}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-500 text-sm">
              Don't have an account? <a href="#" className="text-white font-bold hover:text-blue-400 transition-colors">Contact Support</a>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center mt-8 text-gray-600 text-xs uppercase tracking-[0.2em]">
          Securely encrypted & powered by IronCore Cloud
        </p>
      </div>
      
      {/* Floating Chat for login page */}
      <FloatingChat />
    </div>
  );
};

export default LoginPage;
