import React, { useState, useRef } from 'react';
import { api } from '../../services/api';
import { Upload, Activity, Apple, ChevronRight, Loader2, Info, Camera, X, RefreshCw, Scale, Zap, Fish } from 'lucide-react';

interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
}

interface Prediction {
  name: string;
  confidence: number;
  nutrition_per_100g: NutritionInfo;
}

const FoodCaloriePage: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [grams, setGrams] = useState<number>(100);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    setIsCameraActive(true);
    setPreview(null);
    setSelectedFile(null);
    setPredictions([]);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setError("Could not access camera. Please check permissions.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured_food.jpg", { type: "image/jpeg" });
            setSelectedFile(file);
            setPreview(URL.createObjectURL(blob));
            stopCamera();
          }
        }, 'image/jpeg');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setPredictions([]);
      setError(null);
      if (isCameraActive) stopCamera();
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await api.predictFood(selectedFile);
      if (response.data.predictions) {
        setPredictions(response.data.predictions);
      } else if (response.data.error) {
        setError(response.data.error);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Something went wrong while connecting to the service.');
    } finally {
      setLoading(false);
    }

  };

  const calculateNutrition = (per100g: number) => {
    return ((per100g * grams) / 100).toFixed(1);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">Food Nutrition AI</h1>
          <p className="text-gray-400">Detect food items and get precise nutrition facts based on weight.</p>
        </div>
        <div className="flex gap-3">
          {!isCameraActive ? (
            <button 
              onClick={startCamera}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-500 transition-all font-bold shadow-lg shadow-blue-600/20"
            >
              <Camera size={20} /> Open Camera
            </button>
          ) : (
            <button 
              onClick={stopCamera}
              className="flex items-center gap-2 px-6 py-3 bg-red-600/10 text-red-400 border border-red-500/20 rounded-2xl hover:bg-red-600/20 transition-all font-bold"
            >
              <X size={20} /> Close Camera
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input and Weight */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Scale className="text-blue-500" size={24} />
                Meal Weight
              </h2>
              <div className="relative group">
                <input 
                  type="number" 
                  value={grams}
                  onChange={(e) => setGrams(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-2xl font-black text-white focus:outline-none focus:border-blue-500/50 transition-all pr-20"
                  placeholder="0"
                />
                <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xl">g</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Adjust the weight to update nutrition facts in real-time.</p>
            </div>

            <div className="h-[1px] bg-white/5 w-full"></div>

            <div>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Upload className="text-purple-500" size={24} />
                Food Image
              </h2>
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-white/5 border-2 border-dashed border-white/10 group hover:border-blue-500/50 transition-all">
                {isCameraActive ? (
                  <div className="w-full h-full relative">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                    <button 
                      onClick={capturePhoto}
                      className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-blue-500 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all"
                    >
                      <div className="w-12 h-12 bg-white border-2 border-gray-200 rounded-full"></div>
                    </button>
                  </div>
                ) : preview ? (
                  <>
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <label className="cursor-pointer bg-white text-black px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all">
                        Change Photo
                        <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                      </label>
                    </div>
                  </>
                ) : (
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-4 text-gray-500 hover:text-gray-300 transition-colors">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                      <Upload size={32} />
                    </div>
                    <span className="font-bold">Upload Food Photo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={!selectedFile || loading || isCameraActive}
              className="w-full py-5 rounded-[1.5rem] font-black text-xl flex items-center justify-center gap-3 transition-all 
                disabled:opacity-50 disabled:cursor-not-allowed
                bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-[1.02] active:scale-[0.98] text-white shadow-xl shadow-blue-600/20"
            >
              {loading ? (
                <>
                  <Loader2 size={24} className="animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Activity size={24} /> Get Nutrition Facts
                </>
              )}
            </button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-sm flex items-start gap-3 animate-shake">
              <Info size={18} className="shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Right Column: Results */}
        <div className="lg:col-span-7">
          {predictions.length > 0 ? (
            <div className="space-y-6 animate-slide-up">
              <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 opacity-5 rotate-12">
                  <Apple size={250} />
                </div>
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-black uppercase tracking-widest border border-blue-500/20">Detected Food</span>
                      <h3 className="text-5xl font-black text-white mt-4 capitalize">{predictions[0].name.replace(/_/g, ' ')}</h3>
                      <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <Activity size={16} />
                        <span className="text-sm font-bold">{predictions[0].confidence}% Analysis Confidence</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center group hover:bg-orange-500/10 hover:border-orange-500/20 transition-all">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Calories</p>
                      <p className="text-4xl font-black text-white">{calculateNutrition(predictions[0].nutrition_per_100g.calories)}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">kcal</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center group hover:bg-blue-500/10 hover:border-blue-500/20 transition-all">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Protein</p>
                      <p className="text-4xl font-black text-white">{calculateNutrition(predictions[0].nutrition_per_100g.protein)}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">grams</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 text-center group hover:bg-green-500/10 hover:border-green-500/20 transition-all">
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">Carbs</p>
                      <p className="text-4xl font-black text-white">{calculateNutrition(predictions[0].nutrition_per_100g.carbs)}</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">grams</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-8">
                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-6">Other Potential Matches</h4>
                <div className="space-y-4">
                  {predictions.slice(1).map((pred, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center font-black text-gray-500 group-hover:text-blue-400 transition-colors">
                          0{idx + 2}
                        </div>
                        <div>
                          <p className="font-bold text-white capitalize">{pred.name.replace(/_/g, ' ')}</p>
                          <p className="text-xs text-gray-500">{pred.confidence}% confidence</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 pr-4">
                        <div className="text-center">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Cal</p>
                          <p className="font-black text-white">{calculateNutrition(pred.nutrition_per_100g.calories)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Pro</p>
                          <p className="font-black text-white">{calculateNutrition(pred.nutrition_per_100g.protein)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs font-bold text-gray-500 uppercase tracking-tighter">Carb</p>
                          <p className="font-black text-white">{calculateNutrition(pred.nutrition_per_100g.carbs)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] border-dashed">
              <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
                <Apple size={48} className="text-gray-500" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">No Analysis Yet</h3>
              <p className="text-gray-500 max-w-sm">Capture or upload an image of your food and enter its weight to see full nutrition details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCaloriePage;
