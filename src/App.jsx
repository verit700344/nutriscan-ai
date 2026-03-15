import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, CheckCircle, Pill, Apple, Droplet, Info, Activity, Heart, Brain, Zap, Shield } from 'lucide-react';

export default function NutritionalDeficiencyDetector() {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64Data,
          mimeType: mimeType
        })
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
      setResults({
        deficiencies: [],
        generalObservations: "Unable to analyze the image. Please try another image with clearer visibility of physical features.",
        disclaimer: "This tool is for educational purposes only. Consult a healthcare professional for medical advice."
      });
    }
  };

  const resetAnalysis = () => {
    setImage(null);
    setResults(null);
    setAnalyzing(false);
  };

  const confidenceColor = (confidence) => {
    switch(confidence) {
      case 'high': return 'from-rose-400 via-red-400 to-orange-400';
      case 'medium': return 'from-amber-400 via-yellow-400 to-lime-400';
      case 'low': return 'from-sky-400 via-cyan-400 to-teal-400';
      default: return 'from-slate-400 to-gray-400';
    }
  };

  const getDeficiencyIcon = (index) => {
    const icons = [Heart, Brain, Activity, Shield, Zap];
    const Icon = icons[index % icons.length];
    return <Icon className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
      {/* Animated 3D Background Elements - Igloo Style */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Floating orbs with glass effect */}
        <div 
          className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.4) 0%, transparent 70%)',
            transform: `translateY(${scrollY * 0.3}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.4) 0%, transparent 70%)',
            transform: `translateY(${scrollY * -0.2}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)',
            transform: `translate(-50%, -50%) translateY(${scrollY * 0.15}px)`,
            transition: 'transform 0.3s ease-out'
          }}
        />
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16 max-w-7xl">
        {/* Header with glass morphism */}
        <div className="text-center mb-20 relative">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 blur-2xl animate-pulse" />
            <h1 
              className="relative text-8xl md:text-9xl font-black mb-6 tracking-tight leading-none"
              style={{
                fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
                background: 'linear-gradient(135deg, #fff 0%, #a78bfa 50%, #60a5fa 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 80px rgba(167, 139, 250, 0.5)'
              }}
            >
              NutriScan
            </h1>
          </div>
          <div className="flex items-center justify-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            <p className="text-sm font-semibold tracking-[0.3em] uppercase text-indigo-300">
              AI-Powered Health Analysis
            </p>
            <Sparkles className="w-6 h-6 text-purple-400 animate-pulse" style={{animationDelay: '0.5s'}} />
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
            Advanced computer vision for nutritional deficiency detection
          </p>
        </div>

        {/* Main Content */}
        {!image ? (
          /* Upload Area with Glassmorphism */}
          <div 
            className={`relative group transition-all duration-700 ${dragActive ? 'scale-105' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div 
              className={`
                relative overflow-hidden rounded-3xl border backdrop-blur-2xl cursor-pointer
                transition-all duration-500
                ${dragActive 
                  ? 'border-indigo-400/50 bg-indigo-500/10 shadow-2xl shadow-indigo-500/30' 
                  : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                }
              `}
              style={{
                background: dragActive 
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
              />
              
              {/* Glass reflection effect */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
              
              <div className="relative p-24 text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 mb-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                  <div className="relative w-full h-full rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                    {dragActive ? (
                      <Droplet className="w-16 h-16 text-indigo-300 animate-bounce" />
                    ) : (
                      <Upload className="w-16 h-16 text-indigo-300" />
                    )}
                  </div>
                </div>
                
                <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {dragActive ? 'Release to Upload' : 'Upload Image'}
                </h3>
                <p className="text-slate-400 mb-8 text-lg">
                  Drop your image here or click to browse<br/>
                  <span className="text-sm text-slate-500 mt-2 block">Supported: JPG, PNG, WebP • Max 10MB</span>
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105">
                    Select File
                  </button>
                  <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-full font-semibold hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Take Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : !results && !analyzing ? (
          /* Image Preview with Glass Effect */
          <div className="space-y-8 animate-fadeIn">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none z-10" />
              <img 
                src={image} 
                alt="Preview" 
                className="w-full max-h-[500px] object-contain bg-black/30 backdrop-blur-sm"
              />
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={analyzeImage}
                className="group px-10 py-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-3 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Analyze with AI</span>
              </button>
              <button
                onClick={resetAnalysis}
                className="px-10 py-5 bg-white/5 border border-white/10 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-xl"
              >
                Choose Different
              </button>
            </div>
          </div>
        ) : analyzing ? (
          /* Loading with 3D Animation */}
          <div className="text-center py-32 animate-fadeIn">
            <div className="relative inline-block mb-12">
              {/* Outer rotating ring */}
              <div className="w-40 h-40 rounded-full border-4 border-white/5 absolute top-0 left-0" />
              
              {/* Middle rotating ring */}
              <div className="w-40 h-40 rounded-full border-4 border-transparent border-t-indigo-400 border-r-purple-400 absolute top-0 left-0 animate-spin" />
              
              {/* Inner pulsing circle */}
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 flex items-center justify-center relative">
                <Sparkles className="w-16 h-16 text-indigo-300 animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Analyzing Image
            </h3>
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce" />
              <div className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{animationDelay: '0.2s'}} />
              <div className="w-2 h-2 rounded-full bg-pink-400 animate-bounce" style={{animationDelay: '0.4s'}} />
            </div>
            <p className="mt-6 text-lg text-slate-400">
              AI vision model processing your image...
            </p>
          </div>
        ) : results && (
          /* Results Display with Glassmorphism Cards */
          <div className="space-y-8 animate-fadeIn">
            {/* General Observations Card */}
            <div className="relative rounded-3xl overflow-hidden border border-white/10 backdrop-blur-2xl bg-white/5 p-8">
              <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
              <div className="flex items-start gap-4 relative">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-indigo-200">Analysis Summary</h3>
                  <p className="text-slate-300 leading-relaxed text-lg">{results.generalObservations}</p>
                </div>
              </div>
            </div>

            {/* Deficiencies Grid */}
            {results.deficiencies && results.deficiencies.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 bg-clip-text text-transparent">
                  Detected Deficiencies
                </h2>
                
                {results.deficiencies.map((def, idx) => (
                  <div 
                    key={idx}
                    className="relative rounded-3xl overflow-hidden border border-white/10 backdrop-blur-2xl bg-white/5 hover:bg-white/10 transition-all duration-500 group"
                    style={{
                      animationDelay: `${idx * 100}ms`,
                      animation: 'slideInUp 0.6s ease-out forwards'
                    }}
                  >
                    {/* Glass reflection */}
                    <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Header with gradient */}
                    <div className={`bg-gradient-to-r ${confidenceColor(def.confidence)} p-6 relative`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
                            {getDeficiencyIcon(idx)}
                          </div>
                          <h3 className="text-3xl font-bold text-white">{def.nutrient}</h3>
                        </div>
                        <span className="px-5 py-2 bg-black/30 backdrop-blur-sm rounded-full text-sm font-bold uppercase tracking-wider">
                          {def.confidence} Confidence
                        </span>
                      </div>
                    </div>

                    <div className="p-8 space-y-8">
                      {/* Symptoms */}
                      {def.symptoms && def.symptoms.length > 0 && (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                              <AlertCircle className="w-5 h-5 text-red-400" />
                            </div>
                            <h4 className="text-xl font-bold text-red-300">Observed Symptoms</h4>
                          </div>
                          <div className="grid gap-3">
                            {def.symptoms.map((symptom, i) => (
                              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-red-500/20 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                                <span className="text-slate-300 text-lg">{symptom}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Causes */}
                      {def.causes && def.causes.length > 0 && (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                              <Info className="w-5 h-5 text-amber-400" />
                            </div>
                            <h4 className="text-xl font-bold text-amber-300">Root Causes</h4>
                          </div>
                          <div className="grid gap-3">
                            {def.causes.map((cause, i) => (
                              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-amber-500/20 transition-colors">
                                <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                                <span className="text-slate-300 text-lg">{cause}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Food Sources */}
                      {def.foodSources && def.foodSources.length > 0 && (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                              <Apple className="w-5 h-5 text-green-400" />
                            </div>
                            <h4 className="text-xl font-bold text-green-300">Recommended Foods</h4>
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {def.foodSources.map((food, i) => (
                              <span 
                                key={i}
                                className="px-5 py-3 bg-green-500/10 border border-green-500/20 rounded-full text-sm font-medium text-green-300 hover:bg-green-500/20 hover:scale-105 transition-all cursor-default"
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
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-cyan-400" />
                            </div>
                            <h4 className="text-xl font-bold text-cyan-300">Action Plan</h4>
                          </div>
                          <div className="grid gap-3">
                            {def.remedies.map((remedy, i) => (
                              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/20 transition-colors">
                                <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                                <span className="text-slate-300 text-lg">{remedy}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl">
                <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
                <h3 className="text-3xl font-bold text-green-300 mb-3">No Deficiencies Detected</h3>
                <p className="text-slate-300 text-lg">The analysis didn't identify any clear nutritional deficiencies.</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="rounded-3xl bg-amber-900/10 border border-amber-500/20 p-8 backdrop-blur-2xl">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-8 h-8 text-amber-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-300 mb-3 text-xl">Medical Disclaimer</h4>
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {results.disclaimer}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center pt-8">
              <button
                onClick={resetAnalysis}
                className="px-10 py-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
              >
                Analyze Another Image
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(50px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
