import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  AlertCircle,
  Clock,
  CheckCircle2,
  MessageSquare,
  X,
} from "lucide-react";
import { api } from "../services/api";

interface NotificationItem {
  id: number;
  title: string;
  message: string;
  date: string;
  type: "problem" | "info" | "success";
}

const NotificationCenter: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isAdmin = user.role === "ADMIN";

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      // Fetch both problems and users to show names
      const [problemsRes, usersRes] = await Promise.all([
        api.getProblems(),
        api.getUsers(),
      ]);

      const usersMap: Record<number, any> = {};
      usersRes.data.forEach((u: any) => {
        usersMap[u.id] = u;
      });

      // Filter out cleared notifications
      const clearedIds = JSON.parse(
        localStorage.getItem("cleared_notifications") || "[]",
      );
      const filteredData = problemsRes.data.filter(
        (p: any) => !clearedIds.includes(p.id),
      );

      const formatted: NotificationItem[] = filteredData
        .slice(0, 10)
        .map((p: any) => {
          const u = usersMap[p.user_id];
          const name = u ? u.first_name || u.username : `User #${p.user_id}`;

          return {
            id: p.id,
            title: `Report from ${name}`,
            message:
              p.problem.length > 60
                ? p.problem.substring(0, 60) + "..."
                : p.problem,
            date: p.date,
            type: "problem",
          };
        });

      setNotifications(formatted);
      setUnreadCount(formatted.length);
    } catch (error) {
      console.error("Error fetching admin notifications:", error);
    }
  };

  const handleClearAll = () => {
    const currentIds = notifications.map((n) => n.id);
    const existingCleared = JSON.parse(
      localStorage.getItem("cleared_notifications") || "[]",
    );
    localStorage.setItem(
      "cleared_notifications",
      JSON.stringify([...existingCleared, ...currentIds]),
    );
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleClearOne = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    const existingCleared = JSON.parse(
      localStorage.getItem("cleared_notifications") || "[]",
    );
    localStorage.setItem(
      "cleared_notifications",
      JSON.stringify([...existingCleared, id]),
    );
    setNotifications(notifications.filter((n) => n.id !== id));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2.5 rounded-xl border transition-all relative ${isOpen
            ? "bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-500/20"
            : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10"
          }`}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-[10px] font-bold text-white rounded-full border-2 border-[#0a0a0a] flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-4 w-80 bg-[#0d0d0d] border border-white/10 rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
          {/* Header */}
          <div className="p-5 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div className="flex flex-col gap-0.5">
              <h3 className="font-bold text-white flex items-center gap-2">
                Notifications
                <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-500 text-[10px] font-black uppercase">
                  Live
                </span>
              </h3>
              <p className="text-[10px] text-gray-500 font-medium">
                You have {unreadCount} unread messages
              </p>
            </div>
            <button
              onClick={handleClearAll}
              className="text-[10px] font-bold text-gray-500 hover:text-red-400 transition-colors uppercase tracking-widest"
            >
              Clear All
            </button>
          </div>

          {/* Body */}
          <div className="max-h-96 overflow-y-auto custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-10 text-center space-y-3">
                <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto text-gray-600">
                  <CheckCircle2 size={24} />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  All caught up!
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-5 border-b border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer group relative"
                >
                  <button
                    onClick={(e) => handleClearOne(e, n.id)}
                    className="absolute top-5 right-5 p-1 rounded-md text-gray-700 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X size={14} />
                  </button>
                  <div className="flex gap-4">
                    <div className="mt-1 w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <AlertCircle size={20} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors">
                        {n.title}
                      </p>
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 uppercase tracking-widest pt-1">
                        <Clock size={12} />
                        {new Date(n.date).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-4 bg-white/[0.02] border-t border-white/5 text-center">
            <button className="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors uppercase tracking-widest">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
