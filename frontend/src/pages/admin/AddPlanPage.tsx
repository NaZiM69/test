import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tag, ArrowLeft, Save, Sparkles, Shield, Clock, CreditCard } from 'lucide-react';
import { api } from '../../services/api';

const AddPlanPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration_days: 30
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPlan({
        ...formData,
        price: parseFloat(formData.price)
      });
      navigate('/admin/plans');
    } catch (error) {
      console.error('Error creating plan:', error);
      alert('Failed to create plan.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <button 
        onClick={() => navigate('/admin/plans')}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Back to Plans
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 shadow-2xl">
            <h1 className="text-3xl font-bold mb-2">Create Subscription Option</h1>
            <p className="text-gray-400 text-sm mb-8">Define a new pricing tier for your members.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Plan Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="e.g. 1 Month Starter"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description / Benefits</label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Full gym access, 2PT sessions, free water..."
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price (DA)</label>
                    <div className="relative">
                      <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input 
                        type="number" 
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="3000"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Duration</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <select 
                        value={formData.duration_days}
                        onChange={(e) => setFormData({...formData, duration_days: parseInt(e.target.value)})}
                        className="w-full bg-[#151515] border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all appearance-none"
                      >
                        <option value={30}>1 Month (30 Days)</option>
                        <option value={90}>3 Months (90 Days)</option>
                        <option value={180}>6 Months (180 Days)</option>
                        <option value={365}>1 Year (365 Days)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 rounded-2xl bg-purple-600 font-bold hover:bg-purple-500 transition-all shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
              >
                <Save size={20} />
                Save Subscription Option
              </button>
            </form>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
             <h3 className="text-sm font-bold uppercase tracking-wider text-purple-400 mb-4 flex items-center gap-2">
                <Sparkles size={16} />
                Live Preview
             </h3>
             
             <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center text-purple-500">
                    <Tag size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">{formData.name || 'Plan Name'}</h4>
                    <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Preview Mode</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mb-6 line-clamp-3 min-h-[3rem]">
                  {formData.description || 'Provide a description to see it here...'}
                </p>

                <div className="flex items-baseline gap-1 pt-4 border-t border-white/5">
                  <span className="text-3xl font-black">{formData.price || '0'}</span>
                  <span className="text-gray-500 text-xs font-bold uppercase">DA</span>
                </div>
             </div>

             <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <Shield size={14} className="text-green-500" />
                  Secure Transaction
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <Clock size={14} className="text-blue-500" />
                  Instant Activation
                </div>
             </div>
          </div>

          <div className="bg-white/5 border border-white/5 rounded-3xl p-6">
             <h4 className="font-bold text-sm mb-2">Pro Tip</h4>
             <p className="text-xs text-gray-500 leading-relaxed">
                Add specific benefits in the description to help clients choose the best plan for their fitness goals.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPlanPage;
