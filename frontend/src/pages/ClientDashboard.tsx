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
  Dumbbell,
  Target as TargetIcon,
  Apple,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../services/api";

interface Subscription {
  id: number;
  plan: number;
  plan_name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  is_expired: boolean;
}

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchMySubscription();
    fetchMyProgram();
  }, []);

  const fetchMyProgram = async () => {
    try {
      const response = await api.getMyProgram(user.id);
      setProgram(response.data);
    } catch (err) {
      setProgram(null);
    }
  };

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

  const calculateDaysRemaining = (endDate: string) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-7xl mx-auto pb-20">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-[3rem] bg-zinc-900 border border-white/5 p-12 text-white shadow-2xl overflow-hidden group">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] -mr-20 -mt-20 group-hover:bg-orange-500/15 transition-all duration-700"></div>

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
            <Zap size={12} fill="currentColor" /> Online
          </div>
          <h1 className="text-5xl md:text-6xl font-light mb-6 tracking-tight leading-none">
            The era of <br />
            <span className="italic font-serif text-orange-500">
              Precision
            </span>{" "}
            Performance
          </h1>
          <p className="text-gray-400 text-lg font-light leading-relaxed max-w-lg">
            Your profile is active. Monitor your progress and access your
            fitness plans.
          </p>
        </div>

        <div className="absolute right-12 bottom-12 opacity-5 scale-125 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
          <Dumbbell size={280} strokeWidth={1} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Status Column */}
        <div className="lg:col-span-8 space-y-10">
          {loading ? (
            <div className="h-80 bg-white/5 border border-white/10 rounded-[3rem] flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          ) : subscription ? (
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-10 right-10">
                <div
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${subscription.is_active ? "bg-orange-500/10 text-orange-500 border border-orange-500/30" : "bg-red-500/10 text-red-400 border border-red-500/30"}`}
                >
                  {subscription.is_active ? (
                    <CheckCircle2 size={12} strokeWidth={2.5} />
                  ) : (
                    <XCircle size={12} strokeWidth={2.5} />
                  )}
                  {subscription.is_active ? "Active Status" : "Inactive"}
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mb-3">
                    Membership Plan
                  </p>
                  <h2 className="text-5xl font-light text-white tracking-tighter italic font-serif">
                    {subscription.plan_name}{" "}
                    <span className="text-orange-500 font-sans font-black not-italic text-4xl ml-2">
                      Member
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-5 p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-orange-500/20 transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-orange-500 border border-white/10 group-hover:border-orange-500/40 transition-all">
                      <Calendar size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                        Start Date
                      </p>
                      <p className="text-xl font-light text-white">
                        {formatDate(subscription.start_date)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 p-8 bg-white/5 rounded-[2rem] border border-white/5 hover:border-orange-500/20 transition-all group">
                    <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-orange-500 border border-white/10 group-hover:border-orange-500/40 transition-all">
                      <Clock size={24} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">
                        End Date
                      </p>
                      <p className="text-xl font-light text-white">
                        {formatDate(subscription.end_date)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress Visualizer */}
                <div className="space-y-4 pt-4">
                  <div className="flex justify-between items-end px-1">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      Time Progress
                    </p>
                    <p className="text-sm font-bold text-orange-500 uppercase italic tracking-tighter">
                      {calculateDaysRemaining(subscription.end_date)} Cycles
                      Remaining
                    </p>
                  </div>
                  <div className="h-3 bg-black rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-orange-500 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(249,115,22,0.5)]"
                      style={{
                        width: `${Math.min(100, (calculateDaysRemaining(subscription.end_date) / 30) * 100)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-16 text-center space-y-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-orange-500/5 blur-3xl pointer-events-none"></div>
              <div className="w-24 h-24 bg-orange-500/10 border border-orange-500/20 rounded-full flex items-center justify-center text-orange-500 mx-auto relative z-10">
                <AlertCircle size={48} strokeWidth={1.5} />
              </div>
              <div className="max-w-sm mx-auto relative z-10">
                <h3 className="text-3xl font-light text-white mb-3">
                  No Plan Found
                </h3>
                <p className="text-gray-500 text-sm font-light mb-8 leading-relaxed">
                  You need an active subscription to start your performance
                  tracking.
                </p>
                <button
                  onClick={() => navigate("/subscription")}
                  className="w-full py-5 bg-orange-500 hover:bg-white hover:text-black text-white rounded-full font-bold text-xs uppercase tracking-widest transition-all shadow-2xl shadow-orange-500/30 flex items-center justify-center gap-3"
                >
                  Acquire Membership <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Activity Placeholder or Secondary Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:border-orange-500/30 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-black border border-white/10 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                  <Zap size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                  System
                </span>
              </div>
              <h4 className="text-xl font-light mb-2">Sync Devices</h4>
              <p className="text-gray-500 text-sm font-light">
                Connect your fitness devices for tracking.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:border-orange-500/30 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 bg-black border border-white/10 rounded-xl flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                  <TargetIcon size={20} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
                  Goals
                </span>
              </div>
              <h4 className="text-xl font-light mb-2">Set Objectives</h4>
              <p className="text-gray-500 text-sm font-light">
                Define your next performance milestone.
              </p>
            </div>
          </div>
        </div>

        {/* Intelligence Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* AI Status Card */}
          <div className="bg-orange-500 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-orange-500/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
            <div className="relative z-10">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] mb-4 opacity-80">
                AI Integration Status
              </h4>
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-sm font-light">Network</span>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white text-orange-500 px-2 py-0.5 rounded">
                    Active
                  </span>
                </div>
                <div className="flex justify-between items-center pb-4 border-b border-white/10">
                  <span className="text-sm font-light">Motion Sync</span>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 text-white px-2 py-0.5 rounded">
                    Standby
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-light">Efficiency</span>
                  <span className="text-lg font-bold">94.8%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Access Portal */}
          <div
            onClick={() =>
              navigate(program ? "/workout-plan" : "/generate-plan")
            }
            className="bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 cursor-pointer hover:border-orange-500/50 transition-all group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/[0.03] transition-colors duration-500"></div>
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-orange-500 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all">
                  <Dumbbell size={24} strokeWidth={1.5} />
                </div>
                {program && (
                  <div className="text-[10px] font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></span>{" "}
                    Generated
                  </div>
                )}
              </div>
              <h4 className="text-2xl font-light mb-2">
                {program ? "Your Training" : "Generate"}{" "}
                <span className="italic font-serif text-orange-500">Plan</span>
              </h4>
              <p className="text-gray-500 text-sm font-light leading-relaxed mb-8">
                {program
                  ? `Current focus: ${program.sport_program[0]?.target_muscles}`
                  : "Start your custom AI-driven training architecture."}
              </p>
              <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-white group-hover:text-orange-500 transition-colors">
                {program ? "View Program" : "Create Program"}{" "}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </div>
            </div>
          </div>

          {/* Nutrition Sync */}
          <div
            onClick={() => navigate("/food-calorie")}
            className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 cursor-pointer hover:border-orange-500/50 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-black border border-white/10 rounded-xl flex items-center justify-center text-orange-500">
                <Apple size={20} strokeWidth={1.5} />
              </div>
              <div>
                <h5 className="text-sm font-bold uppercase tracking-widest">
                  Vision Nutrition
                </h5>
                <p className="text-gray-500 text-[10px] uppercase font-medium tracking-tighter">
                  Nutrition Tracking
                </p>
              </div>
              <ArrowRight
                size={16}
                className="ml-auto text-gray-700 group-hover:text-orange-500 group-hover:translate-x-1 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
