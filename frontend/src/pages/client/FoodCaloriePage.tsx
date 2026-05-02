import React, { useState, useRef } from "react";
import { api } from "../../services/api";
import {
  Upload,
  Activity,
  Apple,
  ChevronRight,
  Loader2,
  Info,
  Camera,
  X,
  RefreshCw,
  Scale,
  Zap,
  Fish,
  ArrowRight as ArrowRightIcon,
} from "lucide-react";

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
        video: { facingMode: "environment" },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setError("Camera access denied. Ensure personal authorization.");
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
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
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured_food.jpg", {
              type: "image/jpeg",
            });
            setSelectedFile(file);
            setPreview(URL.createObjectURL(blob));
            stopCamera();
          }
        }, "image/jpeg");
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

    try {
      const response = await api.predictFood(selectedFile);
      if (response.data.predictions) {
        setPredictions(response.data.predictions);
      } else if (response.data.error) {
        setError(response.data.error);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.error || "Intelligence service connection lost.",
      );
    } finally {
      setLoading(false);
    }
  };

  const calculateNutrition = (per100g: number) => {
    return ((per100g * grams) / 100).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-fade-in pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-bold uppercase tracking-[0.3em]">
            Vision Analytics
          </div>
          <h1 className="text-5xl md:text-6xl font-light text-white tracking-tight leading-none">
            Nutrition{" "}
            <span className="italic font-serif text-orange-500">Scanner</span>
          </h1>
          <p className="text-gray-500 text-lg font-light max-w-xl">
            Deep learning fuel analysis. Quantify your intake with precision.
          </p>
        </div>

        <div className="flex gap-4">
          {!isCameraActive ? (
            <button
              onClick={startCamera}
              className="flex items-center gap-3 px-8 py-4 bg-orange-500 text-white rounded-full hover:bg-white hover:text-black transition-all font-bold text-[10px] uppercase tracking-widest shadow-2xl shadow-orange-500/20 group"
            >
              <Camera
                size={18}
                className="group-hover:scale-110 transition-transform"
                strokeWidth={1.5}
              />{" "}
              Activate Optical Sensor
            </button>
          ) : (
            <button
              onClick={stopCamera}
              className="flex items-center gap-3 px-8 py-4 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full hover:bg-red-500/20 transition-all font-bold text-[10px] uppercase tracking-widest"
            >
              <X size={18} strokeWidth={2.5} /> Shutdown Camera
            </button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Data Input */}
        <div className="lg:col-span-5 space-y-10">
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-[80px] pointer-events-none"></div>

            <div className="relative z-10">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-6 flex items-center gap-3">
                <Scale className="text-orange-500" size={14} /> Mass Selection
                (Grams)
              </h2>
              <div className="relative group">
                <input
                  type="number"
                  value={grams}
                  onChange={(e) =>
                    setGrams(Math.max(1, parseInt(e.target.value) || 0))
                  }
                  className="w-full bg-black border border-white/10 rounded-2xl px-8 py-6 text-4xl font-light text-white focus:outline-none focus:border-orange-500/50 transition-all pr-24 italic font-serif"
                  placeholder="0"
                />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 text-orange-500 font-bold text-xl uppercase tracking-tighter">
                  G
                </div>
              </div>
            </div>

            <div className="h-px bg-white/5 w-full"></div>

            <div className="relative z-10">
              <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-500 mb-6 flex items-center gap-3">
                <Upload className="text-orange-500" size={14} /> Visual Input
              </h2>
              <div className="relative aspect-square rounded-[2rem] overflow-hidden bg-black border-2 border-dashed border-white/10 group hover:border-orange-500/40 transition-all duration-500">
                {isCameraActive ? (
                  <div className="w-full h-full relative">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={capturePhoto}
                      className="absolute bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-white rounded-full p-1 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-110 active:scale-95 transition-all duration-300 z-30"
                    >
                      <div className="w-full h-full bg-white border-4 border-black rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-orange-500 rounded-full animate-pulse"></div>
                      </div>
                    </button>
                    <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none"></div>
                  </div>
                ) : preview ? (
                  <div className="w-full h-full relative group">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center backdrop-blur-md">
                      <label className="cursor-pointer bg-white text-black px-10 py-4 rounded-full font-bold text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                        Rescan Pattern
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                ) : (
                  <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center gap-6 text-gray-600 hover:text-orange-500 transition-colors group">
                    <div className="w-20 h-20 rounded-[2rem] bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-orange-500/40 group-hover:bg-orange-500/5 transition-all duration-500">
                      <Upload size={32} strokeWidth={1.5} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                      Load Visual Data
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <button
              onClick={handlePredict}
              disabled={!selectedFile || loading || isCameraActive}
              className="w-full py-6 rounded-full font-bold text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-500 
                disabled:opacity-30 disabled:cursor-not-allowed
                bg-orange-500 hover:bg-white hover:text-black text-white shadow-2xl shadow-orange-500/30 group"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Syncing...
                </>
              ) : (
                <>
                  <Activity size={18} strokeWidth={2} /> Initiate Extraction{" "}
                  <ArrowRightIcon
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-[2rem] text-red-400 text-xs flex items-start gap-4 animate-shake font-bold uppercase tracking-widest leading-none">
              <Info size={16} className="shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Right Column: Intelligence Results */}
        <div className="lg:col-span-7">
          {predictions.length > 0 ? (
            <div className="space-y-10 animate-fade-in">
              <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3.5rem] p-12 relative overflow-hidden shadow-2xl group">
                <div className="absolute -top-10 -right-10 opacity-5 rotate-12 group-hover:scale-110 transition-transform duration-1000">
                  <Apple size={350} strokeWidth={0.5} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-12">
                    <div>
                      <span className="px-4 py-1.5 bg-orange-500/10 text-orange-500 rounded-full text-[10px] font-bold uppercase tracking-[0.3em] border border-orange-500/30">
                        Target Identified
                      </span>
                      <h3 className="text-6xl font-light text-white mt-6 capitalize italic font-serif leading-none tracking-tighter">
                        {predictions[0].name.replace(/_/g, " ")}
                      </h3>
                      <div className="flex items-center gap-3 text-gray-500 mt-6 bg-white/5 w-fit px-4 py-2 rounded-xl border border-white/5">
                        <Zap size={14} className="text-orange-500" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                          {predictions[0].confidence}% Model Confidence
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-8">
                    <div className="bg-black/60 border border-white/10 rounded-[2.5rem] p-8 text-center group hover:border-orange-500/40 transition-all duration-500 shadow-xl">
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
                        Energy (kcal)
                      </p>
                      <p className="text-5xl font-light text-white italic font-serif group-hover:text-orange-500 transition-colors">
                        {calculateNutrition(
                          predictions[0].nutrition_per_100g.calories,
                        )}
                      </p>
                    </div>
                    <div className="bg-black/60 border border-white/10 rounded-[2.5rem] p-8 text-center group hover:border-orange-500/40 transition-all duration-500 shadow-xl">
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
                        Protein (g)
                      </p>
                      <p className="text-5xl font-light text-white italic font-serif group-hover:text-orange-500 transition-colors">
                        {calculateNutrition(
                          predictions[0].nutrition_per_100g.protein,
                        )}
                      </p>
                    </div>
                    <div className="bg-black/60 border border-white/10 rounded-[2.5rem] p-8 text-center group hover:border-orange-500/40 transition-all duration-500 shadow-xl">
                      <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-3">
                        Carbs (g)
                      </p>
                      <p className="text-5xl font-light text-white italic font-serif group-hover:text-orange-500 transition-colors">
                        {calculateNutrition(
                          predictions[0].nutrition_per_100g.carbs,
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10">
                <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.4em] mb-8 px-2 flex items-center gap-3">
                  <Fish size={14} className="text-orange-500" /> Other Matches
                </h4>
                <div className="space-y-4">
                  {predictions.slice(1).map((pred, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-6 rounded-[2rem] bg-black/40 border border-white/5 hover:border-orange-500/30 transition-all group overflow-hidden relative"
                    >
                      <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/[0.02] transition-colors"></div>
                      <div className="flex items-center gap-6 relative z-10">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-serif italic text-xl text-gray-600 group-hover:text-orange-500 group-hover:border-orange-500/30 transition-all">
                          {idx + 2}
                        </div>
                        <div>
                          <p className="text-lg font-light text-white capitalize tracking-tight group-hover:italic transition-all">
                            {pred.name.replace(/_/g, " ")}
                          </p>
                          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                            {pred.confidence}% Sync
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 pr-4 relative z-10">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                            KCAL
                          </p>
                          <p className="text-lg font-light text-white italic font-serif">
                            {calculateNutrition(
                              pred.nutrition_per_100g.calories,
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                            PRO
                          </p>
                          <p className="text-lg font-light text-white italic font-serif">
                            {calculateNutrition(
                              pred.nutrition_per_100g.protein,
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-tighter">
                            CARB
                          </p>
                          <p className="text-lg font-light text-white italic font-serif">
                            {calculateNutrition(pred.nutrition_per_100g.carbs)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center text-center p-20 bg-white/5 border-2 border-white/10 border-dashed rounded-[4rem] group hover:bg-orange-500/[0.02] hover:border-orange-500/30 transition-all duration-700">
              <div className="w-32 h-32 rounded-[2.5rem] bg-black border border-white/10 flex items-center justify-center mb-10 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-700">
                <Apple
                  size={56}
                  strokeWidth={1}
                  className="text-gray-600 group-hover:text-orange-500 transition-colors"
                />
              </div>
              <h3 className="text-3xl font-light text-white mb-4">
                Awaiting Input
              </h3>
              <p className="text-gray-500 max-w-sm font-light leading-relaxed">
                System is in standby. Provide visual data to begin nutritional
                decomposition and personal mapping.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodCaloriePage;
