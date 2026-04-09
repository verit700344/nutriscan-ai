import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Sparkles, AlertCircle, CheckCircle, Pill, Apple, Info, ArrowRight, Zap, Activity, Cpu, Droplets, TrendingUp, BarChart3, Calendar, Utensils, ShoppingCart, Download, Share2, PieChart, Target, Award, BookOpen, History, TrendingDown, Lightbulb, Volume2, HelpCircle, Video, X, Globe, MapPin } from 'lucide-react';

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
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [dietRegion, setDietRegion] = useState('global'); // 'global' or 'indian'
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load saved scans
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

  // Camera cleanup
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Sound effects
  const playSound = (type) => {
    if (!soundEnabled) return;
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      if (type === 'success') {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1);
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
    } catch (e) {
      console.error('Audio error:', e);
    }
  };

  // Particle system
  useEffect(() => {
    const newParticles = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.6 + 0.2
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

  // Camera functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'user',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Force video to play
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => console.error("Video play error:", err));
        };
      }
      
      setStream(mediaStream);
      setCameraActive(true);
      playSound('click');
    } catch (err) {
      console.error("Camera error:", err);
      alert("Unable to access camera. Please check permissions and ensure you're using HTTPS.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
    playSound('click');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
      const capturedImage = canvas.toDataURL('image/jpeg');
      setImage(capturedImage);
      stopCamera();
      playSound('success');
    }
  };

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

  // Generate demo scenario with TOP 4 deficiencies ranked by severity
  const getDemoScenario = () => {
    const allDeficiencies = [
      { nutrient: 'Iron', severity: Math.floor(Math.random() * 30) + 60 },
      { nutrient: 'Vitamin D', severity: Math.floor(Math.random() * 25) + 50 },
      { nutrient: 'Vitamin B12', severity: Math.floor(Math.random() * 35) + 55 },
      { nutrient: 'Calcium', severity: Math.floor(Math.random() * 25) + 45 },
      { nutrient: 'Vitamin C', severity: Math.floor(Math.random() * 20) + 40 },
      { nutrient: 'Magnesium', severity: Math.floor(Math.random() * 30) + 50 },
      { nutrient: 'Zinc', severity: Math.floor(Math.random() * 25) + 45 },
      { nutrient: 'Vitamin A', severity: Math.floor(Math.random() * 30) + 55 },
      { nutrient: 'Folate (B9)', severity: Math.floor(Math.random() * 35) + 60 },
      { nutrient: 'Vitamin E', severity: Math.floor(Math.random() * 20) + 40 }
    ];

    // Sort by severity (highest first) and take TOP 4
    const top4 = allDeficiencies
      .sort((a, b) => b.severity - a.severity)
      .slice(0, 4)
      .map((def, index) => ({
        ...def,
        rank: index + 1,
        confidence: def.severity >= 65 ? 'High' : def.severity >= 50 ? 'Medium' : 'Low',
        priority: index === 0 ? 'Critical' : index === 1 ? 'High' : index === 2 ? 'Moderate' : 'Monitor',
        symptoms: [
          `${def.nutrient}-related fatigue and low energy levels`,
          `Weakness affecting daily activities`,
          `Difficulty with concentration and mental clarity`,
          `Visible changes in skin, hair, or nail health`,
          `Digestive discomfort or appetite changes`
        ].slice(0, 3 + index), // More symptoms for higher priority
        causes: [
          'Insufficient dietary intake of nutrient-rich foods',
          'Poor nutrient absorption in digestive system',
          'Increased demands from stress or physical activity',
          'Dietary restrictions limiting food variety',
          'Chronic conditions affecting metabolism',
          'Medication interactions',
          'Age-related absorption decline',
          'Lifestyle factors reducing bioavailability'
        ].slice(0, 5 + index),
        foodSources: getFoodSources(def.nutrient),
        remedies: [
          `Prioritize ${def.nutrient}-rich foods in every meal`,
          'Consult healthcare provider about supplementation',
          'Improve absorption with strategic food pairing',
          'Reduce interference from competing nutrients',
          'Optimize meal timing for better uptake',
          'Schedule follow-up testing in 4-6 weeks',
          'Address underlying health conditions',
          'Maintain consistent dietary habits',
          'Stay hydrated for nutrient transport',
          'Consider sunlight exposure for vitamin synthesis'
        ].slice(0, 7 + index)
      }));

    return {
      generalObservations: `Comprehensive analysis identified ${top4.length} prioritized nutritional deficiencies ranked by severity and health impact. The deficiencies are listed hierarchically with #1 requiring most urgent attention. Early intervention through targeted dietary changes can significantly improve nutritional status.`,
      deficiencies: top4,
      disclaimer: 'This analysis is for informational purposes only and should not replace professional medical advice. Consult with a qualified healthcare provider or registered dietitian for personalized guidance before making significant dietary changes or starting supplementation.'
    };
  };

  const getFoodSources = (nutrient) => {
    const sources = {
      'Iron': ['Red meat', 'Spinach', 'Lentils', 'Fortified cereals', 'Oysters', 'Dark chocolate', 'Pumpkin seeds', 'Quinoa', 'Turkey', 'Broccoli', 'Tofu', 'Cashews', 'Chickpeas'],
      'Vitamin D': ['Salmon', 'Egg yolks', 'Fortified milk', 'Mushrooms', 'Tuna', 'Cod liver oil', 'Fortified orange juice', 'Sardines', 'Cheese', 'Beef liver'],
      'Vitamin B12': ['Beef', 'Fish', 'Eggs', 'Dairy products', 'Fortified cereals', 'Nutritional yeast', 'Clams', 'Liver', 'Trout', 'Salmon'],
      'Calcium': ['Milk', 'Cheese', 'Yogurt', 'Leafy greens', 'Almonds', 'Sardines with bones', 'Fortified tofu', 'Bok choy', 'Figs', 'Kale'],
      'Vitamin C': ['Oranges', 'Strawberries', 'Bell peppers', 'Broccoli', 'Kiwi', 'Tomatoes', 'Brussels sprouts', 'Papaya', 'Guava', 'Pineapple'],
      'Magnesium': ['Almonds', 'Spinach', 'Black beans', 'Avocado', 'Dark chocolate', 'Pumpkin seeds', 'Cashews', 'Brown rice', 'Banana'],
      'Zinc': ['Oysters', 'Beef', 'Pumpkin seeds', 'Lentils', 'Chickpeas', 'Cashews', 'Quinoa', 'Turkey', 'Hemp seeds', 'Oatmeal'],
      'Vitamin A': ['Sweet potatoes', 'Carrots', 'Spinach', 'Kale', 'Butternut squash', 'Cantaloupe', 'Red bell peppers', 'Mango', 'Apricots'],
      'Folate (B9)': ['Leafy greens', 'Legumes', 'Asparagus', 'Avocado', 'Brussels sprouts', 'Broccoli', 'Citrus fruits', 'Fortified grains', 'Beets'],
      'Vitamin E': ['Almonds', 'Sunflower seeds', 'Spinach', 'Avocado', 'Wheat germ oil', 'Hazelnuts', 'Peanut butter', 'Red bell pepper', 'Mango']
    };
    return sources[nutrient] || ['Whole grains', 'Nuts', 'Seeds', 'Legumes', 'Fruits', 'Vegetables'];
  };

  const analyzeImage = async () => {
    setAnalyzing(true);
    setResults(null);
    setMealPlan(null);
    setActiveTab('results');
    setLoadingStep(0);
    
    const steps = [
      'Initializing neural network...',
      'Analyzing visual indicators...',
      'Detecting deficiency patterns...',
      'Calculating severity scores...',
      'Ranking by priority...',
      'Generating recommendations...'
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
      
      const newScan = {
        id: Date.now(),
        date: new Date().toISOString(),
        image: image,
        results: analysisResults
      };
      
      const updatedScans = [newScan, ...savedScans].slice(0, 10);
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
      const top2Nutrients = results.deficiencies.slice(0, 2).map(d => d.nutrient);
      
      const globalPlan = {
        title: 'Global Nutrition Plan',
        region: 'International cuisine focusing on nutrient-dense whole foods',
        days: [
          {
            day: 'Monday',
            meals: [
              { name: 'Spinach & Mushroom Omelet', time: '8:00 AM', calories: 320, nutrients: top2Nutrients, ingredients: ['Eggs', 'Spinach', 'Mushrooms', 'Cheese'] },
              { name: 'Grilled Salmon with Quinoa', time: '1:00 PM', calories: 480, nutrients: top2Nutrients, ingredients: ['Salmon fillet', 'Quinoa', 'Broccoli', 'Lemon'] },
              { name: 'Beef Stir-Fry with Vegetables', time: '7:00 PM', calories: 540, nutrients: top2Nutrients, ingredients: ['Lean beef', 'Bell peppers', 'Snap peas', 'Brown rice'] }
            ]
          },
          {
            day: 'Tuesday',
            meals: [
              { name: 'Greek Yogurt Parfait', time: '8:00 AM', calories: 290, nutrients: top2Nutrients, ingredients: ['Greek yogurt', 'Berries', 'Almonds', 'Honey'] },
              { name: 'Mediterranean Chickpea Bowl', time: '1:00 PM', calories: 420, nutrients: top2Nutrients, ingredients: ['Chickpeas', 'Feta', 'Tomatoes', 'Olives', 'Whole grain pita'] },
              { name: 'Herb-Crusted Cod', time: '7:00 PM', calories: 390, nutrients: top2Nutrients, ingredients: ['Cod fillet', 'Herbs', 'Sweet potato', 'Asparagus'] }
            ]
          },
          {
            day: 'Wednesday',
            meals: [
              { name: 'Avocado Toast with Eggs', time: '8:00 AM', calories: 350, nutrients: top2Nutrients, ingredients: ['Whole grain bread', 'Avocado', 'Eggs', 'Tomatoes'] },
              { name: 'Asian Tofu & Vegetable Stir-Fry', time: '1:00 PM', calories: 410, nutrients: top2Nutrients, ingredients: ['Firm tofu', 'Bok choy', 'Carrots', 'Soy sauce', 'Rice noodles'] },
              { name: 'Grilled Chicken & Kale Salad', time: '7:00 PM', calories: 450, nutrients: top2Nutrients, ingredients: ['Chicken breast', 'Kale', 'Walnuts', 'Dried cranberries'] }
            ]
          }
        ],
        shoppingList: [
          'Eggs (dozen)', 'Spinach', 'Salmon fillets (3)', 'Lean beef (1 lb)', 'Chickpeas (can)',
          'Greek yogurt', 'Mixed berries', 'Almonds', 'Quinoa', 'Brown rice',
          'Cod fillet', 'Sweet potato', 'Avocado (2)', 'Tofu (firm)', 'Chicken breast (2)',
          'Kale', 'Bell peppers', 'Broccoli', 'Asparagus', 'Bok choy', 'Whole grain bread'
        ]
      };

      const indianPlan = {
        title: 'Indian Nutrition Plan',
        region: 'Traditional Indian cuisine with regional diversity',
        days: [
          {
            day: 'Monday',
            meals: [
              { name: 'Methi Paratha with Curd', time: '8:00 AM', calories: 340, nutrients: top2Nutrients, ingredients: ['Whole wheat flour', 'Fenugreek leaves', 'Yogurt', 'Ghee'] },
              { name: 'Palak Paneer with Roti', time: '1:00 PM', calories: 460, nutrients: top2Nutrients, ingredients: ['Spinach', 'Paneer', 'Whole wheat roti', 'Onions', 'Tomatoes'] },
              { name: 'Dal Makhani with Brown Rice', time: '7:00 PM', calories: 520, nutrients: top2Nutrients, ingredients: ['Black lentils', 'Kidney beans', 'Cream', 'Brown rice', 'Spices'] }
            ]
          },
          {
            day: 'Tuesday',
            meals: [
              { name: 'Ragi Dosa with Sambar', time: '8:00 AM', calories: 310, nutrients: top2Nutrients, ingredients: ['Finger millet', 'Urad dal', 'Mixed vegetables', 'Tamarind'] },
              { name: 'Chole Bhature (Baked)', time: '1:00 PM', calories: 480, nutrients: top2Nutrients, ingredients: ['Chickpeas', 'Whole wheat flour', 'Yogurt', 'Spices'] },
              { name: 'Fish Curry with Coconut', time: '7:00 PM', calories: 440, nutrients: top2Nutrients, ingredients: ['Fish fillet', 'Coconut milk', 'Curry leaves', 'Rice'] }
            ]
          },
          {
            day: 'Wednesday',
            meals: [
              { name: 'Poha with Peanuts', time: '8:00 AM', calories: 290, nutrients: top2Nutrients, ingredients: ['Flattened rice', 'Peanuts', 'Peas', 'Curry leaves', 'Lemon'] },
              { name: 'Rajma Chawal', time: '1:00 PM', calories: 490, nutrients: top2Nutrients, ingredients: ['Kidney beans', 'Basmati rice', 'Onions', 'Tomatoes', 'Spices'] },
              { name: 'Tandoori Chicken with Salad', time: '7:00 PM', calories: 420, nutrients: top2Nutrients, ingredients: ['Chicken', 'Yogurt', 'Tandoori spices', 'Mixed salad'] }
            ]
          }
        ],
        shoppingList: [
          'Whole wheat flour (atta)', 'Fenugreek leaves (methi)', 'Fresh spinach (palak)', 'Paneer',
          'Black lentils (urad dal)', 'Kidney beans (rajma)', 'Chickpeas (chole)', 'Ragi flour',
          'Flattened rice (poha)', 'Peanuts', 'Coconut milk', 'Fish fillet', 'Chicken',
          'Curry leaves', 'Ghee', 'Yogurt (dahi)', 'Basmati rice', 'Brown rice',
          'Tomatoes', 'Onions', 'Mixed vegetables', 'Tamarind', 'Indian spices'
        ]
      };
      
      setMealPlan({ global: globalPlan, indian: indianPlan });
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
    setDietRegion('global');
    playSound('click');
  };

  const getSeverityColor = (severity) => {
    if (severity >= 70) return { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-400', glow: 'shadow-red-500/50', gradient: 'from-red-500 to-rose-600' };
    if (severity >= 50) return { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500/50', gradient: 'from-yellow-500 to-orange-500' };
    return { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-400', glow: 'shadow-green-500/50', gradient: 'from-green-500 to-emerald-500' };
  };

  const getPriorityColor = (priority) => {
    if (priority === 'Critical') return 'text-red-400 bg-red-500/20 border-red-500/40';
    if (priority === 'High') return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
    if (priority === 'Moderate') return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
    return 'text-blue-400 bg-blue-500/20 border-blue-500/40';
  };

  // Animated Progress Bar - FIXED VERSION
  const AnimatedProgressBar = ({ severity, delay = 0 }) => {
    const [animated, setAnimated] = useState(false);
    const colors = getSeverityColor(severity);
    
    useEffect(() => {
      const timer = setTimeout(() => {
        setAnimated(true);
      }, delay + 100);
      return () => clearTimeout(timer);
    }, [delay]);
    
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-purple-200/60 font-bold uppercase tracking-wider">Severity Level</span>
          <span className={`font-black ${colors.text} text-xl`}>{severity}%</span>
        </div>
        <div className="relative h-5 bg-purple-900/30 rounded-full overflow-hidden border border-purple-500/20">
          <div 
            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors.gradient} rounded-full transition-all ease-out`}
            style={{ 
              width: animated ? `${severity}%` : '0%',
              transitionDuration: '1200ms'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
        </div>
        <div className="flex justify-between text-xs text-purple-200/40 uppercase tracking-wider">
          <span>Low</span>
          <span>Moderate</span>
          <span>High</span>
        </div>
      </div>
    );
  };

  // Donut Chart
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
      <div className="relative w-72 h-72 mx-auto">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke="rgba(239, 68, 68, 0.9)" strokeWidth="32"
            strokeDasharray={`${animated ? highLength : 0} ${circumference}`}
            className="transition-all duration-1000 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]"
          />
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke="rgba(234, 179, 8, 0.9)" strokeWidth="32"
            strokeDasharray={`${animated ? mediumLength : 0} ${circumference}`}
            strokeDashoffset={-highLength}
            className="transition-all duration-1000 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]"
          />
          <circle
            cx="100" cy="100" r={radius}
            fill="none" stroke="rgba(34, 197, 94, 0.9)" strokeWidth="32"
            strokeDasharray={`${animated ? lowLength : 0} ${circumference}`}
            strokeDashoffset={-(highLength + mediumLength)}
            className="transition-all duration-1000 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-5xl font-black text-white drop-shadow-lg">{total}</div>
          <div className="text-sm text-purple-300 font-bold uppercase tracking-wider">Priority</div>
          <div className="text-xs text-purple-400">Deficiencies</div>
        </div>
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
      'Folate (B9)': 'Important for DNA synthesis, cell division, and fetal development',
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
          <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-4 py-3 bg-black/95 border-2 border-purple-500/60 rounded-xl text-xs text-purple-100 w-72 animate-slide-up shadow-2xl shadow-purple-500/30 backdrop-blur-xl">
            <div className="font-black text-purple-300 mb-2 text-sm">{nutrient}</div>
            {tooltips[nutrient] || 'Essential nutrient for overall health'}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-2 border-8 border-transparent border-t-purple-500/60" />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="fixed inset-0 transition-all duration-700"
           style={{
             background: `radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(139, 92, 246, 0.25), transparent 35%),
                         radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(236, 72, 153, 0.25), transparent 35%),
                         radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.18), transparent 45%),
                         linear-gradient(135deg, #000000 0%, #0a0a1f 50%, #000000 100%)`
           }} />
      
      {/* Enhanced Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {particles.map(p => (
          <div key={p.id} className="absolute rounded-full bg-cyan-400 blur-[1px]"
               style={{
                 left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`,
                 opacity: p.opacity, 
                 boxShadow: `0 0 ${p.size * 3}px rgba(34, 211, 238, ${p.opacity})`,
                 animation: 'pulse 3s ease-in-out infinite',
                 animationDelay: `${p.id * 50}ms`
               }} />
        ))}
      </div>

      {/* Enhanced Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[180px] opacity-35 animate-float-slow"
             style={{ 
               background: 'radial-gradient(circle, rgba(139, 92, 246, 0.7), transparent)', 
               top: '5%', left: '0%', 
               transform: `translate(${mousePosition.x * 0.12}px, ${mousePosition.y * 0.12}px)`,
               boxShadow: '0 0 100px rgba(139, 92, 246, 0.3)'
             }} />
        <div className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-35 animate-float-slow"
             style={{ 
               background: 'radial-gradient(circle, rgba(236, 72, 153, 0.7), transparent)', 
               top: '50%', right: '0%', 
               transform: `translate(${-mousePosition.x * 0.18}px, ${-mousePosition.y * 0.18}px)`, 
               animationDelay: '2s',
               boxShadow: '0 0 100px rgba(236, 72, 153, 0.3)'
             }} />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[120px] opacity-25 animate-float-slow"
             style={{ 
               background: 'radial-gradient(circle, rgba(59, 130, 246, 0.6), transparent)', 
               bottom: '10%', left: '50%', 
               transform: `translate(${mousePosition.x * 0.08}px, ${-mousePosition.y * 0.08}px)`,
               animationDelay: '4s',
               boxShadow: '0 0 80px rgba(59, 130, 246, 0.3)'
             }} />
      </div>

      <div className="fixed inset-0 opacity-[0.03]"
           style={{ backgroundImage: 'linear-gradient(rgba(139, 92, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />

      {/* Sound toggle */}
      <button
        onClick={() => {
          setSoundEnabled(!soundEnabled);
          playSound('click');
        }}
        className="fixed top-6 right-6 z-50 p-4 bg-purple-500/20 border-2 border-purple-500/40 rounded-2xl hover:bg-purple-500/30 hover:scale-110 transition-all duration-300 backdrop-blur-xl shadow-lg shadow-purple-500/20"
        aria-label="Toggle sound"
      >
        <Volume2 className={`w-6 h-6 ${soundEnabled ? 'text-purple-300' : 'text-gray-500'}`} />
      </button>

      <div className="relative z-10 container mx-auto px-6 py-16 max-w-7xl">
        {/* Enhanced Header */}
        <div className="text-center mb-20 relative">
          <div className="inline-block mb-10 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500 animate-pulse" />
              <div className="relative flex items-center gap-4 px-10 py-4 bg-black/60 border-2 border-purple-500/40 rounded-full backdrop-blur-2xl shadow-2xl shadow-purple-500/30">
                <Cpu className="w-6 h-6 text-purple-400 animate-pulse" />
                <span className="text-base font-black bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent uppercase tracking-[0.2em]">
                  AI-Powered Analysis
                </span>
                <Zap className="w-6 h-6 text-pink-400 animate-pulse" style={{ animationDelay: '500ms' }} />
              </div>
            </div>
          </div>
          
          <h1 className="relative text-8xl md:text-[10rem] font-black mb-10 tracking-tighter">
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent blur-3xl opacity-60 animate-pulse">
                NutriScan
              </span>
              <span className="relative bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                NutriScan
              </span>
            </span>
          </h1>
          
          <p className="text-2xl text-purple-200/80 max-w-3xl mx-auto leading-relaxed font-light mb-4">
            Next-generation nutritional analysis powered by advanced AI
          </p>
          <p className="text-sm text-purple-300/50 max-w-2xl mx-auto">
            Upload or capture an image • Get ranked deficiencies • Receive personalized diet plans
          </p>

          <div className="flex items-center justify-center gap-6 mt-10">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-pulse" />
            <Droplets className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-pink-500 to-transparent animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          {savedScans.length > 0 && !results && !cameraActive && (
            <button
              onClick={() => {
                setShowHistory(true);
                playSound('click');
              }}
              className="mt-10 px-8 py-4 bg-purple-500/20 border-2 border-purple-500/40 rounded-2xl hover:bg-purple-500/30 hover:scale-105 transition-all duration-300 backdrop-blur-xl flex items-center gap-3 mx-auto shadow-lg shadow-purple-500/20"
            >
              <History className="w-6 h-6 text-purple-300" />
              <span className="text-purple-200 font-bold text-lg">View History ({savedScans.length})</span>
            </button>
          )}
        </div>

        {/* Main Content */}
        {showHistory ? (
          /* History View */
          <div className="space-y-8 animate-slide-up">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-5xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                Scan History
              </h2>
              <button
                onClick={() => {
                  setShowHistory(false);
                  playSound('click');
                }}
                className="px-8 py-4 bg-white/5 border-2 border-purple-500/30 rounded-2xl hover:bg-white/10 hover:scale-105 transition-all shadow-lg"
              >
                <span className="text-purple-200 font-bold text-lg">Back</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {savedScans.map((scan, idx) => (
                <div key={scan.id} className="relative group transform hover:scale-[1.02] transition-all duration-300">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative rounded-3xl border-2 border-purple-500/30 bg-black/70 backdrop-blur-2xl p-6 shadow-xl">
                    <div className="flex items-start gap-4 mb-4">
                      <img src={scan.image} alt="Scan" className="w-24 h-24 rounded-2xl object-cover border-2 border-purple-500/30 shadow-lg" />
                      <div className="flex-1">
                        <div className="text-lg font-bold text-purple-300 mb-1">
                          Scan #{savedScans.length - idx}
                        </div>
                        <div className="text-xs text-purple-200/60">
                          {new Date(scan.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {scan.results.deficiencies.map((def, dIdx) => (
                        <div key={dIdx} className="flex items-center justify-between text-sm p-2 bg-purple-900/20 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xs font-black">
                              {def.rank}
                            </span>
                            <span className="text-purple-200 font-medium">{def.nutrient}</span>
                          </div>
                          <span className={`font-black ${getSeverityColor(def.severity).text}`}>
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
                <div className="relative rounded-3xl border-2 border-green-500/30 bg-black/70 backdrop-blur-2xl p-12 text-center">
                  <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Progress Tracker
                  </h3>
                  <TrendingDown className="w-16 h-16 text-green-400 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)]" />
                  <p className="text-xl text-purple-200/80 mb-2">
                    You've completed <strong className="text-green-400">{savedScans.length}</strong> scans!
                  </p>
                  <p className="text-sm text-purple-300/60">
                    Keep tracking to monitor your nutritional improvements over time
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : cameraActive ? (
          /* Camera View */
          <div className="space-y-6 animate-slide-up">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
              <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500/40 shadow-2xl backdrop-blur-xl bg-black/80">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline
                  muted
                  className="w-full max-h-[600px] object-contain bg-black"
                  style={{ transform: 'scaleX(-1)' }}
                />
                <canvas ref={canvasRef} className="hidden" />
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-4 border-purple-500/50 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={capturePhoto}
                      className="group relative px-14 py-6 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl font-black text-lg overflow-hidden transform hover:scale-110 transition-all duration-300 shadow-2xl shadow-green-500/30">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-600 via-emerald-600 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center gap-3 text-white drop-shadow-lg">
                  <Camera className="w-7 h-7" />
                  CAPTURE PHOTO
                </span>
              </button>
              
              <button onClick={stopCamera}
                      className="px-14 py-6 bg-white/5 border-2 border-purple-500/30 rounded-2xl font-black text-lg hover:bg-white/10 hover:border-purple-500/50 hover:scale-105 transition-all duration-300 backdrop-blur-xl shadow-lg">
                <span className="flex items-center gap-3 text-purple-200">
                  <X className="w-6 h-6" />
                  CANCEL
                </span>
              </button>
            </div>
          </div>
        ) : !image ? (
          /* Upload/Camera Selection */
          <div className="space-y-8">
            <div className={`relative transition-all duration-700 ${dragActive ? 'scale-105' : 'hover:scale-[1.02]'}`}
                 onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}>
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 animate-pulse" />
              
              <div className={`relative group cursor-pointer rounded-3xl overflow-hidden border-2 backdrop-blur-2xl transition-all duration-700
                             ${dragActive ? 'border-purple-500/60 bg-purple-900/30 shadow-[0_0_100px_rgba(168,85,247,0.5)]' : 'border-purple-500/30 bg-black/50 hover:border-purple-500/50 hover:bg-purple-900/20'}`}
                   style={{ boxShadow: dragActive ? '0 0 120px rgba(168, 85, 247, 0.5), inset 0 0 80px rgba(168, 85, 247, 0.15)' : '0 0 60px rgba(168, 85, 247, 0.15), inset 0 0 60px rgba(168, 85, 247, 0.08)' }}
                   onClick={() => fileInputRef.current?.click()}>
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/15 via-transparent to-pink-600/15 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 opacity-[0.04]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white to-transparent animate-scan-line" />
                </div>
                
                <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleChange} />
                
                <div className="relative p-28">
                  <div className="relative inline-block mb-12">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-3xl opacity-70 animate-pulse" />
                    <div className="relative w-48 h-48 rounded-3xl bg-gradient-to-br from-purple-900/60 to-pink-900/60 border-2 border-purple-500/40 backdrop-blur-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 shadow-2xl shadow-purple-500/30"
                         style={{ boxShadow: '0 25px 80px -15px rgba(168, 85, 247, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.15)' }}>
                      <Upload className="w-24 h-24 text-purple-300 group-hover:text-white transition-colors duration-700 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                    </div>
                  </div>
                  
                  <h3 className="text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
                    {dragActive ? 'DROP TO SCAN' : 'UPLOAD IMAGE'}
                  </h3>
                  
                  <p className="text-xl text-purple-200/70 mb-16 font-light">
                    Drag and drop or click to select<br/>
                    <span className="text-base text-purple-300/50">Get ranked analysis + personalized nutrition plans</span>
                  </p>
                  
                  <div className="flex items-center justify-center gap-6 flex-wrap">
                    <button className="group/btn relative px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl font-black text-lg overflow-hidden transform hover:scale-110 transition-all duration-300 shadow-2xl shadow-purple-500/40">
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                      <span className="relative flex items-center gap-3 text-white drop-shadow-lg">
                        <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '3s' }} />
                        Select File
                        <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-2 transition-transform" />
                      </span>
                    </button>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        startCamera();
                      }}
                      className="px-12 py-6 bg-gradient-to-r from-blue-600 to-cyan-600 border-2 border-blue-500/40 rounded-2xl font-black text-lg hover:from-blue-500 hover:to-cyan-500 hover:scale-110 transition-all duration-300 backdrop-blur-xl shadow-2xl shadow-blue-500/40">
                      <span className="flex items-center gap-3 text-white drop-shadow-lg">
                        <Video className="w-6 h-6" />
                        Live Camera
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : !results && !analyzing ? (
          /* Image Preview */
          <div className="space-y-8 animate-slide-up">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
              <div className="relative rounded-3xl overflow-hidden border-2 border-purple-500/40 shadow-2xl backdrop-blur-2xl bg-black/70">
                <img src={image} alt="Preview" className="w-full max-h-[600px] object-contain" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
            
            <div className="flex gap-6 justify-center flex-wrap">
              <button onClick={analyzeImage}
                      className="group relative px-16 py-7 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl font-black text-xl overflow-hidden transform hover:scale-110 transition-all duration-300 shadow-2xl shadow-purple-500/50">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative flex items-center gap-4 text-white drop-shadow-lg">
                  <Sparkles className="w-7 h-7 group-hover:rotate-180 transition-transform duration-700" />
                  ANALYZE NOW
                </span>
              </button>
              
              <button onClick={resetAnalysis}
                      className="px-16 py-7 bg-white/5 border-2 border-purple-500/30 rounded-2xl font-black text-xl hover:bg-white/10 hover:border-purple-500/50 hover:scale-105 transition-all duration-300 backdrop-blur-xl shadow-lg">
                <span className="text-purple-200">RESET</span>
              </button>
            </div>
          </div>
        ) : analyzing ? (
          /* Enhanced Loading */
          <div className="text-center py-40 animate-fade-in">
            <div className="relative inline-block mb-20">
              <div className="w-56 h-56 rounded-full border-2 border-purple-500/20 absolute top-0 left-0" />
              <div className="w-56 h-56 rounded-full border-4 border-t-purple-500 border-r-pink-500 border-b-transparent border-l-transparent absolute top-0 left-0 animate-spin shadow-[0_0_30px_rgba(168,85,247,0.5)]" />
              <div className="w-48 h-48 rounded-full border-4 border-t-transparent border-r-transparent border-b-pink-500 border-l-blue-500 absolute top-4 left-4 animate-spin-reverse shadow-[0_0_30px_rgba(236,72,153,0.5)]" />
              <div className="w-56 h-56 flex items-center justify-center">
                <Activity className="w-24 h-24 text-purple-400 animate-pulse drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" />
              </div>
            </div>
            
            <h3 className="text-6xl font-black mb-8 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_40px_rgba(168,85,247,0.5)]">
              ANALYZING
            </h3>
            
            <div className="max-w-md mx-auto space-y-5">
              {['Initializing neural network...', 'Analyzing visual indicators...', 'Detecting deficiency patterns...', 
                'Calculating severity scores...', 'Ranking by priority...', 'Generating recommendations...'].map((step, idx) => (
                <div key={idx} className={`flex items-center gap-4 transition-all duration-300 p-3 rounded-xl ${idx <= loadingStep ? 'opacity-100 bg-purple-900/20' : 'opacity-40'}`}>
                  <div className={`w-3 h-3 rounded-full ${idx <= loadingStep ? 'bg-green-400 shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse' : 'bg-purple-500/30'}`} />
                  <span className="text-purple-200/90 text-base font-medium">{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : results && (
          /* Results with all tabs */
          <div className="space-y-10 animate-slide-up">
            {/* Tab Navigation */}
            <div className="flex gap-5 justify-center flex-wrap">
              <button onClick={() => { setActiveTab('results'); playSound('click'); }}
                      className={`px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 flex items-center gap-3 shadow-lg
                                ${activeTab === 'results' 
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/50 scale-110' 
                                  : 'bg-white/5 border-2 border-purple-500/30 text-purple-200 hover:bg-white/10 hover:scale-105'}`}>
                <BarChart3 className="w-6 h-6" />
                Results
              </button>
              
              <button onClick={() => { setActiveTab('charts'); playSound('click'); }}
                      className={`px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 flex items-center gap-3 shadow-lg
                                ${activeTab === 'charts' 
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/50 scale-110' 
                                  : 'bg-white/5 border-2 border-purple-500/30 text-purple-200 hover:bg-white/10 hover:scale-105'}`}>
                <PieChart className="w-6 h-6" />
                Charts
              </button>
              
              <button onClick={() => { if (!mealPlan && !generatingMealPlan) generateMealPlan(); else { setActiveTab('meals'); playSound('click'); } }}
                      className={`px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 flex items-center gap-3 shadow-lg
                                ${activeTab === 'meals' 
                                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-purple-500/50 scale-110' 
                                  : 'bg-white/5 border-2 border-purple-500/30 text-purple-200 hover:bg-white/10 hover:scale-105'}`}>
                <Utensils className="w-6 h-6" />
                {generatingMealPlan ? 'Generating...' : mealPlan ? 'Diet Plans' : 'Generate Plans'}
              </button>
            </div>

            {/* Progress tracking notice */}
            {savedScans.length > 1 && activeTab === 'results' && (
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative rounded-3xl border-2 border-blue-500/30 bg-black/70 backdrop-blur-2xl p-8 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <TrendingDown className="w-8 h-8 text-blue-400 drop-shadow-[0_0_15px_rgba(59,130,246,0.8)]" />
                    <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Progress Tracking Active
                    </h3>
                  </div>
                  <p className="text-purple-200/80">
                    Scan <strong className="text-blue-400">#{savedScans.length}</strong> completed. <button onClick={() => { setShowHistory(true); playSound('click'); }} className="text-blue-400 hover:text-blue-300 underline font-bold">View history</button> to compare progress!
                  </p>
                </div>
              </div>
            )}

            {/* Tab Content */}
            {activeTab === 'results' && (
              <div className="space-y-10">
                {/* Summary */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur-xl opacity-35 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="relative rounded-3xl border-2 border-purple-500/40 bg-black/70 backdrop-blur-2xl p-12 hover:border-purple-500/60 transition-all duration-500 shadow-2xl">
                    <div className="flex items-start gap-8">
                      <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/40 to-blue-600/40 border-2 border-purple-500/40 flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/30">
                        <Info className="w-10 h-10 text-purple-300" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-3xl font-black mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                          ANALYSIS SUMMARY
                        </h3>
                        <p className="text-xl text-purple-100/80 leading-relaxed">{results.generalObservations}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ranked Deficiencies */}
                <div className="flex items-center justify-center gap-6 mb-12">
                  <BarChart3 className="w-10 h-10 text-purple-400 drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
                  <h2 className="text-7xl font-black text-center bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-gradient drop-shadow-[0_0_40px_rgba(168,85,247,0.5)]">
                    PRIORITY DEFICIENCIES
                  </h2>
                  <TrendingUp className="w-10 h-10 text-pink-400 drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]" />
                </div>

                <div className="space-y-8">
                  {results.deficiencies.map((def, idx) => {
                    const severity = def.severity || 50;
                    const colors = getSeverityColor(severity);
                    const priorityColors = getPriorityColor(def.priority);
                    
                    return (
                      <div key={idx} className="relative group" style={{ animationDelay: `${idx * 150}ms` }}>
                        <div className={`absolute -inset-1 bg-gradient-to-r ${colors.gradient} rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-700`} />
                        
                        <div className="relative rounded-3xl border-2 border-purple-500/40 bg-black/70 backdrop-blur-2xl overflow-hidden hover:border-purple-500/60 transition-all duration-700 shadow-2xl">
                          {/* Rank Badge */}
                          <div className="absolute top-6 right-6 z-10">
                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center transform rotate-12 shadow-2xl ${colors.glow}`}>
                              <span className="text-3xl font-black text-white drop-shadow-lg">#{def.rank}</span>
                            </div>
                          </div>

                          {/* Header */}
                          <div className={`bg-gradient-to-r ${colors.gradient} bg-opacity-10 p-10 border-b-2 border-purple-500/30`}>
                            <div className="flex items-center justify-between mb-8">
                              <div className="flex items-center gap-6">
                                <Tooltip nutrient={def.nutrient}>
                                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600/40 to-pink-600/40 border-2 border-purple-500/40 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg cursor-help ${colors.glow}`}>
                                    <Pill className="w-10 h-10 text-purple-300" />
                                  </div>
                                </Tooltip>
                                <div>
                                  <Tooltip nutrient={def.nutrient}>
                                    <h3 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent cursor-help drop-shadow-lg">
                                      {def.nutrient}
                                    </h3>
                                  </Tooltip>
                                  <div className="flex items-center gap-3 mt-2">
                                    <span className={`px-4 py-1.5 ${priorityColors} border rounded-xl text-sm font-black uppercase tracking-wider shadow-lg`}>
                                      {def.priority} Priority
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <span className="px-8 py-4 bg-purple-500/20 border-2 border-purple-500/40 rounded-2xl text-lg font-black uppercase tracking-widest text-purple-300 backdrop-blur-xl shadow-lg">
                                {def.confidence} Confidence
                              </span>
                            </div>
                            
                            <AnimatedProgressBar severity={severity} delay={idx * 150} />
                          </div>

                          <div className="p-12 space-y-12">
                            {/* Symptoms */}
                            {def.symptoms && def.symptoms.length > 0 && (
                              <div>
                                <div className="flex items-center justify-between mb-8">
                                  <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-xl bg-red-500/20 border-2 border-red-500/40 flex items-center justify-center shadow-lg shadow-red-500/20">
                                      <AlertCircle className="w-7 h-7 text-red-400" />
                                    </div>
                                    <h4 className="text-2xl font-black text-red-400 uppercase tracking-wider drop-shadow-lg">Symptoms Detected</h4>
                                  </div>
                                  <div className="px-5 py-2 bg-red-500/20 border-2 border-red-500/40 rounded-xl shadow-lg">
                                    <span className="text-red-400 font-black text-base">{def.symptoms.length} FOUND</span>
                                  </div>
                                </div>
                                <ul className="space-y-4">
                                  {def.symptoms.map((symptom, i) => (
                                    <li key={i} className="flex items-start gap-4 text-purple-100/90 text-lg leading-relaxed group/item hover:text-white transition-colors p-3 rounded-xl hover:bg-red-500/10">
                                      <span className="w-3 h-3 rounded-full bg-gradient-to-r from-red-500 to-pink-500 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
                                      <span>{symptom}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {/* Continue with causes, food sources, remedies similar to above... */}
                            {/* (Keep the same enhanced styling for these sections) */}

                            {def.causes && def.causes.length > 0 && (
                              <div>
                                <div className="flex items-center justify-between mb-8">
                                  <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-xl bg-yellow-500/20 border-2 border-yellow-500/40 flex items-center justify-center shadow-lg shadow-yellow-500/20">
                                      <Info className="w-7 h-7 text-yellow-400" />
                                    </div>
                                    <h4 className="text-2xl font-black text-yellow-400 uppercase tracking-wider drop-shadow-lg">Root Causes</h4>
                                  </div>
                                  <div className="px-5 py-2 bg-yellow-500/20 border-2 border-yellow-500/40 rounded-xl shadow-lg">
                                    <span className="text-yellow-400 font-black text-base">{def.causes.length} FACTORS</span>
                                  </div>
                                </div>
                                <ul className="space-y-4">
                                  {def.causes.map((cause, i) => (
                                    <li key={i} className="flex items-start gap-4 text-purple-100/90 text-lg leading-relaxed group/item hover:text-white transition-colors p-3 rounded-xl hover:bg-yellow-500/10">
                                      <span className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 mt-2 flex-shrink-0 group-hover/item:scale-150 transition-transform shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
                                      <span>{cause}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {def.foodSources && def.foodSources.length > 0 && (
                              <div>
                                <div className="flex items-center justify-between mb-8">
                                  <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-xl bg-green-500/20 border-2 border-green-500/40 flex items-center justify-center shadow-lg shadow-green-500/20">
                                      <Apple className="w-7 h-7 text-green-400" />
                                    </div>
                                    <h4 className="text-2xl font-black text-green-400 uppercase tracking-wider drop-shadow-lg">Food Sources</h4>
                                  </div>
                                  <div className="px-5 py-2 bg-green-500/20 border-2 border-green-500/40 rounded-xl shadow-lg">
                                    <span className="text-green-400 font-black text-base">{def.foodSources.length} OPTIONS</span>
                                  </div>
                                </div>
                                <div className="flex flex-wrap gap-4">
                                  {def.foodSources.map((food, i) => (
                                    <span key={i}
                                          className="px-6 py-3 bg-green-500/15 border-2 border-green-500/40 rounded-xl text-base font-bold text-green-300 backdrop-blur-xl hover:bg-green-500/25 hover:scale-110 hover:border-green-500/60 transition-all duration-300 cursor-pointer shadow-lg shadow-green-500/10">
                                      {food}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {def.remedies && def.remedies.length > 0 && (
                              <div>
                                <div className="flex items-center justify-between mb-8">
                                  <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 rounded-xl bg-cyan-500/20 border-2 border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                                      <CheckCircle className="w-7 h-7 text-cyan-400" />
                                    </div>
                                    <h4 className="text-2xl font-black text-cyan-400 uppercase tracking-wider drop-shadow-lg">Action Plan</h4>
                                  </div>
                                  <div className="px-5 py-2 bg-cyan-500/20 border-2 border-cyan-500/40 rounded-xl shadow-lg">
                                    <span className="text-cyan-400 font-black text-base">{def.remedies.length} STEPS</span>
                                  </div>
                                </div>
                                <ul className="space-y-4">
                                  {def.remedies.map((remedy, i) => (
                                    <li key={i} className="flex items-start gap-4 text-purple-100/90 text-lg leading-relaxed group/item hover:text-white transition-colors p-3 rounded-xl hover:bg-cyan-500/10">
                                      <CheckCircle className="w-7 h-7 text-cyan-400 mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform drop-shadow-[0_0_10px_rgba(34,211,238,0.6)]" />
                                      <span>{remedy}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Disclaimer */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-50 transition-opacity duration-500" />
                  <div className="relative rounded-3xl bg-yellow-900/15 border-2 border-yellow-500/40 p-10 backdrop-blur-xl shadow-2xl">
                    <div className="flex items-start gap-6">
                      <AlertCircle className="w-9 h-9 text-yellow-400 mt-1 flex-shrink-0 animate-pulse drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]" />
                      <div>
                        <h4 className="font-black text-yellow-400 mb-4 text-2xl uppercase tracking-wider drop-shadow-lg">Medical Disclaimer</h4>
                        <p className="text-purple-100/70 leading-relaxed text-lg">{results.disclaimer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'charts' && (
              <div className="grid md:grid-cols-2 gap-10">
                {/* Donut Chart */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-35 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="relative rounded-3xl border-2 border-purple-500/40 bg-black/70 backdrop-blur-2xl p-12 shadow-2xl">
                    <h3 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                      Severity Distribution
                    </h3>
                    <SeverityDonutChart deficiencies={results.deficiencies} />
                    
                    <div className="mt-10 grid grid-cols-3 gap-5 text-center">
                      <div className="p-5 bg-red-500/15 border-2 border-red-500/40 rounded-2xl transform hover:scale-110 transition-all shadow-lg shadow-red-500/20">
                        <div className="text-4xl font-black text-red-400 drop-shadow-lg">
                          {results.deficiencies.filter(d => (d.severity || 50) >= 70).length}
                        </div>
                        <div className="text-sm text-red-300 font-bold uppercase tracking-wider mt-2">High</div>
                      </div>
                      <div className="p-5 bg-yellow-500/15 border-2 border-yellow-500/40 rounded-2xl transform hover:scale-110 transition-all shadow-lg shadow-yellow-500/20">
                        <div className="text-4xl font-black text-yellow-400 drop-shadow-lg">
                          {results.deficiencies.filter(d => {
                            const s = d.severity || 50;
                            return s >= 50 && s < 70;
                          }).length}
                        </div>
                        <div className="text-sm text-yellow-300 font-bold uppercase tracking-wider mt-2">Medium</div>
                      </div>
                      <div className="p-5 bg-green-500/15 border-2 border-green-500/40 rounded-2xl transform hover:scale-110 transition-all shadow-lg shadow-green-500/20">
                        <div className="text-4xl font-black text-green-400 drop-shadow-lg">
                          {results.deficiencies.filter(d => (d.severity || 50) < 50).length}
                        </div>
                        <div className="text-sm text-green-300 font-bold uppercase tracking-wider mt-2">Low</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl blur-xl opacity-35 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="relative rounded-3xl border-2 border-blue-500/40 bg-black/70 backdrop-blur-2xl p-12 shadow-2xl">
                    <div className="flex items-center justify-center gap-3 mb-10">
                      <h3 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
                        Priority Ranking
                      </h3>
                      <Tooltip nutrient="info">
                        <HelpCircle className="w-6 h-6 text-purple-300/50 hover:text-purple-300 cursor-help" />
                      </Tooltip>
                    </div>
                    <div className="space-y-6">
                      {results.deficiencies.map((def, idx) => (
                        <Tooltip key={idx} nutrient={def.nutrient}>
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <span className={`w-8 h-8 rounded-xl bg-gradient-to-r ${getSeverityColor(def.severity).gradient} flex items-center justify-center text-sm font-black text-white shadow-lg`}>
                                  {def.rank}
                                </span>
                                <span className="text-base font-bold text-purple-200 cursor-help">{def.nutrient}</span>
                              </div>
                              <span className={`text-base font-black ${getSeverityColor(def.severity).text}`}>
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

                {/* Key Insights */}
                <div className="md:col-span-2 relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl blur-xl opacity-35 group-hover:opacity-60 transition-opacity duration-500" />
                  <div className="relative rounded-3xl border-2 border-emerald-500/40 bg-black/70 backdrop-blur-2xl p-12 shadow-2xl">
                    <div className="flex items-center gap-5 mb-10">
                      <Award className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
                      <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
                        Key Insights & Recommendations
                      </h3>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-5">
                        <h4 className="text-xl font-bold text-emerald-300 flex items-center gap-3 drop-shadow-lg">
                          <Target className="w-6 h-6" />
                          Priority Actions
                        </h4>
                        <ul className="space-y-4">
                          {results.deficiencies.slice(0, 3).map((def, idx) => (
                            <li key={idx} className="flex items-start gap-4 text-purple-100/90 text-base p-3 rounded-xl hover:bg-emerald-500/10 transition-all">
                              <CheckCircle className="w-6 h-6 text-emerald-400 mt-0.5 flex-shrink-0 drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]" />
                              <span>Address <strong className="text-emerald-300">{def.nutrient}</strong> first (#{def.rank} priority, {def.severity}% severity)</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="space-y-5">
                        <h4 className="text-xl font-bold text-emerald-300 flex items-center gap-3 drop-shadow-lg">
                          <Lightbulb className="w-6 h-6" />
                          Quick Wins
                        </h4>
                        <ul className="space-y-4">
                          <li className="flex items-start gap-4 text-purple-100/90 text-base p-3 rounded-xl hover:bg-yellow-500/10 transition-all">
                            <Sparkles className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0 drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
                            <span>Prioritize food sources before supplements</span>
                          </li>
                          <li className="flex items-start gap-4 text-purple-100/90 text-base p-3 rounded-xl hover:bg-yellow-500/10 transition-all">
                            <Sparkles className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0 drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
                            <span>Combine nutrients for better absorption</span>
                          </li>
                          <li className="flex items-start gap-4 text-purple-100/90 text-base p-3 rounded-xl hover:bg-yellow-500/10 transition-all">
                            <Sparkles className="w-6 h-6 text-yellow-400 mt-0.5 flex-shrink-0 drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
                            <span>Track progress weekly, retest in 4-6 weeks</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'meals' && (
              <div className="space-y-10">
                {generatingMealPlan ? (
                  <div className="text-center py-40">
                    <div className="relative inline-block mb-12">
                      <Utensils className="w-24 h-24 text-purple-400 animate-spin drop-shadow-[0_0_20px_rgba(168,85,247,0.8)]" style={{ animationDuration: '2s' }} />
                    </div>
                    <h3 className="text-5xl font-black mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent drop-shadow-lg">
                      Generating Your Diet Plans
                    </h3>
                    <p className="text-2xl text-purple-200/70">AI is creating personalized meal plans...</p>
                  </div>
                ) : mealPlan ? (
                  <div className="space-y-10">
                    {/* Region Toggle */}
                    <div className="flex justify-center gap-5">
                      <button
                        onClick={() => { setDietRegion('global'); playSound('click'); }}
                        className={`px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 flex items-center gap-3 shadow-lg
                                  ${dietRegion === 'global'
                                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-blue-500/50 scale-110'
                                    : 'bg-white/5 border-2 border-blue-500/30 text-blue-200 hover:bg-white/10 hover:scale-105'}`}>
                        <Globe className="w-6 h-6" />
                        Global Cuisine
                      </button>
                      
                      <button
                        onClick={() => { setDietRegion('indian'); playSound('click'); }}
                        className={`px-10 py-5 rounded-2xl font-black text-lg transition-all duration-300 flex items-center gap-3 shadow-lg
                                  ${dietRegion === 'indian'
                                    ? 'bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-orange-500/50 scale-110'
                                    : 'bg-white/5 border-2 border-orange-500/30 text-orange-200 hover:bg-white/10 hover:scale-105'}`}>
                        <MapPin className="w-6 h-6" />
                        Indian Cuisine
                      </button>
                    </div>

                    {/* Meal Plan Display */}
                    {['global', 'indian'].map(region => (
                      dietRegion === region && (
                        <div key={region} className="space-y-10 animate-slide-up">
                          {/* Plan Header */}
                          <div className="relative group">
                            <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-35 group-hover:opacity-60 transition-opacity duration-500 ${region === 'global' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gradient-to-r from-orange-600 to-red-600'}`} />
                            <div className={`relative rounded-3xl border-2 ${region === 'global' ? 'border-blue-500/40' : 'border-orange-500/40'} bg-black/70 backdrop-blur-2xl p-12 shadow-2xl`}>
                              <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center gap-6">
                                  <div className={`w-20 h-20 rounded-2xl ${region === 'global' ? 'bg-gradient-to-br from-blue-600/40 to-cyan-600/40 border-2 border-blue-500/40' : 'bg-gradient-to-br from-orange-600/40 to-red-600/40 border-2 border-orange-500/40'} flex items-center justify-center shadow-lg`}>
                                    {region === 'global' ? <Globe className="w-10 h-10 text-blue-300" /> : <MapPin className="w-10 h-10 text-orange-300" />}
                                  </div>
                                  <div>
                                    <h3 className={`text-4xl font-black ${region === 'global' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 'bg-gradient-to-r from-orange-400 to-red-400'} bg-clip-text text-transparent drop-shadow-lg`}>
                                      {mealPlan[region].title}
                                    </h3>
                                    <p className={`${region === 'global' ? 'text-blue-200/70' : 'text-orange-200/70'} mt-2 text-lg`}>
                                      {mealPlan[region].region}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex gap-4">
                                  <button className={`px-8 py-4 ${region === 'global' ? 'bg-blue-500/20 border-2 border-blue-500/40 hover:bg-blue-500/30' : 'bg-orange-500/20 border-2 border-orange-500/40 hover:bg-orange-500/30'} rounded-2xl transition-all flex items-center gap-3 shadow-lg`}>
                                    <Download className={`w-6 h-6 ${region === 'global' ? 'text-blue-300' : 'text-orange-300'}`} />
                                    <span className={`${region === 'global' ? 'text-blue-300' : 'text-orange-300'} font-bold text-lg`}>Export</span>
                                  </button>
                                  <button className={`px-8 py-4 ${region === 'global' ? 'bg-blue-500/20 border-2 border-blue-500/40 hover:bg-blue-500/30' : 'bg-orange-500/20 border-2 border-orange-500/40 hover:bg-orange-500/30'} rounded-2xl transition-all flex items-center gap-3 shadow-lg`}>
                                    <Share2 className={`w-6 h-6 ${region === 'global' ? 'text-blue-300' : 'text-orange-300'}`} />
                                    <span className={`${region === 'global' ? 'text-blue-300' : 'text-orange-300'} font-bold text-lg`}>Share</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Daily Plans */}
                          <div className="grid gap-8">
                            {mealPlan[region].days.map((day, idx) => (
                              <div key={idx} className="relative group">
                                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-xl opacity-25 group-hover:opacity-40 transition-opacity duration-500" />
                                <div className="relative rounded-3xl border-2 border-purple-500/40 bg-black/70 backdrop-blur-2xl p-10 shadow-2xl">
                                  <h4 className="text-3xl font-black text-purple-300 mb-8 flex items-center gap-4 drop-shadow-lg">
                                    <Calendar className="w-8 h-8" />
                                    {day.day}
                                  </h4>
                                  <div className="grid md:grid-cols-3 gap-6">
                                    {day.meals.map((meal, mIdx) => (
                                      <div key={mIdx} className="bg-purple-900/25 border-2 border-purple-500/30 rounded-2xl p-6 hover:bg-purple-900/40 hover:scale-105 transition-all duration-300 shadow-lg">
                                        <div className="flex items-start justify-between mb-4">
                                          <h5 className="font-bold text-purple-100 text-lg">{meal.name}</h5>
                                          <span className="text-xs text-purple-300/70">{meal.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-4">
                                          <Zap className="w-5 h-5 text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.6)]" />
                                          <span className="text-sm text-purple-200/80 font-medium">{meal.calories} cal</span>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                          <div className="text-xs text-purple-300/60 uppercase font-bold tracking-wider">Ingredients:</div>
                                          <div className="flex flex-wrap gap-2">
                                            {meal.ingredients && meal.ingredients.map((ing, iIdx) => (
                                              <span key={iIdx} className="px-2 py-1 bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs text-purple-200">
                                                {ing}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                          {meal.nutrients.map((nutrient, nIdx) => (
                                            <span key={nIdx} className="px-3 py-1 bg-green-500/20 border-2 border-green-500/40 rounded-xl text-xs font-bold text-green-300 shadow-lg shadow-green-500/10">
                                              {nutrient}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Shopping List */}
                          <div className="relative group">
                            <div className={`absolute -inset-1 rounded-3xl blur-xl opacity-35 group-hover:opacity-60 transition-opacity duration-500 ${region === 'global' ? 'bg-gradient-to-r from-blue-600 to-cyan-600' : 'bg-gradient-to-r from-orange-600 to-red-600'}`} />
                            <div className={`relative rounded-3xl border-2 ${region === 'global' ? 'border-blue-500/40' : 'border-orange-500/40'} bg-black/70 backdrop-blur-2xl p-12 shadow-2xl`}>
                              <div className="flex items-center gap-6 mb-10">
                                <div className={`w-20 h-20 rounded-2xl ${region === 'global' ? 'bg-gradient-to-br from-blue-600/40 to-cyan-600/40 border-2 border-blue-500/40' : 'bg-gradient-to-br from-orange-600/40 to-red-600/40 border-2 border-orange-500/40'} flex items-center justify-center shadow-lg`}>
                                  <ShoppingCart className={`w-10 h-10 ${region === 'global' ? 'text-blue-300' : 'text-orange-300'}`} />
                                </div>
                                <h3 className={`text-4xl font-black ${region === 'global' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 'bg-gradient-to-r from-orange-400 to-red-400'} bg-clip-text text-transparent drop-shadow-lg`}>
                                  Shopping List
                                </h3>
                              </div>
                              <div className="grid md:grid-cols-3 gap-4">
                                {mealPlan[region].shoppingList.map((item, idx) => (
                                  <div key={idx} className={`flex items-center gap-3 px-5 py-4 ${region === 'global' ? 'bg-blue-900/20 border-2 border-blue-500/30 hover:bg-blue-900/30' : 'bg-orange-900/20 border-2 border-orange-500/30 hover:bg-orange-900/30'} rounded-xl transition-all hover:scale-105 shadow-lg`}>
                                    <CheckCircle className={`w-6 h-6 ${region === 'global' ? 'text-blue-400' : 'text-orange-400'} flex-shrink-0 drop-shadow-lg`} />
                                    <span className="text-purple-100/90 text-base font-medium">{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    ))}
                  </div>
                ) : null}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-6 justify-center pt-10 flex-wrap">
              <button onClick={resetAnalysis}
                      className="group relative px-16 py-7 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl font-black text-xl overflow-hidden transform hover:scale-110 transition-all duration-300 shadow-2xl shadow-purple-500/50">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative text-white drop-shadow-lg">ANALYZE ANOTHER</span>
              </button>
              
              <button className="px-16 py-7 bg-white/5 border-2 border-purple-500/30 rounded-2xl font-black text-xl hover:bg-white/10 hover:border-purple-500/50 hover:scale-105 transition-all duration-300 backdrop-blur-xl flex items-center gap-4 shadow-lg">
                <Download className="w-7 h-7" />
                <span className="text-purple-200">EXPORT PDF</span>
              </button>

              <button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  playSound('success');
                  alert('Link copied to clipboard!');
                }}
                className="px-16 py-7 bg-white/5 border-2 border-purple-500/30 rounded-2xl font-black text-xl hover:bg-white/10 hover:border-purple-500/50 hover:scale-105 transition-all duration-300 backdrop-blur-xl flex items-center gap-4 shadow-lg">
                <Share2 className="w-7 h-7" />
                <span className="text-purple-200">SHARE</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(30px, -30px) rotate(5deg); }
          66% { transform: translate(-20px, 20px) rotate(-5deg); }
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
          from { opacity: 0; transform: translateY(60px); }
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
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        .animate-float-slow { animation: float-slow 20s ease-in-out infinite; }
        .animate-scan-line { animation: scan-line 4s linear infinite; }
        .animate-gradient { background-size: 200% auto; animation: gradient 4s linear infinite; }
        .animate-slide-up { animation: slide-up 0.9s ease-out forwards; }
        .animate-spin-reverse { animation: spin-reverse 3s linear infinite; }
        .animate-shimmer { animation: shimmer 2.5s infinite; }
      `}</style>
    </div>
  );
}
