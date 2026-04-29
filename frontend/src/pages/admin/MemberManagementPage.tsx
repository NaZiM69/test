import React, { useState, useEffect } from 'react';
import { 
  Plus, Trash2, Edit2, Filter, Download, UserPlus, Search, Users,
  CheckCircle2, XCircle, Phone, Calendar, Mail, Shield, 
  AlertTriangle, CreditCard, Clock, MoreVertical
} from 'lucide-react';
import { api } from '../../services/api';
import type { User, SubscriptionPlan } from '../../types';

interface ExtendedUser extends User {
  subscription_id?: number;
  plan_id?: string | number;
  plan_name?: string;
  subscription_date?: string;
  end_date?: string;
  is_active?: boolean;
  is_expired?: boolean;
}

const MemberManagementPage: React.FC = () => {
  const [users, setUsers] = useState<ExtendedUser[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const initialFormState = {
    username: '',
    email: '',
    password: 'password123',
    first_name: '',
    last_name: '',
    phone: '',
    role: 'CLIENT' as 'CLIENT' | 'ADMIN',
    plan_id: '',
    start_date: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, plansRes, subsRes] = await Promise.all([
        api.getUsers(),
        api.getPlans(),
        api.getSubscriptions()
      ]);

      // Merge user data with subscription data for the unified view
      const mergedUsers = usersRes.data
        .filter((user: User) => user.role === 'CLIENT')
        .map((user: User) => {
          const sub = subsRes.data.find((s: any) => s.user_id === user.id);
          return {
            ...user,
            subscription_id: sub ? sub.id : null,
            plan_id: sub ? sub.plan : '',
            plan_name: sub ? sub.plan_name : 'No Plan',
            subscription_date: sub ? sub.start_date : null,
            end_date: sub ? sub.end_date : null,
            is_active: sub ? sub.is_active : false,
            is_expired: sub ? sub.is_expired : false
          };
        });

      setUsers(mergedUsers);
      setPlans(plansRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userRes = await api.createUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        role: formData.role
      });

      const newUserId = userRes.data.id;
      if (formData.plan_id && newUserId) {
        await api.createSubscription({
          user: newUserId,
          plan: parseInt(formData.plan_id),
          start_date: formData.start_date
        });
      }

      setIsModalOpen(false);
      setFormData(initialFormState);
      fetchData();
    } catch (error: any) {
      console.error('Error creating client:', error);
      const errorMsg = error.response?.data?.detail || error.response?.data?.error || JSON.stringify(error.response?.data) || error.message;
      alert(`Failed to create client: ${errorMsg}`);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete) return;
    try {
      await api.deleteUser(userToDelete.id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user.');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      // Update User Info
      await api.updateUser(editingUser.id, {
        username: formData.username,
        email: formData.email,
        first_name: formData.first_name,
        last_name: formData.last_name,
        phone: formData.phone,
        role: formData.role
      });

      // Update Subscription if plan or date changed
      const originalUser = users.find(u => u.id === editingUser.id);
      const hasPlanChanged = formData.plan_id.toString() !== (originalUser?.plan_id || '').toString();
      const hasDateChanged = formData.start_date !== (originalUser?.subscription_date ? originalUser.subscription_date.split('T')[0] : '');
      
      if (hasPlanChanged || hasDateChanged) {
        if (formData.plan_id) {
          // Create new subscription (backend handles deactivating old ones)
          await api.createSubscription({
            user: editingUser.id,
            plan: parseInt(formData.plan_id),
            start_date: formData.start_date
          });
        } else if (originalUser?.subscription_id && originalUser.is_active) {
          // If changed to "No Plan", deactivate the current one
          await api.toggleSubscriptionStatus(originalUser.subscription_id);
        }
      }



      setIsEditModalOpen(false);
      setFormData(initialFormState);
      fetchData();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user.');
    }
  };

  const handleToggleStatus = async (subId?: number) => {
    if (!subId) return;
    try {
      await api.toggleSubscriptionStatus(subId);
      fetchData();
    } catch (error) {
      console.error('Error toggling status:', error);
      alert('Failed to toggle subscription status. Only active non-expired subscriptions can be toggled.');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.first_name + ' ' + u.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.plan_name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Member Management</h1>
          <p className="text-gray-400 text-sm mt-1">Unified view for clients and their subscription records.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search members, plans..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#0a0a0a] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 w-64 focus:outline-none focus:border-blue-500/50 transition-all text-sm"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <UserPlus size={18} />
            Add New Member
          </button>
        </div>
      </div>

      {/* Stats Quick View */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Members', value: users.length, color: 'text-blue-500', icon: <Users size={18} /> },
          { label: 'Active Subs', value: users.filter(u => u.is_active && !u.is_expired).length, color: 'text-green-500', icon: <CheckCircle2 size={18} /> },
          { label: 'Expired', value: users.filter(u => u.is_expired).length, color: 'text-red-500', icon: <XCircle size={18} /> },
          { label: 'Staff Count', value: users.filter(u => u.role === 'ADMIN').length, color: 'text-purple-500', icon: <Shield size={18} /> },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-2xl bg-[#0a0a0a] border border-white/5 flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{stat.label}</p>
              <p className="text-xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Unified Data Grid */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                <th className="px-6 py-5">Member Profile</th>
                <th className="px-6 py-5">Plan Detail</th>
                <th className="px-6 py-5">Validity Period</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Role</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="px-6 py-20 text-center text-gray-500 animate-pulse">Loading member directory...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-20 text-center text-gray-500">No members found.</td></tr>
              ) : filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  {/* Profile */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 text-blue-400 flex items-center justify-center font-bold text-base border border-blue-500/10">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {user.first_name || user.last_name ? `${user.first_name} ${user.last_name}` : user.username}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-0.5 font-mono">#{user.id} • {user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Plan */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <CreditCard size={14} className={user.plan_name === 'No Plan' ? 'text-gray-600' : 'text-purple-500'} />
                      <span className={`text-sm font-medium ${user.plan_name === 'No Plan' ? 'text-gray-600 italic' : 'text-gray-300'}`}>
                        {user.plan_name}
                      </span>
                    </div>
                  </td>

                  {/* Validity */}
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        <Calendar size={12} className="text-blue-500/40" />
                        Start: {formatDate(user.subscription_date)}
                      </div>
                      {user.end_date && (
                        <div className="flex items-center gap-2 text-[10px] text-gray-400">
                          <Clock size={12} className="text-orange-500/40" />
                          End: {formatDate(user.end_date)}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4">
                    {user.plan_name === 'No Plan' ? (
                      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter">No Access</span>
                    ) : user.is_expired ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-red-500/10 text-red-500 border border-red-500/20">
                        <XCircle size={10} /> Deactivated
                      </span>
                    ) : (
                      <button 
                        onClick={() => handleToggleStatus(user.subscription_id)}
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase transition-all active:scale-95 ${
                          user.is_active 
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20' 
                          : 'bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20'
                        }`}
                        title={user.is_active ? 'Click to deactivate' : 'Click to activate'}
                      >
                        {user.is_active ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                        {user.is_active ? 'Active' : 'Suspended'}
                      </button>
                    )}
                  </td>

                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                      user.role === 'ADMIN' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { 
                          setEditingUser(user); 
                          setFormData({
                            ...initialFormState,
                            username: user.username,
                            email: user.email,
                            first_name: user.first_name || '',
                            last_name: user.last_name || '',
                            phone: user.phone || '',
                            role: user.role,
                            plan_id: user.plan_id ? user.plan_id.toString() : '',
                            start_date: user.subscription_date ? user.subscription_date.split('T')[0] : new Date().toISOString().split('T')[0]
                          }); 
                          setIsEditModalOpen(true); 
                        }} 
                        className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white hover:bg-blue-600 transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => { setUserToDelete(user); setIsDeleteModalOpen(true); }} className="p-2 bg-red-500/5 rounded-lg text-red-500/50 hover:text-red-500 hover:bg-red-500 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Register/Edit Modal */}
      {(isModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#0a0a0a] border border-white/10 w-full max-w-2xl rounded-[2rem] overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-white/5 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{isEditModalOpen ? 'Edit Member Profile' : 'New Member Onboarding'}</h2>
                <p className="text-gray-500 text-sm mt-1">{isEditModalOpen ? 'Modify account and personal details' : 'Register a new account and optionally assign a subscription'}</p>
              </div>
              <button 
                onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); setFormData(initialFormState); }} 
                className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <Plus className="rotate-45" size={24} />
              </button>
            </div>
            
            <form onSubmit={isEditModalOpen ? handleUpdate : handleSubmit} className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-blue-500 uppercase tracking-widest">Account Details</label>
                  <input 
                    type="text" placeholder="Username" required value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-700"
                  />
                  <input 
                    type="email" placeholder="Email Address" required value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-700"
                  />
                  {!isEditModalOpen && (
                    <input 
                      type="password" placeholder="Password" required value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-700"
                    />
                  )}
                </div>

                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-purple-500 uppercase tracking-widest">Personal Info</label>
                  <div className="flex gap-4">
                    <input 
                      type="text" placeholder="First Name" value={formData.first_name}
                      onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-700"
                    />
                    <input 
                      type="text" placeholder="Last Name" value={formData.last_name}
                      onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-700"
                    />
                  </div>
                  <input 
                    type="text" placeholder="Phone (+213...)" value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-700"
                  />
                  <select 
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value as any})}
                    className="w-full bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500 appearance-none text-gray-400"
                    disabled
                  >
                    <option value="CLIENT">Member (Client)</option>
                  </select>
                </div>
              </div>

                <div className="pt-6 border-t border-white/5 space-y-4">
                  <label className="block text-[10px] font-black text-green-500 uppercase tracking-widest">
                    {isEditModalOpen ? 'Subscription Renewal / Change' : 'Subscription Setup'}
                  </label>
                  <div className="flex gap-4">
                    <select 
                      value={formData.plan_id}
                      onChange={(e) => setFormData({...formData, plan_id: e.target.value})}
                      className="w-1/2 bg-[#111] border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500 appearance-none text-gray-400"
                    >
                      <option value="">No Active Plan</option>
                      {plans.map(plan => (
                        <option key={plan.id} value={plan.id}>{plan.name} ({plan.price} DA)</option>
                      ))}
                    </select>
                    <input 
                      type="date" 
                      value={formData.start_date}
                      onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                      className="w-1/2 bg-white/5 border border-white/10 rounded-2xl px-5 py-3.5 text-sm focus:outline-none focus:border-blue-500 text-gray-400"
                    />
                  </div>
                </div>

              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => { setIsModalOpen(false); setIsEditModalOpen(false); setFormData(initialFormState); }}
                  className="flex-1 px-8 py-4 rounded-2xl bg-white/5 font-bold text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-8 py-4 rounded-2xl bg-blue-600 font-bold text-white hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20"
                >
                  {isEditModalOpen ? 'Save Changes' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {isDeleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
          <div className="bg-[#0a0a0a] border border-red-500/20 w-full max-w-md rounded-[2.5rem] p-10 text-center shadow-3xl">
            <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-8 animate-pulse">
              <AlertTriangle size={48} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Are you sure?</h2>
            <p className="text-gray-500 mb-10 text-sm leading-relaxed">
              Deleting <span className="text-white font-bold">{userToDelete.username}</span> will permanently erase their profile and all associated records.
            </p>
            <div className="flex gap-4">
              <button onClick={() => { setIsDeleteModalOpen(false); setUserToDelete(null); }} className="flex-1 py-4 rounded-2xl bg-white/5 font-bold text-gray-400 hover:bg-white/10">Abort</button>
              <button onClick={handleDelete} className="flex-1 py-4 rounded-2xl bg-red-600 font-bold text-white shadow-lg shadow-red-600/30">Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagementPage;
