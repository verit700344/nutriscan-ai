import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, CheckCircle, Pill, Apple, Info, Heart, Brain, Activity, Shield, Zap } from 'lucide-react';

export default function NutritionalDeficiencyDetector() {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

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
      }, 1500);
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalyzing(false);
      setResults({
        deficiencies: [],
        generalObservations: "Unable to analyze the image. Please try another image.",
        disclaimer: "This tool is for educational purposes only. Consult a healthcare professional."
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
      case 'high': return 'from-red-500 to-orange-500';
      case 'medium': return 'from-yellow-500 to-amber-500';
      case 'low': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-7xl md:text-8xl font-black mb-6 bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent">
            NutriScan AI
          </h1>
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
            <p className="text-sm font-semibold tracking-widest uppercase text-indigo-300">
              AI-Powered Health Analysis
            </p>
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Advanced computer vision for nutritional deficiency detection
          </p>
        </div>

        {/* Main Content */}
        {!image ? (
          /* Upload Area */
          <div 
            className={`relative transition-all duration-500 ${dragActive ? 'scale-105' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={`
              relative rounded-3xl border backdrop-blur-xl cursor-pointer p-16 text-center
              transition-all duration-500
              ${dragActive 
                ? 'border-indigo-400/50 bg-indigo-500/10 shadow-2xl shadow-indigo-500/30' 
                : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
              }
            `}
            onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleChange}
              />
              
              <div className="inline-flex items-center justify-center w-28 h-28 mb-8 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/20">
                <Upload className="w-14 h-14 text-indigo-300" />
              </div>
              
              <h3 className="text-3xl font-bold mb-4">
                {dragActive ? 'Drop your image here' : 'Upload an Image'}
              </h3>
              <p className="text-slate-400 mb-8">
                Drag and drop or click to select<br/>
                <span className="text-sm">Supports: JPG, PNG, WebP</span>
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105">
                  Choose File
                </button>
                <button className="px-8 py-4 bg-white/10 border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Take Photo
                </button>
              </div>
            </div>
          </div>
        ) : !results && !analyzing ? (
          /* Image Preview */
          <div className="space-y-6">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
              <img 
                src={image} 
                alt="Preview" 
                className="w-full max-h-96 object-contain bg-black/50"
              />
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={analyzeImage}
                className="px-10 py-5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-6 h-6" />
                Analyze with AI
              </button>
              <button
                onClick={resetAnalysis}
                className="px-10 py-5 bg-white/10 border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300"
              >
                Choose Different
              </button>
            </div>
          </div>
        ) : analyzing ? (
          /* Loading */
          <div className="text-center py-24">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 rounded-full border-4 border-white/5" />
              <div className="w-32 h-32 rounded-full border-4 border-t-indigo-400 border-r-purple-400 border-b-transparent border-l-transparent absolute top-0 left-0 animate-spin" />
              <Sparkles className="w-12 h-12 text-indigo-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
              Analyzing Image...
            </h3>
            <p className="text-slate-400">AI is processing your image</p>
          </div>
        ) : results && (
          /* Results */
          <div className="space-y-8">
            {/* General Observations */}
            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <Info className="w-6 h-6 text-indigo-300" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-3 text-indigo-200">Analysis Summary</h3>
                  <p className="text-slate-300 leading-relaxed">{results.generalObservations}</p>
                </div>
              </div>
            </div>

            {/* Deficiencies */}
            {results.deficiencies && results.deficiencies.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-indigo-200 to-purple-200 bg-clip-text text-transparent">
                  Detected Deficiencies
                </h2>
                
                {results.deficiencies.map((def, idx) => (
                  <div 
                    key={idx}
                    className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden hover:bg-white/10 transition-all duration-500"
                  >
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${confidenceColor(def.confidence)} p-6`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center">
                            <Pill className="w-6 h-6" />
                          </div>
                          <h3 className="text-2xl font-bold">{def.nutrient}</h3>
                        </div>
                        <span className="px-4 py-2 bg-black/30 rounded-full text-sm font-bold uppercase">
                          {def.confidence} confidence
                        </span>
                      </div>
                    </div>

                    <div className="p-8 space-y-6">
                      {/* Symptoms */}
                      {def.symptoms && def.symptoms.length > 0 && (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <h4 className="text-lg font-bold text-red-300">Observed Symptoms</h4>
                          </div>
                          <ul className="space-y-2">
                            {def.symptoms.map((symptom, i) => (
                              <li key={i} className="flex items-start gap-3 text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2" />
                                <span>{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Causes */}
                      {def.causes && def.causes.length > 0 && (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <Info className="w-5 h-5 text-yellow-400" />
                            <h4 className="text-lg font-bold text-yellow-300">Common Causes</h4>
                          </div>
                          <ul className="space-y-2">
                            {def.causes.map((cause, i) => (
                              <li key={i} className="flex items-start gap-3 text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2" />
                                <span>{cause}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Food Sources */}
                      {def.foodSources && def.foodSources.length > 0 && (
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            <Apple className="w-5 h-5 text-green-400" />
                            <h4 className="text-lg font-bold text-green-300">Rich Food Sources</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {def.foodSources.map((food, i) => (
                              <span 
                                key={i}
                                className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-sm font-medium text-green-300"
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
                            <CheckCircle className="w-5 h-5 text-cyan-400" />
                            <h4 className="text-lg font-bold text-cyan-300">Recommended Actions</h4>
                          </div>
                          <ul className="space-y-2">
                            {def.remedies.map((remedy, i) => (
                              <li key={i} className="flex items-start gap-3 text-slate-300">
                                <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5" />
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
              <div className="text-center py-12 bg-green-900/20 border border-green-500/30 rounded-3xl">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-300 mb-2">No Deficiencies Detected</h3>
                <p className="text-slate-300">The analysis didn't identify any clear signs.</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="rounded-3xl bg-yellow-900/20 border border-yellow-500/30 p-6 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-400 mt-1" />
                <div>
                  <h4 className="font-bold text-yellow-300 mb-2">Medical Disclaimer</h4>
                  <p className="text-slate-300 text-sm">
                    {results.disclaimer}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center pt-6">
              <button
                onClick={resetAnalysis}
                className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 hover:scale-105"
              >
                Analyze Another Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
