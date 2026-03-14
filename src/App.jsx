import React, { useState, useRef } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, CheckCircle, Pill, Apple, Droplet, Info } from 'lucide-react';

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
      // Extract base64 data from data URL
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1];

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "image",
                  source: {
                    type: "base64",
                    media_type: mimeType,
                    data: base64Data
                  }
                },
                {
                  type: "text",
                  text: `Analyze this image for signs of nutritional deficiencies. Look for visual indicators in skin, hair, nails, eyes, or any visible symptoms. 

Respond ONLY with a JSON object (no markdown, no preamble) in this exact format:
{
  "deficiencies": [
    {
      "nutrient": "Vitamin name or mineral",
      "confidence": "high/medium/low",
      "symptoms": ["symptom1", "symptom2"],
      "causes": ["cause1", "cause2"],
      "remedies": ["remedy1", "remedy2"],
      "foodSources": ["food1", "food2", "food3"]
    }
  ],
  "generalObservations": "Brief overall assessment",
  "disclaimer": "Medical disclaimer"
}`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();
      const textContent = data.content.find(item => item.type === "text")?.text || "";
      
      // Clean up response and parse JSON
      const cleanedText = textContent.replace(/```json\n?|\n?```/g, '').trim();
      const analysisResults = JSON.parse(cleanedText);
      
      // Simulate processing time for better UX
      setTimeout(() => {
        setResults(analysisResults);
        setAnalyzing(false);
      }, 1500);
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
      case 'high': return 'from-red-500 to-orange-500';
      case 'medium': return 'from-yellow-500 to-amber-500';
      case 'low': return 'from-blue-500 to-cyan-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <div className="inline-flex items-center gap-3 mb-4 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-full border border-purple-500/30 backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-sm font-semibold tracking-wider uppercase text-cyan-300">AI-Powered Analysis</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-4 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent leading-tight">
            NutriScan AI
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Upload a photo to detect potential nutritional deficiencies using advanced AI vision technology
          </p>
        </div>

        {/* Main Content Area */}
        {!image ? (
          /* Upload Area */
          <div 
            className={`relative group transition-all duration-500 ${dragActive ? 'scale-105' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className={`
              relative overflow-hidden rounded-3xl border-2 border-dashed p-16 text-center cursor-pointer
              transition-all duration-500 backdrop-blur-xl
              ${dragActive 
                ? 'border-cyan-400 bg-cyan-500/10 shadow-lg shadow-cyan-500/50' 
                : 'border-purple-500/30 bg-white/5 hover:border-purple-400/50 hover:bg-white/10'
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
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 p-0.5 group-hover:scale-110 transition-transform duration-300">
                  <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center">
                    {dragActive ? (
                      <Droplet className="w-12 h-12 text-cyan-400 animate-bounce" />
                    ) : (
                      <Upload className="w-12 h-12 text-purple-400" />
                    )}
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold mb-3">
                  {dragActive ? 'Drop your image here' : 'Upload an Image'}
                </h3>
                <p className="text-gray-400 mb-6">
                  Drag and drop or click to select<br/>
                  <span className="text-sm">Supports: JPG, PNG, WebP</span>
                </p>
                
                <div className="flex items-center justify-center gap-4 flex-wrap">
                  <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105">
                    Choose File
                  </button>
                  <button className="px-6 py-3 bg-white/10 border border-white/20 rounded-full font-semibold hover:bg-white/20 transition-all duration-300">
                    <Camera className="w-5 h-5 inline mr-2" />
                    Take Photo
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : !results && !analyzing ? (
          /* Image Preview */
          <div className="space-y-6 animate-fadeIn">
            <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl shadow-purple-500/20">
              <img 
                src={image} 
                alt="Preview" 
                className="w-full max-h-96 object-contain bg-black/50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button
                onClick={analyzeImage}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                Analyze with AI
              </button>
              <button
                onClick={resetAnalysis}
                className="px-8 py-4 bg-white/10 border border-white/20 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300"
              >
                Choose Different Image
              </button>
            </div>
          </div>
        ) : analyzing ? (
          /* Loading Animation */
          <div className="text-center py-20 animate-fadeIn">
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 rounded-full border-4 border-purple-500/20"></div>
              <div className="w-32 h-32 rounded-full border-4 border-t-cyan-400 border-r-purple-400 border-b-pink-400 border-l-transparent absolute top-0 left-0 animate-spin"></div>
              <Sparkles className="w-12 h-12 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
            </div>
            <h3 className="text-3xl font-bold mb-4 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">
              Analyzing Image...
            </h3>
            <p className="text-gray-400 animate-pulse">
              Our AI is examining visual indicators of nutritional health
            </p>
          </div>
        ) : results && (
          /* Results Display */
          <div className="space-y-6 animate-fadeIn">
            {/* General Observations */}
            <div className="bg-gradient-to-br from-purple-900/30 to-cyan-900/30 border border-purple-500/30 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <Info className="w-6 h-6 text-cyan-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold mb-2 text-cyan-300">General Assessment</h3>
                  <p className="text-gray-300 leading-relaxed">{results.generalObservations}</p>
                </div>
              </div>
            </div>

            {/* Deficiencies */}
            {results.deficiencies && results.deficiencies.length > 0 ? (
              <div className="grid gap-6">
                <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-300 to-cyan-300 bg-clip-text text-transparent">
                  Detected Deficiencies
                </h2>
                
                {results.deficiencies.map((def, idx) => (
                  <div 
                    key={idx}
                    className="bg-gradient-to-br from-slate-900/80 to-purple-900/30 border border-purple-500/30 rounded-2xl overflow-hidden backdrop-blur-xl hover:shadow-xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-[1.02]"
                    style={{animationDelay: `${idx * 150}ms`}}
                  >
                    {/* Header */}
                    <div className={`bg-gradient-to-r ${confidenceColor(def.confidence)} p-6`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Pill className="w-8 h-8" />
                          <h3 className="text-2xl font-bold">{def.nutrient}</h3>
                        </div>
                        <span className="px-4 py-2 bg-black/30 rounded-full text-sm font-semibold uppercase tracking-wider backdrop-blur-sm">
                          {def.confidence} confidence
                        </span>
                      </div>
                    </div>

                    <div className="p-6 space-y-6">
                      {/* Symptoms */}
                      {def.symptoms && def.symptoms.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                            <h4 className="text-lg font-bold text-red-300">Observed Symptoms</h4>
                          </div>
                          <ul className="space-y-2">
                            {def.symptoms.map((symptom, i) => (
                              <li key={i} className="flex items-start gap-3 text-gray-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0"></span>
                                <span>{symptom}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Causes */}
                      {def.causes && def.causes.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Info className="w-5 h-5 text-yellow-400" />
                            <h4 className="text-lg font-bold text-yellow-300">Common Causes</h4>
                          </div>
                          <ul className="space-y-2">
                            {def.causes.map((cause, i) => (
                              <li key={i} className="flex items-start gap-3 text-gray-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 flex-shrink-0"></span>
                                <span>{cause}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Food Sources */}
                      {def.foodSources && def.foodSources.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <Apple className="w-5 h-5 text-green-400" />
                            <h4 className="text-lg font-bold text-green-300">Rich Food Sources</h4>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {def.foodSources.map((food, i) => (
                              <span 
                                key={i}
                                className="px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full text-sm font-medium text-green-300 hover:bg-green-500/30 transition-colors duration-300"
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
                          <div className="flex items-center gap-2 mb-3">
                            <CheckCircle className="w-5 h-5 text-cyan-400" />
                            <h4 className="text-lg font-bold text-cyan-300">Recommended Actions</h4>
                          </div>
                          <ul className="space-y-2">
                            {def.remedies.map((remedy, i) => (
                              <li key={i} className="flex items-start gap-3 text-gray-300">
                                <CheckCircle className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
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
              <div className="text-center py-12 bg-gradient-to-br from-green-900/30 to-cyan-900/30 border border-green-500/30 rounded-2xl backdrop-blur-xl">
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-300 mb-2">No Deficiencies Detected</h3>
                <p className="text-gray-300">The analysis didn't identify any clear signs of nutritional deficiencies.</p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-xl">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-yellow-400 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-yellow-300 mb-2">Medical Disclaimer</h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {results.disclaimer}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="text-center pt-6">
              <button
                onClick={resetAnalysis}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-bold text-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 hover:scale-105"
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
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
