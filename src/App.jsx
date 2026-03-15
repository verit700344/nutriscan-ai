import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, CheckCircle, Pill, Apple, Info, ArrowRight, Zap, Activity } from 'lucide-react';

export default function NutritionalDeficiencyDetector() {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    setAnalyzing(true);
    setResults(null);

    try {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Data, mimeType: mimeType })
      });

      const data = await response.json();
      const analysisResults = JSON.parse(data.analysis);
      
      setTimeout(() => {
        setResults(analysisResults);
        setAnalyzing(false);
      }, 2000);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setResults(null);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div 
        className="fixed inset-0 opacity-40 transition-all duration-700"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.15), transparent 50%), 
                       radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(139, 92, 246, 0.15), transparent 50%),
                       linear-gradient(180deg, #0A0A0F 0%, #1a1a2e 100%)`
        }}
      />

      {/* Floating Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float"
          style={{ 
            background: 'radial-gradient(circle, rgba(99, 102, 241, 0.4), transparent)',
            top: '10%',
            left: '10%',
            animation: 'float 20s ease-in-out infinite'
          }}
        />
        <div 
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 animate-float-delay"
          style={{ 
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.4), transparent)',
            bottom: '10%',
            right: '10%',
            animation: 'float 25s ease-in-out infinite 5s'
          }}
        />
      </div>

      {/* Noise Texture Overlay */}
      <div 
        className="fixed inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 px-6 py-2.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-xl">
              <Zap className="w-4 h-4 text-indigo-400" />
              <span className="text-sm font-medium text-white/80 tracking-wide">AI-Powered Health Analysis</span>
            </div>
          </div>
          
          <h1 className="text-8xl md:text-9xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-b from-white via-white/95 to-white/70 bg-clip-text text-transparent">
              NutriScan
            </span>
          </h1>
          
          <p className="text-xl text-white/60 max-w-2xl mx-auto font-light leading-relaxed">
            Advanced computer vision technology for<br/>
            nutritional deficiency detection
          </p>
        </div>

        {/* Main Content */}
        {!image ? (
          /* Upload Area */
          <div 
            className={`relative transition-all duration-700 ${dragActive ? 'scale-[1.02]' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={`
              group relative rounded-3xl cursor-pointer overflow-hidden
              transition-all duration-700 ease-out
              ${dragActive 
                ? 'bg-white/10 border-white/30 shadow-2xl shadow-indigo-500/20' 
                : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04] hover:border-white/20'
              }
              border backdrop-blur-2xl
            `}
            style={{
              background: dragActive 
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1))'
                : 'linear-gradient(135deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0.01))'
            }}
            onClick={() => fileInputRef.current?.click()}
            >
              {/* Glass reflection effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
              />
              
              <div className="relative p-24 text-center">
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-32 h-32 mb-10 rounded-3xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 backdrop-blur-xl group-hover:scale-110 transition-transform duration-700">
                  <Upload className="w-16 h-16 text-white/80 group-hover:text-white transition-colors duration-700" />
                </div>
                
                <h3 className="text-4xl font-semibold mb-4 text-white/90">
                  {dragActive ? 'Release to upload' : 'Upload Image'}
                </h3>
                
                <p className="text-lg text-white/50 mb-12 font-light">
                  Drag and drop or click to select<br/>
                  <span className="text-sm text-white/40">Supports JPG, PNG, WebP</span>
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <button className="group/btn px-8 py-4 bg-white text-black rounded-2xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg shadow-white/10">
                    <span className="flex items-center gap-2">
                      Choose File
                      <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  
                  <button className="px-8 py-4 bg-white/5 border border-white/20 rounded-2xl font-semibold hover:bg-white/10 transition-all duration-300 backdrop-blur-xl">
                    <span className="flex items-center gap-2">
                      <Camera className="w-5 h-5" />
                      Camera
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : !results && !analyzing ? (
          /* Image Preview */
          <div className="space-y-8 animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl backdrop-blur-xl bg-white/[0.02]">
              <img 
                src={image} 
                alt="Preview" 
                className="w-full max-h-[600px] object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={analyzeImage}
                className="group px-12 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-white/20"
              >
                <span className="flex items-center gap-3">
                  <Sparkles className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                  Analyze with AI
                </span>
              </button>
              
              <button
                onClick={resetAnalysis}
                className="px-12 py-5 bg-white/5 border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-xl"
              >
                Change Image
              </button>
            </div>
          </div>
        ) : analyzing ? (
          /* Loading */
          <div className="text-center py-32 animate-fade-in">
            <div className="relative inline-block mb-12">
              <div className="w-40 h-40 rounded-full border border-white/10" />
              <div className="w-40 h-40 rounded-full border-2 border-t-white/80 border-r-white/60 border-b-transparent border-l-transparent absolute top-0 left-0 animate-spin" />
              <Activity className="w-16 h-16 text-white/80 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            
            <h3 className="text-4xl font-semibold mb-4 text-white/90">
              Analyzing Image
            </h3>
            <p className="text-lg text-white/50 font-light">Processing with advanced AI models...</p>
          </div>
        ) : results && (
          /* Results */
          <div className="space-y-8 animate-fade-in">
            {/* General Observations */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-10 hover:bg-white/[0.04] transition-all duration-500">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <Info className="w-7 h-7 text-indigo-300" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold mb-4 text-white/90">Analysis Summary</h3>
                  <p className="text-lg text-white/60 leading-relaxed font-light">{results.generalObservations}</p>
                </div>
              </div>
            </div>

            {/* Deficiencies */}
            {results.deficiencies && results.deficiencies.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-5xl font-bold text-center text-white/90 mb-8">
                  Detected Deficiencies
                </h2>
                
                {results.deficiencies.map((def, idx) => (
                  <div 
                    key={idx}
                    className="group rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-2xl overflow-hidden hover:border-white/20 transition-all duration-700"
                    style={{ animationDelay: `${idx * 100}ms` }}
                  >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-8 border-b border-white/10">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-black/30 flex items-center justify-center backdrop-blur-xl">
                            <Pill className="w-7 h-7" />
                          </div>
                          <h3 className="text-3xl font-bold">{def.nutrient}</h3>
                        </div>
                        <span className="px-5 py-2.5 bg-black/40 rounded-full text-sm font-bold uppercase tracking-wider backdrop-blur-xl">
                          {def.confidence} confidence
                        </span>
                      </div>
                    </div>

                    <div className="p-10 space-y-8">
                      {/* Symptoms */}
                      {def.symptoms && def.symptoms.length > 0 && (
                        <div>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                              <AlertCircle className="w-5 h-5 text-red-400" />
                            </div>
                            <h4 className="text-xl font-bold text-red-300">Observed Symptoms</h4>
                          </div>
                          <ul className="space-y-3">
                            {def.symptoms.map((symptom, i) => (
                              <li key={i} className="flex items-start gap-4 text-white/70 text-lg font-light">
                                <span className="w-2 h-2 rounded-full bg-red-400 mt-2.5 flex-shrink-0" />
                                <span>{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Causes */}
                      {def.causes && def.causes.length > 0 && (
                        <div>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                              <Info className="w-5 h-5 text-yellow-400" />
                            </div>
                            <h4 className="text-xl font-bold text-yellow-300">Common Causes</h4>
                          </div>
                          <ul className="space-y-3">
                            {def.causes.map((cause, i) => (
                              <li key={i} className="flex items-start gap-4 text-white/70 text-lg font-light">
                                <span className="w-2 h-2 rounded-full bg-yellow-400 mt-2.5 flex-shrink-0" />
                                <span>{cause}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Food Sources */}
                      {def.foodSources && def.foodSources.length > 0 && (
                        <div>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                              <Apple className="w-5 h-5 text-green-400" />
                            </div>
                            <h4 className="text-xl font-bold text-green-300">Rich Food Sources</h4>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {def.foodSources.map((food, i) => (
                              <span 
                                key={i}
                                className="px-5 py-2.5 bg-green-500/10 border border-green-500/30 rounded-full text-sm font-medium text-green-300 backdrop-blur-xl hover:bg-green-500/20 transition-colors duration-300"
                              >
                                {food}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Remedies */}
                      {def.remedies && def.remedies.length > 0 && (
                        <div>
                          <div className="flex items-center gap-4 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-cyan-400" />
                            </div>
                            <h4 className="text-xl font-bold text-cyan-300">Recommended Actions</h4>
                          </div>
                          <ul className="space-y-3">
                            {def.remedies.map((remedy, i) => (
                              <li key={i} className="flex items-start gap-4 text-white/70 text-lg font-light">
                                <CheckCircle className="w-6 h-6 text-cyan-400 mt-0.5 flex-shrink-0" />
                                <span>{remedy}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-green-900/10 border border-green-500/30 rounded-3xl backdrop-blur-xl">
                <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-green-300 mb-3">No Deficiencies Detected</h3>
                <p className="text-lg text-white/60 font-light">Analysis didn't identify clear signs of deficiencies.</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="rounded-3xl bg-yellow-900/10 border border-yellow-500/30 p-8 backdrop-blur-xl">
              <div className="flex items-start gap-5">
                <AlertCircle className="w-7 h-7 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-yellow-300 mb-3 text-lg">Medical Disclaimer</h4>
                  <p className="text-white/60 leading-relaxed font-light">
                    {results.disclaimer}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center pt-8">
              <button
                onClick={resetAnalysis}
                className="px-12 py-5 bg-white text-black rounded-2xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-white/20"
              >
                Analyze Another Image
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        
        .animate-float {
          animation: float 20s ease-in-out infinite;
        }
        
        .animate-float-delay {
          animation: float 25s ease-in-out infinite 5s;
        }
      `}</style>
    </div>
  );
}
