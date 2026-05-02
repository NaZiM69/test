import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import {
  Send,
  History,
  AlertCircle,
  CheckCircle2,
  Clock,
  Trash2,
} from "lucide-react";

interface Problem {
  id: number;
  user_id: number;
  problem: string;
  date: string;
}

const ProblemsPage: React.FC = () => {
  const [problem, setProblem] = useState("");
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setFetching(true);
      const response = await api.getProblems();
      const userProblems = response.data.filter(
        (p: Problem) => p.user_id === user.id,
      );
      setProblems(userProblems);
    } catch (error) {
      console.error("Error fetching problems:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      await api.submitProblem({
        user_id: user.id,
        problem: problem.trim(),
      });
      setMessage({
        type: "success",
        text: "Message sent. Our team is reviewing your feedback.",
      });
      setProblem("");
      fetchProblems();
    } catch (error) {
      console.error("Error submitting problem:", error);
      setMessage({
        type: "error",
        text: "Message failed. Re-establish connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this historical record?")) return;
    try {
      await api.deleteProblem(id);
      setProblems(problems.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-20">
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em]">
          Technical Connection
        </div>
        <h1 className="text-5xl md:text-6xl font-light text-white tracking-tight leading-none uppercase">
          <span className="italic font-serif text-orange-500">Support</span>
        </h1>
        <p className="text-gray-500 text-lg font-light max-w-2xl">
          Contact support. Report problems or suggest improvements.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Submit Form */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="relative z-10 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
              <AlertCircle size={24} strokeWidth={1.5} />
            </div>
            <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">
              Start Report
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] ml-2">
                Problem Description
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Describe the problem..."
                className="w-full h-48 bg-black border border-white/10 rounded-[2rem] p-8 text-white focus:outline-none focus:border-orange-500/50 transition-all resize-none italic font-serif text-lg tracking-wide placeholder:text-gray-800"
                required
              />
            </div>

            {message.text && (
              <div
                className={`p-6 rounded-[1.5rem] flex items-center gap-4 animate-shake ${
                  message.type === "success"
                    ? "bg-orange-500/10 text-orange-500 border border-orange-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}
                <p className="text-[10px] font-bold uppercase tracking-widest leading-none">
                  {message.text}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !problem.trim()}
              className="w-full py-6 rounded-full bg-orange-500 hover:bg-white hover:text-black disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold text-[10px] uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl shadow-orange-500/30 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <Clock className="animate-spin" size={18} />
              ) : (
                <>
                  Transmit Data{" "}
                  <Send
                    size={16}
                    strokeWidth={2.5}
                    className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                  />
                </>
              )}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="lg:col-span-7 space-y-8">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500">
                <History size={24} strokeWidth={1.5} />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500">
                Connection History
              </h2>
            </div>
            <span className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-600">
              {problems.length} Transmissions
            </span>
          </div>

          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide">
            {fetching ? (
              <div className="flex flex-col items-center justify-center py-32 gap-6 bg-white/5 border border-white/10 rounded-[3rem] border-dashed">
                <div className="w-12 h-12 border-2 border-orange-500/20 border-t-orange-500 rounded-full animate-spin"></div>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
                  Syncing Historical Data...
                </p>
              </div>
            ) : problems.length === 0 ? (
              <div className="text-center py-32 bg-white/5 border-2 border-white/10 border-dashed rounded-[3rem] space-y-6">
                <AlertCircle
                  className="mx-auto text-gray-800"
                  size={56}
                  strokeWidth={1}
                />
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-[0.3em]">
                  No Problem Records Detected
                </p>
              </div>
            ) : (
              problems.map((p) => (
                <div
                  key={p.id}
                  className="group bg-white/5 border border-white/10 rounded-[2.5rem] p-8 hover:border-orange-500/30 transition-all duration-500 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/[0.02] transition-colors"></div>
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className="flex items-center gap-3 px-4 py-1.5 bg-black/40 rounded-full text-[10px] font-bold text-gray-600 group-hover:text-orange-500 transition-colors uppercase tracking-widest border border-white/5">
                      <Clock size={12} strokeWidth={2.5} />
                      {new Date(p.date).toLocaleString()}
                    </div>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="w-10 h-10 rounded-xl bg-red-500/0 text-gray-700 hover:text-red-400 hover:bg-red-500/10 transition-all duration-300 flex items-center justify-center"
                    >
                      <Trash2 size={16} strokeWidth={2} />
                    </button>
                  </div>
                  <p className="text-gray-400 text-lg font-light leading-relaxed whitespace-pre-wrap relative z-10 italic font-serif pl-2 border-l-2 border-orange-500/20 group-hover:border-orange-500/50 transition-colors">
                    "{p.problem}"
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProblemsPage;
