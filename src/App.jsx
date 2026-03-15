import React, { useState, useRef, useEffect } from 'react';
import { Upload, Sparkles, AlertCircle, CheckCircle, Pill, Apple, Info, ArrowRight } from 'lucide-react';

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
      }, 1800);
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
    <div className="min-h-screen bg-[#0d0d11] text-[#b6bac5] relative overflow-hidden font-light">
      {/* Subtle grid background */}
      <div 
        className="fixed inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#b6bac5 1px, transparent 1px), linear-gradient(90deg, #b6bac5 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Chromatic aberration gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-10"
          style={{ 
            background: 'radial-gradient(circle, rgba(182, 186, 197, 0.3), transparent)',
            top: '5%',
            left: '10%',
            transform: `translateY(${scrollY * 0.3}px)`,
            filter: 'blur(120px) contrast(150%)'
          }}
        />
        <div 
          className="absolute w-[500px] h-[500px] rounded-full blur-[100px] opacity-10"
          style={{ 
            background: 'radial-gradient(circle, rgba(56, 62, 78, 0.4), transparent)',
            bottom: '10%',
            right: '5%',
            transform: `translateY(${scrollY * -0.2}px)`,
            filter: 'blur(100px) contrast(150%)'
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-8 py-24 max-w-6xl">
        {/* Minimal header */}
        <div className="mb-32 text-center">
          <div className="inline-block mb-8 px-6 py-2 border border-[#b6bac5]/10 rounded-full backdrop-blur-sm">
            <span className="text-xs uppercase tracking-[0.2em] text-[#b6bac5]/60">AI Health Analysis</span>
          </div>
          
          <h1 className="text-[clamp(3rem,8vw,7rem)] font-extralight mb-6 leading-[0.9] tracking-tight">
            <span className="block text-[#b6bac5]">NutriScan</span>
          </h1>
          
          <p className="text-lg text-[#b6bac5]/50 max-w-xl mx-auto font-extralight tracking-wide">
            Precision nutritional deficiency detection
          </p>
        </div>

        {/* Main Content */}
        {!image ? (
          /* Upload Area - Ice block aesthetic */
          <div 
            className="relative group"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div 
              className={`
                relative rounded-3xl cursor-pointer overflow-hidden
                transition-all duration-1000 ease-out
                border backdrop-blur-xl
                ${dragActive 
                  ? 'border-[#b6bac5]/30 bg-[#b6bac5]/[0.02] shadow-[0_0_80px_rgba(182,186,197,0.1)]' 
                  : 'border-[#b6bac5]/[0.08] bg-[#0d0d11]/40 hover:border-[#b6bac5]/[0.15] hover:bg-[#b6bac5]/[0.01]'
                }
              `}
              style={{
                boxShadow: dragActive 
                  ? '0 0 0 1px rgba(182,186,197,0.05), 0 20px 60px -10px rgba(182,186,197,0.1), inset 0 1px 0 rgba(182,186,197,0.1)' 
                  : '0 0 0 1px rgba(182,186,197,0.03), inset 0 1px 0 rgba(182,186,197,0.05)',
                transform: dragActive ? 'scale(1.01)' : 'scale(1)'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
              {/* Chromatic aberration effect */}
              <div 
                className="absolute inset-0 opacity-20 pointer-events-none mix-blend-screen"
                style={{
                  background: 'linear-gradient(135deg, rgba(182,186,197,0.1) 0%, transparent 50%, rgba(56,62,78,0.1) 100%)'
                }}
              />
              
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
              />
              
              <div className="relative p-32">
                {/* Ice-block icon container */}
                <div className="inline-flex items-center justify-center w-28 h-28 mb-12 rounded-2xl bg-[#b6bac5]/[0.03] border border-[#b6bac5]/10 backdrop-blur-xl group-hover:bg-[#b6bac5]/[0.05] transition-all duration-700">
                  <Upload className="w-14 h-14 text-[#b6bac5]/60 group-hover:text-[#b6bac5]/80 transition-colors duration-700" />
                </div>
                
                <h3 className="text-3xl font-extralight mb-4 text-[#b6bac5]/90 tracking-wide">
                  {dragActive ? 'Release to analyze' : 'Upload image'}
                </h3>
                
                <p className="text-base text-[#b6bac5]/40 mb-16 font-extralight tracking-wide">
                  Drop file or click to browse<br/>
                  <span className="text-sm text-[#b6bac5]/30">JPG, PNG, WebP supported</span>
                </p>
                
                <div className="flex items-center justify-center gap-4">
                  <button className="px-10 py-4 bg-[#b6bac5]/[0.08] border border-[#b6bac5]/20 rounded-2xl font-light hover:bg-[#b6bac5]/[0.12] hover:border-[#b6bac5]/30 transition-all duration-500 backdrop-blur-xl">
                    <span className="flex items-center gap-2 text-[#b6bac5]/90">
                      Select file
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : !results && !analyzing ? (
          /* Image Preview */
          <div className="space-y-8 animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden border border-[#b6bac5]/[0.08] shadow-[0_0_0_1px_rgba(182,186,197,0.03)] backdrop-blur-xl bg-[#0d0d11]/60">
              <img 
                src={image} 
                alt="Preview" 
                className="w-full max-h-[500px] object-contain opacity-90"
              />
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={analyzeImage}
                className="px-10 py-4 bg-[#b6bac5]/[0.08] border border-[#b6bac5]/20 rounded-2xl font-light hover:bg-[#b6bac5]/[0.12] transition-all duration-500 backdrop-blur-xl"
              >
                <span className="flex items-center gap-2 text-[#b6bac5]/90">
                  <Sparkles className="w-5 h-5" />
                  Analyze
                </span>
              </button>
              
              <button
                onClick={resetAnalysis}
                className="px-10 py-4 bg-transparent border border-[#b6bac5]/10 rounded-2xl font-light hover:border-[#b6bac5]/20 transition-all duration-500"
              >
                <span className="text-[#b6bac5]/70">Reset</span>
              </button>
            </div>
          </div>
        ) : analyzing ? (
          /* Loading - Minimal */
          <div className="text-center py-40 animate-fade-in">
            <div className="relative inline-block mb-12">
              <div className="w-32 h-32 rounded-full border border-[#b6bac5]/10" />
              <div className="w-32 h-32 rounded-full border border-t-[#b6bac5]/40 border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0 animate-spin" 
                   style={{ animationDuration: '2s' }} />
            </div>
            
            <h3 className="text-3xl font-extralight mb-4 text-[#b6bac5]/80 tracking-wide">
              Analyzing
            </h3>
            <p className="text-base text-[#b6bac5]/40 font-extralight">Processing data...</p>
          </div>
        ) : results && (
          /* Results - Ice block cards */
          <div className="space-y-6 animate-fade-in">
            {/* Summary */}
            <div className="rounded-3xl border border-[#b6bac5]/[0.08] bg-[#0d0d11]/40 backdrop-blur-xl p-10" 
                 style={{ boxShadow: '0 0 0 1px rgba(182,186,197,0.03), inset 0 1px 0 rgba(182,186,197,0.05)' }}>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 rounded-xl bg-[#b6bac5]/[0.05] border border-[#b6bac5]/10 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-[#b6bac5]/60" />
                </div>
                <div>
                  <h3 className="text-xl font-light mb-3 text-[#b6bac5]/90 tracking-wide">Summary</h3>
                  <p className="text-base text-[#b6bac5]/60 leading-relaxed font-extralight">{results.generalObservations}</p>
                </div>
              </div>
            </div>

            {/* Deficiencies */}
            {results.deficiencies && results.deficiencies.length > 0 && (
              <div className="space-y-6 mt-12">
                <h2 className="text-4xl font-extralight text-center text-[#b6bac5]/90 mb-8 tracking-wide">
                  Detected deficiencies
                </h2>
                
                {results.deficiencies.map((def, idx) => (
                  <div 
                    key={idx}
                    className="rounded-3xl border border-[#b6bac5]/[0.08] bg-[#0d0d11]/40 backdrop-blur-xl overflow-hidden hover:border-[#b6bac5]/[0.12] transition-all duration-700"
                    style={{ 
                      boxShadow: '0 0 0 1px rgba(182,186,197,0.03), inset 0 1px 0 rgba(182,186,197,0.05)',
                      animationDelay: `${idx * 100}ms` 
                    }}
                  >
                    {/* Header */}
                    <div className="bg-[#b6bac5]/[0.02] p-8 border-b border-[#b6bac5]/[0.08]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-xl bg-[#b6bac5]/[0.05] flex items-center justify-center">
                            <Pill className="w-6 h-6 text-[#b6bac5]/70" />
                          </div>
                          <h3 className="text-2xl font-light text-[#b6bac5]/90">{def.nutrient}</h3>
                        </div>
                        <span className="px-4 py-2 bg-[#b6bac5]/[0.05] border border-[#b6bac5]/10 rounded-full text-xs uppercase tracking-widest text-[#b6bac5]/60">
                          {def.confidence}
                        </span>
                      </div>
                    </div>

                    <div className="p-10 space-y-8">
                      {/* Symptoms */}
                      {def.symptoms && def.symptoms.length > 0 && (
                        <div>
                          <h4 className="text-sm uppercase tracking-[0.2em] mb-4 text-[#b6bac5]/50 font-light flex items-center gap-3">
                            <AlertCircle className="w-4 h-4" />
                            Symptoms
                          </h4>
                          <ul className="space-y-2">
                            {def.symptoms.map((symptom, i) => (
                              <li key={i} className="flex items-start gap-3 text-[#b6bac5]/70 text-sm font-extralight leading-relaxed">
                                <span className="w-1 h-1 rounded-full bg-[#b6bac5]/40 mt-2 flex-shrink-0" />
                                <span>{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Causes */}
                      {def.causes && def.causes.length > 0 && (
                        <div>
                          <h4 className="text-sm uppercase tracking-[0.2em] mb-4 text-[#b6bac5]/50 font-light flex items-center gap-3">
                            <Info className="w-4 h-4" />
                            Causes
                          </h4>
                          <ul className="space-y-2">
                            {def.causes.map((cause, i) => (
                              <li key={i} className="flex items-start gap-3 text-[#b6bac5]/70 text-sm font-extralight leading-relaxed">
                                <span className="w-1 h-1 rounded-full bg-[#b6bac5]/40 mt-2 flex-shrink-0" />
                                <span>{cause}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Food Sources */}
                      {def.foodSources && def.foodSources.length > 0 && (
                        <div>
                          <h4 className="text-sm uppercase tracking-[0.2em] mb-4 text-[#b6bac5]/50 font-light flex items-center gap-3">
                            <Apple className="w-4 h-4" />
                            Sources
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {def.foodSources.map((food, i) => (
                              <span 
                                key={i}
                                className="px-4 py-2 bg-[#b6bac5]/[0.03] border border-[#b6bac5]/10 rounded-full text-xs text-[#b6bac5]/70 font-light hover:bg-[#b6bac5]/[0.05] transition-colors duration-500"
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
                          <h4 className="text-sm uppercase tracking-[0.2em] mb-4 text-[#b6bac5]/50 font-light flex items-center gap-3">
                            <CheckCircle className="w-4 h-4" />
                            Actions
                          </h4>
                          <ul className="space-y-2">
                            {def.remedies.map((remedy, i) => (
                              <li key={i} className="flex items-start gap-3 text-[#b6bac5]/70 text-sm font-extralight leading-relaxed">
                                <CheckCircle className="w-4 h-4 text-[#b6bac5]/40 mt-0.5 flex-shrink-0" />
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
            )}

            {/* Disclaimer */}
            <div className="rounded-3xl bg-[#383e4e]/10 border border-[#b6bac5]/[0.08] p-8 mt-8">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-[#b6bac5]/40 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-light text-[#b6bac5]/70 mb-2 text-sm uppercase tracking-wider">Disclaimer</h4>
                  <p className="text-[#b6bac5]/50 text-sm leading-relaxed font-extralight">
                    {results.disclaimer}
                  </p>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="text-center pt-8">
              <button
                onClick={resetAnalysis}
                className="px-10 py-4 bg-[#b6bac5]/[0.08] border border-[#b6bac5]/20 rounded-2xl font-light hover:bg-[#b6bac5]/[0.12] transition-all duration-500 backdrop-blur-xl"
              >
                <span className="text-[#b6bac5]/90">Analyze another</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
