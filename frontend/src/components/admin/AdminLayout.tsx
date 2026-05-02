import React from "react";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Bell,
  Search,
  Tag,
  Shield,
  AlertCircle,
  Server,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import Sidebar from "../Sidebar";
import type { MenuItem } from "../Sidebar";
import FloatingChat from "../client/FloatingChat";
import NotificationCenter from "../NotificationCenter";

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  const menuItems: MenuItem[] = [
    {
      icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
      label: "Dashboard",
      path: "/admin",
    },
    {
      icon: <Users size={18} strokeWidth={1.5} />,
      label: "Members",
      path: "/admin/members",
    },
    {
      icon: <Shield size={18} strokeWidth={1.5} />,
      label: "Admins",
      path: "/admin/admins",
    },
    {
      icon: <Tag size={18} strokeWidth={1.5} />,
      label: "Plans",
      path: "/admin/plans",
    },
    {
      icon: <AlertCircle size={18} strokeWidth={1.5} />,
      label: "Support",
      path: "/admin/problems",
    },
    {
      icon: <Server size={18} strokeWidth={1.5} />,
      label: "System",
      path: "/admin/system",
    },
  ];

  const handleLogout = () => {
    localStorage.clear();
    api.setToken(null);
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-black text-gray-100 overflow-hidden font-sans selection:bg-orange-500/30">
      <Sidebar menuItems={menuItems} onLogout={handleLogout} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-orange-500/[0.03] rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <header className="h-24 bg-black/40 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-10 z-20">
          <div className="flex items-center gap-8 flex-1">
            <div className="relative max-w-lg w-full group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-orange-500 transition-colors"
                size={16}
                strokeWidth={2.5}
              />
              <input
                type="text"
                placeholder="Search database..."
                className="bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-6 w-full focus:outline-none focus:border-orange-500/50 focus:bg-orange-500/[0.02] transition-all text-[10px] uppercase tracking-widest font-bold placeholder:text-gray-700"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <NotificationCenter />
            <div className="h-6 w-px bg-white/10 mx-2"></div>
            <div className="flex items-center gap-5 group cursor-pointer">
              <div className="text-right hidden xl:block">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                  Administrator
                </p>
                <p className="text-[10px] text-orange-500 font-bold uppercase tracking-widest opacity-70">
                  Level 01 Access
                </p>
              </div>
              <div className="w-12 h-12 rounded-[1.2rem] bg-orange-500/10 border border-orange-500/20 p-1 group-hover:border-orange-500/50 transition-all duration-500">
                <div className="w-full h-full rounded-[0.9rem] bg-black flex items-center justify-center overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700">
                  <img
                    src="https://ui-avatars.com/api/?name=Admin+User&background=000&color=f97316&bold=true"
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-1 overflow-y-auto p-12 scrollbar-hide">
          <div className="animate-fade-in">{children}</div>
        </div>

        {/* Floating Chat */}
        <FloatingChat />
      </main>
    </div>
  );
};

export default AdminLayout;
