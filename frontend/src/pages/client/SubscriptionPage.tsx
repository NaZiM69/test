import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, Zap, ArrowRight, Shield, Star } from 'lucide-react';

import { api } from '../../services/api';

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
  const [error, setError] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Step 1: Get user ID from JWT token as requested
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.user_id);
        console.log('User ID from token:', payload.user_id);
      } catch (e) {
        console.error('Failed to decode token', e);
      }
    }

    fetchMySubscription();
  }, []);

  const fetchMySubscription = async () => {
    setLoading(true);
    try {
      // Step 2: Send request to subscription service
      // We use the specialized endpoint that identifies the user from the token server-side
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
        <div className="w-16 h-16 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-medium animate-pulse">Retrieving your subscription details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
            Membership Details
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">My Subscription</h1>
          <p className="text-gray-400 text-lg">Manage your access and view billing cycles.</p>
        </div>
        
        {userId && (
          <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
               <Shield size={16} />
             </div>
             <div>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Client ID</p>
               <p className="text-sm font-mono font-bold text-gray-300">#{userId.toString().padStart(6, '0')}</p>
             </div>
          </div>
        )}
      </div>

      {subscription ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 opacity-5 pointer-events-none">
                  <CreditCard size={400} className="text-white" />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between gap-12">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-gray-500 text-sm font-bold uppercase tracking-[0.2em] mb-3">Current Membership</p>
                      <h2 className="text-6xl font-black text-white tracking-tighter">{subscription.plan_name}</h2>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 ${subscription.is_active ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                      {subscription.is_active ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                      {subscription.is_active ? 'Active' : 'Expired'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Calendar size={12} className="text-blue-500" /> Member Since
                      </p>
                      <p className="text-xl font-bold text-white">{formatDate(subscription.start_date)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <Clock size={12} className="text-orange-500" /> Renewal Date
                      </p>
                      <p className="text-xl font-bold text-white">{formatDate(subscription.end_date)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex items-center gap-2">
                         <span className="text-sm font-bold text-gray-400">Time remaining</span>
                         <span className="text-xs text-blue-500 font-black px-2 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/10">
                           {calculateDaysRemaining(subscription.end_date)} Days
                         </span>
                      </div>
                      <span className="text-sm font-bold text-gray-500">
                        {Math.max(0, Math.round(100 - calculateProgress(subscription.start_date, subscription.end_date)))}% left
                      </span>
                    </div>
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5 p-0.5">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.max(0, 100 - calculateProgress(subscription.start_date, subscription.end_date))}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-10">
              <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Star className="text-yellow-500" fill="currentColor" size={24} />
                Included Benefits
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Full Access to Gym Floor',
                  'Premium Locker Facilities',
                  '2 Guest Passes per Month',
                  'Monthly Progress Report',
                  'Discounted Personal Training',
                  'Free Sauna & Spa Access'
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 flex-shrink-0">
                      <CheckCircle2 size={14} />
                    </div>
                    <span className="text-gray-300 font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] p-8 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden">
               <div className="relative z-10 space-y-6">
                 <h4 className="text-xl font-black">Upgrade Your Experience</h4>
                 <p className="text-blue-100/80 text-sm leading-relaxed">
                   Switch to an Elite membership today and get unlimited personal training sessions and nutrition coaching.
                 </p>
                 <button className="w-full py-4 bg-white text-blue-600 rounded-2xl font-black transition-all hover:scale-[1.02] shadow-lg shadow-black/20 flex items-center justify-center gap-2">
                    Explore Plans <Zap size={18} fill="currentColor" />
                 </button>
               </div>
               <Zap size={150} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
            </div>
          </div>
        </div>

      ) : (
        <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-16 text-center space-y-8 max-w-2xl mx-auto">
          <div className="w-24 h-24 bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500 mx-auto">
            <AlertCircle size={48} />
          </div>
          <div className="space-y-4">
            <h3 className="text-3xl font-black text-white">No Active Subscription</h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              It looks like you don't have an active membership at the moment. Join the IRONCORE community to start your transformation.
            </p>
          </div>
          <button className="px-10 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-lg transition-all shadow-xl shadow-blue-500/20 flex items-center justify-center gap-3 mx-auto">
            View Membership Plans <ArrowRight size={22} />
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
