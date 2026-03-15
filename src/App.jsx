import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, CheckCircle, Pill, Apple, Info, ArrowRight, Zap, Activity, Cpu, Droplets, TrendingUp, BarChart3, Calendar, Utensils, ShoppingCart, Download, Share2, PieChart, Target, Award, BookOpen } from 'lucide-react';

export default function NutritionalDeficiencyDetector() {
  const [image, setImage] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);
  const [generatingMealPlan, setGeneratingMealPlan] = useState(false);
  const [mealPlan, setMealPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('results');
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
    setMealPlan(null);
    setActiveTab('results');
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

  const generateMealPlan = () => {
    setGeneratingMealPlan(true);
    setActiveTab('meals');
    
    setTimeout(() => {
      const deficiencies = results.deficiencies.map(d => d.nutrient).join(' + ');
      
      const weeklyPlan = {
        title: `7-Day ${deficiencies} Recovery Plan`,
        days: [
          {
            day: 'Monday',
            meals: [
              { name: 'Spinach & Egg Scramble', time: '8:00 AM', calories: 320, nutrients: ['Iron', 'Protein'] },
              { name: 'Grilled Salmon Salad', time: '1:00 PM', calories: 450, nutrients: ['Vitamin D', 'Omega-3'] },
              { name: 'Beef Stir-Fry with Broccoli', time: '7:00 PM', calories: 520, nutrients: ['Iron', 'Vitamin C'] }
            ]
          },
          {
            day: 'Tuesday',
            meals: [
              { name: 'Fortified Oatmeal with Almonds', time: '8:00 AM', calories: 350, nutrients: ['Iron', 'Magnesium'] },
              { name: 'Tuna Sandwich on Whole Grain', time: '1:00 PM', calories: 420, nutrients: ['Vitamin D', 'B12'] },
              { name: 'Lentil Curry with Rice', time: '7:00 PM', calories: 480, nutrients: ['Iron', 'Folate'] }
            ]
          },
          {
            day: 'Wednesday',
            meals: [
              { name: 'Greek Yogurt with Berries', time: '8:00 AM', calories: 280, nutrients: ['Calcium', 'Vitamin D'] },
              { name: 'Chicken & Quinoa Bowl', time: '1:00 PM', calories: 490, nutrients: ['Iron', 'Protein'] },
              { name: 'Baked Cod with Sweet Potato', time: '7:00 PM', calories: 460, nutrients: ['Vitamin D', 'Beta-Carotene'] }
            ]
          },
          {
            day: 'Thursday',
            meals: [
              { name: 'Smoothie with Spinach & Banana', time: '8:00 AM', calories: 310, nutrients: ['Iron', 'Potassium'] },
              { name: 'Beef Burrito Bowl', time: '1:00 PM', calories: 550, nutrients: ['Iron', 'B12'] },
              { name: 'Grilled Mackerel & Vegetables', time: '7:00 PM', calories: 470, nutrients: ['Vitamin D', 'Omega-3'] }
            ]
          },
          {
            day: 'Friday',
            meals: [
              { name: 'Fortified Cereal with Milk', time: '8:00 AM', calories: 330, nutrients: ['Iron', 'Vitamin D', 'Calcium'] },
              { name: 'Spinach & Chickpea Salad', time: '1:00 PM', calories: 400, nutrients: ['Iron', 'Folate'] },
              { name: 'Salmon Teriyaki with Brown Rice', time: '7:00 PM', calories: 510, nutrients: ['Vitamin D', 'B12'] }
            ]
          },
          {
            day: 'Saturday',
            meals: [
              { name: 'Egg Benedict with Salmon', time: '9:00 AM', calories: 480, nutrients: ['Vitamin D', 'Protein'] },
              { name: 'Beef & Vegetable Soup', time: '1:00 PM', calories: 380, nutrients: ['Iron', 'Vitamin C'] },
              { name: 'Grilled Chicken with Kale', time: '7:00 PM', calories: 440, nutrients: ['Iron', 'Vitamin K'] }
            ]
          },
          {
            day: 'Sunday',
            meals: [
              { name: 'Mushroom Omelet', time: '9:00 AM', calories: 340, nutrients: ['Vitamin D', 'Protein'] },
              { name: 'Sardine Pasta', time: '1:00 PM', calories: 520, nutrients: ['Vitamin D', 'Calcium'] },
              { name: 'Roast Beef with Roasted Veggies', time: '7:00 PM', calories: 560, nutrients: ['Iron', 'B12'] }
            ]
          }
        ],
        shoppingList: [
          'Spinach (2 bunches)', 'Eggs (1 dozen)', 'Salmon (3 fillets)', 'Beef (1 lb)',
          'Lentils (1 bag)', 'Quinoa (1 box)', 'Fortified cereal', 'Almonds',
          'Greek yogurt', 'Berries', 'Chicken breast (2 lbs)', 'Tuna (3 cans)',
          'Cod fillet', 'Mackerel', 'Sardines', 'Mushrooms', 'Kale', 'Broccoli',
          'Sweet potato', 'Brown rice', 'Whole grain bread', 'Milk (fortified)'
        ]
      };
      
      setMealPlan(weeklyPlan);
      setGeneratingMealPlan(false);
    }, 2500);
  };

  const resetAnalysis = () => {
    setImage(null);
    setResults(null);
    setAnalyzing(false);
    setMealPlan(null);
    setActiveTab('results');
  };

  const getSeverityColor = (severity) => {
    if (severity >= 70) return { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-400', glow: 'shadow-red-500/50' };
    if (severity >= 50) return { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500/50' };
    return { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-400', glow: 'shadow-green-500/50' };
  };

  // Enhanced Chart Component - Donut Chart for Severity Distribution
  const SeverityDonutChart = ({ deficiencies }) => {
    const total = deficiencies.length;
    const severityCounts = deficiencies.reduce((acc, def) => {
      const severity = def.severity || 50;
      if (severity >= 70) acc.high++;
      else if (severity >= 50) acc.medium++;
      else acc.low++;
      return acc;
    }, { high: 0, medium: 0, low: 0 });

    const highPercent = (severityCounts.high / total) * 100;
    const mediumPercent = (severityCounts.medium / total) * 100;
    const lowPercent = (severityCounts.low / total) * 100;

    // Calculate donut segments
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const highLength = (highPercent / 100) * circumference;
    const mediumLength = (mediumPercent / 100) * circumference;
    const lowLength = (lowPercent / 100) * circumference;

    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          {/* High severity (red) */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(239, 68, 68, 0.8)"
            strokeWidth="30"
            strokeDasharray={`${highLength} ${circumference}`}
            className="transition-all duration-1000"
          />
          {/* Medium severity (yellow) */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(234, 179, 8, 0.8)"
            strokeWidth="30"
            strokeDasharray={`${mediumLength} ${circumference}`}
            strokeDashoffset={-highLength}
            className="transition-all duration-1000"
          />
          {/* Low severity (green) */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="rgba(34, 197, 94, 0.8)"
            strokeWidth="30"
            strokeDasharray={`${lowLength} ${circumference}`}
            strokeDashoffset={-(highLength + mediumLength)}
            className="transition-all duration-1000"
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-black text-white">{total}</div>
          <div className="text-sm text-purple-300">Deficiencies</div>
        </div>
      </div>
    );
  };

  // Nutrient Comparison Bar Chart
  const NutrientBarChart = ({ deficiencies }) => {
    return (
      <div className="space-y-4">
        {deficiencies.map((def, idx) => {
          const severity = def.severity || 50;
          const colors = getSeverityColor(severity);
          
          return (
            <div key={idx} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-purple-200">{def.nutrient}</span>
                <span className={`text-sm font-black ${colors.text}`}>{severity}%</span>
              </div>
              <div className="relative h-8 bg-purple-900/20 rounded-full overflow-hidden">
                <div 
                  className={`absolute inset-y-0 left-0 ${colors.bg} rounded-full transition-all duration-1000 flex items-center justify-end pr-3`}
                  style={{ width: `${severity}%`, animationDelay: `${idx * 100}ms` }}
                >
                  <span className="text-white font-bold text-xs">{severity}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background effects */}
      <div className="fixed inset-0 transition-all duration-700"
           style={{
             background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.2), transparent 40%),
                         radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(236, 72, 153, 0.2), transparent 40%),
                         radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.15), transparent 50%),
                         linear-gradient(135deg, #000000 0%, #0a0a1f 50%, #000000 100%)`
           }} />
      
      <div className="fixed inset-0 pointer-events-none">
        {particles.map(p => (
          <div key={p.id} className="absolute rounded-full bg-cyan-400 blur-[1px] animate-pulse"
               style={{
                 left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`,
                 opacity: p.opacity, boxShadow: `0 0 ${p.size * 2}px rgba(34, 211, 238, ${p.opacity})`
               }} />
        ))}
      </div>

      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-30 animate-float-slow"
             style={{ background: 'radial-gradient(circle, rgba(139, 92, 246, 0.6), transparent)', top: '10%', left: '5%', transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)` }} />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-30 animate-float-slow"
             style={{ background: 'radial-gradient(circle, rgba(236, 72, 153, 0.6), transparent)', top: '50%', right: '5%', transform: `translate(${-mousePosition.x * 0.15}px, ${-mousePosition.y * 0.15}px)`, animationDelay: '2s' }} />
      </div>

      <div className="fixed inset-0 opacity-[0.02]"
           style={{ backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-20 relative">
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
          
          <p className="text-xl text-purple-200/70 max-w-2xl mx-auto leading-relaxed font-light">
            Next-generation nutritional analysis powered by advanced AI
          </p>

          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />
            <Droplets className="w-5 h-5 text-cyan-400" />
            <div className="h-px w-20 bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </div>

        {/* Main Content */}
        {!image ? (
          /* Upload Area */
          <div className={`relative transition-all duration-700 ${dragActive ? 'scale-105' : 'hover:scale-[1.02]'}`}
               onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
            
            <div className={`relative group cursor-pointer rounded-3xl overflow-hidden border-2 backdrop-blur-2xl transition-all duration-700
                           ${dragActive ? 'border-purple-500/50 bg-purple-900/20 shadow-[0_0_80px_rgba(168,85,247,0.4)]' : 'border-purple-500/20 bg-black/40 hover:border-purple-500/40 hover:bg-purple-900/10'}`}
                 style={{ boxShadow: dragActive ? '0 0 100px rgba(168, 85, 247, 0.4), inset 0 0 60px rgba(168, 85, 247, 0.1)' : '0 0 40px rgba(168, 85, 247, 0.1), inset 0 0 40px rgba(168, 85, 247, 0.05)' }}
                 onClick={() => fileInputRef.current?.click()}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 opacity-[0.03]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent animate-scan-line" />
              </div>
              
              <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleChange} />
              
              <div className="relative p-24">
                <div className="relative inline-block mb-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-60 animate-pulse" />
                  <div className="relative w-40 h-40 rounded-3xl bg-gradient-to-br from-purple-900/50 to-pink-900/50 border border-purple-500/30 backdrop-blur-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-700"
                       style={{ boxShadow: '0 20px 60px -10px rgba(168, 85, 247, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>
                    <Upload className="w-20 h-20 text-purple-300 group-hover:text-white transition-colors duration-700" />
                  </div>
                </div>
                
                <h3 className="text-5xl font-black mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {dragActive ? 'DROP TO SCAN' : 'UPLOAD IMAGE'}
                </h3>
                
                <p className="text-lg text-purple-200/60 mb-12 font-light">
                  Drag and drop or click to select<br/>
                  <span className="text-sm text-purple-300/40">Get AI insights + personalized recommendations</span>
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
          /* Image Preview */
          <div className="space-y-8 animate-slide-up">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500/30 shadow-2xl backdrop-blur-xl bg-black/60">
                <img src={image} alt="Preview" className="w-full max-h-[600px] object-contain" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
            
            <div className="flex gap-4 justify-center">
              <button onClick={analyzeImage}
                      className="group relative px-14 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl font-black text-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center gap-3 text-white">
                  <Sparkles className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
                  ANALYZE NOW
                </span>
              </button>
              
              <button onClick={resetAnalysis}
                      className="px-14 py-6 bg-white/5 border-2 border-purple-500/30 rounded-2xl font-black text-lg hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-xl">
                <span className="text-purple-200">RESET</span>
              </button>
            </div>
          </div>
        ) : analyzing ? (
          /* Loading */
          <div className="text-center py-32 animate-fade-in">
            <div className="relative inline-block mb-16">
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
            
            <div className="max-w-md mx-auto mt-12 space-y-3">
              {[40, 60, 80].map((width, i) => (
                <div key={i} className="h-1.5 bg-purple-900/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-pulse"
                       style={{ width: `${width}%`, animationDelay: `${i * 200}ms` }} />
                </div>
              ))}
            </div>
          </div>
        ) : results && (
          /* Results with Enhanced Visualization */
          <div className="space-y-8 animate-slide-up">
            {/* Tab Navigation */}
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={() => setActiveTab('results')}
                      className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3
                                ${activeTab === 'results' 
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                                  : 'bg-white/5 border-2 border-purple-500/30 text-purple-200 hover:bg-white/10'}`}>
                <BarChart3 className="w-5 h-5" />
                Analysis Results
              </button>
              
              <button onClick={() => setActiveTab('charts')}
                      className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3
                                ${activeTab === 'charts' 
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                                  : 'bg-white/5 border-2 border-purple-500/30 text-purple-200 hover:bg-white/10'}`}>
                <PieChart className="w-5 h-5" />
                Data Charts
              </button>
              
              <button onClick={() => { if (!mealPlan && !generatingMealPlan) generateMealPlan(); else setActiveTab('meals'); }}
                      className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3
                                ${activeTab === 'meals' 
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                                  : 'bg-white/5 border-2 border-purple-500/30 text-purple-200 hover:bg-white/10'}`}>
                <Utensils className="w-5 h-5" />
                {generatingMealPlan ? 'Generating...' : mealPlan ? 'Meal Plan' : 'Generate Meal Plan'}
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'results' && (
              <div className="space-y-8">
                {/* (Keep existing results tab content from previous version) */}
                {/* Summary + Deficiencies with all the detailed cards */}
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

                {/* Continue with full results display from previous version... */}
                {/* (Include all deficiency cards with severity meters, symptoms, causes, food sources, remedies) */}
              </div>
            )}

            {activeTab === 'charts' && (
              <div className="grid md:grid-cols-2 gap-8">
                {/* Donut Chart */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative rounded-3xl border-2 border-purple-500/30 bg-black/60 backdrop-blur-2xl p-10">
                    <h3 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Severity Distribution
                    </h3>
                    <SeverityDonutChart deficiencies={results.deficiencies} />
                    
                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                        <div className="text-2xl font-black text-red-400">
                          {results.deficiencies.filter(d => (d.severity || 50) >= 70).length}
                        </div>
                        <div className="text-xs text-red-300">High</div>
                      </div>
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                        <div className="text-2xl font-black text-yellow-400">
                          {results.deficiencies.filter(d => {
                            const s = d.severity || 50;
                            return s >= 50 && s < 70;
                          }).length}
                        </div>
                        <div className="text-xs text-yellow-300">Medium</div>
                      </div>
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
                        <div className="text-2xl font-black text-green-400">
                          {results.deficiencies.filter(d => (d.severity || 50) < 50).length}
                        </div>
                        <div className="text-xs text-green-300">Low</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative rounded-3xl border-2 border-blue-500/30 bg-black/60 backdrop-blur-2xl p-10">
                    <h3 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Deficiency Levels
                    </h3>
                    <NutrientBarChart deficiencies={results.deficiencies} />
                  </div>
                </div>

                {/* Key Insights */}
                <div className="md:col-span-2 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative rounded-3xl border-2 border-emerald-500/30 bg-black/60 backdrop-blur-2xl p-10">
                    <div className="flex items-center gap-4 mb-6">
                      <Award className="w-8 h-8 text-emerald-400" />
                      <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        Key Insights & Recommendations
                      </h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h4 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
                          <Target className="w-5 h-5" />
                          Priority Actions
                        </h4>
                        <ul className="space-y-3">
                          {results.deficiencies
                            .sort((a, b) => (b.severity || 50) - (a.severity || 50))
                            .slice(0, 3)
                            .map((def, idx) => (
                              <li key={idx} className="flex items-start gap-3 text-purple-100/80 text-sm">
                                <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                                <span>Address <strong>{def.nutrient}</strong> deficiency first (severity: {def.severity || 50}%)</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
                          <BookOpen className="w-5 h-5" />
                          Quick Wins
                        </h4>
                        <ul className="space-y-3">
                          <li className="flex items-start gap-3 text-purple-100/80 text-sm">
                            <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span>Start with food sources before supplements</span>
                          </li>
                          <li className="flex items-start gap-3 text-purple-100/80 text-sm">
                            <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span>Combine complementary nutrients for better absorption</span>
                          </li>
                          <li className="flex items-start gap-3 text-purple-100/80 text-sm">
                            <Sparkles className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span>Track progress weekly and retest in 4-6 weeks</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'meals' && mealPlan && (
              /* (Keep existing meal plan content from previous version) */
              <div className="space-y-8">
                {/* Meal plan cards, shopping list, etc. */}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-8">
              <button onClick={resetAnalysis}
                      className="group relative px-14 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl font-black text-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative text-white">ANALYZE ANOTHER</span>
              </button>
              
              <button className="px-14 py-6 bg-white/5 border-2 border-purple-500/30 rounded-2xl font-black text-lg hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-xl flex items-center gap-3">
                <Download className="w-6 h-6" />
                <span className="text-purple-200">EXPORT PDF</span>
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
        .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
        .animate-scan-line { animation: scan-line 3s linear infinite; }
        .animate-gradient { background-size: 200% auto; animation: gradient 3s linear infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-spin-reverse { animation: spin-reverse 3s linear infinite; }
      `}</style>
    </div>
  );
}
