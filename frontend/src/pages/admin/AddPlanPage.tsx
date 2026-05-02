import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tag,
  ArrowLeft,
  Save,
  Sparkles,
  Shield,
  Clock,
  CreditCard,
} from "lucide-react";
import { api } from "../../services/api";

const AddPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration_days: 30,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPlan({
        ...formData,
        price: parseFloat(formData.price),
      });
      navigate("/admin/plans");
    } catch (error) {
      console.error("Error creating plan:", error);
      alert("Failed to create plan.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in pb-20">
      <button
        onClick={() => navigate("/admin/plans")}
        className="flex items-center gap-3 text-gray-600 hover:text-white transition-all mb-12 group uppercase text-[10px] font-bold tracking-[0.3em]"
      >
        <ArrowLeft
          size={16}
          className="group-hover:-translate-x-2 transition-transform"
        />
        Return to Plan Registry
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-12 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/[0.02] rounded-full blur-[100px] pointer-events-none"></div>

            <div className="mb-12">
              <h1 className="text-4xl font-light text-white leading-none uppercase">
                Forge New{" "}
                <span className="italic font-serif text-orange-500">Tier</span>
              </h1>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-4">
                Start a new membership access plan
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="space-y-8">
                <div>
                  <label className="block text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.4em] mb-4">
                    Plan Identity
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. NEURAL START (1M)"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all placeholder:text-gray-800 font-bold uppercase tracking-widest"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.4em] mb-4">
                    Features
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Full workout tracking, 24/7 support, free nutrition guide..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all resize-none font-light leading-relaxed placeholder:text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.4em] mb-4">
                      Price (DA)
                    </label>
                    <div className="relative">
                      <CreditCard
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700"
                        size={18}
                        strokeWidth={1.5}
                      />
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) =>
                          setFormData({ ...formData, price: e.target.value })
                        }
                        placeholder="3000"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all font-bold uppercase tracking-widest"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-orange-500/50 uppercase tracking-[0.4em] mb-4">
                      Temporal Range
                    </label>
                    <div className="relative">
                      <Clock
                        className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-700"
                        size={18}
                        strokeWidth={1.5}
                      />
                      <select
                        value={formData.duration_days}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            duration_days: parseInt(e.target.value),
                          })
                        }
                        className="w-full bg-black border border-white/10 rounded-2xl pl-16 pr-6 py-4 text-sm text-white focus:outline-none focus:border-orange-500/50 transition-all appearance-none font-bold uppercase tracking-widest cursor-pointer"
                      >
                        <option value={30}>01 Month (30d)</option>
                        <option value={90}>03 Months (90d)</option>
                        <option value={180}>06 Months (180d)</option>
                        <option value={365}>01 Year (365d)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-6 rounded-full bg-orange-500 font-bold text-[10px] uppercase tracking-[0.3em] text-white hover:bg-white hover:text-black transition-all duration-500 shadow-2xl shadow-orange-500/30 flex items-center justify-center gap-4 group"
              >
                <Save
                  size={20}
                  strokeWidth={1.5}
                  className="group-hover:scale-110 transition-transform"
                />
                Commit Plan Configuration
              </button>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-8">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 relative overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-orange-500/[0.02] pointer-events-none"></div>

            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-orange-500/50 mb-10 flex items-center gap-3">
              <Sparkles size={16} strokeWidth={1.5} />
              Live Synchronization
            </h3>

            <div className="bg-black border border-white/10 rounded-[2rem] p-8 shadow-2xl transform transition-all duration-700 group-hover:scale-[1.02]">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-orange-500">
                  <Tag size={24} strokeWidth={1.5} />
                </div>
                <div>
                  <h4 className="text-xl font-light text-white tracking-tight leading-none uppercase">
                    {formData.name || "Plan Tag"}
                  </h4>
                  <p className="text-[9px] text-gray-700 uppercase font-black tracking-widest mt-2">
                    DOKU ELITE PREVIEW
                  </p>
                </div>
              </div>

              <p className="text-sm text-gray-500 font-light leading-relaxed mb-8 line-clamp-4 min-h-[5rem]">
                {formData.description ||
                  "Enter details to see plan description..."}
              </p>

              <div className="flex items-baseline gap-2 pt-8 border-t border-white/5">
                <span className="text-4xl font-light text-white italic font-serif leading-none">
                  {formData.price || "0000"}
                </span>
                <span className="text-gray-700 text-[10px] font-bold uppercase tracking-widest">
                  DA / Cycle
                </span>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              <div className="flex items-center gap-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                <Shield size={14} className="text-orange-500/40" />
                Personal Verification Active
              </div>
              <div className="flex items-center gap-4 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                <Clock size={14} className="text-orange-600/40" />
                Instant Activation
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] text-white mb-4 italic font-serif">
              Operator Guidance
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed font-light">
              Detailed plan descriptions enhance member conversion rates. Ensure
              benefits are clearly enumerated for optimal network growth.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlanPage;
