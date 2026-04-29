import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AlertCircle, Clock, User, Trash2, CheckCircle2, MessageSquare } from 'lucide-react';

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
        api.getUsers()
      ]);

      const usersMap: Record<number, AppUser> = {};
      usersRes.data.forEach((u: AppUser) => {
        usersMap[u.id] = u;
      });

      setUsers(usersMap);
      setProblems(problemsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Mark this problem as resolved and delete?')) return;
    try {
      await api.deleteProblem(id);
      setProblems(problems.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting problem:', error);
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black tracking-tight text-white">
            CLIENT <span className="text-blue-500">PROBLEMS</span>
          </h1>
          <p className="text-gray-400">Manage and respond to issues reported by members.</p>
        </div>
        <div className="px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-bold">
          {problems.length} ACTIVE REPORTS
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        </div>
      ) : problems.length === 0 ? (
        <div className="text-center py-24 bg-[#0a0a0a] border border-white/5 border-dashed rounded-[2rem] space-y-4">
          <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 size={40} />
          </div>
          <h3 className="text-xl font-bold text-white">All Clear!</h3>
          <p className="text-gray-500">No client problems reported at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div 
              key={p.id} 
              className="group bg-[#0a0a0a] border border-white/5 rounded-[2rem] p-6 hover:border-blue-500/30 transition-all duration-300 relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-all"></div>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-blue-400">
                    <User size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white truncate max-w-[150px]">
                      {getUserName(p.user_id)}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <Clock size={12} />
                      {new Date(p.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(p.id)}
                  className="p-2 rounded-xl text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-gray-300 text-sm leading-relaxed min-h-[100px]">
                  <MessageSquare size={16} className="text-blue-500 mb-2 opacity-50" />
                  {p.problem}
                </div>
                
                <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-blue-600 hover:border-blue-500 transition-all">
                  RESPOND TO CLIENT
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
