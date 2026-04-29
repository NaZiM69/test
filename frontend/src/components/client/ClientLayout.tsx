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
    { icon: <LayoutDashboard size={20} />, label: 'My Dashboard', path: '/dashboard' },
    { icon: <CreditCard size={20} />, label: 'My Subscription', path: '/subscription' },
   // icon: <Zap size={20} />, label: 'Available Plans', path: '/plans' },
   // icon: <Calendar size={20} />, label: 'Training Schedule', path: '/schedule' },
    //icon: <User size={20} />, label: 'My Profile', path: '/profile' },
    { icon: <Apple size={20} />, label: 'Food Calorie', path: '/food-calorie' },
    { icon: <Dumbbell size={20} />, label: 'AI Bicep Coach', path: '/bicep-coach' },
    { icon: <Target size={20} />, label: 'AI Pushup Coach', path: '/pushup-coach' },
    { icon: <MessageSquare size={20} />, label: 'Coach Chat', path: '/chat' },
    { icon: <Activity size={20} />, label: 'Workout Plan', path: '/workout-plan' },
    { icon: <AlertCircle size={20} />, label: 'Support', path: '/support' },
  ];



  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-[#050505] text-gray-100 overflow-hidden font-sans">
      <Sidebar menuItems={menuItems} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-[#0a0a0a]/50 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-4 flex-1">
             <h2 className="text-xl font-bold">Welcome back, {user.first_name || user.username}!</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">{user.first_name} {user.last_name}</p>
                <p className="text-xs text-gray-500 uppercase tracking-tighter">{user.role}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 p-[1px]">
                <div className="w-full h-full rounded-[10px] bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                   <User size={20} className="text-blue-400" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
        
        {/* Floating Chat */}
        <FloatingChat />
      </main>
    </div>
  );
};

export default ClientLayout;
