import React, { useState, useRef, useEffect } from 'react';
import { api } from '../../services/api';
import { Camera, Upload, Play, CheckCircle, AlertCircle, Loader2, Activity, Target, Zap } from 'lucide-react';

const FormCoachPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'realtime' | 'video'>('realtime');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState<string>('Ready for Bicep Curls?');
  const [isCameraActive, setIsCameraActive] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
        setError(null);
      }
    } catch (err) {
      setError('Could not access camera.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const captureFrameAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || !isCameraActive) return;

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg', 0.8);
      
      try {
        const response = await api.analyzeBicepFrame(imageData);
        if (response.data) {
          setRepCount(response.data.count || 0);
          setFeedback(response.data.feedback || 'Good form!');
        }
      } catch (err) {
        console.error('Frame analysis failed:', err);
      }
    }
  };

  useEffect(() => {
    let interval: any;
    if (isCameraActive && activeTab === 'realtime') {
      interval = setInterval(captureFrameAndAnalyze, 500);
    }
    return () => clearInterval(interval);
  }, [isCameraActive, activeTab]);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await api.analyzeBicepVideo(file);
      setAnalysisResult(response.data);
      setRepCount(response.data.total_reps || 0);
      setFeedback('Analysis complete!');
    } catch (err: any) {
      setError('Failed to analyze video.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-xl">
                <Target className="text-white" size={24} />
              </div>
              BICEP <span className="text-purple-500">COACH</span>
            </h1>
            <p className="text-gray-400 mt-1">AI Form Analysis for Curls</p>
          </div>
          
          <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
            <button 
              onClick={() => setActiveTab('realtime')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'realtime' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Real-time
            </button>
            <button 
              onClick={() => {
                setActiveTab('video');
                stopCamera();
              }}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'video' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
            >
              Video Upload
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-video bg-white/5 rounded-3xl border border-white/10 overflow-hidden group shadow-2xl">
              {activeTab === 'realtime' ? (
                <>
                  {isCameraActive ? (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-20 h-20 bg-purple-600/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Camera className="text-purple-500" size={32} />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Camera Feed</h3>
                      <button onClick={startCamera} className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-full font-bold transition-all flex items-center gap-2">
                        Start Camera
                      </button>
                    </div>
                  )}
                  <canvas ref={canvasRef} className="hidden" />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="text-blue-500" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Upload Video</h3>
                  <input type="file" ref={fileInputRef} onChange={handleVideoUpload} accept="video/*" className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing} className="px-8 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-full font-bold transition-all flex items-center gap-2">
                    {isAnalyzing ? <><Loader2 className="animate-spin" size={20} /> Analyzing...</> : <><Play size={20} /> Select Video</>}
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Coach Feedback</h3>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-500">
                  <Activity size={24} />
                </div>
                <div>
                  <p className="text-xl font-bold leading-tight">{feedback}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-3xl p-8 shadow-xl shadow-purple-900/20 relative overflow-hidden">
              <h3 className="text-white/80 text-sm font-bold uppercase tracking-widest mb-2">Total Reps</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-black">{repCount}</span>
                <span className="text-xl font-bold text-white/60">reps</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormCoachPage;
