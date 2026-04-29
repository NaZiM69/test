import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, CreditCard, Clock, Tag, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import type { SubscriptionPlan } from '../../types';

const PlansPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_days: 30
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.getPlans();
      setPlans(res.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;
    try {
      await api.deletePlan(id);
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
      alert('Failed to delete plan.');
    }
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setEditFormData({
      name: plan.name,
      description: plan.description || '',
      price: plan.price.toString(),
      duration_days: plan.duration_days
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      await api.updatePlan(editingPlan.id, {
        ...editFormData,
        price: parseFloat(editFormData.price)
      });
      setIsEditModalOpen(false);
      fetchPlans();
    } catch (error) {
      console.error('Error updating plan:', error);
      alert('Failed to update plan.');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscription Plans</h1>
          <p className="text-gray-400 text-sm mt-1">Define and manage your membership tiers.</p>
        </div>
        <Link 
          to="/admin/plans/add"
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all shadow-lg shadow-purple-500/20 active:scale-95"
        >
          <Plus size={18} />
          Add Plan Option
        </Link>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-gray-500">Loading plans...</div>
        ) : plans.map((plan) => (
          <div key={plan.id} className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 hover:border-purple-500/30 transition-all group relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditModal(plan)}
                  className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(plan.id)}
                  className="p-2 bg-red-500/10 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500">
                <Tag size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Plan ID: #{plan.id}</span>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Clock size={16} className="text-purple-500" />
                <span>Duration: {plan.duration_days} Days</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <CreditCard size={16} className="text-purple-500" />
                <span>Price: {plan.price} DA</span>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex items-baseline gap-1">
              <span className="text-4xl font-black">{plan.price}</span>
              <span className="text-gray-500 font-medium text-sm">DA</span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#0f0f0f] border border-white/10 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-purple-500/5">
              <h2 className="text-xl font-bold">Edit Subscription Plan</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-gray-500 hover:text-white">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdate} className="p-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Plan Name</label>
                  <input 
                    type="text" 
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea 
                    value={editFormData.description}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-all resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price (DA)</label>
                    <input 
                      type="number" 
                      required
                      value={editFormData.price}
                      onChange={(e) => setEditFormData({...editFormData, price: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Duration (Days)</label>
                    <select 
                      value={editFormData.duration_days}
                      onChange={(e) => setEditFormData({...editFormData, duration_days: parseInt(e.target.value)})}
                      className="w-full bg-[#151515] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-all appearance-none"
                    >
                      <option value={30}>1 Month (30 Days)</option>
                      <option value={90}>3 Months (90 Days)</option>
                      <option value={180}>6 Months (180 Days)</option>
                      <option value={365}>1 Year (365 Days)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 px-6 py-4 rounded-xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-6 py-4 rounded-xl bg-purple-600 font-bold hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlansPage;
