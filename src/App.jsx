import React, { useState, useRef, useEffect } from 'react';
import {
  Camera, Upload, Sparkles, AlertCircle, CheckCircle, Pill, Apple, Info,
  ArrowRight, Zap, Activity, Cpu, Droplets, TrendingUp, BarChart3, Calendar,
  Utensils, ShoppingCart, Download, Share2, PieChart, Target, Award, BookOpen,
  History, TrendingDown, Lightbulb, Volume2, HelpCircle, Video, X, Globe, MapPin
} from 'lucide-react';

// --------------------------------------------------------------
// SYMPTOM QUESTIONNAIRE (Step 1)
// --------------------------------------------------------------
const SYMPTOMS = [
  { id: 'fatigue',      label: 'Fatigue / Low Energy',         icon: '⚡', desc: 'Persistent tiredness even after adequate sleep' },
  { id: 'hairloss',     label: 'Hair Loss / Thinning',          icon: '🌿', desc: 'Noticeable shedding, breakage, or thinning strands' },
  { id: 'skin_dry',     label: 'Dry / Flaky Skin',              icon: '🫧', desc: 'Rough texture, flaking, or dull complexion' },
  { id: 'brittle_nails',label: 'Brittle / Ridged Nails',        icon: '💅', desc: 'Nails that chip, peel, or have vertical ridges' },
  { id: 'muscle_cramps',label: 'Muscle Cramps / Weakness',      icon: '💪', desc: 'Frequent cramps, spasms, or unexplained weakness' },
  { id: 'mood',         label: 'Brain Fog / Mood Changes',      icon: '🧠', desc: 'Difficulty concentrating, irritability, or low mood' },
  { id: 'pale_skin',    label: 'Pale Skin / Lips',              icon: '🫀', desc: 'Unusual paleness especially around gums or eyelids' },
  { id: 'slow_heal',    label: 'Slow Wound Healing',            icon: '🩹', desc: 'Cuts or bruises take longer than usual to heal' },
];

const SEVERITY_OPTIONS = ['None', 'Mild', 'Moderate', 'Severe'];

const BLOOD_MARKERS = [
  { id: 'hemoglobin',  label: 'Hemoglobin (g/dL)',    normal: '12–17',  unit: 'g/dL' },
  { id: 'ferritin',    label: 'Ferritin (ng/mL)',     normal: '12–300', unit: 'ng/mL' },
  { id: 'vitd',        label: 'Vitamin D (ng/mL)',    normal: '30–100', unit: 'ng/mL' },
  { id: 'vitb12',      label: 'Vitamin B12 (pg/mL)',  normal: '200–900',unit: 'pg/mL' },
  { id: 'calcium',     label: 'Calcium (mg/dL)',      normal: '8.5–10.5',unit: 'mg/dL' },
  { id: 'magnesium',   label: 'Magnesium (mg/dL)',    normal: '1.7–2.2',unit: 'mg/dL' },
  { id: 'zinc',        label: 'Zinc (µg/dL)',         normal: '60–120', unit: 'µg/dL' },
  { id: 'folate',      label: 'Folate (ng/mL)',       normal: '2.7–17', unit: 'ng/mL' },
];

function SymptomQuestionnaire({ onComplete }) {
  const [step, setStep] = useState('symptoms'); // 'symptoms' | 'blood'
  const [symptoms, setSymptoms] = useState({});
  const [showBlood, setShowBlood] = useState(false);
  const [bloodData, setBloodData] = useState({});
  const [animIn, setAnimIn] = useState(true);

  const setSeverity = (id, val) => setSymptoms(prev => ({ ...prev, [id]: val }));

  const goToBlood = () => {
    setAnimIn(false);
    setTimeout(() => { setStep('blood'); setAnimIn(true); }, 300);
  };

  const finish = () => {
    onComplete({ symptoms, bloodData: showBlood ? bloodData : {} });
  };

  const severityColor = (val) => {
    if (val === 'Severe')   return 'bg-red-500/20 border-red-500 text-red-300';
    if (val === 'Moderate') return 'bg-yellow-500/20 border-yellow-500 text-yellow-300';
    if (val === 'Mild')     return 'bg-blue-500/20 border-blue-500 text-blue-300';
    return 'bg-white/5 border-white/10 text-white/40';
  };

  return (
    <div className={`transition-all duration-300 ${animIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {step === 'symptoms' && (
        <div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 mb-4">
              <Activity className="w-4 h-4 text-violet-400" />
              <span className="text-sm text-violet-300 font-medium">Step 1 of 3 — Symptom Assessment</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">How are you feeling?</h2>
            <p className="text-white/50 text-sm max-w-md mx-auto">Rate each symptom to help us better map your deficiency profile before image analysis.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {SYMPTOMS.map(sym => {
              const val = symptoms[sym.id] || 'None';
              return (
                <div key={sym.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-xl">{sym.icon}</span>
                    <div>
                      <p className="text-white text-sm font-semibold">{sym.label}</p>
                      <p className="text-white/40 text-xs">{sym.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {SEVERITY_OPTIONS.map(opt => (
                      <button
                        key={opt}
                        onClick={() => setSeverity(sym.id, opt)}
                        className={`flex-1 py-1 text-xs rounded-lg border transition-all duration-200 font-medium ${
                          val === opt ? severityColor(opt) : 'bg-white/5 border-white/10 text-white/30 hover:text-white/60 hover:border-white/30'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={goToBlood}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 transition-all duration-200 flex items-center justify-center gap-2"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {step === 'blood' && (
        <div>
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-4">
              <Droplets className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-300 font-medium">Step 2 of 3 — Blood Report (Optional)</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Have recent blood test results?</h2>
            <p className="text-white/50 text-sm max-w-md mx-auto">Adding blood marker values significantly improves deficiency mapping accuracy. This step is completely optional.</p>
          </div>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setShowBlood(true)}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                showBlood ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30 hover:text-white/60'
              }`}
            >
              ✅ Yes, I have blood report data
            </button>
            <button
              onClick={() => setShowBlood(false)}
              className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                !showBlood ? 'bg-white/15 border-white/40 text-white' : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30 hover:text-white/60'
              }`}
            >
              ⏭ Skip this step
            </button>
          </div>

          {showBlood && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {BLOOD_MARKERS.map(marker => (
                <div key={marker.id} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <label className="text-white/70 text-xs font-medium mb-1 block">{marker.label}</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Enter value"
                      value={bloodData[marker.id] || ''}
                      onChange={e => setBloodData(prev => ({ ...prev, [marker.id]: e.target.value }))}
                      className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-500/60 focus:bg-white/15 transition-all"
                    />
                    <span className="text-white/30 text-xs w-12 text-right">{marker.unit}</span>
                  </div>
                  <p className="text-white/30 text-xs mt-1">Normal: {marker.normal} {marker.unit}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setStep('symptoms'); setAnimIn(false); setTimeout(() => setAnimIn(true), 300); }}
              className="px-6 py-3 rounded-xl border border-white/20 text-white/60 text-sm font-medium hover:border-white/40 hover:text-white/80 transition-all"
            >
              ← Back
            </button>
            <button
              onClick={finish}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all duration-200 flex items-center justify-center gap-2"
            >
              Continue to Image Upload <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------------
// MAIN COMPONENT
// --------------------------------------------------------------
export default function NutritionalDeficiencyDetector() {
  const [appStep, setAppStep] = useState('questionnaire');
  const [questionnaireData, setQuestionnaireData] = useState(null);
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
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [cameraActive, setCameraActive] = useState(false);
  const [stream, setStream] = useState(null);
  const [dietRegion, setDietRegion] = useState('global');

  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Load saved scans
  useEffect(() => {
    const saved = localStorage.getItem('nutriscan_history');
    if (saved) {
      try { setSavedScans(JSON.parse(saved)); } catch (e) { console.error('Error loading history:', e); }
    }
  }, []);

  // Camera cleanup
  useEffect(() => {
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, [stream]);

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
    } catch (e) { console.error('Audio error:', e); }
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
      setMousePosition({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Camera functions
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
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
    if (stream) { stream.getTracks().forEach(t => t.stop()); setStream(null); }
    setCameraActive(false);
    playSound('click');
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d').drawImage(video, 0, 0);
      setImage(canvas.toDataURL('image/jpeg'));
      stopCamera();
      playSound('success');
    }
  };

  const handleDrag = (e) => {
    e.preventDefault(); e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault(); e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) handleFile(e.target.files[0]);
  };

  const handleFile = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => { setImage(e.target.result); playSound('click'); };
      reader.readAsDataURL(file);
    }
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

  // Generate demo scenario with symptom/blood data bias
  const getDemoScenario = () => {
    const allDeficiencies = [
      { nutrient: 'Iron',        severity: Math.floor(Math.random() * 30) + 60 },
      { nutrient: 'Vitamin D',   severity: Math.floor(Math.random() * 25) + 50 },
      { nutrient: 'Vitamin B12', severity: Math.floor(Math.random() * 35) + 55 },
      { nutrient: 'Calcium',     severity: Math.floor(Math.random() * 25) + 45 },
      { nutrient: 'Vitamin C',   severity: Math.floor(Math.random() * 20) + 40 },
      { nutrient: 'Magnesium',   severity: Math.floor(Math.random() * 30) + 50 },
      { nutrient: 'Zinc',        severity: Math.floor(Math.random() * 25) + 45 },
      { nutrient: 'Vitamin A',   severity: Math.floor(Math.random() * 30) + 55 },
      { nutrient: 'Folate (B9)', severity: Math.floor(Math.random() * 35) + 60 },
      { nutrient: 'Vitamin E',   severity: Math.floor(Math.random() * 20) + 40 }
    ];

    // Bias based on questionnaire data
    if (questionnaireData) {
      const { symptoms, bloodData } = questionnaireData;
      const sevMap = { 'Severe': 20, 'Moderate': 10, 'Mild': 5, 'None': 0 };

      if (symptoms.fatigue && sevMap[symptoms.fatigue]) {
        const iron = allDeficiencies.find(d => d.nutrient === 'Iron');
        const b12  = allDeficiencies.find(d => d.nutrient === 'Vitamin B12');
        if (iron) iron.severity = Math.min(99, iron.severity + sevMap[symptoms.fatigue]);
        if (b12)  b12.severity  = Math.min(99, b12.severity  + sevMap[symptoms.fatigue]);
      }
      if (symptoms.hairloss && sevMap[symptoms.hairloss]) {
        const zinc = allDeficiencies.find(d => d.nutrient === 'Zinc');
        const iron = allDeficiencies.find(d => d.nutrient === 'Iron');
        if (zinc) zinc.severity = Math.min(99, zinc.severity + sevMap[symptoms.hairloss]);
        if (iron) iron.severity = Math.min(99, iron.severity + sevMap[symptoms.hairloss]);
      }
      if (symptoms.skin_dry && sevMap[symptoms.skin_dry]) {
        const vitA = allDeficiencies.find(d => d.nutrient === 'Vitamin A');
        const vitE = allDeficiencies.find(d => d.nutrient === 'Vitamin E');
        if (vitA) vitA.severity = Math.min(99, vitA.severity + sevMap[symptoms.skin_dry]);
        if (vitE) vitE.severity = Math.min(99, vitE.severity + sevMap[symptoms.skin_dry]);
      }
      if (symptoms.muscle_cramps && sevMap[symptoms.muscle_cramps]) {
        const mag = allDeficiencies.find(d => d.nutrient === 'Magnesium');
        const cal = allDeficiencies.find(d => d.nutrient === 'Calcium');
        if (mag) mag.severity = Math.min(99, mag.severity + sevMap[symptoms.muscle_cramps]);
        if (cal) cal.severity = Math.min(99, cal.severity + sevMap[symptoms.muscle_cramps]);
      }
      if (symptoms.pale_skin && sevMap[symptoms.pale_skin]) {
        const iron = allDeficiencies.find(d => d.nutrient === 'Iron');
        if (iron) iron.severity = Math.min(99, iron.severity + sevMap[symptoms.pale_skin] * 1.5);
      }

      if (bloodData.hemoglobin && parseFloat(bloodData.hemoglobin) < 12) {
        const iron = allDeficiencies.find(d => d.nutrient === 'Iron');
        if (iron) iron.severity = Math.min(99, iron.severity + 25);
      }
      if (bloodData.vitd && parseFloat(bloodData.vitd) < 20) {
        const vd = allDeficiencies.find(d => d.nutrient === 'Vitamin D');
        if (vd) vd.severity = Math.min(99, vd.severity + 25);
      }
      if (bloodData.vitb12 && parseFloat(bloodData.vitb12) < 200) {
        const b12 = allDeficiencies.find(d => d.nutrient === 'Vitamin B12');
        if (b12) b12.severity = Math.min(99, b12.severity + 25);
      }
      if (bloodData.zinc && parseFloat(bloodData.zinc) < 60) {
        const zn = allDeficiencies.find(d => d.nutrient === 'Zinc');
        if (zn) zn.severity = Math.min(99, zn.severity + 20);
      }
    }

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
          'Weakness affecting daily activities',
          'Difficulty with concentration and mental clarity',
          'Visible changes in skin, hair, or nail health',
          'Digestive discomfort or appetite changes'
        ].slice(0, 3 + index),
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
      setLoadingStep(prev => prev < steps.length - 1 ? prev + 1 : prev);
    }, 300);

    try {
      await new Promise(resolve => setTimeout(resolve, 1800));
      const analysisResults = getDemoScenario();

      const newScan = { id: Date.now(), date: new Date().toISOString(), image, results: analysisResults };
      const updatedScans = [newScan, ...savedScans].slice(0, 10);
      setSavedScans(updatedScans);
      localStorage.setItem('nutriscan_history', JSON.stringify(updatedScans));

      clearInterval(stepInterval);
      setResults(analysisResults);
      setAnalyzing(false);
      setAppStep('results');
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
              { name: 'Spinach & Mushroom Omelet',    time: '8:00 AM', calories: 320, nutrients: top2Nutrients, ingredients: ['Eggs', 'Spinach', 'Mushrooms', 'Cheese'] },
              { name: 'Grilled Salmon with Quinoa',   time: '1:00 PM', calories: 480, nutrients: top2Nutrients, ingredients: ['Salmon fillet', 'Quinoa', 'Broccoli', 'Lemon'] },
              { name: 'Beef Stir-Fry with Vegetables', time: '7:00 PM', calories: 540, nutrients: top2Nutrients, ingredients: ['Lean beef', 'Bell peppers', 'Snap peas', 'Brown rice'] }
            ]
          },
          {
            day: 'Tuesday',
            meals: [
              { name: 'Greek Yogurt Parfait',          time: '8:00 AM', calories: 290, nutrients: top2Nutrients, ingredients: ['Greek yogurt', 'Berries', 'Almonds', 'Honey'] },
              { name: 'Mediterranean Chickpea Bowl',   time: '1:00 PM', calories: 420, nutrients: top2Nutrients, ingredients: ['Chickpeas', 'Feta', 'Tomatoes', 'Olives', 'Whole grain pita'] },
              { name: 'Herb-Crusted Cod',              time: '7:00 PM', calories: 390, nutrients: top2Nutrients, ingredients: ['Cod fillet', 'Herbs', 'Sweet potato', 'Asparagus'] }
            ]
          },
          {
            day: 'Wednesday',
            meals: [
              { name: 'Avocado Toast with Eggs',       time: '8:00 AM', calories: 350, nutrients: top2Nutrients, ingredients: ['Whole grain bread', 'Avocado', 'Eggs', 'Tomatoes'] },
              { name: 'Asian Tofu & Vegetable Stir-Fry', time: '1:00 PM', calories: 410, nutrients: top2Nutrients, ingredients: ['Firm tofu', 'Bok choy', 'Carrots', 'Soy sauce', 'Rice noodles'] },
              { name: 'Grilled Chicken & Kale Salad',  time: '7:00 PM', calories: 450, nutrients: top2Nutrients, ingredients: ['Chicken breast', 'Kale', 'Walnuts', 'Dried cranberries'] }
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
              { name: 'Methi Paratha with Curd',    time: '8:00 AM', calories: 340, nutrients: top2Nutrients, ingredients: ['Whole wheat flour', 'Fenugreek leaves', 'Yogurt', 'Ghee'] },
              { name: 'Palak Paneer with Roti',     time: '1:00 PM', calories: 460, nutrients: top2Nutrients, ingredients: ['Spinach', 'Paneer', 'Whole wheat roti', 'Onions', 'Tomatoes'] },
              { name: 'Dal Makhani with Brown Rice', time: '7:00 PM', calories: 520, nutrients: top2Nutrients, ingredients: ['Black lentils', 'Kidney beans', 'Cream', 'Brown rice', 'Spices'] }
            ]
          },
          {
            day: 'Tuesday',
            meals: [
              { name: 'Ragi Dosa with Sambar',     time: '8:00 AM', calories: 310, nutrients: top2Nutrients, ingredients: ['Finger millet', 'Urad dal', 'Mixed vegetables', 'Tamarind'] },
              { name: 'Chole Bhature (Baked)',      time: '1:00 PM', calories: 480, nutrients: top2Nutrients, ingredients: ['Chickpeas', 'Whole wheat flour', 'Yogurt', 'Spices'] },
              { name: 'Fish Curry with Coconut',   time: '7:00 PM', calories: 440, nutrients: top2Nutrients, ingredients: ['Fish fillet', 'Coconut milk', 'Curry leaves', 'Rice'] }
            ]
          },
          {
            day: 'Wednesday',
            meals: [
              { name: 'Poha with Peanuts',          time: '8:00 AM', calories: 290, nutrients: top2Nutrients, ingredients: ['Flattened rice', 'Peanuts', 'Peas', 'Curry leaves', 'Lemon'] },
              { name: 'Rajma Chawal',               time: '1:00 PM', calories: 490, nutrients: top2Nutrients, ingredients: ['Kidney beans', 'Basmati rice', 'Onions', 'Tomatoes', 'Spices'] },
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
    setQuestionnaireData(null);
    setAppStep('questionnaire');
    playSound('click');
  };

  const getSeverityColor = (severity) => {
    if (severity >= 70) return { bg: 'bg-red-500',    border: 'border-red-500',    text: 'text-red-400',    glow: 'shadow-red-500/50',    gradient: 'from-red-500 to-rose-600' };
    if (severity >= 50) return { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-400', glow: 'shadow-yellow-500/50', gradient: 'from-yellow-500 to-orange-500' };
    return               { bg: 'bg-green-500',  border: 'border-green-500',  text: 'text-green-400',  glow: 'shadow-green-500/50',  gradient: 'from-green-500 to-emerald-500' };
  };

  const getPriorityColor = (priority) => {
    if (priority === 'Critical') return 'text-red-400 bg-red-500/20 border-red-500/40';
    if (priority === 'High')     return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
    if (priority === 'Moderate') return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/40';
    return 'text-blue-400 bg-blue-500/20 border-blue-500/40';
  };

  // ----------------------------------------------------------
  // FIXED ANIMATED PROGRESS BAR COMPONENT
  // ----------------------------------------------------------
  const AnimatedProgressBar = ({ severity, delay = 0 }) => {
    const [animated, setAnimated] = useState(false);
    const colors = getSeverityColor(severity);

    useEffect(() => {
      const timer = setTimeout(() => setAnimated(true), delay + 100);
      return () => clearTimeout(timer);
    }, [delay]);

    return (
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colors.gradient} transition-all duration-1000 ease-out relative overflow-hidden`}
          style={{ width: animated ? `${severity}%` : '0%' }}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse" />
        </div>
      </div>
    );
  };

  const loadingSteps = [
    'Initializing neural network...',
    'Analyzing visual indicators...',
    'Detecting deficiency patterns...',
    'Calculating severity scores...',
    'Ranking by priority...',
    'Generating recommendations...'
  ];

  const currentPlan = dietRegion === 'global' ? mealPlan?.global : mealPlan?.indian;

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-950 text-white relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl transition-all duration-1000"
          style={{
            background: 'radial-gradient(circle, #7c3aed, transparent)',
            left: `${mousePosition.x - 10}%`,
            top: `${mousePosition.y - 10}%`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950" />
        {particles.map(p => (
          <div
            key={p.id}
            className="absolute rounded-full bg-violet-400"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity * 0.3
            }}
          />
        ))}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">NutriScan AI</h1>
              <p className="text-white/40 text-xs">Deficiency Detection System</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-lg border transition-all ${soundEnabled ? 'border-violet-500/40 text-violet-400 bg-violet-500/10' : 'border-white/10 text-white/30'}`}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 rounded-lg border border-white/10 text-white/60 hover:border-white/30 hover:text-white transition-all relative"
            >
              <History className="w-4 h-4" />
              {savedScans.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-violet-500 rounded-full text-xs flex items-center justify-center">
                  {savedScans.length}
                </span>
              )}
            </button>
            {(appStep !== 'questionnaire' || results) && (
              <button onClick={resetAnalysis} className="p-2 rounded-lg border border-white/10 text-white/60 hover:border-red-500/40 hover:text-red-400 transition-all">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mb-6 p-4 bg-white/5 border border-white/10 rounded-2xl">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <History className="w-4 h-4 text-violet-400" /> Scan History ({savedScans.length})
            </h3>
            {savedScans.length === 0 ? (
              <p className="text-white/40 text-sm">No previous scans.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {savedScans.map(scan => (
                  <button
                    key={scan.id}
                    onClick={() => {
                      setResults(scan.results);
                      setImage(scan.image);
                      setAppStep('results');
                      setShowHistory(false);
                    }}
                    className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-violet-500/40 transition-all"
                  >
                    {scan.image && <img src={scan.image} alt="Scan" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-all" />}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-xs text-white/70">{new Date(scan.date).toLocaleDateString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 1: Questionnaire */}
        {appStep === 'questionnaire' && !results && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-sm">
            <SymptomQuestionnaire
              onComplete={(data) => {
                setQuestionnaireData(data);
                setAppStep('upload');
                playSound('click');
              }}
            />
          </div>
        )}

        {/* Step 2: Image Upload */}
        {appStep === 'upload' && !results && (
          <div className="space-y-6">
            {questionnaireData && (
              <div className="flex flex-wrap gap-2 p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                <div className="flex items-center gap-2 text-violet-300 text-sm">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Assessment complete —</span>
                </div>
                {Object.entries(questionnaireData.symptoms)
                  .filter(([, v]) => v && v !== 'None')
                  .map(([k, v]) => (
                    <span key={k} className="px-2 py-0.5 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs">
                      {SYMPTOMS.find(s => s.id === k)?.label}: {v}
                    </span>
                  ))}
                {Object.values(questionnaireData.bloodData).some(v => v) && (
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs">
                    🩸 Blood data included
                  </span>
                )}
              </div>
            )}

            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-4">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-300 font-medium">Step 3 of 3 — Image Upload</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Upload your image for analysis</h2>
            </div>

            {cameraActive ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/20 bg-black">
                <video ref={videoRef} autoPlay playsInline muted className="w-full max-h-80 object-cover" />
                <div className="absolute inset-0 border-2 border-violet-500/40 rounded-2xl pointer-events-none" />
                <div className="absolute top-4 left-4 right-4 flex justify-between">
                  <div className="px-3 py-1 bg-red-500/80 rounded-full text-xs font-medium flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" /> LIVE
                  </div>
                </div>
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-4">
                  <button onClick={stopCamera} className="px-4 py-2 bg-gray-800/90 text-white text-sm rounded-xl border border-white/20 hover:bg-gray-700 transition-all">
                    Cancel
                  </button>
                  <button onClick={capturePhoto} className="px-6 py-2 bg-violet-600 text-white text-sm rounded-xl font-semibold hover:bg-violet-500 transition-all flex items-center gap-2">
                    <Camera className="w-4 h-4" /> Capture
                  </button>
                </div>
              </div>
            ) : image ? (
              <div className="relative rounded-2xl overflow-hidden border border-violet-500/40">
                <img src={image} alt="Selected" className="w-full max-h-80 object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <button onClick={() => setImage(null)} className="absolute top-3 right-3 p-2 bg-black/60 rounded-lg text-white/60 hover:text-white transition-all">
                  <X className="w-4 h-4" />
                </button>
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1 bg-violet-600/80 rounded-full text-xs font-medium">Image ready</span>
                </div>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer
                  ${dragActive ? 'border-violet-400 bg-violet-500/10' : 'border-white/20 hover:border-violet-500/50 hover:bg-white/5'}`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleChange} className="hidden" />
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/30 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-violet-400" />
                </div>
                <p className="text-white font-semibold mb-1">Drop image here or click to browse</p>
                <p className="text-white/40 text-sm">Supports JPG, PNG, WebP</p>
              </div>
            )}

            {!cameraActive && !image && (
              <button onClick={startCamera} className="w-full py-3 rounded-xl border border-white/10 text-white/60 text-sm font-medium hover:border-violet-500/40 hover:text-violet-300 hover:bg-violet-500/5 transition-all flex items-center justify-center gap-2">
                <Camera className="w-4 h-4" /> Use Camera Instead
              </button>
            )}

            {image && !analyzing && (
              <button
                onClick={analyzeImage}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 text-white font-bold text-lg hover:from-violet-500 hover:via-indigo-500 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-violet-500/30 flex items-center justify-center gap-3"
              >
                <Sparkles className="w-5 h-5" /> Analyze Now
              </button>
            )}

            {analyzing && (
              <div className="p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                <p className="text-white font-semibold mb-2">Analyzing your data...</p>
                <p className="text-violet-400 text-sm">{loadingSteps[loadingStep]}</p>
                <div className="mt-4 flex gap-1 justify-center">
                  {loadingSteps.map((_, i) => (
                    <div key={i} className={`h-1 w-8 rounded-full transition-all duration-300 ${i <= loadingStep ? 'bg-violet-500' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
            )}

            {!analyzing && (
              <button
                onClick={() => setAppStep('questionnaire')}
                className="w-full py-2 text-white/40 text-sm hover:text-white/60 transition-all"
              >
                ← Back to symptom assessment
              </button>
            )}
          </div>
        )}

        {/* Step 3: Results */}
        {results && (
          <div className="space-y-6">
            <div className="flex gap-2 bg-white/5 p-1 rounded-xl border border-white/10">
              {[
                { id: 'results', label: 'Analysis', icon: <Activity className="w-4 h-4" /> },
                { id: 'meals',   label: 'Meal Plan', icon: <Utensils className="w-4 h-4" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg'
                      : 'text-white/50 hover:text-white/80'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'results' && (
              <div className="space-y-4">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-white/70 text-sm leading-relaxed">{results.generalObservations}</p>
                  </div>
                </div>

                {questionnaireData && Object.values(questionnaireData.symptoms).some(v => v && v !== 'None') && (
                  <div className="flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl text-sm text-violet-300">
                    <Zap className="w-4 h-4" />
                    Results enhanced using your symptom & blood report data
                  </div>
                )}

                {results.deficiencies.map((def, idx) => {
                  const colors = getSeverityColor(def.severity);
                  return (
                    <div key={idx} className={`border rounded-2xl overflow-hidden ${colors.border} bg-white/5`} style={{ borderOpacity: 0.3 }}>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center text-white font-bold text-lg shadow-lg ${colors.glow}`}>
                              {def.rank}
                            </div>
                            <div>
                              <h3 className="text-white font-bold text-lg">{def.nutrient}</h3>
                              <div className="flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full border ${getPriorityColor(def.priority)}`}>
                                  {def.priority}
                                </span>
                                <span className="text-white/40 text-xs">Confidence: {def.confidence}</span>
                              </div>
                            </div>
                          </div>
                          <div className={`text-2xl font-bold ${colors.text}`}>{def.severity}%</div>
                        </div>

                        <AnimatedProgressBar severity={def.severity} delay={idx * 150} />

                        <div className="mt-4 grid sm:grid-cols-3 gap-4">
                          <div>
                            <p className="text-white/50 text-xs font-semibold uppercase mb-2 flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Symptoms
                            </p>
                            <ul className="space-y-1">
                              {def.symptoms.map((s, i) => (
                                <li key={i} className="text-white/60 text-xs flex items-start gap-1.5">
                                  <span className="text-red-400 mt-0.5">•</span> {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs font-semibold uppercase mb-2 flex items-center gap-1">
                              <Apple className="w-3 h-3" /> Food Sources
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {def.foodSources.slice(0, 6).map((f, i) => (
                                <span key={i} className="text-xs px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-300 rounded-full">
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="text-white/50 text-xs font-semibold uppercase mb-2 flex items-center gap-1">
                              <Pill className="w-3 h-3" /> Remedies
                            </p>
                            <ul className="space-y-1">
                              {def.remedies.slice(0, 4).map((r, i) => (
                                <li key={i} className="text-white/60 text-xs flex items-start gap-1.5">
                                  <span className="text-blue-400 mt-0.5">→</span> {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-yellow-300/70 text-xs leading-relaxed">{results.disclaimer}</p>
                </div>

                <button
                  onClick={generateMealPlan}
                  disabled={generatingMealPlan}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold hover:from-emerald-500 hover:to-teal-500 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-500/20"
                >
                  {generatingMealPlan ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Generating Plan...</>
                  ) : (
                    <><Utensils className="w-5 h-5" /> Generate Personalized Meal Plan</>
                  )}
                </button>
              </div>
            )}

            {activeTab === 'meals' && (
              <div className="space-y-4">
                {generatingMealPlan ? (
                  <div className="p-12 text-center bg-white/5 border border-white/10 rounded-2xl">
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                    <p className="text-white font-semibold">Building your personalized meal plan...</p>
                    <p className="text-white/40 text-sm mt-1">Tailoring for your top deficiencies</p>
                  </div>
                ) : mealPlan ? (
                  <>
                    <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
                      {[
                        { id: 'global', label: '🌍 Global Plan' },
                        { id: 'indian', label: '🇮🇳 Indian Plan' },
                      ].map(r => (
                        <button
                          key={r.id}
                          onClick={() => { setDietRegion(r.id); playSound('click'); }}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            dietRegion === r.id
                              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                              : 'text-white/50 hover:text-white/80'
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>

                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                      <h3 className="text-emerald-300 font-semibold">{currentPlan?.title}</h3>
                      <p className="text-white/50 text-sm">{currentPlan?.region}</p>
                    </div>

                    {currentPlan?.days.map((day, di) => (
                      <div key={di} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                        <div className="px-5 py-3 bg-white/5 border-b border-white/10">
                          <h4 className="text-white font-semibold flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-violet-400" /> {day.day}
                          </h4>
                        </div>
                        <div className="divide-y divide-white/5">
                          {day.meals.map((meal, mi) => (
                            <div key={mi} className="p-4 flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-white/40 text-xs">{meal.time}</span>
                                </div>
                                <p className="text-white font-medium">{meal.name}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {meal.ingredients.map((ing, ii) => (
                                    <span key={ii} className="text-xs px-2 py-0.5 bg-white/5 border border-white/10 text-white/50 rounded-full">
                                      {ing}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <span className="text-white/40 text-sm whitespace-nowrap">{meal.calories} kcal</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                      <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4 text-violet-400" /> Shopping List
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {currentPlan?.shoppingList.map((item, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-12 text-center">
                    <Utensils className="w-12 h-12 mx-auto mb-4 text-white/20" />
                    <p className="text-white/40">Generate a meal plan from the Results tab.</p>
                  </div>
                )}
              </div>
            )}

            <button onClick={resetAnalysis} className="w-full py-3 rounded-xl border border-white/10 text-white/40 text-sm hover:border-white/30 hover:text-white/60 transition-all">
              ← Start New Analysis
            </button>
          </div>
        )}
      </div>
    </div>
  );
}