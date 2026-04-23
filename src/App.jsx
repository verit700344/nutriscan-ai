import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, Upload, Sparkles, AlertCircle, CheckCircle, Pill, Apple, Info,
  ArrowRight, Zap, Activity, Droplets, Calendar, Utensils, ShoppingCart,
  History, Volume2, X, Fingerprint, Hand, Eye, MessageCircle
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

const bodyPartIcons = {
  'Nails': <Fingerprint className="w-4 h-4" />,
  'Palm': <Hand className="w-4 h-4" />,
  'Lips': <MessageCircle className="w-4 h-4" />,
  'Tongue': <Eye className="w-4 h-4" />
};

function SymptomQuestionnaire({ onComplete }) {
  const [step, setStep] = useState('symptoms');
  const [symptoms, setSymptoms] = useState({});
  const [showBlood, setShowBlood] = useState(false);
  const [bloodData, setBloodData] = useState({});

  const setSeverity = (id, val) => setSymptoms(prev => ({ ...prev, [id]: val }));

  const severityColor = (val) => {
    if (val === 'Severe')   return 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-red-500/40';
    if (val === 'Moderate') return 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-yellow-500/40';
    if (val === 'Mild')     return 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-blue-500/40';
    return 'bg-white/5 text-white/40 border-white/10';
  };

  return (
    <AnimatePresence mode="wait">
      {step === 'symptoms' && (
        <motion.div
          key="symptoms"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-neon-purple/30 mb-4"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Activity className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm text-neon-cyan font-medium">Step 1 of 3 — Symptom Assessment</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">How are you feeling?</h2>
            <p className="text-white/50 text-sm max-w-md mx-auto">Rate each symptom to help us better map your deficiency profile before image analysis.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {SYMPTOMS.map((sym, idx) => {
              const val = symptoms[sym.id] || 'None';
              return (
                <motion.div
                  key={sym.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="glass-card rounded-xl p-4 hover:border-neon-purple/40 transition-all duration-300"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl">{sym.icon}</span>
                    <div>
                      <p className="text-white text-sm font-semibold">{sym.label}</p>
                      <p className="text-white/40 text-xs">{sym.desc}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {SEVERITY_OPTIONS.map(opt => (
                      <motion.button
                        key={opt}
                        onClick={() => setSeverity(sym.id, opt)}
                        className={`flex-1 py-1.5 text-xs rounded-lg border transition-all duration-200 font-medium ${
                          val === opt 
                            ? severityColor(opt) 
                            : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <motion.button
            onClick={() => setStep('blood')}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-neon-purple-600 to-neon-cyan-600 text-white font-semibold shadow-lg shadow-neon-purple-500/20"
            whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(139, 92, 246, 0.4)" }}
            whileTap={{ scale: 0.98 }}
          >
            Continue <ArrowRight className="w-4 h-4 inline ml-1" />
          </motion.button>
        </motion.div>
      )}

      {step === 'blood' && (
        <motion.div
          key="blood"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center mb-8">
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 border border-neon-cyan/30 mb-4"
              whileHover={{ scale: 1.05 }}
            >
              <Droplets className="w-4 h-4 text-neon-cyan" />
              <span className="text-sm text-neon-cyan font-medium">Step 2 of 3 — Blood Report (Optional)</span>
            </motion.div>
            <h2 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">Have recent blood test results?</h2>
            <p className="text-white/50 text-sm max-w-md mx-auto">Adding blood marker values significantly improves deficiency mapping accuracy. This step is completely optional.</p>
          </div>

          <div className="flex gap-3 mb-6">
            {[true, false].map((show) => (
              <motion.button
                key={show}
                onClick={() => setShowBlood(show)}
                className={`flex-1 py-3 rounded-xl border text-sm font-medium transition-all ${
                  showBlood === show
                    ? 'bg-gradient-to-r from-neon-cyan-600 to-neon-blue-600 text-white border-neon-cyan-500 shadow-lg shadow-neon-cyan-500/20'
                    : 'glass-card text-white/60 hover:text-white/90 border-white/10 hover:border-neon-cyan/40'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {show ? '✅ Yes, I have blood report data' : '⏭ Skip this step'}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {showBlood && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
              >
                {BLOOD_MARKERS.map((marker) => (
                  <div key={marker.id} className="glass-card rounded-xl p-4">
                    <label className="text-white/70 text-xs font-medium mb-1 block">{marker.label}</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Enter value"
                        value={bloodData[marker.id] || ''}
                        onChange={e => setBloodData(prev => ({ ...prev, [marker.id]: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm
                          placeholder-white/30 focus:outline-none focus:border-neon-cyan-500/60 focus:ring-1 focus:ring-neon-cyan-500/60"
                      />
                      <span className="text-white/30 text-xs w-12 text-right">{marker.unit}</span>
                    </div>
                    <p className="text-white/30 text-xs mt-1">Normal: {marker.normal} {marker.unit}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            <motion.button
              onClick={() => setStep('symptoms')}
              className="px-6 py-3 rounded-xl glass-card text-white/70 text-sm font-medium hover:text-white hover:border-neon-purple/40 transition-all"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Back
            </motion.button>
            <motion.button
              onClick={() => onComplete({ symptoms, bloodData: showBlood ? bloodData : {} })}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-neon-cyan-600 to-neon-blue-600 text-white font-semibold shadow-lg shadow-neon-cyan-500/20"
              whileHover={{ scale: 1.02, boxShadow: "0 0 25px rgba(34, 211, 238, 0.4)" }}
              whileTap={{ scale: 0.98 }}
            >
              Continue to Image Upload <ArrowRight className="w-4 h-4 inline ml-1" />
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// --------------------------------------------------------------
// BODY PART SELECTOR COMPONENT
// --------------------------------------------------------------
function BodyPartSelector({ selectedPart, onSelect }) {
  const bodyParts = ['Nails', 'Palm', 'Lips', 'Tongue'];
  
  return (
    <div className="mb-6">
      <label className="text-white/70 text-sm font-medium mb-2 block">Recommended body part for analysis:</label>
      <div className="flex flex-wrap gap-3">
        {bodyParts.map((part) => (
          <motion.button
            key={part}
            onClick={() => onSelect(part)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-200 ${
              selectedPart === part
                ? 'bg-gradient-to-r from-neon-purple-600 to-neon-cyan-600 text-white border-transparent shadow-lg shadow-neon-purple-500/20'
                : 'glass-card text-white/60 hover:text-white border-white/10 hover:border-neon-purple/40'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {bodyPartIcons[part]}
            <span>{part}</span>
          </motion.button>
        ))}
      </div>
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
  const [selectedBodyPart, setSelectedBodyPart] = useState('');

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
    const newParticles = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.4 + 0.1
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
    if (file && file.type.startsWith('image/') && selectedBodyPart) {
      const reader = new FileReader();
      reader.onload = (e) => { setImage(e.target.result); playSound('click'); };
      reader.readAsDataURL(file);
    } else if (!selectedBodyPart) {
      alert('Please select a body part (Nails, Palm, Lips, or Tongue) first.');
    } else {
      alert('Please upload a valid image file.');
    }
  };

  // Fixed: Corrected string for Folate (B9)
  const getFoodSources = (nutrient) => {
    const sources = {
      'Iron': ['Red meat', 'Spinach', 'Lentils', 'Fortified cereals', 'Oysters', 'Dark chocolate', 'Pumpkin seeds', 'Quinoa', 'Turkey', 'Broccoli'],
      'Vitamin D': ['Salmon', 'Egg yolks', 'Fortified milk', 'Mushrooms', 'Tuna', 'Cod liver oil', 'Fortified orange juice'],
      'Vitamin B12': ['Beef', 'Fish', 'Eggs', 'Dairy products', 'Fortified cereals', 'Nutritional yeast'],
      'Calcium': ['Milk', 'Cheese', 'Yogurt', 'Leafy greens', 'Almonds', 'Sardines with bones', 'Fortified tofu'],
      'Vitamin C': ['Oranges', 'Strawberries', 'Bell peppers', 'Broccoli', 'Kiwi', 'Tomatoes'],
      'Magnesium': ['Almonds', 'Spinach', 'Black beans', 'Avocado', 'Dark chocolate', 'Pumpkin seeds'],
      'Zinc': ['Oysters', 'Beef', 'Pumpkin seeds', 'Lentils', 'Chickpeas', 'Cashews'],
      'Vitamin A': ['Sweet potatoes', 'Carrots', 'Spinach', 'Kale', 'Butternut squash', 'Cantaloupe'],
      'Folate (B9)': ['Leafy greens', 'Legumes', 'A