import React from 'react';
import { LayoutDashboard, CreditCard, Bell, User, Zap, Calendar, Apple, Dumbbell, Target, MessageSquare, Activity, AlertCircle } from 'lucide-react';

import { useNavigate } from 'react-router-dom';
import Sidebar from '../Sidebar';
import type { MenuItem } from '../Sidebar';
import FloatingChat from './FloatingChat';

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const menuItems: MenuItem[] = [
    { icon: <LayoutDashboard size={18} strokeWidth={1.5} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <CreditCard size={18} strokeWidth={1.5} />, label: 'Subscription', path: '/subscription' },
    { icon: <Apple size={18} strokeWidth={1.5} />, label: 'Nutrition', path: '/food-calorie' },
    { icon: <Dumbbell size={18} strokeWidth={1.5} />, label: 'Bicep Coach', path: '/bicep-coach' },
    { icon: <Target size={18} strokeWidth={1.5} />, label: 'Pushup Coach', path: '/pushup-coach' },
    { icon: <MessageSquare size={18} strokeWidth={1.5} />, label: 'Chat', path: '/chat' },
    { icon: <Activity size={18} strokeWidth={1.5} />, label: 'Workout Plan', path: '/workout-plan' },
    { icon: <AlertCircle size={18} strokeWidth={1.5} />, label: 'Support', path: '/support' },
  ];



  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden font-sans">
      <Sidebar menuItems={menuItems} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <header className="h-24 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-10 z-10">
          <div className="flex items-center gap-4 flex-1">
             <h2 className="text-2xl font-light tracking-tight">
                Welcome back, <span className="italic font-serif text-orange-500">{user.first_name || user.username}</span>
             </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <button className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-orange-500/10 hover:border-orange-500/50 transition-all text-gray-400 hover:text-orange-500 relative">
               <Bell size={20} strokeWidth={1.5} />
               <span className="absolute top-3 right-3 w-2 h-2 bg-orange-500 rounded-full border-2 border-black"></span>
            </button>

            <div className="h-10 w-px bg-white/10 mx-2"></div>

            <div className="flex items-center gap-4 group cursor-pointer">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold uppercase tracking-widest">{user.first_name} {user.last_name}</p>
                <p className="text-[10px] text-orange-500 font-bold uppercase tracking-tighter opacity-70 group-hover:opacity-100 transition-opacity italic">{user.role}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-white/10 p-1 group-hover:border-orange-500/50 transition-all">
                <div className="w-full h-full rounded-xl bg-black flex items-center justify-center overflow-hidden">
                   <User size={24} className="text-orange-500" strokeWidth={1.5} />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar relative z-0">
          {children}
        </div>
        
        <FloatingChat />
      </main>
    </div>
  );
};

export default ClientLayout;
