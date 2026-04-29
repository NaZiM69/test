import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Search, Filter, Download, MoreVertical, CreditCard, Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react';
import type { UserSubscription } from '../../types';

const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const res = await api.getSubscriptions();
      setSubscriptions(res.data);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Subscriptions</h1>
          <p className="text-gray-400 text-sm mt-1">Monitor and manage all member subscription statuses.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Active Now', value: subscriptions.filter(s => s.is_active && !s.is_expired).length, color: 'text-green-500', icon: <CheckCircle2 size={20} /> },
          { label: 'Recently Expired', value: subscriptions.filter(s => s.is_expired).length, color: 'text-red-500', icon: <XCircle size={20} /> },
          { label: 'Total Revenue (Est)', value: '142,000 DA', color: 'text-blue-500', icon: <CreditCard size={20} /> },
        ].map((stat, i) => (
          <div key={i} className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</p>
            </div>
            <div className={`p-4 rounded-xl bg-white/5 ${stat.color}`}>{stat.icon}</div>
          </div>
        ))}
      </div>

      {/* Subscriptions Table */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                <input 
                  type="text" 
                  placeholder="Filter subscriptions..." 
                  className="bg-white/5 border border-white/10 rounded-lg py-2 pl-9 pr-4 text-sm focus:outline-none focus:border-blue-500/50"
                />
             </div>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white transition-all">
              <Filter size={16} />
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-400 hover:text-white transition-all">
              <Download size={16} />
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-xs font-semibold uppercase tracking-wider">
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Plan</th>
                <th className="px-6 py-4">Start Date</th>
                <th className="px-6 py-4">End Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Loading subscriptions...</td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">No subscriptions found.</td>
                </tr>
              ) : subscriptions.map((sub) => (
                <tr key={sub.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs text-blue-400">#USR-{sub.user_id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className="text-purple-500" />
                      <span className="text-sm font-medium">{sub.plan_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Calendar size={14} />
                      {formatDate(sub.start_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock size={14} />
                      {formatDate(sub.end_date)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {sub.is_expired ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full w-fit">
                        <XCircle size={14} />
                        Expired
                      </span>
                    ) : sub.is_active ? (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-green-400 bg-green-400/10 px-2.5 py-1 rounded-full w-fit">
                        <CheckCircle2 size={14} />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-medium text-orange-400 bg-orange-400/10 px-2.5 py-1 rounded-full w-fit">
                        <Clock size={14} />
                        Suspended
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-500 hover:text-white transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
