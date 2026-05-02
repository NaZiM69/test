import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import {
  AlertCircle,
  Clock,
  User,
  Trash2,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";

interface Problem {
  id: number;
  user_id: number;
  problem: string;
  date: string;
}

interface AppUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
}

const ClientProblemsPage: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [users, setUsers] = useState<Record<number, AppUser>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [problemsRes, usersRes] = await Promise.all([
        api.getProblems(),
        api.getUsers(),
      ]);

      const usersMap: Record<number, AppUser> = {};
      usersRes.data.forEach((u: AppUser) => {
        usersMap[u.id] = u;
      });

      setUsers(usersMap);
      setProblems(problemsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Mark this problem as resolved and delete?")) return;
    try {
      await api.deleteProblem(id);
      setProblems(problems.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting problem:", error);
    }
  };

  const getUserName = (userId: number) => {
    const user = users[userId];
    if (!user) return `User #${userId}`;
    return user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.username;
  };

  return (
    <div className="space-y-12 animate-fade-in pb-20">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            Support Connection
          </div>
          <h1 className="text-5xl md:text-6xl font-light text-white tracking-tight leading-none uppercase">
            <span className="italic font-serif text-orange-500">Support</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-xl">
            Monitor and resolve biomechanical anomalies and member plan
            discrepancies.
          </p>
        </div>
        <div className="px-8 py-4 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em] backdrop-blur-xl">
          {problems.length} ACTIVE SIGNALS
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 space-y-8">
          <div className="w-16 h-16 border-2 border-orange-500/10 border-t-orange-500 rounded-full animate-spin"></div>
          <p className="text-gray-600 text-[10px] font-bold uppercase tracking-[0.5em] animate-pulse">
            Filtering Distress Signals...
          </p>
        </div>
      ) : problems.length === 0 ? (
        <div className="text-center py-40 bg-white/5 border border-white/10 border-dashed rounded-[4rem] space-y-8 backdrop-blur-2xl">
          <div className="w-24 h-24 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(249,115,22,0.1)]">
            <CheckCircle2 size={40} strokeWidth={1.5} />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-light text-white uppercase italic font-serif">
              Plan <span className="text-orange-500">Stable</span>
            </h3>
            <p className="text-gray-500 text-sm font-light">
              No anomalous signals detected from the client network.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {problems.map((p) => (
            <div
              key={p.id}
              className="group bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 hover:border-orange-500/30 transition-all duration-500 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.3)]"
            >
              {/* Internal Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/[0.02] rounded-full blur-[100px] pointer-events-none group-hover:bg-orange-500/[0.05] transition-all duration-700"></div>

              <div className="flex justify-between items-start mb-10 relative z-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-orange-500 shadow-xl group-hover:scale-110 transition-transform duration-500">
                    <User size={28} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-xl font-light text-white tracking-tight leading-none uppercase truncate max-w-[140px]">
                      {getUserName(p.user_id)}
                    </h3>
                    <div className="flex items-center gap-2 text-[9px] font-black text-gray-600 uppercase tracking-widest mt-2">
                      <Clock size={12} className="text-orange-500/40" />
                      {new Date(p.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="w-12 h-12 rounded-xl bg-red-500/0 border border-red-500/0 text-gray-700 hover:text-red-500 hover:bg-red-500/10 hover:border-red-500/20 transition-all duration-500 flex items-center justify-center"
                >
                  <Trash2 size={20} strokeWidth={2} />
                </button>
              </div>

              <div className="space-y-8 relative z-10">
                <div className="p-6 rounded-[2rem] bg-black border border-white/5 text-gray-400 text-sm font-light leading-relaxed min-h-[140px] shadow-inner italic font-serif">
                  <MessageSquare
                    size={16}
                    className="text-orange-500 mb-4 opacity-30"
                  />
                  "{p.problem}"
                </div>

                <button className="w-full py-5 rounded-full bg-white/5 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-orange-500 hover:text-white hover:border-orange-400 transition-all duration-500 shadow-xl">
                  Respond to Operator
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientProblemsPage;
