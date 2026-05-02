import React, { useState } from "react";
import { api } from "../../services/api";
import CartoonButton from "../../components/CartoonButton";
import {
  Upload,
  CheckCircle,
  AlertCircle,
  FileVideo,
  ArrowLeft,
  ArrowRight as ArrowRightIcon,
} from "lucide-react";

interface CoachProps {
  onBack: () => void;
}

export default function BicepCoach({ onBack }: CoachProps) {
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
      const res = await api.analyzeBicepVideo(video);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      setError("Synchronization failed. Ensure bicep_service is operational.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto w-full p-12 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] shadow-2xl relative overflow-hidden mt-6 animate-fade-in">
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />

      <button
        onClick={onBack}
        className="flex items-center gap-3 text-gray-500 hover:text-orange-500 transition-all mb-10 group text-[10px] uppercase font-bold tracking-widest"
      >
        <ArrowLeft
          className="w-4 h-4 group-hover:-translate-x-1 transition-transform"
          strokeWidth={2.5}
        />
        <span>Return to Hub</span>
      </button>

      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
          Personal Analysis
        </div>
        <h1 className="text-5xl md:text-6xl font-light text-white mb-6 tracking-tight leading-none">
          Bicep <span className="italic font-serif text-orange-500">Plan</span>
        </h1>
        <p className="text-gray-500 font-light text-lg max-w-xl mx-auto">
          Upload video for AI form evaluation.
        </p>
      </div>

      {!result ? (
        <form onSubmit={handleUpload} className="space-y-12">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-[2.5rem] p-16 bg-black/40 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all cursor-pointer relative group overflow-hidden">
            <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/[0.02] transition-colors"></div>
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer z-20"
            />
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 bg-orange-500/10 border border-orange-500/20 rounded-[2rem] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(249,115,22,0.2)] transition-all duration-500">
                <Upload className="w-8 h-8 text-orange-500" strokeWidth={1.5} />
              </div>
              <p className="text-xl font-light text-gray-200">
                {video ? video.name : "Initiate Video Upload"}
              </p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em] mt-3">
                Drag data package or click to browse
              </p>
            </div>
          </div>

          {error && (
            <div className="p-5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs flex items-center gap-4 animate-shake">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="font-bold uppercase tracking-widest leading-none">
                {error}
              </span>
            </div>
          )}

          <div className="flex justify-center pt-4">
            <button
              disabled={loading || !video}
              type="submit"
              className="w-full md:w-80 py-6 bg-orange-500 hover:bg-white hover:text-black text-white rounded-full font-bold text-xs uppercase tracking-[0.3em] transition-all duration-500 shadow-2xl shadow-orange-500/20 disabled:opacity-30 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Start Analysis{" "}
                  <ArrowRightIcon
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-12 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-black/60 border border-white/10 p-8 rounded-[2rem] text-center group hover:border-orange-500/30 transition-all">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
                Total Cycles
              </p>
              <p className="text-4xl font-light text-white italic font-serif">
                {result.summary.total_frames}
              </p>
            </div>
            <div className="bg-black/60 border border-white/10 p-8 rounded-[2rem] text-center group hover:border-red-500/30 transition-all">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
                Anomalies
              </p>
              <p className="text-4xl font-light text-red-500 italic font-serif">
                {result.summary.error_frames}
              </p>
            </div>
            <div className="bg-black/60 border border-white/10 p-8 rounded-[2rem] text-center group hover:border-orange-500/30 transition-all">
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
                Precision Index
              </p>
              <p className="text-4xl font-light text-orange-500 italic font-serif">
                {result.summary.percentage_incorrect}
              </p>
            </div>
          </div>

          {result.video_url && (
            <div className="space-y-6">
              <h3 className="text-xl font-light text-white flex items-center gap-3 uppercase tracking-widest">
                <FileVideo
                  className="w-5 h-5 text-orange-500"
                  strokeWidth={1.5}
                />
                Annotated <span className="italic font-serif">Playback</span>
              </h3>
              <div className="rounded-[2.5rem] overflow-hidden border border-white/10 bg-black shadow-2xl relative group">
                <video
                  src={result.video_url}
                  controls
                  className="w-full h-auto object-contain"
                />
                <div className="absolute top-6 left-6 z-10 flex items-center gap-3">
                  <div className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>{" "}
                    Optimal
                  </div>
                  <div className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>{" "}
                    Problem
                  </div>
                </div>
              </div>
              <div className="p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl flex items-center gap-5">
                <CheckCircle
                  className="w-6 h-6 text-orange-500"
                  strokeWidth={1.5}
                />
                <p className="text-xs text-gray-400 font-light leading-relaxed uppercase tracking-wider">
                  Real-time markers integrated into playback.{" "}
                  <span className="text-orange-500 font-bold">
                    Orange/Green
                  </span>{" "}
                  indicators show posture alignment. Corrections shown in{" "}
                  <span className="text-red-500 font-bold">Red</span>.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center pt-6">
            <button
              onClick={() => {
                setResult(null);
                setVideo(null);
              }}
              className="px-10 py-5 bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10 text-white font-bold text-[10px] uppercase tracking-[0.3em] rounded-full transition-all duration-500"
            >
              Reset Terminal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
