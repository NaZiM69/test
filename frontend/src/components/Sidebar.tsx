import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CreditCard, LogOut } from 'lucide-react';

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
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <CreditCard className="text-white" size={18} />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">IRONCORE<span className="text-blue-500">.</span></span>
      </div>
      
      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              location.pathname === item.path 
                ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20 shadow-lg shadow-blue-500/5' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button 
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-gray-400 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
