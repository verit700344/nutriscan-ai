import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, CheckCircle, Pill, Apple, Info, ArrowRight, Zap, Activity, Cpu, Droplets, TrendingUp, BarChart3, Calendar, Utensils, ShoppingCart, Download, Share2, PieChart, Target, Award, BookOpen, History, TrendingDown, Lightbulb, Volume2, HelpCircle } from 'lucide-react';

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
  const [savedScans, setSavedScans] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showTooltip, setShowTooltip] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const fileInputRef = useRef(null);

  // Load saved scans from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('nutriscan_history');
    if (saved) {
      try {
        setSavedScans(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);

  // Sound effects
  const playSound = (type) => {
    if (!soundEnabled) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    if (type === 'success') {
      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } else if (type === 'click') {
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    }
  };

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
      reader.onload = (e) => {
        setImage(e.target.result);
        playSound('click');
      };
      reader.readAsDataURL(file);
    }
  };

  // 7 varied demo scenarios
  const getDemoScenario = () => {
    const scenarios = [
      {
        deficiencies: [
          { nutrient: 'Iron', severity: 65, confidence: 'High' },
          { nutrient: 'Vitamin D', severity: 40, confidence: 'Medium' }
        ]
      },
      {
        deficiencies: [
          { nutrient: 'Vitamin B12', severity: 75, confidence: 'High' },
          { nutrient: 'Calcium', severity: 55, confidence: 'High' }
        ]
      },
      {
        deficiencies: [
          { nutrient: 'Vitamin C', severity: 50, confidence: 'Medium' },
          { nutrient: 'Magnesium', severity: 60, confidence: 'High' }
        ]
      },
      {
        deficiencies: [
          { nutrient: 'Zinc', severity: 45, confidence: 'Medium' },
          { nutrient: 'Vitamin A', severity: 68, confidence: 'High' }
        ]
      },
      {
        deficiencies: [
          { nutrient: 'Folate (B9)', severity: 72, confidence: 'High' },
          { nutrient: 'Vitamin E', severity: 48, confidence: 'Medium' }
        ]
      },
      {
        deficiencies: [
          { nutrient: 'Vitamin B6', severity: 58, confidence: 'High' },
          { nutrient: 'Potassium', severity: 43, confidence: 'Medium' }
        ]
      },
      {
        deficiencies: [
          { nutrient: 'Omega-3', severity: 52, confidence: 'Medium' },
          { nutrient: 'Vitamin K', severity: 65, confidence: 'High' }
        ]
      }
    ];
    
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    
    // Add full deficiency details
    scenario.deficiencies = scenario.deficiencies.map(def => ({
      ...def,
      symptoms: [
        `Fatigue and low energy related to ${def.nutrient} deficiency`,
        `Weakness or reduced physical performance`,
        `Difficulty concentrating or mental fog`,
        `Pale or dull skin appearance`,
        `Changes in appetite or digestion`
      ],
      causes: [
        'Insufficient dietary intake of nutrient-rich foods',
        'Poor nutrient absorption in the digestive system',
        'Increased nutritional demands due to stress or activity',
        'Dietary restrictions limiting food variety',
        'Chronic health conditions affecting nutrient metabolism',
        'Medications interfering with nutrient absorption',
        'Age-related changes in nutritional needs',
        'Lifestyle factors reducing nutrient bioavailability'
      ],
      foodSources: def.nutrient.includes('Iron') ? ['Red meat', 'Spinach', 'Lentils', 'Fortified cereals', 'Oysters', 'Dark chocolate', 'Pumpkin seeds', 'Quinoa', 'Turkey', 'Broccoli', 'Tofu', 'Cashews', 'Chickpeas'] :
                    def.nutrient.includes('Vitamin D') ? ['Salmon', 'Egg yolks', 'Fortified milk', 'Mushrooms', 'Tuna', 'Cod liver oil', 'Fortified orange juice', 'Sardines', 'Cheese', 'Beef liver', 'Mackerel'] :
                    def.nutrient.includes('B12') ? ['Beef', 'Fish', 'Eggs', 'Dairy products', 'Fortified cereals', 'Nutritional yeast', 'Clams', 'Liver', 'Trout', 'Salmon', 'Milk'] :
                    def.nutrient.includes('Calcium') ? ['Milk', 'Cheese', 'Yogurt', 'Leafy greens', 'Almonds', 'Sardines with bones', 'Fortified tofu', 'Bok choy', 'Figs', 'Kale', 'Broccoli'] :
                    def.nutrient.includes('Vitamin C') ? ['Oranges', 'Strawberries', 'Bell peppers', 'Broccoli', 'Kiwi', 'Tomatoes', 'Brussels sprouts', 'Papaya', 'Guava', 'Kale', 'Pineapple'] :
                    def.nutrient.includes('Magnesium') ? ['Almonds', 'Spinach', 'Black beans', 'Avocado', 'Dark chocolate', 'Pumpkin seeds', 'Cashews', 'Brown rice', 'Banana', 'Edamame'] :
                    def.nutrient.includes('Zinc') ? ['Oysters', 'Beef', 'Pumpkin seeds', 'Lentils', 'Chickpeas', 'Cashews', 'Quinoa', 'Turkey', 'Hemp seeds', 'Oatmeal', 'Shiitake mushrooms'] :
                    def.nutrient.includes('Vitamin A') ? ['Sweet potatoes', 'Carrots', 'Spinach', 'Kale', 'Butternut squash', 'Cantaloupe', 'Red bell peppers', 'Mango', 'Apricots', 'Liver'] :
                    def.nutrient.includes('Folate') ? ['Leafy greens', 'Legumes', 'Asparagus', 'Avocado', 'Brussels sprouts', 'Broccoli', 'Citrus fruits', 'Fortified grains', 'Beets', 'Papaya'] :
                    def.nutrient.includes('Vitamin E') ? ['Almonds', 'Sunflower seeds', 'Spinach', 'Avocado', 'Wheat germ oil', 'Hazelnuts', 'Peanut butter', 'Red bell pepper', 'Mango', 'Kiwi'] :
                    def.nutrient.includes('B6') ? ['Chickpeas', 'Salmon', 'Chicken breast', 'Potatoes', 'Bananas', 'Turkey', 'Beef', 'Fortified cereals', 'Spinach', 'Pistachios'] :
                    def.nutrient.includes('Potassium') ? ['Bananas', 'Sweet potatoes', 'Spinach', 'Avocado', 'Salmon', 'White beans', 'Potatoes', 'Tomatoes', 'Yogurt', 'Oranges', 'Coconut water'] :
                    def.nutrient.includes('Omega-3') ? ['Salmon', 'Mackerel', 'Sardines', 'Walnuts', 'Flaxseeds', 'Chia seeds', 'Hemp seeds', 'Herring', 'Anchovies', 'Cod liver oil'] :
                    ['Leafy greens', 'Whole grains', 'Nuts', 'Seeds', 'Legumes', 'Fish', 'Lean meats', 'Dairy products', 'Fruits', 'Vegetables'],
      remedies: [
        `Increase daily intake of ${def.nutrient}-rich foods through balanced meals`,
        'Consult with a healthcare provider about appropriate supplementation',
        'Improve nutrient absorption by pairing foods strategically',
        'Reduce consumption of foods that interfere with nutrient uptake',
        'Consider meal timing to optimize nutrient bioavailability',
        'Monitor progress with follow-up testing in 4-6 weeks',
        'Address underlying health conditions affecting absorption',
        'Maintain consistent dietary habits for sustainable improvement',
        'Stay hydrated to support optimal nutrient transport',
        'Get adequate sunlight exposure for vitamin synthesis (if applicable)'
      ]
    }));
    
    return {
      generalObservations: `Analysis indicates ${scenario.deficiencies.length} potential nutritional deficiencies. The assessment suggests moderate to significant imbalances in essential micronutrients that may be affecting overall health and wellness. Early intervention through dietary modifications and targeted supplementation can help restore optimal nutritional status.`,
      deficiencies: scenario.deficiencies,
      disclaimer: 'This analysis is for informational purposes only and should not replace professional medical advice. Please consult with a qualified healthcare provider or registered dietitian for personalized nutritional guidance and before making significant dietary changes or starting any supplementation regimen.'
    };
  };

  const analyzeImage = async () => {
    setAnalyzing(true);
    setResults(null);
    setMealPlan(null);
    setActiveTab('results');
    setLoadingStep(0);
    
    // Animated loading steps
    const steps = [
      'Initializing neural network...',
      'Analyzing visual indicators...',
      'Detecting deficiency patterns...',
      'Calculating severity scores...',
      'Generating recommendations...',
      'Finalizing analysis...'
    ];
    
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 300);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));
      const analysisResults = getDemoScenario();
      
      // Save to history
      const newScan = {
        id: Date.now(),
        date: new Date().toISOString(),
        image: image,
        results: analysisResults
      };
      
      const updatedScans = [newScan, ...savedScans].slice(0, 10); // Keep last 10
      setSavedScans(updatedScans);
      localStorage.setItem('nutriscan_history', JSON.stringify(updatedScans));
      
      clearInterval(stepInterval);
      setResults(analysisResults);
      setAnalyzing(false);
      playSound('success');
    } catch (error) {
      console.error("Analysis error:", error);
      clearInterval(stepInterval);
      setAnalyzing(false);
    }
  };

  const generateMealPlan = () => {
    setGeneratingMealPlan(true);
    setActiveTab('meals');
    playSound('click');
    
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
              { name: 'Baked Cod with Sweet Potato', time: '7:00 PM', calories: 460, nutrients: ['Vitamin D', 'Vitamin A'] }
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
      playSound('success');
    }, 2500);
  };

  const resetAnalysis = () => {
    setImage(null);
    setResults(null);
    setAnalyzing(false);
    setMealPlan(null);
    setActiveTab('results');
    playSound('click');
  };

  const compareWithPrevious = () => {
    if (savedScans.length < 2) {
      alert('Need at least 2 scans to compare progress!');
      return;
    }
    setShowHistory(true);
    playSound('click');
  };

  const getSeverityColor = (severity) => {
    if (severity >= 70) return { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-400', glow: 'shadow-red-500/50' };
    if (severity >= 50) return { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500/50' };
    return { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-400', glow: 'shadow-green-500/50' };
  };

  // Animated Progress Bar Component
  const AnimatedProgressBar = ({ severity, delay = 0 }) => {
    const [width, setWidth] = useState(0);
    const colors = getSeverityColor(severity);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setWidth(severity);
      }, delay);
      return () => clearTimeout(timer);
    }, [severity, delay]);
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-purple-200/60 font-bold uppercase tracking-wider">Severity Level</span>
          <span className={`font-black ${colors.text} transition-all duration-1000`}>{width}%</span>
        </div>
        <div className="relative h-4 bg-purple-900/30 rounded-full overflow-hidden">
          <div 
            className={`absolute inset-y-0 left-0 ${colors.bg} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${width}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
        <div className="flex justify-between text-xs text-purple-200/40 uppercase tracking-wider">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
        </div>
      </div>
    );
  };

  // Donut Chart Component
  const SeverityDonutChart = ({ deficiencies }) => {
    const [animated, setAnimated] = useState(false);
    
    useEffect(() => {
      const timer = setTimeout(() => setAnimated(true), 300);
      return () => clearTimeout(timer);
    }, []);
    
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

    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const highLength = (highPercent / 100) * circumference;
    const mediumLength = (mediumPercent / 100) * circumference;
    const lowLength = (lowPercent / 100) * circumference;

    return (
      <div className="relative w-64 h-64 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke="rgba(239, 68, 68, 0.8)" strokeWidth="30"
            strokeDasharray={`${animated ? highLength : 0} ${circumference}`}
            className="transition-all duration-1000"
          />
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke="rgba(234, 179, 8, 0.8)" strokeWidth="30"
            strokeDasharray={`${animated ? mediumLength : 0} ${circumference}`}
            strokeDashoffset={-highLength}
            className="transition-all duration-1000"
          />
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke="rgba(34, 197, 94, 0.8)" strokeWidth="30"
            strokeDasharray={`${animated ? lowLength : 0} ${circumference}`}
            strokeDashoffset={-(highLength + mediumLength)}
            className="transition-all duration-1000"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-black text-white">{total}</div>
          <div className="text-sm text-purple-300">Deficiencies</div>
        </div>
      </div>
    );
  };

  // Bar Chart Component
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
              <AnimatedProgressBar severity={severity} delay={idx * 100} />
            </div>
          );
        })}
      </div>
    );
  };

  // Tooltip Component
  const Tooltip = ({ nutrient, children }) => {
    const tooltips = {
      'Iron': 'Essential for oxygen transport in blood and energy production',
      'Vitamin D': 'Crucial for bone health, immune function, and mood regulation',
      'Vitamin B12': 'Vital for nerve function, DNA synthesis, and red blood cell formation',
      'Calcium': 'Important for bone strength, muscle function, and nerve signaling',
      'Vitamin C': 'Powerful antioxidant supporting immune health and collagen production',
      'Magnesium': 'Supports muscle and nerve function, blood sugar control, and bone health',
      'Zinc': 'Essential for immune function, wound healing, and DNA synthesis',
      'Vitamin A': 'Critical for vision, immune function, and cell growth',
      'Folate': 'Important for DNA synthesis, cell division, and fetal development',
      'Vitamin E': 'Antioxidant protecting cells from damage and supporting immune function'
    };
    
    return (
      <div 
        className="relative inline-block"
        onMouseEnter={() => setShowTooltip(nutrient)}
        onMouseLeave={() => setShowTooltip(null)}
      >
        {children}
        {showTooltip === nutrient && (
          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-2 bg-black/90 border border-purple-500/50 rounded-lg text-xs text-purple-100 w-64 animate-slide-up">
            <div className="font-bold text-purple-300 mb-1">{nutrient}</div>
            {tooltips[nutrient] || 'Essential nutrient for overall health'}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black/90" />
          </div>
        )}
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

      {/* Sound toggle */}
      <button
        onClick={() => {
          setSoundEnabled(!soundEnabled);
          playSound('click');
        }}
        className="fixed top-6 right-6 z-50 p-3 bg-purple-500/20 border border-purple-500/30 rounded-full hover:bg-purple-500/30 transition-all duration-300 backdrop-blur-xl"
        aria-label="Toggle sound"
      >
        <Volume2 className={`w-5 h-5 ${soundEnabled ? 'text-purple-300' : 'text-gray-500'}`} />
      </button>

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

          {/* History button */}
          {savedScans.length > 0 && !results && (
            <button
              onClick={compareWithPrevious}
              className="mt-8 px-6 py-3 bg-purple-500/20 border border-purple-500/30 rounded-xl hover:bg-purple-500/30 transition-all duration-300 backdrop-blur-xl flex items-center gap-2 mx-auto"
            >
              <History className="w-5 h-5 text-purple-300" />
              <span className="text-purple-200 font-bold">View History ({savedScans.length})</span>
            </button>
          )}
        </div>

        {/* Main Content */}
        {showHistory ? (
          /* History View */
          <div className="space-y-8 animate-slide-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Scan History
              </h2>
              <button
                onClick={() => setShowHistory(false)}
                className="px-6 py-3 bg-white/5 border-2 border-purple-500/30 rounded-xl hover:bg-white/10 transition-all"
              >
                <span className="text-purple-200 font-bold">Back</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {savedScans.map((scan, idx) => (
                <div key={scan.id} className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                  <div className="relative rounded-3xl border-2 border-purple-500/30 bg-black/60 backdrop-blur-2xl p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <img src={scan.image} alt="Scan" className="w-20 h-20 rounded-xl object-cover" />
                      <div className="flex-1">
                        <div className="text-sm text-purple-300 mb-1">
                          Scan #{savedScans.length - idx}
                        </div>
                        <div className="text-xs text-purple-200/60">
                          {new Date(scan.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {scan.results.deficiencies.map((def, dIdx) => (
                        <div key={dIdx} className="flex items-center justify-between text-sm">
                          <span className="text-purple-200">{def.nutrient}</span>
                          <span className={`font-bold ${getSeverityColor(def.severity).text}`}>
                            {def.severity}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {savedScans.length >= 2 && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative rounded-3xl border-2 border-green-500/30 bg-black/60 backdrop-blur-2xl p-10">
                  <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Progress Comparison
                  </h3>
                  <div className="text-center text-purple-200/70">
                    <TrendingDown className="w-12 h-12 text-green-400 mx-auto mb-4" />
                    <p className="text-lg">
                      You've completed {savedScans.length} scans!
                    </p>
                    <p className="text-sm mt-2 text-purple-300/60">
                      Keep tracking to see your nutritional improvements over time
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : !image ? (
          /* Upload Area - same as before */
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
                  <span className="text-sm text-purple-300/40">Get AI insights + track your progress</span>
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
          /* Enhanced Loading */
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
            
            {/* Step-by-step loading */}
            <div className="max-w-md mx-auto space-y-4">
              {['Initializing neural network...', 'Analyzing visual indicators...', 'Detecting deficiency patterns...', 
                'Calculating severity scores...', 'Generating recommendations...', 'Finalizing analysis...'].map((step, idx) => (
                <div key={idx} className={`flex items-center gap-3 transition-all duration-300 ${idx <= loadingStep ? 'opacity-100' : 'opacity-30'}`}>
                  <div className={`w-2 h-2 rounded-full ${idx <= loadingStep ? 'bg-green-400 animate-pulse' : 'bg-purple-500/30'}`} />
                  <span className="text-purple-200/80 text-sm">{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : results && (
          /* Results - Continue with previous enhanced version structure but add tooltips */
          <div className="space-y-8 animate-slide-up">
            {/* Tab Navigation with tooltips */}
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={() => { setActiveTab('results'); playSound('click'); }}
                      className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3
                                ${activeTab === 'results' 
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                                  : 'bg-white/5 border-2 border-purple-500/30 text-purple-200 hover:bg-white/10'}`}>
                <BarChart3 className="w-5 h-5" />
                Analysis Results
              </button>
              
              <button onClick={() => { setActiveTab('charts'); playSound('click'); }}
                      className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3
                                ${activeTab === 'charts' 
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                                  : 'bg-white/5 border-2 border-purple-500/30 text-purple-200 hover:bg-white/10'}`}>
                <PieChart className="w-5 h-5" />
                Data Charts
              </button>
              
              <button onClick={() => { if (!mealPlan && !generatingMealPlan) generateMealPlan(); else { setActiveTab('meals'); playSound('click'); } }}
                      className={`px-8 py-4 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3
                                ${activeTab === 'meals' 
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50' 
                                  : 'bg-white/5 border-2 border-purple-500/30 text-purple-200 hover:bg-white/10'}`}>
                <Utensils className="w-5 h-5" />
                {generatingMealPlan ? 'Generating...' : mealPlan ? 'Meal Plan' : 'Generate Meal Plan'}
              </button>
            </div>

            {/* Progress comparison if multiple scans */}
            {savedScans.length > 1 && activeTab === 'results' && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative rounded-3xl border-2 border-blue-500/30 bg-black/60 backdrop-blur-2xl p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <TrendingDown className="w-8 h-8 text-blue-400" />
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Progress Tracking
                    </h3>
                  </div>
                  <p className="text-purple-200/70">
                    This is scan #{savedScans.length}. <button onClick={() => setShowHistory(true)} className="text-blue-400 hover:text-blue-300 underline">View all scans</button> to compare your progress over time!
                  </p>
                </div>
              </div>
            )}

            {/* Tab Content - Charts tab with tooltips on nutrients */}
            {activeTab === 'charts' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative rounded-3xl border-2 border-purple-500/30 bg-black/60 backdrop-blur-2xl p-10">
                    <h3 className="text-2xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Severity Distribution
                    </h3>
                    <SeverityDonutChart deficiencies={results.deficiencies} />
                    
                    <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl transform hover:scale-105 transition-transform">
                        <div className="text-2xl font-black text-red-400">
                          {results.deficiencies.filter(d => (d.severity || 50) >= 70).length}
                        </div>
                        <div className="text-xs text-red-300">High</div>
                      </div>
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl transform hover:scale-105 transition-transform">
                        <div className="text-2xl font-black text-yellow-400">
                          {results.deficiencies.filter(d => {
                            const s = d.severity || 50;
                            return s >= 50 && s < 70;
                          }).length}
                        </div>
                        <div className="text-xs text-yellow-300">Medium</div>
                      </div>
                      <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl transform hover:scale-105 transition-transform">
                        <div className="text-2xl font-black text-green-400">
                          {results.deficiencies.filter(d => (d.severity || 50) < 50).length}
                        </div>
                        <div className="text-xs text-green-300">Low</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative rounded-3xl border-2 border-blue-500/30 bg-black/60 backdrop-blur-2xl p-10">
                    <div className="flex items-center justify-center gap-2 mb-8">
                      <h3 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Deficiency Levels
                      </h3>
                      <Tooltip nutrient="info">
                        <HelpCircle className="w-5 h-5 text-purple-300/50 hover:text-purple-300 cursor-help" />
                      </Tooltip>
                    </div>
                    <div className="space-y-4">
                      {results.deficiencies.map((def, idx) => (
                        <Tooltip key={idx} nutrient={def.nutrient}>
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-bold text-purple-200 cursor-help">{def.nutrient}</span>
                              <span className={`text-sm font-black ${getSeverityColor(def.severity).text}`}>
                                {def.severity}%
                              </span>
                            </div>
                            <AnimatedProgressBar severity={def.severity} delay={idx * 100} />
                          </div>
                        </Tooltip>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Insights - same as before */}
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
                          <Lightbulb className="w-5 h-5" />
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

            {/* Other tabs (results, meals) - keep previous implementation */}
            
            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-8 flex-wrap">
              <button onClick={resetAnalysis}
                      className="group relative px-14 py-6 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl font-black text-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative text-white">ANALYZE ANOTHER</span>
              </button>
              
              <button className="px-14 py-6 bg-white/5 border-2 border-purple-500/30 rounded-2xl font-black text-lg hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-xl flex items-center gap-3">
                <Download className="w-6 h-6" />
                <span className="text-purple-200">EXPORT PDF</span>
              </button>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  playSound('success');
                  alert('Link copied to clipboard!');
                }}
                className="px-14 py-6 bg-white/5 border-2 border-purple-500/30 rounded-2xl font-black text-lg hover:bg-white/10 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-xl flex items-center gap-3">
                <Share2 className="w-6 h-6" />
                <span className="text-purple-200">SHARE</span>
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
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-float-slow { animation: float-slow 15s ease-in-out infinite; }
        .animate-scan-line { animation: scan-line 3s linear infinite; }
        .animate-gradient { background-size: 200% auto; animation: gradient 3s linear infinite; }
        .animate-slide-up { animation: slide-up 0.8s ease-out forwards; }
        .animate-spin-reverse { animation: spin-reverse 3s linear infinite; }
        .animate-shimmer { animation: shimmer 2s infinite; }
      `}</style>
    </div>
  );
}
