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
    } catch (err) {
      console.error('Failed to generate program:', err);
      alert('Could not generate program. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                <Target size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Let's get to know you</h2>
                <p className="text-gray-500 text-sm">We need some basic info to tailor your plan.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Age</label>
                <div className="relative">
                  <input 
                    type="number" 
                    name="age" 
                    value={formData.age} 
                    onChange={handleChange}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Goal</label>
                <select 
                  name="goal" 
                  value={formData.goal} 
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-500/50 transition-all appearance-none"
                >
                  <option>Build Muscle</option>
                  <option>Lose Weight</option>
                  <option>Improve Endurance</option>
                  <option>General Fitness</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Scale size={14} /> Weight (kg)
                </label>
                <input 
                  type="number" 
                  name="weight_kg" 
                  value={formData.weight_kg} 
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Ruler size={14} /> Height (cm)
                </label>
                <input 
                  type="number" 
                  name="height_cm" 
                  value={formData.height_cm} 
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                />
              </div>
            </div>

            <button 
              onClick={handleNext}
              className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group"
            >
              Continue <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in slide-in-from-right duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white">
                <Dumbbell size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">Your Experience</h2>
                <p className="text-gray-500 text-sm">Help us adjust the difficulty.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Activity size={14} /> Fitness Level
                </label>
                <select 
                  name="level" 
                  value={formData.level} 
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none"
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Calendar size={14} /> Days Available per week
                </label>
                <div className="flex gap-4">
                  {[2, 3, 4, 5, 6].map(d => (
                    <button 
                      key={d}
                      onClick={() => setFormData(prev => ({ ...prev, days_available: d }))}
                      className={`flex-1 py-4 rounded-2xl font-bold border transition-all ${formData.days_available === d ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20'}`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Zap size={14} /> Equipment Access
                </label>
                <select 
                  name="equipment" 
                  value={formData.equipment} 
                  onChange={handleChange}
                  className="w-full bg-[#1a1a1a] border border-white/10 rounded-2xl py-4 px-6 text-white focus:outline-none focus:border-purple-500/50 transition-all appearance-none"
                >
                  <option>Full Gym</option>
                  <option>Dumbbells Only</option>
                  <option>Bodyweight Only</option>
                  <option>Home Gym</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleBack}
                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all border border-white/10"
              >
                <ChevronLeft size={18} /> Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20"
              >
                {loading ? <><Loader2 className="animate-spin" size={18} /> Building Plan...</> : 'Generate My Plan'}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-10rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-white/5">
          <div 
            className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500"
            style={{ width: `${(step / 2) * 100}%` }}
          ></div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
};

export default GenerateProgramPage;
