import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Zap, ArrowRight, Dumbbell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';

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
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

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
        setError('Failed to load subscription data.');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-indigo-700 p-10 text-white shadow-2xl shadow-blue-500/20">
        <div className="relative z-10">
          <h1 className="text-4xl font-black mb-3 tracking-tight">Your Fitness Journey</h1>
          <p className="text-blue-100 max-w-xl text-lg leading-relaxed opacity-90">
            Keep track of your membership status, training sessions, and upcoming gym events all in one place.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10 translate-x-10 translate-y-10 scale-150">
          <Dumbbell size={300} />
        </div>
      </div>

      {/* Subscription Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {loading ? (
            <div className="h-64 bg-[#0a0a0a] border border-white/5 rounded-3xl flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          ) : subscription ? (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8">
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${subscription.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {subscription.is_active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                  {subscription.is_active ? 'Active Membership' : 'Inactive'}
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] mb-2">Current Plan</p>
                  <h2 className="text-5xl font-black text-white">{subscription.plan_name}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Started On</p>
                      <p className="text-lg font-bold text-white">{formatDate(subscription.start_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-6 bg-white/5 rounded-3xl border border-white/5">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                      <Clock size={24} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase">Expires On</p>
                      <p className="text-lg font-bold text-white">{formatDate(subscription.end_date)}</p>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <p className="text-sm font-bold text-gray-400">Membership Progress</p>
                    <p className="text-sm font-black text-blue-500">{calculateDaysRemaining(subscription.end_date)} Days Remaining</p>
                  </div>
                  <div className="h-4 bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full transition-all duration-1000"
                      style={{ width: `${Math.min(100, (calculateDaysRemaining(subscription.end_date) / 30) * 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 mx-auto">
                <AlertCircle size={40} />
              </div>
              <div className="max-w-xs mx-auto">
                <h3 className="text-2xl font-bold text-white mb-2">No Active Plan</h3>
                <p className="text-gray-500 text-sm mb-6">You don't have an active subscription yet. Select a plan to start your training.</p>
                <button className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2">
                  View Plans <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/5 rounded-3xl p-6">
            <h4 className="text-sm font-bold uppercase tracking-widest text-purple-400 mb-4">Training Stats</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Total Sessions</span>
                <span className="text-white font-bold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Attendance Rate</span>
                <span className="text-white font-bold text-green-500">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-sm">Goal Progress</span>
                <span className="text-white font-bold">75%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 flex items-center gap-4 group cursor-pointer hover:border-blue-500/30 transition-all">
            <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
              <Zap size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Upgrade Plan</p>
              <p className="text-xs text-gray-500">Get unlimited access</p>
            </div>
            <ArrowRight size={16} className="ml-auto text-gray-600 group-hover:text-white transition-colors" />
          </div>

          {/* AI Workout Plan Widget */}
          <div 
            onClick={() => navigate(program ? '/workout-plan' : '/generate-plan')}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white cursor-pointer hover:scale-[1.02] transition-all shadow-xl shadow-blue-900/20 group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-white/20 rounded-lg">
                <Dumbbell size={20} />
              </div>
              {program && <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded">AI Generated</span>}
            </div>
            <h4 className="text-lg font-black mb-1">{program ? 'Your Workout Plan' : 'Generate AI Plan'}</h4>
            <p className="text-blue-100 text-xs mb-4 opacity-80">
              {program ? `Focusing on: ${program.sport_program[0]?.target_muscles}` : 'Get a custom training routine powered by AI.'}
            </p>
            <div className="flex items-center gap-2 text-sm font-bold">
              {program ? 'View Details' : 'Start Now'} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
