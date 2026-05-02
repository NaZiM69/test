import React, { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, CreditCard, Clock, Tag, X } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "../../services/api";
import type { SubscriptionPlan } from "../../types";

const PlansPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration_days: 30,
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.getPlans();
      setPlans(res.data);
    } catch (error) {
      console.error("Error fetching plans:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;
    try {
      await api.deletePlan(id);
      fetchPlans();
    } catch (error) {
      console.error("Error deleting plan:", error);
      alert("Failed to delete plan.");
    }
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setEditFormData({
      name: plan.name,
      description: plan.description || "",
      price: plan.price.toString(),
      duration_days: plan.duration_days,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlan) return;
    try {
      await api.updatePlan(editingPlan.id, {
        ...editFormData,
        price: parseFloat(editFormData.price),
      });
      setIsEditModalOpen(false);
      fetchPlans();
    } catch (error) {
      console.error("Error updating plan:", error);
      alert("Failed to update plan.");
    }
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            Financial Plans
          </div>
          <h1 className="text-5xl md:text-6xl font-light text-white tracking-tight leading-none uppercase">
            <span className="italic font-serif text-orange-500">Plans</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-xl">
            Configure membership access plans and temporal duration tiers.
          </p>
        </div>
        <Link
          to="/admin/plans/add"
          className="flex items-center gap-3 px-8 py-4 bg-orange-500 hover:bg-white hover:text-black text-white rounded-full font-bold text-[10px] uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl shadow-orange-500/20 group"
        >
          <Plus
            size={18}
            strokeWidth={1.5}
            className="group-hover:scale-110 transition-transform"
          />
          Add Plan Tier
        </Link>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-32 text-center text-gray-600 italic font-serif text-xl animate-pulse">
            Syncing tier configurations...
          </div>
        ) : (
          plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 hover:border-orange-500/30 transition-all duration-500 group relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)]"
            >
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <div className="flex gap-3">
                  <button
                    onClick={() => openEditModal(plan)}
                    className="w-10 h-10 bg-white/5 border border-white/10 rounded-xl text-gray-600 hover:text-white hover:bg-orange-500 transition-all duration-500 flex items-center justify-center"
                  >
                    <Edit2 size={14} strokeWidth={2} />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="w-10 h-10 bg-red-500/0 border border-red-500/0 rounded-xl text-gray-800 hover:text-red-500 hover:bg-red-500/10 transition-all duration-500 flex items-center justify-center"
                  >
                    <Trash2 size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 mb-10">
                <div className="w-16 h-16 bg-black border border-white/10 rounded-2xl flex items-center justify-center text-orange-500 shadow-xl group-hover:scale-110 transition-transform duration-500">
                  <Tag size={28} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-light text-white tracking-tight leading-none uppercase">
                    {plan.name}
                  </h3>
                  <span className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mt-2 block">
                    Plan CID: #{plan.id}
                  </span>
                </div>
              </div>

              <div className="space-y-6 mb-12">
                <div className="flex items-center gap-4 text-gray-500 text-sm font-light">
                  <div className="p-2 bg-black border border-white/5 rounded-lg">
                    <Clock size={14} className="text-orange-500/50" />
                  </div>
                  <span>
                    Temporal Span:{" "}
                    <span className="text-white font-medium">
                      {plan.duration_days} Days
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-4 text-gray-500 text-sm font-light">
                  <div className="p-2 bg-black border border-white/5 rounded-lg">
                    <CreditCard size={14} className="text-orange-500/50" />
                  </div>
                  <span>
                    Connection Cost:{" "}
                    <span className="text-white font-medium">
                      {plan.price} DA
                    </span>
                  </span>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex items-baseline gap-2">
                <span className="text-5xl font-light text-white italic font-serif leading-none">
                  {plan.price}
                </span>
                <span className="text-gray-600 font-bold text-[10px] uppercase tracking-widest">
                  DA / Plan
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Authority Logic (Edit Modal) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl animate-fade-in">
          <div className="bg-black border border-white/10 w-full max-w-xl rounded-[4rem] overflow-hidden shadow-[0_0_100px_rgba(249,115,22,0.1)] relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

            <div className="p-12 border-b border-white/5 flex items-center justify-between relative z-10 bg-orange-500/[0.02]">
              <div>
                <h2 className="text-4xl font-light text-white leading-none uppercase">
                  Modify{" "}
                  <span className="italic font-serif text-orange-500">
                    Plan
                  </span>
                </h2>
                <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">
                  Adjust tier parameters and connection costs
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-gray-700 hover:text-white transition-all duration-500 hover:rotate-90 border border-white/10"
              >
                <X size={24} strokeWidth={1.5} />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="p-12 space-y-10 relative z-10"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.4em] mb-4">
                    Tier Identity
                  </label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-800 font-bold uppercase tracking-widest"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.4em] mb-4">
                    Functional Description
                  </label>
                  <textarea
                    value={editFormData.description}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        description: e.target.value,
                      })
                    }
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all resize-none font-light leading-relaxed"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.4em] mb-4">
                      Connection (DA)
                    </label>
                    <input
                      type="number"
                      required
                      value={editFormData.price}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          price: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all font-bold uppercase tracking-widest"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.4em] mb-4">
                      Temporal Cycle
                    </label>
                    <div className="relative">
                      <select
                        value={editFormData.duration_days}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            duration_days: parseInt(e.target.value),
                          })
                        }
                        className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all appearance-none font-bold uppercase tracking-widest cursor-pointer"
                      >
                        <option value={30}>01 Month (30d)</option>
                        <option value={90}>03 Months (90d)</option>
                        <option value={180}>06 Months (180d)</option>
                        <option value={365}>01 Year (365d)</option>
                      </select>
                      <Clock
                        size={14}
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-700 pointer-events-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-6 pt-6">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-6 rounded-full bg-white/5 font-bold text-[10px] uppercase tracking-[0.3em] text-gray-600 hover:text-white hover:bg-white/10 transition-all duration-500 border border-white/10"
                >
                  Abort Changes
                </button>
                <button
                  type="submit"
                  className="flex-[2] py-6 rounded-full bg-orange-500 font-bold text-[10px] uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all duration-500 shadow-2xl shadow-orange-500/30"
                >
                  Execute Plan Update
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
