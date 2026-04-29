import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Calendar, 
  Clock, 
  Zap, 
  Dumbbell, 
  ArrowRight, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Loader2,
  AlertCircle,
  Trophy,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WorkoutPlanPage: React.FC = () => {
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchProgram();
  }, []);

  const fetchProgram = async () => {
    setLoading(true);
    try {
      const response = await api.getMyProgram(user.id);
      setProgram(response.data);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setProgram(null);
      } else {
        setError('Failed to load your workout plan.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-blue-500" size={48} />
        <p className="text-gray-400 font-bold animate-pulse">Fetching your personalized plan...</p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto space-y-6">
        <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center text-blue-500">
          <Dumbbell size={40} />
        </div>
        <div>
          <h2 className="text-3xl font-black mb-3">No Active Plan</h2>
          <p className="text-gray-500 leading-relaxed">
            You haven't generated a workout plan yet. Get a personalized routine tailored to your goals in seconds.
          </p>
        </div>
        <button 
          onClick={() => navigate('/generate-plan')}
          className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20"
        >
          Generate My Plan <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Summary Card */}
      <div className="bg-[#0a0a0a] border border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest">
              <Zap size={12} /> Personalized AI Program
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Your <span className="text-blue-500">8-Week</span> Transformation
            </h1>
            <p className="text-gray-400 text-lg max-w-xl">
              {program.summary}
            </p>
            <button 
              onClick={() => navigate('/generate-plan')}
              className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold transition-all flex items-center gap-2 text-gray-400 hover:text-white"
            >
              <RefreshCw size={14} /> Regenerate Plan
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Calories</p>
              <p className="text-2xl font-black">{program.daily_calories}</p>
              <p className="text-[10px] text-gray-500 font-bold">kcal / day</p>
            </div>
            <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">Duration</p>
              <p className="text-2xl font-black">{program.duration_weeks}</p>
              <p className="text-[10px] text-gray-500 font-bold">Weeks</p>
            </div>
            <div className="col-span-2 p-6 bg-blue-600/10 rounded-3xl border border-blue-500/20 flex items-center justify-between">
              <div>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-widest">Macro Split</p>
                <div className="flex gap-4 mt-1">
                  <span className="text-sm font-bold">P: {program.macros.proteins_grams}g</span>
                  <span className="text-sm font-bold">C: {program.macros.carbs_grams}g</span>
                  <span className="text-sm font-bold">F: {program.macros.fats_grams}g</span>
                </div>
              </div>
              <Trophy size={32} className="text-blue-500 opacity-50" />
            </div>
          </div>
        </div>
      </div>

      {/* Workout Days */}
      <div className="space-y-4">
        <h2 className="text-2xl font-black ml-2">Training Split</h2>
        <div className="grid grid-cols-1 gap-4">
          {program.sport_program.map((day: any, idx: number) => (
            <div 
              key={idx} 
              className={`bg-[#0a0a0a] border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-300 ${expandedDay === idx ? 'ring-1 ring-blue-500/30' : ''}`}
            >
              <button 
                onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex flex-col items-center justify-center">
                    <span className="text-[10px] font-black text-blue-500 uppercase">Day</span>
                    <span className="text-xl font-black leading-none">{idx + 1}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{day.target_muscles}</h3>
                    <p className="text-sm text-gray-500">{day.exercises.length} Exercises</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold border border-green-500/20">
                    <CheckCircle2 size={14} /> Ready
                  </div>
                  {expandedDay === idx ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
                </div>
              </button>

              {expandedDay === idx && (
                <div className="px-6 pb-6 animate-in slide-in-from-top-4 duration-300">
                  <div className="grid grid-cols-1 gap-2 pt-2 border-t border-white/5">
                    {day.exercises.map((ex: any, exIdx: number) => (
                      <div key={exIdx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 group-hover:scale-150 transition-transform"></div>
                          <span className="font-bold text-gray-200">{ex.name}</span>
                        </div>
                        <div className="flex items-center gap-8">
                          <div className="text-center">
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Sets</p>
                            <p className="font-black text-blue-400">{ex.sets}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Reps</p>
                            <p className="font-black text-blue-400">{ex.reps}</p>
                          </div>
                          <div className="text-center min-w-[60px]">
                            <p className="text-[10px] text-gray-500 font-bold uppercase">Rest</p>
                            <p className="font-black text-blue-400">{ex.rest_seconds}s</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-4 bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500/30 rounded-2xl text-sm font-bold transition-all text-gray-400 hover:text-blue-400">
                    Log Workout Session
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkoutPlanPage;
