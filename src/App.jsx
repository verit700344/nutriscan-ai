import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, CheckCircle, Pill, Apple, Info, ArrowRight, Zap, Activity, Cpu, Droplets } from 'lucide-react';

export default function NutritionalDeficiencyDetector() {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Particle system
  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.5 + 0.3
    }));
    setParticles(newParticles);

    const interval = setInterval(() => {
      setParticles(prev => prev.map(p => ({
        ...p,
        x: (p.x + p.speedX + 100) % 100,
        y: (p.y + p.speedY + 100) % 100
      })));
    }, 50);

    return () => clearInterval(interval);
  }, []);

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
      reader.onload = (e) => setImage(e.target.result);
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
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="fixed inset-0 transition-all duration-700"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.2), transparent 40%),
            radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(236, 72, 153, 0.2), transparent 40%),
            radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15), transparent 50%),
            linear-gradient(135deg, #000000 0%, #0a0a1f 50%, #000000 100%)
          `
        }}
      />

      {/* Particle field */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-cyan-400 blur-[1px] animate-pulse"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              boxShadow: `0 0 ${p.size * 2}px rgba(34, 211, 238, ${p.opacity})`
            }}
          />
        ))}
      </div>

      {/* Glowing orbs with parallax */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-30 animate-float-slow"
          style={{ 
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6), transparent)',
            top: '10%',
            left: '5%',
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`
          }}
        />
        <div 
          className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-30 animate-float-slow"
          style={{ 
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.6), transparent)',
            top: '50%',
            right: '5%',
            transform: `translate(${-mousePosition.x * 0.15}px, ${-mousePosition.y * 0.15}px)`,
            animationDelay: '2s'
          }}
        />
        <div 
          className="absolute w-[350px] h-[350px] rounded-full blur-[100px] opacity-20 animate-float-slow"
          style={{ 
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6), transparent)',
            bottom: '15%',
            left: '30%',
            transform: `translate(${mousePosition.x * 0.08}px, ${mousePosition.y * 0.08}px)`,
            animationDelay: '4s'
          }}
        />
      </div>

      {/* Grid overlay */}
      <div 
        className="fixed inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-7xl">
        {/* Futuristic header */}
        <div className="text-center mb-20 relative">
          {/* Glowing badge */}
          <div className="inline-block mb-8 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <div className="relative flex items-center gap-3 px-8 py-3 bg-black/50 border border-purple-500/30 rounded-full backdrop-blur-xl">
                <Cpu className="w-5 h-5 text-purple-400 animate-pulse" />
                <span className="text-sm font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent uppercase tracking-widest">
                  AI-Powered Analysis
                </span>
                <Zap className="w-5 h-5 text-pink-400 animate-pulse" style={{ animationDelay: '500ms' }} />
              </div>
            </div>
          </div>
          
          {/* Main title with glitch effect */}
          <h1 className="relative text-8xl md:text-9xl font-black mb-8 tracking-tighter">
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent blur-2xl opacity-50 animate-pulse">
                NutriScan
              </span>
              <span className="relative bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                NutriScan
              </span>
            </span>
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-purple-200/70 max-w-2xl mx-auto leading-relaxed font-light">
            Next-generation nutritional analysis powered by advanced AI
          </p>

          {/* Decorative lines */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />
            <Droplets className="w-5 h-5 text-cyan-400" />
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* Main Content */}
        {!image ? (
          /* Upload Area - Cyberpunk glassmorphism */
          <div 
            className={`
              relative transition-all duration-700 
              ${dragActive ? 'scale-105' : 'hover:scale-[1.02]'}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            
            <div 
              className={`
                relative group cursor-pointer rounded-3xl overflow-hidden
                border-2 backdrop-blur-2xl transition-all duration-700
                ${dragActive 
                  ? 'border-purple-500/50 bg-purple-900/20 shadow-[0_0_80px_rgba(168,85,247,0.4)]' 
                  : 'border-purple-500/20 bg-black/40 hover:border-purple-500/40 hover:bg-purple-900/10'
                }
              `}
              style={{
                boxShadow: dragActive 
                  ? '0 0 100px rgba(168, 85, 247, 0.4), inset 0 0 60px rgba(168, 85, 247, 0.1)' 
                  : '0 0 40px rgba(168, 85, 247, 0.1), inset 0 0 40px rgba(168, 85, 247, 0.05)'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* Animated gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Scan lines */}
              <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent animate-scan-line" />
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
              />
              
              <div className="relative p-24">
                {/* Floating icon with 3D effect */}
                <div className="relative inline-block mb-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-60 animate-pulse" />
                  <div className="relative w-40 h-40 rounded-3xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 backdrop-blur-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-700"
                       style={{ 
                         boxShadow: '0 20px 60px -10px rgba(168, 85, 247, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                       }}>
                    <Upload className="w-20 h-20 text-purple-300 group-hover:text-white transition-colors duration-700" />
                  </div>
                </div>
                
                <h3 className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {dragActive ? 'DROP TO SCAN' : 'UPLOAD IMAGE'}
                </h3>
                
                <p className="text-lg text-purple-200/60 mb-12 font-light">
                  Drag and drop or click to select<br/>
                  <span className="text-sm text-purple-300/40">Maximum clarity. Instant results.</span>
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <button className="group/btn relative px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-bold overflow-hidden transform hover:scale-105 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                    <span className="relative flex items-center gap-3 text-white">
                      <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '3s' }} />
                      Select File
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </span>
                  </button>
                  
                  <button className="px-10 py-5 bg-white/5 border-2 border-purple-500/30 rounded-2xl font-bold hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-xl">
                    <span className="flex items-center gap-3 text-purple-200">
                      <Camera className="w-5 h-5" />
                      Camera
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : !results && !analyzing ? (
          /* Image Preview - Neon frame */
          <div className="space-y-8 animate-slide-up">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500/30 shadow-2xl backdrop-blur-xl bg-black/60">
                <img 
                  src={image} 
                  alt="Preview" 
                  className="w-full max-h-[600px] object-contain"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={analyzeImage}
                className="group relative px-14 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl font-black text-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center gap-3 text-white">
                  <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
                  ANALYZE NOW
                </span>
              </button>
              
              <button
                onClick={resetAnalysis}
                className="px-14 py-6 bg-white/5 border-2 border-purple-500/30 rounded-2xl font-black text-lg hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-xl"
              >
                <span className="text-purple-200">RESET</span>
              </button>
            </div>
          </div>
        ) : analyzing ? (
          /* Loading - Cyberpunk animation */
          <div className="text-center py-32 animate-fade-in">
            <div className="relative inline-block mb-16">
              {/* Rotating rings */}
              <div className="w-48 h-48 rounded-full border-2 border-purple-500/20 absolute top-0 left-0" />
              <div className="w-48 h-48 rounded-full border-2 border-t-purple-500 border-r-pink-500 border-b-transparent border-l-transparent absolute top-0 left-0 animate-spin" />
              <div className="w-40 h-40 rounded-full border-2 border-t-transparent border-r-transparent border-b-pink-500 border-l-blue-500 absolute top-4 left-4 animate-spin-reverse" />
              <div className="w-48 h-48 flex items-center justify-center">
                <Activity className="w-20 h-20 text-purple-400 animate-pulse" />
              </div>
            </div>
            
            <h3 className="text-5xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
              ANALYZING
            </h3>
            <p className="text-xl text-purple-200/60 font-light animate-pulse">Processing neural networks...</p>
            
            {/* Progress bars */}
            <div className="max-w-md mx-auto mt-12 space-y-3">
              {[40, 60, 80].map((width, i) => (
                <div key={i} className="h-1.5 bg-purple-900/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"
                    style={{ 
                      width: `${width}%`,
                      animationDelay: `${i * 200}ms`
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : results && (
          /* Results - Futuristic cards */
          <div className="space-y-8 animate-slide-up">
            {/* Summary */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="relative rounded-3xl border-2 border-purple-500/30 bg-black/60 backdrop-blur-2xl p-10 hover:border-purple-500/50 transition-all duration-500">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/30 to-blue-600/30 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                    <Info className="w-8 h-8 text-purple-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">ANALYSIS SUMMARY</h3>
                    <p className="text-lg text-purple-100/70 leading-relaxed">{results.generalObservations}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Deficiencies */}
            {results.deficiencies && results.deficiencies.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-6xl font-black text-center mb-12 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient">
                  DETECTED DEFICIENCIES
                </h2>
                
                {results.deficiencies.map((def, idx) => (
                  <div 
                    key={idx}
                    className="relative group"
                    style={{ animationDelay: `${idx * 150}ms` }}
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
                    
                    <div className="relative rounded-3xl border-2 border-purple-500/30 bg-black/60 backdrop-blur-2xl overflow-hidden hover:border-purple-500/50 transition-all duration-700">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-purple-900/40 via-pink-900/40 to-blue-900/40 p-8 border-b-2 border-purple-500/20">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600/30 to-pink-600/30 border border-purple-500/30 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                              <Pill className="w-8 h-8 text-purple-300" />
                            </div>
                            <h3 className="text-3xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{def.nutrient}</h3>
                          </div>
                          <span className="px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-full text-sm font-bold uppercase tracking-widest text-purple-300 backdrop-blur-xl">
                            {def.confidence}
                          </span>
                        </div>
                      </div>

                      <div className="p-10 space-y-10">
                        {/* Symptoms */}
                        {def.symptoms && def.symptoms.length > 0 && (
                          <div>
                            <div className="flex items-center gap-4 mb-6">
                              <div className="w-12 h-12 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-400" />
                              </div>
                              <h4 className="text-xl font-bold text-red-400 uppercase tracking-wider">Symptoms Detected</h4>
                            </div>
                            <ul className="space-y-3">
                              {def.symptoms.map((symptom, i) => (
                                <li key={i} className="flex items-start gap-4 text-purple-100/80 text-base leading-relaxed group/item hover:text-white transition-colors">
                                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-red-500 to-pink-500 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform" />
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
                              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center">
                                <Info className="w-6 h-6 text-yellow-400" />
                              </div>
                              <h4 className="text-xl font-bold text-yellow-400 uppercase tracking-wider">Root Causes</h4>
                            </div>
                            <ul className="space-y-3">
                              {def.causes.map((cause, i) => (
                                <li key={i} className="flex items-start gap-4 text-purple-100/80 text-base leading-relaxed group/item hover:text-white transition-colors">
                                  <span className="w-2 h-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform" />
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
                              <div className="w-12 h-12 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                                <Apple className="w-6 h-6 text-green-400" />
                              </div>
                              <h4 className="text-xl font-bold text-green-400 uppercase tracking-wider">Food Sources</h4>
                            </div>
                            <div className="flex flex-wrap gap-3">
                              {def.foodSources.map((food, i) => (
                                <span 
                                  key={i}
                                  className="px-5 py-2.5 bg-green-500/10 border border-green-500/30 rounded-xl text-sm font-bold text-green-300 backdrop-blur-xl hover:bg-green-500/20 hover:scale-105 hover:border-green-500/50 transition-all duration-300 cursor-pointer"
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
                              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-cyan-400" />
                              </div>
                              <h4 className="text-xl font-bold text-cyan-400 uppercase tracking-wider">Action Plan</h4>
                            </div>
                            <ul className="space-y-3">
                              {def.remedies.map((remedy, i) => (
                                <li key={i} className="flex items-start gap-4 text-purple-100/80 text-base leading-relaxed group/item hover:text-white transition-colors">
                                  <CheckCircle className="w-6 h-6 text-cyan-400 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform" />
                                  <span>{remedy}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Disclaimer */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
              <div className="relative rounded-3xl bg-yellow-900/10 border-2 border-yellow-500/30 p-8 backdrop-blur-xl">
                <div className="flex items-start gap-5">
                  <AlertCircle className="w-7 h-7 text-yellow-400 mt-1 flex-shrink-0 animate-pulse" />
                  <div>
                    <h4 className="font-black text-yellow-400 mb-3 text-lg uppercase tracking-wider">Medical Disclaimer</h4>
                    <p className="text-purple-100/60 leading-relaxed">
                      {results.disclaimer}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center pt-8">
              <button
                onClick={resetAnalysis}
                className="group relative px-14 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl font-black text-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative text-white">ANALYZE ANOTHER</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(20px, -20px); }
        }
        
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 15s ease-in-out infinite;
        }
        
        .animate-scan-line {
          animation: scan-line 3s linear infinite;
        }
        
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s linear infinite;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
