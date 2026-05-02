import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import LogoDoku from './LogoDoku';

export interface MenuItem {
  icon: React.ReactNode;
  label: string;
  path: string;
}

interface SidebarProps {
  menuItems: MenuItem[];
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menuItems, onLogout }) => {
  const location = useLocation();

  return (
    <aside className="w-72 bg-black border-r border-white/10 flex flex-col h-full overflow-hidden">
      {/* Branding Section */}
      <div className="p-8 pb-10">
        <LogoDoku size="w-32" showText={true} />
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group ${
              location.pathname === item.path 
                ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/20' 
                : 'text-gray-500 hover:text-white hover:bg-white/5'
            }`}
          >
            <div className={`transition-transform duration-300 group-hover:scale-110 ${
               location.pathname === item.path ? 'text-white' : 'text-gray-600 group-hover:text-orange-500'
            }`}>
              {item.icon}
            </div>
            <span className="font-bold text-[10px] uppercase tracking-[0.2em]">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-white/5">
        <button 
          onClick={onLogout}
          className="flex items-center gap-4 px-5 py-4 w-full text-gray-600 hover:text-orange-500 hover:bg-orange-500/5 rounded-2xl transition-all duration-300 group"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-[10px] uppercase tracking-[0.2em]">Exit Terminal</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
