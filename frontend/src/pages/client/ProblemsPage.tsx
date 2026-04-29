import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Send, History, AlertCircle, CheckCircle2, Clock, Trash2 } from 'lucide-react';

interface Problem {
  id: number;
  user_id: number;
  problem: string;
  date: string;
}

const ProblemsPage: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      setFetching(true);
      const response = await api.getProblems();
      // Filter by user_id if needed, or backend handles it
      const userProblems = response.data.filter((p: Problem) => p.user_id === user.id);
      setProblems(userProblems);
    } catch (error) {
      console.error('Error fetching problems:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim()) return;

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await api.submitProblem({
        user_id: user.id,
        problem: problem.trim()
      });
      setMessage({ type: 'success', text: 'Your problem has been submitted successfully. Our team will look into it.' });
      setProblem('');
      fetchProblems();
    } catch (error) {
      console.error('Error submitting problem:', error);
      setMessage({ type: 'error', text: 'Failed to submit problem. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await api.deleteProblem(id);
      setProblems(problems.filter(p => p.id !== id));
    } catch (error) {
      console.error('Error deleting problem:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          CLIENT <span className="text-blue-500">SUPPORT</span>
        </h1>
        <p className="text-gray-400">Tell us about any issues or suggestions you have.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submit Form */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-8 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500">
              <AlertCircle size={24} />
            </div>
            <h2 className="text-xl font-bold text-white">Report a Problem</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400 ml-1">Describe your issue</label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="Type your message here..."
                className="w-full h-40 bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none"
                required
              />
            </div>

            {message.text && (
              <div className={`p-4 rounded-2xl flex items-center gap-3 ${
                message.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
              }`}>
                {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <p className="text-sm font-medium">{message.text}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !problem.trim()}
              className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
            >
              {loading ? (
                <Clock className="animate-spin" size={20} />
              ) : (
                <>
                  Send Report <Send size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* History */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500">
                <History size={24} />
              </div>
              <h2 className="text-xl font-bold text-white">Your Reports</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-gray-400">
              {problems.length} total
            </span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {fetching ? (
              <div className="flex items-center justify-center py-20">
                <Clock className="animate-spin text-gray-600" size={32} />
              </div>
            ) : problems.length === 0 ? (
              <div className="text-center py-20 bg-white/5 border border-white/5 border-dashed rounded-3xl">
                <AlertCircle className="mx-auto text-gray-600 mb-4" size={40} />
                <p className="text-gray-500 font-medium">No reports found</p>
              </div>
            ) : (
              problems.map((p) => (
                <div key={p.id} className="group bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                      <Clock size={14} />
                      {new Date(p.date).toLocaleString()}
                    </div>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-2 rounded-lg text-gray-600 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{p.problem}</p>
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
