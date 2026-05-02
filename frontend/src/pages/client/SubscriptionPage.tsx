import React, { useState, useEffect } from "react";
import {
  CreditCard,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  ArrowRight,
  Shield,
  Star,
} from "lucide-react";

import { api } from "../../services/api";

interface Subscription {
  id: number;
  plan: number;
  plan_name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const SubscriptionPage: React.FC = () => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserId(payload.user_id);
      } catch (e) {
        console.error("Failed to decode token", e);
      }
    }

    fetchMySubscription();
  }, []);

  const fetchMySubscription = async () => {
    setLoading(true);
    try {
      const response = await api.getMySubscription();
      setSubscription(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setSubscription(null);
      } else {
        setError("Failed to load subscription data.");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateProgress = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = new Date().getTime();

    if (now >= end) return 100;
    if (now <= start) return 0;

    const total = end - start;
    const elapsed = now - start;
    return (elapsed / total) * 100;
  };

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 font-light tracking-[0.2em] uppercase text-[10px] animate-pulse">
          Syncing Membership Data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            Status
          </div>
          <h1 className="text-5xl md:text-6xl font-light text-white tracking-tight leading-none">
            Premium{" "}
            <span className="italic font-serif text-orange-500">
              Membership
            </span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-md">
            Manage your subscriptions and access.
          </p>
        </div>

        {userId && (
          <div className="px-6 py-4 bg-white/5 border border-white/10 rounded-[2rem] flex items-center gap-4 hover:border-orange-500/30 transition-all group">
            <div className="w-10 h-10 rounded-xl bg-black border border-white/10 flex items-center justify-center text-orange-500 group-hover:border-orange-500/50 transition-all">
              <Shield size={18} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                Plan ID
              </p>
              <p className="text-sm font-mono font-bold text-gray-300">
                #{userId.toString().padStart(6, "0")}
              </p>
            </div>
          </div>
        )}
      </div>

      {subscription ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Card */}
          <div className="lg:col-span-8 space-y-10">
            <div className="relative group overflow-hidden rounded-[3rem]">
              <div className="absolute inset-0 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem]"></div>

              <div className="relative p-12">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-5 pointer-events-none group-hover:opacity-[0.07] transition-all duration-1000">
                  <CreditCard
                    size={500}
                    strokeWidth={0.5}
                    className="text-white"
                  />
                </div>

                <div className="relative z-10 space-y-12">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-3">
                        Active Plan
                      </p>
                      <h2 className="text-6xl font-light text-white tracking-tighter italic font-serif group-hover:text-orange-500 transition-colors duration-500">
                        {subscription.plan_name}
                      </h2>
                    </div>
                    <div
                      className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 ${subscription.is_active ? "bg-orange-500/10 text-orange-500 border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.1)]" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}
                    >
                      {subscription.is_active ? (
                        <CheckCircle2 size={12} strokeWidth={2.5} />
                      ) : (
                        <XCircle size={12} strokeWidth={2.5} />
                      )}
                      {subscription.is_active ? "Synchronized" : "Desynced"}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-12">
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                        <Calendar size={12} className="text-orange-500" /> Start
                        Date
                      </p>
                      <p className="text-2xl font-light text-white">
                        {formatDate(subscription.start_date)}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                        <Clock size={12} className="text-orange-500" /> End Date
                      </p>
                      <p className="text-2xl font-light text-white">
                        {formatDate(subscription.end_date)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-5 pt-4">
                    <div className="flex justify-between items-end px-1">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          Plan Lifecycle
                        </span>
                        <span className="text-[10px] text-orange-500 font-bold px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 uppercase">
                          {calculateDaysRemaining(subscription.end_date)} Cycles
                          Left
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-widest italic">
                        {Math.max(
                          0,
                          Math.round(
                            100 -
                              calculateProgress(
                                subscription.start_date,
                                subscription.end_date,
                              ),
                          ),
                        )}
                        % Precision
                      </span>
                    </div>
                    <div className="h-3 bg-black rounded-full overflow-hidden border border-white/10 p-0.5">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all duration-1000 shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                        style={{
                          width: `${Math.max(0, 100 - calculateProgress(subscription.start_date, subscription.end_date))}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12">
              <h3 className="text-2xl font-light text-white mb-10 flex items-center gap-4">
                <Star
                  className="text-orange-500"
                  fill="currentColor"
                  size={24}
                />
                Access <span className="italic font-serif">Privileges</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  "Full Facility Access",
                  "Wearable Tracking",
                  "AI Motion Analysis",
                  "Dynamic Recovery Suite",
                  "Priority Lab Access",
                  "Secure Cloud Storage",
                ].map((benefit, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-5 bg-black/40 rounded-2xl border border-white/5 hover:border-orange-500/20 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <CheckCircle2 size={14} strokeWidth={2.5} />
                    </div>
                    <span className="text-gray-400 font-light text-sm uppercase tracking-widest">
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-orange-500 rounded-[3rem] p-10 text-white shadow-2xl shadow-orange-500/30 relative overflow-hidden group">
              <div className="relative z-10 space-y-8">
                <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
                  <Zap size={24} fill="currentColor" />
                </div>
                <div>
                  <h4 className="text-3xl font-light tracking-tight mb-2 leading-none">
                    Elevate <br />
                    <span className="italic font-serif font-bold">Tier</span>
                  </h4>
                  <p className="text-white/70 text-sm leading-relaxed font-light">
                    Start the Premium plan for unrestricted AI coaching and
                    advanced personal analytics.
                  </p>
                </div>
                <button className="w-full py-5 bg-white text-black rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:bg-black hover:text-white shadow-xl flex items-center justify-center gap-3 group/btn">
                  Upgrade Now{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  />
                </button>
              </div>
              <Zap
                size={200}
                strokeWidth={0.5}
                className="absolute -bottom-10 -right-10 text-white/5 rotate-12 group-hover:scale-125 transition-transform duration-1000"
              />
            </div>

            <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem]">
              <h5 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-6">
                Support Terminal
              </h5>
              <div className="space-y-4">
                <button className="w-full py-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-orange-500 transition-colors flex items-center justify-between group">
                  Billing Issues{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
                <div className="h-px bg-white/5 w-full"></div>
                <button className="w-full py-4 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-orange-500 transition-colors flex items-center justify-between group">
                  Termination Sync{" "}
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-20 text-center space-y-10 max-w-3xl mx-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-orange-500/5 blur-3xl pointer-events-none"></div>
          <div className="w-24 h-24 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center text-orange-500 mx-auto relative z-10 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
            <AlertCircle size={48} strokeWidth={1.5} />
          </div>
          <div className="space-y-6 relative z-10">
            <h3 className="text-4xl font-light text-white leading-none">
              Plan{" "}
              <span className="italic font-serif text-orange-500">Offline</span>
            </h3>
            <p className="text-gray-500 text-lg font-light leading-relaxed max-w-lg mx-auto">
              Your personal profile is currently detached from our training
              infrastructure. Select a plan to begin synchronization.
            </p>
          </div>
          <button className="px-12 py-6 bg-orange-500 hover:bg-white hover:text-black text-white rounded-full font-bold text-xs uppercase tracking-[0.2em] transition-all shadow-2xl shadow-orange-500/30 flex items-center justify-center gap-4 mx-auto relative z-10 group">
            Start Access{" "}
            <ArrowRight
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
