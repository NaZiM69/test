import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Dumbbell, 
  Target, 
  ChevronRight, 
  ChevronLeft, 
  Loader2, 
  Scale, 
  Ruler, 
  Activity, 
  Calendar,
  Zap
} from 'lucide-react';

const GenerateProgramPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    user_id: JSON.parse(localStorage.getItem('user') || '{}').id,
    name: JSON.parse(localStorage.getItem('user') || '{}').username || 'User',
    age: 25,
    weight_kg: 70,
    height_cm: 175,
    goal: 'Build Muscle',
    level: 'Beginner',
    days_available: 3,
    equipment: 'Full Gym'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'age' || name === 'weight_kg' || name === 'height_cm' || name === 'days_available' 
        ? parseInt(value) 
        : value 
    }));
  };

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.generateProgram(formData);
      navigate('/workout-plan');
    } catch (err: any) {
      console.error('Failed to generate program:', err);
      const msg = err.response?.data?.detail || 'Failed to generate program. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-10 animate-fade-in">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 bg-orange-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                <Target size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-3xl font-light text-white leading-none">Personal <span className="italic font-serif text-orange-500">Profiling</span></h2>
                <p className="text-gray-500 text-xs uppercase tracking-[0.2em] font-bold mt-2">Start your physical parameters</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] ml-1">Current Age</label>
                <div className="relative group">
                  <input 
                    type="number" 
                    name="age" 
                    value={formData.age} 
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none focus:border-orange-500/50 transition-all font-light italic font-serif text-xl"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] ml-1">Primary Objective</label>
                <div className="relative">
                  <select 
                    name="goal" 
                    value={formData.goal} 
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none focus:border-orange-500/50 transition-all appearance-none font-light italic font-serif text-xl cursor-pointer"
                  >
                    <option>Build Muscle</option>
                    <option>Lose Weight</option>
                    <option>Improve Endurance</option>
                    <option>General Fitness</option>
                  </select>
                  <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 rotate-90 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] ml-1 flex items-center gap-2">
                  <Scale size={14} className="text-orange-500" /> Mass (kg)
                </label>
                <input 
                  type="number" 
                  name="weight_kg" 
                  value={formData.weight_kg} 
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none focus:border-orange-500/50 transition-all font-light italic font-serif text-xl"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] ml-1 flex items-center gap-2">
                  <Ruler size={14} className="text-orange-500" /> Stature (cm)
                </label>
                <input 
                  type="number" 
                  name="height_cm" 
                  value={formData.height_cm} 
                  onChange={handleChange}
                  className="w-full bg-black border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none focus:border-orange-500/50 transition-all font-light italic font-serif text-xl"
                />
              </div>
            </div>

            <button 
              onClick={handleNext}
              className="w-full py-6 bg-orange-500 hover:bg-white hover:text-black text-white rounded-full font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-500 group shadow-2xl shadow-orange-500/20"
            >
              Next Plan <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-10 animate-fade-in">
            <div className="flex items-center gap-6 mb-12">
              <div className="w-16 h-16 bg-orange-500 rounded-[1.5rem] flex items-center justify-center text-white shadow-[0_0_30px_rgba(249,115,22,0.3)]">
                <Dumbbell size={28} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-3xl font-light text-white leading-none">Experience <span className="italic font-serif text-orange-500">Parameters</span></h2>
                <p className="text-gray-500 text-xs uppercase tracking-[0.2em] font-bold mt-2">Adjust your program preferences</p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] ml-1 flex items-center gap-2">
                  <Activity size={14} className="text-orange-500" /> Proficiency Tier
                </label>
                <div className="relative">
                  <select 
                    name="level" 
                    value={formData.level} 
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none focus:border-orange-500/50 transition-all appearance-none font-light italic font-serif text-xl cursor-pointer"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Advanced</option>
                  </select>
                  <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 rotate-90 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] ml-1 flex items-center gap-2">
                  <Calendar size={14} className="text-orange-500" /> Training Cycles (Per Week)
                </label>
                <div className="flex gap-4">
                  {[2, 3, 4, 5, 6].map(d => (
                    <button 
                      key={d}
                      onClick={() => setFormData(prev => ({ ...prev, days_available: d }))}
                      className={`flex-1 py-5 rounded-2xl font-serif italic text-2xl transition-all duration-500 border ${formData.days_available === d ? 'bg-orange-500 border-orange-400 text-white shadow-2xl shadow-orange-500/30 scale-105 z-10' : 'bg-black border-white/10 text-gray-600 hover:border-orange-500/30'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] ml-1 flex items-center gap-2">
                  <Zap size={14} className="text-orange-500" /> Logistics Access
                </label>
                <div className="relative">
                  <select 
                    name="equipment" 
                    value={formData.equipment} 
                    onChange={handleChange}
                    className="w-full bg-black border border-white/10 rounded-2xl py-5 px-8 text-white focus:outline-none focus:border-orange-500/50 transition-all appearance-none font-light italic font-serif text-xl cursor-pointer"
                  >
                    <option>Full Gym</option>
                    <option>Dumbbells Only</option>
                    <option>Bodyweight Only</option>
                    <option>Home Gym</option>
                  </select>
                  <ChevronRight size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-600 rotate-90 pointer-events-none" />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 text-sm italic font-serif mt-4 text-center">
                {error}
              </div>
            )}

            <div className="flex gap-6 pt-4">
              <button 
                onClick={handleBack}
                className="flex-1 py-6 bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white rounded-full font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-500 border border-white/10"
              >
                <ChevronLeft size={16} strokeWidth={3} /> Return
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] py-6 bg-orange-500 hover:bg-white hover:text-black text-white rounded-full font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl shadow-orange-500/30 disabled:opacity-30"
              >
                {loading ? <><Loader2 className="animate-spin" size={18} /> Generating Plan...</> : 'Start Program'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-3xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[4rem] p-12 md:p-16 shadow-[0_0_80px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        <div className="absolute inset-0 bg-orange-500/[0.01] pointer-events-none"></div>
        
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-white/5">
          <div 
            className="h-full bg-orange-500 transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(249,115,22,0.6)]"
            style={{ width: `${(step / 2) * 100}%` }}
          ></div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default GenerateProgramPage;
