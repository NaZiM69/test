import React, { useState } from 'react';
import { api } from '../../services/api';
import CartoonButton from '../../components/CartoonButton';
import { Upload, CheckCircle, AlertCircle, FileVideo, ArrowLeft } from 'lucide-react';

interface CoachProps {
  onBack: () => void;
}

export default function PushupCoach({ onBack }: CoachProps) {
  const [video, setVideo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideo(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!video) return;

    setLoading(true);
    setError(null);

    try {
      const res = await api.analyzePushupVideo(video);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze video. Make sure the backend pushup_service is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full p-8 bg-[#111111] border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden mt-6">
      <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2" />
      
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to Dashboard</span>
      </button>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-brand-light via-brand to-brand bg-clip-text text-transparent mb-4 tracking-tight">AI Pushup Coach</h1>
        <p className="text-neutral-400 font-medium">Upload a video of your pushups for real-time form analysis</p>
      </div>

      {!result ? (
        <form onSubmit={handleUpload} className="space-y-8">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-700 rounded-3xl p-12 bg-black/30 hover:border-brand/50 hover:bg-brand/5 transition-all cursor-pointer relative group">
            <input 
              type="file" 
              accept="video/*" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-brand/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8 text-brand" />
              </div>
              <p className="text-lg font-bold text-neutral-200">
                {video ? video.name : "Choose a video or drag & drop"}
              </p>
              <p className="text-sm text-neutral-500 mt-2">MP4, MOV or WebM (Max 50MB)</p>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-900/50 text-red-400 rounded-xl text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="flex justify-center">
            <div className="w-64">
              <CartoonButton disabled={loading || !video} type="submit" color="bg-brand-light">
                {loading ? "Analyzing Form..." : "Analyze Now"}
              </CartoonButton>
            </div>
          </div>
        </form>
      ) : (
        <div className="space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/50 border border-neutral-800 p-6 rounded-2xl text-center">
              <p className="text-neutral-500 text-sm font-bold uppercase tracking-wider mb-1">Total Frames</p>
              <p className="text-3xl font-black text-white">{result.summary.total_frames}</p>
            </div>
            <div className="bg-black/50 border border-neutral-800 p-6 rounded-2xl text-center">
              <p className="text-neutral-500 text-sm font-bold uppercase tracking-wider mb-1">Incorrect Frames</p>
              <p className="text-3xl font-black text-red-500">{result.summary.error_frames}</p>
            </div>
            <div className="bg-black/50 border border-neutral-800 p-6 rounded-2xl text-center">
              <p className="text-neutral-500 text-sm font-bold uppercase tracking-wider mb-1">Error Rate</p>
              <p className="text-3xl font-black text-brand">{result.summary.percentage_incorrect}</p>
            </div>
          </div>

          {result.video_url && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-neutral-200 flex items-center gap-2">
                <FileVideo className="w-6 h-6 text-brand" />
                Annotated Video
              </h3>
              <div className="aspect-video rounded-2xl overflow-hidden border border-neutral-800 bg-black shadow-2xl">
                <video src={result.video_url} controls className="w-full h-full" />
              </div>
              <div className="p-4 bg-brand/10 border border-brand/20 rounded-xl flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-brand" />
                <p className="text-sm text-neutral-300">
                  We've marked your posture in the video. <span className="text-brand font-bold">Green</span> means good form, <span className="text-red-500 font-bold">Red</span> means you should adjust your position.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <button 
              onClick={() => {setResult(null); setVideo(null);}}
              className="px-8 py-3 bg-neutral-800 hover:bg-neutral-700 text-white font-bold rounded-xl transition-all"
            >
              Analyze Another Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
