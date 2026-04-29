import React from 'react';
import { LayoutDashboard, Users, CreditCard, Settings, Bell, Search, Tag, Shield, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import Sidebar from '../Sidebar';
import type { MenuItem } from '../Sidebar';
import FloatingChat from '../client/FloatingChat';
import NotificationCenter from '../NotificationCenter';

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  const menuItems: MenuItem[] = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin' },
    { icon: <Users size={20} />, label: 'Members', path: '/admin/members' },
    { icon: <Shield size={20} />, label: 'Admins', path: '/admin/admins' },
    { icon: <Tag size={20} />, label: 'Plans', path: '/admin/plans' },
    { icon: <AlertCircle size={20} />, label: 'Client Problems', path: '/admin/problems' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
  ];

  const handleLogout = () => {
    localStorage.clear();
    api.setToken(null);
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
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input 
                type="text" 
                placeholder="Search clients, plans..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 w-full focus:outline-none focus:border-blue-500/50 transition-all text-sm"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationCenter />
            <div className="h-8 w-[1px] bg-white/10 mx-2"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold">Admin User</p>
                <p className="text-xs text-gray-500">System Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 p-[1px]">
                <div className="w-full h-full rounded-[10px] bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                  <img src="https://ui-avatars.com/api/?name=Admin+User&background=transparent&color=fff" alt="Avatar" />
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

export default AdminLayout;
