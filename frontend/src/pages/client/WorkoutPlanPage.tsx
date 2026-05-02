import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
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
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const WorkoutPlanPage: React.FC = () => {
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

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
        setError("Failed to load your workout plan.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="w-16 h-16 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="text-gray-600 font-light tracking-[0.3em] uppercase text-[10px] animate-pulse">
          Loading Routine Plans...
        </p>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center max-w-2xl mx-auto space-y-10 animate-fade-in">
        <div className="w-32 h-32 bg-orange-500/10 border border-orange-500/20 rounded-[2.5rem] flex items-center justify-center text-orange-500 shadow-[0_0_50px_rgba(249,115,22,0.1)]">
          <Dumbbell size={56} strokeWidth={1} />
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-light text-white leading-none">
            No Active{" "}
            <span className="italic font-serif text-orange-500">Program</span>
          </h2>
          <p className="text-gray-500 text-lg font-light leading-relaxed">
            Your profile lacks a structured training program. Generate a new
            workout program to get started.
          </p>
        </div>
        <button
          onClick={() => navigate("/generate-plan")}
          className="px-12 py-6 bg-orange-500 hover:bg-white hover:text-black text-white rounded-full font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all duration-500 shadow-2xl shadow-orange-500/30 group"
        >
          Start Plan{" "}
          <ArrowRight
            size={18}
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
      {/* Header Summary Card */}
      <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-8">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              <Zap size={14} fill="currentColor" /> Workout Program
            </div>
            <h1 className="text-5xl md:text-6xl font-light text-white tracking-tight leading-none">
              Your{" "}
              <span className="italic font-serif text-orange-500">
                Transformation
              </span>{" "}
              Dashboard
            </h1>
            <p className="text-gray-500 text-lg font-light leading-relaxed max-w-2xl">
              {program.summary}
            </p>
            <button
              onClick={() => navigate("/generate-plan")}
              className="mt-6 px-8 py-3 bg-black/40 hover:bg-orange-500 hover:text-white border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-500 flex items-center gap-3 text-gray-500"
            >
              <RefreshCw
                size={14}
                className="group-hover:rotate-180 transition-transform duration-700"
              />{" "}
              Regenerate Plan
            </button>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-6">
            <div className="p-8 bg-black/60 rounded-[2rem] border border-white/10 group-hover:border-orange-500/30 transition-all duration-500 shadow-xl">
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-3">
                Daily Fuel
              </p>
              <p className="text-3xl font-light text-white italic font-serif leading-none">
                {program.daily_calories}
              </p>
              <p className="text-[10px] text-orange-500 font-bold uppercase mt-2">
                Kcal / Day
              </p>
            </div>
            <div className="p-8 bg-black/60 rounded-[2rem] border border-white/10 group-hover:border-orange-500/30 transition-all duration-500 shadow-xl">
              <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] mb-3">
                Duration
              </p>
              <p className="text-3xl font-light text-white italic font-serif leading-none">
                {program.duration_weeks}
              </p>
              <p className="text-[10px] text-orange-500 font-bold uppercase mt-2">
                Week Cycle
              </p>
            </div>
            <div className="col-span-2 p-8 bg-orange-500/10 rounded-[2rem] border border-orange-500/20 flex items-center justify-between group/macros">
              <div>
                <p className="text-[10px] text-orange-500 font-bold uppercase tracking-[0.3em] mb-4">
                  Nutrition
                </p>
                <div className="flex gap-6">
                  <div className="flex flex-col">
                    <span className="text-white font-serif italic text-2xl leading-none">
                      {program.macros.proteins_grams}g
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold mt-1">
                      Pro
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-serif italic text-2xl leading-none">
                      {program.macros.carbs_grams}g
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold mt-1">
                      Carb
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-serif italic text-2xl leading-none">
                      {program.macros.fats_grams}g
                    </span>
                    <span className="text-[10px] text-gray-500 uppercase font-bold mt-1">
                      Fat
                    </span>
                  </div>
                </div>
              </div>
              <Trophy
                size={48}
                className="text-orange-500 opacity-20 group-hover/macros:opacity-50 transition-opacity duration-1000"
                strokeWidth={1}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Workout Days */}
      <div className="space-y-8">
        <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] ml-4">
          Training Split Plans
        </h2>
        <div className="grid grid-cols-1 gap-6">
          {program.sport_program.map((day: any, idx: number) => (
            <div
              key={idx}
              className={`bg-white/5 backdrop-blur-xl border rounded-[2.5rem] overflow-hidden transition-all duration-500 ${expandedDay === idx ? "border-orange-500/30 ring-1 ring-orange-500/20" : "border-white/10"}`}
            >
              <button
                onClick={() => setExpandedDay(expandedDay === idx ? null : idx)}
                className="w-full p-8 flex items-center justify-between text-left hover:bg-orange-500/[0.02] transition-colors group"
              >
                <div className="flex items-center gap-8">
                  <div
                    className={`w-16 h-16 rounded-[1.5rem] flex flex-col items-center justify-center transition-all duration-500 ${expandedDay === idx ? "bg-orange-500 text-white shadow-2xl shadow-orange-500/30" : "bg-black border border-white/10 text-gray-500 group-hover:border-orange-500/30 group-hover:text-orange-500"}`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-tighter mb-1">
                      Day
                    </span>
                    <span className="text-2xl font-serif italic leading-none">
                      {idx + 1}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-light text-white group-hover:text-orange-500 transition-colors uppercase tracking-tight">
                      {day.target_muscles}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-1">
                      {day.exercises.length} Modular Operations
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden md:flex items-center gap-3 px-4 py-1.5 bg-orange-500/5 text-orange-500 rounded-full text-[10px] font-bold border border-orange-500/10 uppercase tracking-widest">
                    <CheckCircle2 size={12} strokeWidth={2.5} /> Sync Ready
                  </div>
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-500 ${expandedDay === idx ? "bg-orange-500 border-orange-400 text-white rotate-180" : "bg-black border-white/10 text-gray-500"}`}
                  >
                    <ChevronDown size={18} strokeWidth={3} />
                  </div>
                </div>
              </button>

              {expandedDay === idx && (
                <div className="px-8 pb-8 animate-fade-in">
                  <div className="grid grid-cols-1 gap-3 pt-6 border-t border-white/5">
                    {day.exercises.map((ex: any, exIdx: number) => (
                      <div
                        key={exIdx}
                        className="flex items-center justify-between p-6 bg-black/40 rounded-[2rem] border border-white/5 hover:border-orange-500/30 transition-all group/ex overflow-hidden relative"
                      >
                        <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/[0.02] transition-colors"></div>
                        <div className="flex items-center gap-6 relative z-10">
                          <div className="w-1.5 h-1.5 rounded-full bg-orange-500 group-hover:scale-[3] transition-all duration-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]"></div>
                          <span className="text-lg font-light text-gray-300 group-hover:text-white transition-colors capitalize tracking-tight">
                            {ex.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-10 relative z-10">
                          <div className="text-center">
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">
                              Volume
                            </p>
                            <p className="text-xl font-light text-white italic font-serif leading-none group-hover:text-orange-500 transition-colors">
                              {ex.sets}{" "}
                              <span className="text-[10px] text-gray-500 uppercase font-bold ml-1">
                                Sets
                              </span>
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">
                              Cadence
                            </p>
                            <p className="text-xl font-light text-white italic font-serif leading-none group-hover:text-orange-500 transition-colors">
                              {ex.reps}{" "}
                              <span className="text-[10px] text-gray-500 uppercase font-bold ml-1">
                                Reps
                              </span>
                            </p>
                          </div>
                          <div className="text-center min-w-[70px]">
                            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mb-1">
                              Rest
                            </p>
                            <p className="text-xl font-light text-white italic font-serif leading-none group-hover:text-orange-500 transition-colors">
                              {ex.rest_seconds}s
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-8 py-5 bg-orange-500 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.3em] transition-all duration-500 hover:bg-white hover:text-black shadow-2xl shadow-orange-500/20">
                    Log Plan Session
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
