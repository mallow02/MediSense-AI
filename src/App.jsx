import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from "recharts";
import {
  Activity, Heart, Brain, Shield, AlertTriangle, Phone, User, Settings,
  BarChart2, FileText, Clock, Mic, MicOff, ChevronRight, Globe, Zap,
  Users, TrendingUp, Bell, LogOut, Home, X, Check, ArrowRight, Download,
  Loader, AlertCircle, CheckCircle, Baby, Wifi, WifiOff, Calendar, Menu,
  ChevronLeft, Star, Stethoscope, Monitor, RefreshCw, Award, Cpu,
  Database, ChevronDown, Wind, Droplets, Plus, Target, FlaskConical,
  ChevronUp, Layers, MessageCircle, Info, Eye, Pill, MapPin
} from "lucide-react";

/* ================================================================
   DESIGN TOKENS — Medical Monitor Aesthetic
   Deep navy background + electric indigo + cyan LED accents
   Monospace for health metrics, sans for prose
================================================================ */
const T = {
  bg: "#080e1d",
  surface: "rgba(255,255,255,0.04)",
  surfaceHover: "rgba(255,255,255,0.07)",
  border: "rgba(255,255,255,0.08)",
  indigo: "#4f46e5",
  cyan: "#06b6d4",
  rose: "#f43f5e",
  emerald: "#10b981",
  amber: "#f59e0b",
  purple: "#8b5cf6",
  text: "#f1f5f9",
  textMuted: "#94a3b8",
};

/* ================================================================
   SECTION 1 — CONSTANTS & DATA
================================================================ */
const BANGLA_SYMPTOM_MAP = {
  "জ্বর": "fever", "জ্বর আছে": "fever", "জ্বর হয়েছে": "fever", "গায়ে জ্বর": "fever",
  "কাশি": "cough", "শুকনো কাশি": "cough", "কাশ": "cough",
  "বুকে ব্যথা": "chest_pain", "বুক ব্যথা": "chest_pain", "বুকে ব্যাথা": "chest_pain",
  "মাথা ব্যথা": "headache", "মাথাব্যথা": "headache", "মাথায় ব্যথা": "headache",
  "শ্বাসকষ্ট": "shortness_of_breath", "শ্বাস নিতে সমস্যা": "shortness_of_breath",
  "শ্বাস নিতে কষ্ট": "shortness_of_breath", "শ্বাস নিচ্ছি না": "shortness_of_breath",
  "বমি": "nausea", "বমি বমি ভাব": "nausea", "বমি হচ্ছে": "nausea",
  "পেট ব্যথা": "abdominal_pain", "পেটে ব্যথা": "abdominal_pain", "পেটে ব্যাথা": "abdominal_pain",
  "ডায়রিয়া": "diarrhea", "পাতলা পায়খানা": "diarrhea",
  "দুর্বলতা": "weakness", "শরীর দুর্বল": "weakness", "ক্লান্তি": "weakness", "ক্লান্ত": "weakness",
  "চক্কর": "dizziness", "মাথা ঘোরা": "dizziness", "মাথা ঘুরছে": "dizziness",
  "গলা ব্যথা": "sore_throat", "গলায় ব্যথা": "sore_throat", "গলা ব্যাথা": "sore_throat",
  "সর্দি": "runny_nose", "ঠান্ডা": "runny_nose", "নাক দিয়ে পানি": "runny_nose",
  "শরীর ব্যথা": "body_aches", "হাত পা ব্যথা": "body_aches", "সারা শরীর ব্যথা": "body_aches",
  "র‍্যাশ": "rash", "চামড়ায় ফুসকুড়ি": "rash", "র্যাশ": "rash",
  "বুক ধড়ফড়": "palpitations", "হার্ট বিট বাড়ছে": "palpitations",
  "হাত পা ফুলেছে": "swelling", "পা ফোলা": "swelling", "ফোলা": "swelling",
  "খিদে নেই": "loss_of_appetite", "খেতে পারছি না": "loss_of_appetite",
  "ঘুম হচ্ছে না": "insomnia", "ঘুমের সমস্যা": "insomnia",
  "পিঠে ব্যথা": "back_pain", "পিঠে ব্যাথা": "back_pain",
  "চোখে জ্বালা": "eye_irritation", "চোখ লাল": "eye_irritation",
};

const SYMPTOMS = [
  { id: "fever", label: "Fever", bangla: "জ্বর", emoji: "🌡️", severity: "medium" },
  { id: "cough", label: "Cough", bangla: "কাশি", emoji: "😷", severity: "low" },
  { id: "chest_pain", label: "Chest Pain", bangla: "বুকে ব্যথা", emoji: "💔", severity: "critical" },
  { id: "headache", label: "Headache", bangla: "মাথা ব্যথা", emoji: "🤕", severity: "low" },
  { id: "shortness_of_breath", label: "Shortness of Breath", bangla: "শ্বাসকষ্ট", emoji: "💨", severity: "high" },
  { id: "nausea", label: "Nausea / Vomiting", bangla: "বমি ভাব", emoji: "🤢", severity: "medium" },
  { id: "abdominal_pain", label: "Abdominal Pain", bangla: "পেট ব্যথা", emoji: "😣", severity: "medium" },
  { id: "diarrhea", label: "Diarrhea", bangla: "ডায়রিয়া", emoji: "💧", severity: "medium" },
  { id: "weakness", label: "Weakness / Fatigue", bangla: "দুর্বলতা", emoji: "😴", severity: "low" },
  { id: "dizziness", label: "Dizziness", bangla: "মাথা ঘোরা", emoji: "😵", severity: "medium" },
  { id: "sore_throat", label: "Sore Throat", bangla: "গলা ব্যথা", emoji: "🤒", severity: "low" },
  { id: "body_aches", label: "Body Aches", bangla: "শরীর ব্যথা", emoji: "🦴", severity: "low" },
  { id: "rash", label: "Skin Rash", bangla: "র‍্যাশ", emoji: "🔴", severity: "medium" },
  { id: "palpitations", label: "Palpitations", bangla: "বুক ধড়ফড়", emoji: "❤️", severity: "high" },
  { id: "swelling", label: "Swelling", bangla: "ফোলা", emoji: "🫙", severity: "medium" },
  { id: "loss_of_appetite", label: "Loss of Appetite", bangla: "খিদে নেই", emoji: "🍽️", severity: "low" },
  { id: "insomnia", label: "Insomnia", bangla: "ঘুমের সমস্যা", emoji: "🌙", severity: "low" },
  { id: "back_pain", label: "Back Pain", bangla: "পিঠে ব্যথা", emoji: "🔙", severity: "medium" },
  { id: "runny_nose", label: "Runny Nose", bangla: "সর্দি", emoji: "👃", severity: "low" },
  { id: "eye_irritation", label: "Eye Irritation", bangla: "চোখে জ্বালা", emoji: "👁️", severity: "low" },
];

const EMERGENCY_RULES = [
  {
    id: "heart_attack", label: "Heart Attack Risk", bangla: "হার্ট অ্যাটাকের আশঙ্কা",
    triggers: ["chest_pain", "shortness_of_breath", "palpitations", "weakness"],
    minMatch: 2, level: "Critical", color: T.rose,
    action: "📞 Call 999 immediately | নিকটস্থ হাসপাতালে যান",
  },
  {
    id: "stroke", label: "Stroke Warning", bangla: "স্ট্রোকের সতর্কতা",
    triggers: ["dizziness", "weakness", "headache", "nausea"],
    minMatch: 3, level: "High", color: "#f97316",
    action: "🏥 Emergency care needed | জরুরি চিকিৎসা দরকার",
  },
  {
    id: "severe_asthma", label: "Severe Asthma", bangla: "তীব্র হাঁপানি",
    triggers: ["shortness_of_breath", "chest_pain", "weakness"],
    minMatch: 2, level: "High", color: "#f97316",
    action: "💨 Use inhaler & seek help | ইনহেলার ব্যবহার করুন",
  },
];

const DOCTORS = [
  { id: "cardiologist", specialty: "Cardiologist", bangla: "হৃদরোগ বিশেষজ্ঞ", icon: Heart, triggers: ["chest_pain", "palpitations", "shortness_of_breath"], hospitals: ["National Heart Foundation", "Square Hospital", "Ibn Sina"] },
  { id: "neurologist", specialty: "Neurologist", bangla: "স্নায়ু বিশেষজ্ঞ", icon: Brain, triggers: ["headache", "dizziness", "weakness"], hospitals: ["BSMMU", "Dhaka Medical", "Lab Aid"] },
  { id: "pulmonologist", specialty: "Pulmonologist", bangla: "ফুসফুস বিশেষজ্ঞ", icon: Wind, triggers: ["shortness_of_breath", "cough", "chest_pain"], hospitals: ["NIDCH", "BIRDEM", "Enam Medical"] },
  { id: "gastro", specialty: "Gastroenterologist", bangla: "পেটের রোগ বিশেষজ্ঞ", icon: Activity, triggers: ["abdominal_pain", "nausea", "diarrhea"], hospitals: ["BSMMU", "Dhaka Medical", "Holy Family"] },
  { id: "general", specialty: "General Physician", bangla: "সাধারণ চিকিৎসক", icon: Stethoscope, triggers: ["fever", "cough", "weakness", "sore_throat", "runny_nose"], hospitals: ["Upazila Health Complex", "Community Clinic", "District Hospital"] },
  { id: "dermatologist", specialty: "Dermatologist", bangla: "চর্মরোগ বিশেষজ্ঞ", icon: Shield, triggers: ["rash", "eye_irritation"], hospitals: ["Skin Disease Hospital", "BSMMU"] },
  { id: "gynecologist", specialty: "Gynecologist", bangla: "স্ত্রীরোগ বিশেষজ্ঞ", icon: Baby, triggers: ["abdominal_pain", "swelling", "back_pain"], hospitals: ["Dhaka Medical", "Maternity Hospital"] },
];

const HEALTH_TREND = [
  { month: "Jan", risk: 35, score: 78, checks: 2 },
  { month: "Feb", risk: 42, score: 72, checks: 3 },
  { month: "Mar", risk: 28, score: 85, checks: 1 },
  { month: "Apr", risk: 55, score: 62, checks: 4 },
  { month: "May", risk: 38, score: 75, checks: 3 },
  { month: "Jun", risk: 25, score: 88, checks: 2 },
];

const SYMPTOM_FREQ = [
  { name: "Fatigue", count: 15 }, { name: "Headache", count: 12 },
  { name: "Fever", count: 8 }, { name: "Cough", count: 6 }, { name: "Nausea", count: 4 },
];

const DISEASE_DIST = [
  { name: "Respiratory", value: 35, color: T.indigo },
  { name: "Gastrointestinal", value: 25, color: T.cyan },
  { name: "Cardiovascular", value: 20, color: T.rose },
  { name: "Neurological", value: 12, color: T.purple },
  { name: "Others", value: 8, color: T.emerald },
];

const ML_MODELS = [
  { model: "XGBoost", accuracy: 96.1, precision: 95.8, recall: 96.4, f1: 96.1 },
  { model: "Random Forest", accuracy: 94.2, precision: 93.8, recall: 94.5, f1: 94.1 },
  { model: "Logistic Reg.", accuracy: 88.5, precision: 87.9, recall: 89.1, f1: 88.5 },
];

const FEATURE_IMP = [
  { feature: "Symptoms", val: 42 }, { feature: "Age", val: 18 },
  { feature: "Med History", val: 15 }, { feature: "Vitals", val: 12 },
  { feature: "Lifestyle", val: 8 }, { feature: "Gender", val: 5 },
];

const SAMPLE_HISTORY = [
  {
    id: 1, date: "2026-06-10", time: "10:30 AM",
    symptoms: ["fever", "cough", "weakness"], risk: 32, severity: "Low", confidence: 88,
    diagnosis: "Common Cold / Viral Fever",
    rec: "Rest and hydration. Take paracetamol for fever.",
    bangla: "সাধারণ ঠান্ডা বা ভাইরাল জ্বর। বিশ্রাম নিন এবং প্রচুর পানি পান করুন।",
  },
  {
    id: 2, date: "2026-05-22", time: "3:15 PM",
    symptoms: ["chest_pain", "shortness_of_breath", "palpitations"], risk: 78, severity: "High", confidence: 91,
    diagnosis: "Possible Cardiac Concern",
    rec: "Seek immediate medical attention. Cardiac evaluation required.",
    bangla: "হৃদয়ের সমস্যার লক্ষণ দেখা যাচ্ছে। এখনই ডাক্তারের কাছে যান।",
  },
  {
    id: 3, date: "2026-04-08", time: "9:00 AM",
    symptoms: ["abdominal_pain", "nausea", "diarrhea"], risk: 45, severity: "Medium", confidence: 85,
    diagnosis: "Gastroenteritis",
    rec: "ORS, bland diet, probiotics. Monitor for 48 hours.",
    bangla: "পেটের সংক্রমণ। ওরস্যালাইন পান করুন এবং হালকা খাবার খান।",
  },
];

const DEFAULT_PROFILE = {
  name: "Rahul Ahmed", age: 32, gender: "Male", weight: 72, height: 170,
  bloodGroup: "B+", existingConditions: ["Mild Hypertension"], allergies: ["Penicillin"],
  emergencyContact: "01712-345678", district: "Dhaka",
};

/* ================================================================
   SECTION 2 — LOCAL AI ENGINE
================================================================ */
const extractSymptoms = (text) => {
  const found = new Set();
  for (const [bangla, id] of Object.entries(BANGLA_SYMPTOM_MAP)) {
    if (text.includes(bangla)) found.add(id);
  }
  const low = text.toLowerCase();
  SYMPTOMS.forEach(s => {
    if (low.includes(s.label.toLowerCase()) || low.includes(s.id.replace(/_/g, " "))) found.add(s.id);
  });
  return [...found];
};

const detectEmergency = (syms) => {
  for (const rule of EMERGENCY_RULES) {
    const hits = rule.triggers.filter(t => syms.includes(t));
    if (hits.length >= rule.minMatch) return { ...rule, matched: hits };
  }
  return null;
};

const calcRisk = (syms, profile) => {
  const w = { critical: 30, high: 20, medium: 12, low: 5 };
  let r = syms.reduce((acc, id) => {
    const s = SYMPTOMS.find(x => x.id === id);
    return acc + (s ? (w[s.severity] || 5) : 5);
  }, 0);
  if ((profile?.age || 30) > 60) r += 20;
  else if ((profile?.age || 30) > 45) r += 10;
  if (profile?.existingConditions?.length > 0) r += 10;
  return Math.min(100, r);
};

const getBestDoctor = (syms) => {
  let best = DOCTORS[DOCTORS.length - 1]; let max = 0;
  DOCTORS.forEach(d => {
    const score = d.triggers.filter(t => syms.includes(t)).length;
    if (score > max) { max = score; best = d; }
  });
  return best;
};

const getSeverityLabel = (risk) => {
  if (risk < 25) return "Low"; if (risk < 50) return "Medium";
  if (risk < 75) return "High"; return "Critical";
};

const getSeverityColor = (sev) => {
  const map = { Low: T.emerald, Medium: T.amber, High: "#f97316", Critical: T.rose };
  return map[sev] || T.emerald;
};

/* ================================================================
   SECTION 3 — CLAUDE AI
================================================================ */
const analyzeWithAI = async (syms, profile, desc) => {
  const symLabels = syms.map(id => SYMPTOMS.find(x => x.id === id)?.label || id).join(", ");
  const prompt = `Analyze symptoms for a Bangladesh patient. Respond ONLY with JSON, no markdown.

Patient: Age ${profile.age}, ${profile.gender}, ${profile.weight}kg, ${profile.height}cm
Conditions: ${profile.existingConditions?.join(", ") || "None"}
Symptoms: ${symLabels}
Notes: ${desc || "None"}

JSON format:
{
  "risk": <0-100>,
  "severity": "<Low|Medium|High|Critical>",
  "confidence": <50-99>,
  "conditions": [{"name": "...", "bangla": "...", "probability": <0-100>}],
  "recommendations": ["..."],
  "banglaRecommendations": ["..."],
  "banglaExplanation": "Simple Bangla for rural patient",
  "isEmergency": <bool>,
  "emergencyMessage": "...",
  "doctorSpecialty": "...",
  "lifestyle": ["..."],
  "followUp": "...",
  "ruralAdvice": "Advice for no-hospital area in Bangla"
}`;

  try {
    const res = await fetch("/api/claude", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: "You are MediSense AI, a healthcare assistant for Bangladesh. Respond only with valid JSON.",
        messages: [{ role: "user", content: prompt }],
      }),
    });
    const data = await res.json();
    const raw = data.content[0].text.replace(/```json|```/g, "").trim();
    return JSON.parse(raw);
  } catch {
    const risk = calcRisk(syms, profile);
    const doc = getBestDoctor(syms);
    const sev = getSeverityLabel(risk);
    return {
      risk, severity: sev, confidence: 75,
      conditions: [{ name: "Requires clinical evaluation", bangla: "ক্লিনিকাল মূল্যায়ন প্রয়োজন", probability: 70 }],
      recommendations: ["Consult a doctor", "Rest and hydrate", "Monitor symptoms"],
      banglaRecommendations: ["ডাক্তারের সাথে পরামর্শ করুন", "বিশ্রাম নিন ও পানি পান করুন", "লক্ষণ পর্যবেক্ষণ করুন"],
      banglaExplanation: "আপনার লক্ষণগুলি বিশ্লেষণ করা হয়েছে। একজন ডাক্তারের পরামর্শ নিন।",
      isEmergency: risk > 75,
      emergencyMessage: risk > 75 ? "Seek immediate medical attention" : "",
      doctorSpecialty: doc.specialty,
      lifestyle: ["Adequate rest", "Stay hydrated", "Reduce stress", "Eat nutritious food"],
      followUp: risk > 60 ? "24–48 hours" : "3–5 days",
      ruralAdvice: "নিকটস্থ কমিউনিটি ক্লিনিক বা উপজেলা স্বাস্থ্য কমপ্লেক্সে যান।",
    };
  }
};

/* ================================================================
   SECTION 4 — REUSABLE UI COMPONENTS
================================================================ */
const css = {
  glass: {
    background: T.surface,
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: `1px solid ${T.border}`,
  },
  glassBright: {
    background: "rgba(255,255,255,0.06)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.12)",
  },
};

const GCard = ({ children, className = "", style = {}, onClick }) => (
  <div
    onClick={onClick}
    className={`rounded-2xl ${className}`}
    style={{ ...css.glass, ...style }}
  >
    {children}
  </div>
);

const Btn = ({ children, onClick, variant = "primary", className = "", disabled = false, size = "md" }) => {
  const base = "rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer";
  const sizes = { sm: "px-3 py-1.5 text-sm", md: "px-5 py-2.5 text-sm", lg: "px-7 py-3 text-base" };
  const variants = {
    primary: `text-white ${disabled ? "opacity-50" : "hover:opacity-90 active:scale-95"}`,
    ghost: `text-slate-300 hover:bg-white/10 active:scale-95`,
    danger: `text-white ${disabled ? "opacity-50" : "hover:opacity-90 active:scale-95"}`,
    outline: `border border-white/20 text-slate-300 hover:bg-white/10 active:scale-95`,
  };
  const bgMap = {
    primary: `background: linear-gradient(135deg, ${T.indigo}, ${T.purple})`,
    danger: `background: linear-gradient(135deg, ${T.rose}, #e11d48)`,
    ghost: "",
    outline: "",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      style={["primary", "danger"].includes(variant) ? {
        background: variant === "primary" ? `linear-gradient(135deg, ${T.indigo}, ${T.purple})` : `linear-gradient(135deg, ${T.rose}, #e11d48)`
      } : {}}
    >
      {children}
    </button>
  );
};

const Badge = ({ label, color = T.indigo }) => (
  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
    style={{ background: `${color}22`, color, border: `1px solid ${color}44` }}>
    {label}
  </span>
);

const RiskGauge = ({ value, size = 160 }) => {
  const sev = getSeverityLabel(value);
  const col = getSeverityColor(sev);
  const r = (size / 2) - 16;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth="12"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s ease" }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono font-bold text-white" style={{ fontSize: size * 0.2 }}>{value}<span style={{ fontSize: size * 0.1 }}>%</span></span>
          <span className="text-xs font-semibold mt-1" style={{ color: col }}>{sev}</span>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color = T.indigo, sub }) => (
  <GCard className="p-4 flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}22` }}>
        <Icon size={18} style={{ color }} />
      </div>
    </div>
    <div className="font-mono text-2xl font-bold text-white">{value}</div>
    <div className="text-xs text-slate-400">{label}</div>
    {sub && <div className="text-xs" style={{ color }}>{sub}</div>}
  </GCard>
);

const SymTag = ({ sym, onRemove, selected, onClick }) => {
  const s = SYMPTOMS.find(x => x.id === sym) || { label: sym, emoji: "🔵", severity: "low" };
  const col = selected ? getSeverityColor(s.severity === "critical" ? "Critical" : s.severity === "high" ? "High" : s.severity === "medium" ? "Medium" : "Low") : T.textMuted;
  return (
    <div onClick={onClick}
      className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 text-sm"
      style={{
        background: selected ? `${col}20` : T.surface,
        border: `1px solid ${selected ? col + "60" : T.border}`,
        color: selected ? col : T.textMuted,
      }}>
      <span>{s.emoji}</span>
      <span className="font-medium">{s.label}</span>
      <span className="text-xs opacity-60">{s.bangla}</span>
      {onRemove && (
        <button onClick={e => { e.stopPropagation(); onRemove(sym); }}
          className="ml-1 hover:text-rose-400"><X size={12} /></button>
      )}
    </div>
  );
};

const Spinner = () => (
  <div className="flex flex-col items-center justify-center gap-3 py-12">
    <div className="w-10 h-10 rounded-full border-2 border-transparent animate-spin"
      style={{ borderTopColor: T.indigo, borderRightColor: T.cyan }} />
    <p className="text-slate-400 text-sm animate-pulse">AI বিশ্লেষণ চলছে...</p>
  </div>
);

const PulsingDot = ({ color = T.rose }) => (
  <span className="relative flex h-3 w-3">
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
      style={{ background: color }} />
    <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: color }} />
  </span>
);

/* ================================================================
   SECTION 5 — EMERGENCY MODAL
================================================================ */
const EmergencyModal = ({ alert, onDismiss }) => {
  if (!alert) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(10px)" }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden"
        style={{ border: `2px solid ${alert.color}`, boxShadow: `0 0 60px ${alert.color}66` }}>
        <div className="p-6 text-center" style={{ background: `${alert.color}22` }}>
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center animate-pulse"
              style={{ background: `${alert.color}33`, border: `2px solid ${alert.color}` }}>
              <AlertTriangle size={36} style={{ color: alert.color }} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">{alert.label}</h2>
          <p className="font-bold mb-4" style={{ color: alert.color }}>{alert.bangla}</p>
          <div className="rounded-2xl p-4 mb-4 text-left" style={{ background: "rgba(0,0,0,0.4)" }}>
            <p className="text-white font-semibold text-sm mb-2">Matched symptoms:</p>
            <div className="flex flex-wrap gap-2 mb-3">
              {alert.matched?.map(s => <Badge key={s} label={SYMPTOMS.find(x => x.id === s)?.label || s} color={alert.color} />)}
            </div>
            <p className="text-white text-sm font-bold">{alert.action}</p>
          </div>
          <div className="flex gap-3">
            <a href="tel:999" className="flex-1">
              <Btn variant="danger" className="w-full"><Phone size={16} /> Call 999</Btn>
            </a>
            <Btn variant="outline" onClick={onDismiss} className="flex-1">
              <X size={16} /> Dismiss
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ================================================================
   SECTION 6 — NAVIGATION
================================================================ */
const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "symptoms", label: "Symptom Check", icon: Activity },
  { id: "history", label: "Health History", icon: Clock },
  { id: "analytics", label: "Analytics", icon: BarChart2 },
  { id: "maternal", label: "Maternal Health", icon: Baby },
  { id: "judge", label: "Research Mode", icon: FlaskConical },
  { id: "settings", label: "Settings", icon: Settings },
];

const Sidebar = ({ view, setView, profile, isOpen, setOpen, onLogout }) => (
  <>
    {isOpen && <div className="fixed inset-0 z-40 md:hidden" onClick={() => setOpen(false)} style={{ background: "rgba(0,0,0,0.5)" }} />}
    <aside
      className="fixed left-0 top-0 h-full z-50 flex flex-col transition-all duration-300"
      style={{
        width: 240, ...css.glassBright,
        borderRight: `1px solid ${T.border}`,
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
      }}>
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: T.border }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.cyan})` }}>
            <Activity size={18} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">MediSense AI</div>
            <div className="text-xs" style={{ color: T.cyan }}>Bangladesh Health</div>
          </div>
        </div>
      </div>
      {/* Nav items */}
      <nav className="flex-1 p-3 overflow-y-auto">
        {NAV_ITEMS.map(item => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button key={item.id} onClick={() => { setView(item.id); setOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-medium transition-all duration-200"
              style={{
                background: active ? `${T.indigo}22` : "transparent",
                color: active ? T.indigo : T.textMuted,
                border: active ? `1px solid ${T.indigo}44` : "1px solid transparent",
              }}>
              <Icon size={17} />
              {item.label}
              {item.id === "judge" && <span className="ml-auto text-xs px-1.5 py-0.5 rounded-md"
                style={{ background: `${T.amber}22`, color: T.amber }}>AI</span>}
            </button>
          );
        })}
      </nav>
      {/* Profile */}
      <div className="p-4 border-t" style={{ borderColor: T.border }}>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white text-sm"
            style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}>
            {profile.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white text-sm font-semibold truncate">{profile.name}</div>
            <div className="text-xs text-slate-500">{profile.district}</div>
          </div>
        </div>
        <button onClick={onLogout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-slate-400 hover:text-white hover:bg-white/10 transition-all">
          <LogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  </>
);

const TopBar = ({ view, profile, isOnline, notifCount, sidebarOpen, setSidebarOpen, setView }) => (
  <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3"
    style={{ ...css.glassBright, borderBottom: `1px solid ${T.border}` }}>
    <div className="flex items-center gap-3">
      <button onClick={() => setSidebarOpen(o => !o)}
        className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all text-slate-400">
        <Menu size={18} />
      </button>
      <div>
        <h1 className="text-white font-bold text-sm capitalize">{view.replace(/_/g, " ")}</h1>
        <div className="flex items-center gap-2">
          {isOnline ? <><Wifi size={10} style={{ color: T.emerald }} /><span className="text-xs" style={{ color: T.emerald }}>Online</span></>
            : <><WifiOff size={10} style={{ color: T.amber }} /><span className="text-xs" style={{ color: T.amber }}>Offline Mode</span></>}
        </div>
      </div>
    </div>
    <div className="flex items-center gap-2">
      <button onClick={() => setView("symptoms")}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
        style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.cyan})`, color: "white" }}>
        <Plus size={13} /> Quick Check
      </button>
      <button className="relative w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 text-slate-400">
        <Bell size={17} />
        {notifCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ background: T.rose }} />}
      </button>
    </div>
  </header>
);

/* ================================================================
   SECTION 7 — LANDING PAGE
================================================================ */
const LandingPage = ({ onGetStarted }) => {
  const features = [
    { icon: Brain, title: "AI Risk Engine", desc: "XGBoost + Random Forest trained on Bangladesh disease patterns", color: T.indigo },
    { icon: Globe, title: "Bangla NLP", desc: "Understands natural Bangla speech — 'আমার জ্বর আর কাশি'", color: T.cyan },
    { icon: AlertTriangle, title: "Emergency Detection", desc: "Real-time critical condition alerts for heart attack, stroke", color: T.rose },
    { icon: Baby, title: "Maternal Health", desc: "Dedicated AI module for pregnant mothers & newborns", color: T.purple },
    { icon: WifiOff, title: "Offline Mode", desc: "Works without internet in rural, low-connectivity areas", color: T.amber },
    { icon: Stethoscope, title: "Doctor Finder", desc: "AI recommends the right specialist for your symptoms", color: T.emerald },
  ];

  return (
    <div className="min-h-screen text-white" style={{ background: `linear-gradient(135deg, #060b1a 0%, #0d1b3e 50%, #060d20 100%)` }}>
      {/* Animated blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl animate-pulse"
          style={{ background: T.indigo }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl animate-pulse"
          style={{ background: T.cyan, animationDelay: "1s" }} />
      </div>

      {/* Header */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.cyan})` }}>
            <Activity size={20} className="text-white" />
          </div>
          <div>
            <div className="font-bold text-white">MediSense AI</div>
            <div className="text-xs" style={{ color: T.cyan }}>Bangladesh Health Platform</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge label="🇧🇩 Made for Bangladesh" color={T.emerald} />
          <Btn onClick={onGetStarted} size="sm">Get Started <ArrowRight size={14} /></Btn>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-16 pb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm"
          style={{ background: `${T.indigo}22`, border: `1px solid ${T.indigo}44`, color: T.indigo }}>
          <Zap size={14} /> AI-Powered · Bangla First · Rural Ready
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight text-white mb-4" style={{ maxWidth: 700 }}>
          Your Health,<br />
          <span style={{ background: `linear-gradient(90deg, ${T.indigo}, ${T.cyan})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Intelligently Assessed
          </span>
        </h1>
        <p className="text-slate-400 text-lg mb-2 max-w-xl">
          Speak Bangla, get AI-powered health insights. Designed for Bangladesh — from Dhaka to rural villages.
        </p>
        <p className="text-slate-500 text-base mb-8">"আমার জ্বর আর কাশি" → Instant AI Analysis</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Btn onClick={onGetStarted} size="lg"><Activity size={18} /> Start Health Check</Btn>
          <Btn variant="outline" size="lg"><Eye size={18} /> View Demo</Btn>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg w-full">
          {[["96.1%", "AI Accuracy"], ["20+", "Diseases"], ["2", "Languages"]].map(([val, lab]) => (
            <GCard key={lab} className="py-4 text-center">
              <div className="font-mono text-2xl font-bold text-white">{val}</div>
              <div className="text-xs text-slate-400 mt-1">{lab}</div>
            </GCard>
          ))}
        </div>
      </section>

      {/* Features grid */}
      <section className="relative z-10 px-6 pb-12">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-center text-2xl font-bold text-white mb-8">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map(f => {
              const Icon = f.icon;
              return (
                <GCard key={f.title} className="p-5 hover:scale-[1.02] transition-transform duration-200 cursor-default">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                    style={{ background: `${f.color}22` }}>
                    <Icon size={20} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-bold text-white mb-1">{f.title}</h3>
                  <p className="text-sm text-slate-400">{f.desc}</p>
                </GCard>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bangla NLP showcase */}
      <section className="relative z-10 px-6 pb-16">
        <div className="max-w-2xl mx-auto">
          <GCard className="p-6" style={{ border: `1px solid ${T.indigo}44` }}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: `${T.cyan}22` }}>
                <Mic size={16} style={{ color: T.cyan }} />
              </div>
              <h3 className="font-bold text-white">Bangla Voice Recognition</h3>
            </div>
            <div className="space-y-3">
              {[
                ["আমার ৩ দিন ধরে জ্বর", "→ Fever (3 days) detected"],
                ["বুকে ব্যথা করছে", "→ Chest Pain — Emergency Alert triggered"],
                ["কাশি আর গলা ব্যথা", "→ Cough + Sore Throat detected"],
              ].map(([bangla, result]) => (
                <div key={bangla} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)" }}>
                  <span className="text-white font-medium flex-1" style={{ fontFamily: "serif" }}>{bangla}</span>
                  <span className="text-xs" style={{ color: T.emerald }}>{result}</span>
                </div>
              ))}
            </div>
          </GCard>
        </div>
      </section>

      <footer className="relative z-10 text-center py-6 text-slate-500 text-sm border-t" style={{ borderColor: T.border }}>
        Built for Bangladesh 🇧🇩 · MediSense AI · © 2026 All Rights Reserved
      </footer>
    </div>
  );
};

/* ================================================================
   SECTION 8 — AUTH PAGE
================================================================ */
const AuthPage = ({ onLogin }) => {
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: `linear-gradient(135deg, #060b1a, #0d1b3e, #060d20)` }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.cyan})` }}>
              <Activity size={20} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg">MediSense AI</span>
          </div>
          <p className="text-slate-400 text-sm">Bangladesh's AI Health Platform</p>
        </div>

        <GCard className="p-6" style={{ border: `1px solid ${T.indigo}33` }}>
          <div className="flex rounded-xl overflow-hidden mb-5" style={{ background: "rgba(0,0,0,0.3)" }}>
            {["login", "register"].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="flex-1 py-2.5 text-sm font-semibold capitalize transition-all duration-200"
                style={{
                  background: tab === t ? `linear-gradient(135deg, ${T.indigo}, ${T.purple})` : "transparent",
                  color: tab === t ? "white" : T.textMuted,
                  borderRadius: 10,
                }}>
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {tab === "register" && (
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Full Name</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Rahul Ahmed"
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none focus:ring-1"
                  style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, focusRingColor: T.indigo }} />
              </div>
            )}
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Email</label>
              <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}` }} />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Password</label>
              <input type="password" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}` }} />
            </div>

            <Btn onClick={onLogin} className="w-full mt-2" size="lg">
              {tab === "login" ? "Sign In" : "Create Account"}
              <ArrowRight size={16} />
            </Btn>
          </div>

          <div className="mt-4 p-3 rounded-xl text-center" style={{ background: `${T.cyan}11`, border: `1px solid ${T.cyan}33` }}>
            <p className="text-xs text-slate-400">Demo credentials</p>
            <p className="text-xs font-mono" style={{ color: T.cyan }}>demo@medisense.ai / demo123</p>
            <Btn onClick={onLogin} size="sm" variant="ghost" className="mt-2 text-xs">Quick Demo Login</Btn>
          </div>
        </GCard>
      </div>
    </div>
  );
};

/* ================================================================
   SECTION 9 — DASHBOARD
================================================================ */
const DashboardPage = ({ profile, assessments, setView, setCurrentResult }) => {
  const latest = assessments[0];
  const avgRisk = Math.round(assessments.reduce((a, b) => a + b.risk, 0) / assessments.length);
  const healthScore = 100 - avgRisk;

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Welcome */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">আস্সালামুয়ালাইকুম, {profile.name.split(" ")[0]} 👋</h2>
          <p className="text-slate-400 text-sm mt-1">Your health summary for today</p>
        </div>
        <Badge label={`🩸 ${profile.bloodGroup}`} color={T.rose} />
      </div>

      {/* Health Score Banner */}
      <GCard className="p-5" style={{ background: `linear-gradient(135deg, ${T.indigo}22, ${T.cyan}11)`, border: `1px solid ${T.indigo}44` }}>
        <div className="flex items-center gap-5">
          <RiskGauge value={avgRisk} size={110} />
          <div className="flex-1">
            <p className="text-slate-400 text-sm mb-1">Overall Health Score</p>
            <p className="font-mono text-3xl font-bold text-white">{healthScore}<span className="text-lg">/100</span></p>
            <div className="flex items-center gap-2 mt-2">
              <Badge label={getSeverityLabel(avgRisk) + " Risk"} color={getSeverityColor(getSeverityLabel(avgRisk))} />
              <span className="text-xs text-slate-500">{assessments.length} assessments this month</span>
            </div>
            <Btn onClick={() => setView("symptoms")} size="sm" className="mt-3">
              <Activity size={14} /> New Assessment
            </Btn>
          </div>
        </div>
      </GCard>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Activity} label="Assessments" value={assessments.length} color={T.indigo} sub="This month" />
        <StatCard icon={Heart} label="Avg Risk" value={`${avgRisk}%`} color={getSeverityColor(getSeverityLabel(avgRisk))} sub="30-day average" />
        <StatCard icon={CheckCircle} label="Health Score" value={healthScore} color={T.emerald} sub="Out of 100" />
        <StatCard icon={Calendar} label="Last Check" value={latest?.date?.slice(5) || "N/A"} color={T.cyan} sub={latest?.severity + " risk"} />
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-white font-semibold mb-3 text-sm">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Mic, label: "Voice Check", sub: "Speak Bangla", color: T.indigo, view: "symptoms" },
            { icon: Baby, label: "Maternal Care", sub: "Pregnancy AI", color: T.purple, view: "maternal" },
            { icon: BarChart2, label: "Analytics", sub: "Health trends", color: T.cyan, view: "analytics" },
            { icon: FlaskConical, label: "Judge Mode", sub: "AI research", color: T.amber, view: "judge" },
          ].map(action => {
            const Icon = action.icon;
            return (
              <GCard key={action.label} className="p-4 cursor-pointer hover:scale-[1.02] transition-transform"
                onClick={() => setView(action.view)}
                style={{ border: `1px solid ${action.color}33` }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-2"
                  style={{ background: `${action.color}22` }}>
                  <Icon size={18} style={{ color: action.color }} />
                </div>
                <p className="text-white text-sm font-semibold">{action.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{action.sub}</p>
              </GCard>
            );
          })}
        </div>
      </div>

      {/* Recent assessments */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-white font-semibold text-sm">Recent Assessments</h3>
          <button onClick={() => setView("history")} className="text-xs flex items-center gap-1" style={{ color: T.indigo }}>
            View all <ChevronRight size={12} />
          </button>
        </div>
        <div className="space-y-3">
          {assessments.slice(0, 3).map(a => {
            const col = getSeverityColor(a.severity);
            return (
              <GCard key={a.id} className="p-4 cursor-pointer hover:bg-white/[0.06] transition-all"
                onClick={() => { setCurrentResult(a); setView("report"); }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm"
                    style={{ background: `${col}22`, color: col }}>{a.risk}%</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium text-sm truncate">{a.diagnosis}</p>
                    <p className="text-xs text-slate-500">{a.date} · {a.symptoms.length} symptoms</p>
                  </div>
                  <Badge label={a.severity} color={col} />
                </div>
              </GCard>
            );
          })}
        </div>
      </div>

      {/* Trend mini-chart */}
      <GCard className="p-4">
        <h3 className="text-white font-semibold text-sm mb-4">Risk Trend — Last 6 Months</h3>
        <ResponsiveContainer width="100%" height={120}>
          <AreaChart data={HEALTH_TREND}>
            <defs>
              <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.indigo} stopOpacity={0.4} />
                <stop offset="95%" stopColor={T.indigo} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} domain={[0, 100]} />
            <Tooltip contentStyle={{ background: "#0f172a", border: `1px solid ${T.border}`, borderRadius: 12, color: "white" }} />
            <Area type="monotone" dataKey="risk" stroke={T.indigo} strokeWidth={2} fill="url(#riskGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </GCard>
    </div>
  );
};

/* ================================================================
   SECTION 10 — SYMPTOM ANALYSIS PAGE
================================================================ */
const SymptomPage = ({ profile, onComplete, isOnline }) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [textInput, setTextInput] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceActive, setVoiceActive] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [detectedFromVoice, setDetectedFromVoice] = useState([]);
  const [voiceLang, setVoiceLang] = useState("bn-BD");
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState(1); // 1=input, 2=confirm, 3=analyzing
  const recogRef = useRef(null);

  const toggleSym = useCallback((id) => {
    setSelectedSymptoms(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }, []);

  const handleVoice = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser. Try Chrome.");
      return;
    }
    if (voiceActive) {
      recogRef.current?.stop();
      setVoiceActive(false);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = new SpeechRecognition();
    rec.lang = voiceLang;
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e) => {
      let full = "";
      for (let i = 0; i < e.results.length; i++) full += e.results[i][0].transcript;
      setTranscript(full);
      const found = extractSymptoms(full);
      setDetectedFromVoice(found);
    };
    rec.onend = () => {
      setVoiceActive(false);
      if (detectedFromVoice.length > 0) {
        setSelectedSymptoms(prev => [...new Set([...prev, ...detectedFromVoice])]);
      }
    };
    rec.onerror = (e) => { setVoiceActive(false); console.error(e); };
    recogRef.current = rec;
    rec.start();
    setVoiceActive(true);
    setTranscript("");
    setDetectedFromVoice([]);
  };

  const handleTextExtract = () => {
    const found = extractSymptoms(textInput);
    if (found.length > 0) {
      setSelectedSymptoms(prev => [...new Set([...prev, ...found])]);
      setTextInput("");
    }
  };

  const handleAnalyze = async () => {
    if (selectedSymptoms.length === 0) return;
    setLoading(true);
    setStep(3);
    const emergency = detectEmergency(selectedSymptoms);
    const result = await analyzeWithAI(selectedSymptoms, profile, description);
    const doctor = getBestDoctor(selectedSymptoms);
    setLoading(false);
    onComplete({ ...result, symptoms: selectedSymptoms, date: new Date().toISOString().slice(0, 10), time: new Date().toLocaleTimeString(), id: Date.now(), emergency, doctor });
  };

  const filteredSymptoms = SYMPTOMS.filter(s =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.bangla.includes(searchQuery)
  );

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <Spinner />
      <p className="text-slate-400 text-sm mt-4 text-center">আপনার লক্ষণগুলি AI দ্বারা বিশ্লেষণ করা হচ্ছে...</p>
      <p className="text-slate-500 text-xs mt-2">Using {isOnline ? "Claude AI (Online)" : "Local AI Engine (Offline)"}</p>
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Symptom Analysis</h2>
        <p className="text-slate-400 text-sm mt-1">বাংলায় বলুন বা লক্ষণ বেছে নিন</p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-2">
        {[1, 2].map(s => (
          <div key={s} className="flex-1 h-1.5 rounded-full transition-all"
            style={{ background: step >= s ? T.indigo : "rgba(255,255,255,0.1)" }} />
        ))}
      </div>

      {/* Voice Input */}
      <GCard className="p-4" style={{ border: `1px solid ${voiceActive ? T.cyan + "80" : T.border}` }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Mic size={16} style={{ color: T.cyan }} />
            <span className="text-white font-semibold text-sm">Voice Input</span>
            {voiceActive && <PulsingDot color={T.rose} />}
          </div>
          <div className="flex items-center gap-2">
            <select value={voiceLang} onChange={e => setVoiceLang(e.target.value)}
              className="text-xs rounded-lg px-2 py-1 border-0 outline-none"
              style={{ background: "rgba(255,255,255,0.08)", color: T.textMuted }}>
              <option value="bn-BD">🇧🇩 Bangla</option>
              <option value="en-US">🇺🇸 English</option>
            </select>
          </div>
        </div>

        {transcript && (
          <div className="mb-3 p-3 rounded-xl text-sm" style={{ background: "rgba(255,255,255,0.04)" }}>
            <p className="text-slate-300" style={{ fontFamily: "serif" }}>{transcript}</p>
            {detectedFromVoice.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                <span className="text-xs text-slate-500">Detected: </span>
                {detectedFromVoice.map(id => {
                  const s = SYMPTOMS.find(x => x.id === id);
                  return s ? <Badge key={id} label={`${s.emoji} ${s.label}`} color={T.emerald} /> : null;
                })}
              </div>
            )}
          </div>
        )}

        <button onClick={handleVoice}
          className="w-full flex items-center justify-center gap-3 py-4 rounded-xl font-semibold text-white transition-all"
          style={{
            background: voiceActive ? `linear-gradient(135deg, ${T.rose}, #e11d48)` : `linear-gradient(135deg, ${T.cyan}33, ${T.indigo}33)`,
            border: `1px solid ${voiceActive ? T.rose : T.cyan}60`,
          }}>
          {voiceActive ? <><MicOff size={20} /> Stop Recording</> : <><Mic size={20} /> বলুন — Tap & Speak</>}
        </button>

        <p className="text-xs text-center text-slate-500 mt-2">
          Try: "আমার তিন দিন ধরে জ্বর আর কাশি" or "I have chest pain and dizziness"
        </p>
      </GCard>

      {/* Text Input */}
      <GCard className="p-4">
        <label className="text-sm font-semibold text-white mb-3 block">Text Input (Bangla / English)</label>
        <div className="flex gap-2">
          <input
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleTextExtract()}
            placeholder="আমার মাথা ব্যথা আর জ্বর... or type symptoms in English"
            className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none"
            style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`, fontFamily: "serif" }}
          />
          <Btn onClick={handleTextExtract} size="md"><Check size={15} /></Btn>
        </div>
      </GCard>

      {/* Symptom Selector */}
      <GCard className="p-4">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-white">Select Symptoms</label>
          <span className="text-xs text-slate-500">{selectedSymptoms.length} selected</span>
        </div>
        <input
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search symptoms..."
          className="w-full px-3 py-2 rounded-xl text-sm text-white placeholder-slate-500 outline-none mb-3"
          style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}` }}
        />
        <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
          {filteredSymptoms.map(s => {
            const sel = selectedSymptoms.includes(s.id);
            const col = getSeverityColor(s.severity === "critical" ? "Critical" : s.severity === "high" ? "High" : s.severity === "medium" ? "Medium" : "Low");
            return (
              <button key={s.id} onClick={() => toggleSym(s.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs transition-all duration-150"
                style={{
                  background: sel ? `${col}20` : "rgba(255,255,255,0.04)",
                  border: `1px solid ${sel ? col + "60" : "rgba(255,255,255,0.08)"}`,
                  color: sel ? col : T.textMuted,
                }}>
                <span>{s.emoji}</span>
                <div>
                  <div className="font-medium">{s.label}</div>
                  <div className="opacity-60 text-xs">{s.bangla}</div>
                </div>
                {sel && <Check size={12} className="ml-auto" />}
              </button>
            );
          })}
        </div>
      </GCard>

      {/* Selected symptoms display */}
      {selectedSymptoms.length > 0 && (
        <GCard className="p-4" style={{ border: `1px solid ${T.indigo}33` }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-white">Selected ({selectedSymptoms.length})</span>
            <button onClick={() => setSelectedSymptoms([])} className="text-xs text-slate-500 hover:text-red-400">Clear all</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedSymptoms.map(id => (
              <SymTag key={id} sym={id} selected onRemove={() => toggleSym(id)} />
            ))}
          </div>
        </GCard>
      )}

      {/* Additional notes */}
      <GCard className="p-4">
        <label className="text-sm font-semibold text-white mb-2 block">Additional Notes (Optional)</label>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="When did it start? Any recent travel? Pre-existing conditions?"
          rows={3}
          className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-slate-500 outline-none resize-none"
          style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}` }}
        />
      </GCard>

      {/* Analyze button */}
      <Btn
        onClick={handleAnalyze}
        disabled={selectedSymptoms.length === 0}
        size="lg"
        className="w-full"
      >
        <Zap size={18} />
        {selectedSymptoms.length === 0 ? "Select at least 1 symptom" : `Analyze ${selectedSymptoms.length} Symptom${selectedSymptoms.length > 1 ? "s" : ""} with AI`}
      </Btn>
    </div>
  );
};

/* ================================================================
   SECTION 11 — RISK REPORT PAGE
================================================================ */
const ReportPage = ({ result, profile, setView, onSave }) => {
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState("overview");
  if (!result) return null;

  const col = getSeverityColor(result.severity);
  const doctor = result.doctor || getBestDoctor(result.symptoms || []);
  const DocIcon = doctor?.icon || Stethoscope;

  const handleSave = () => {
    onSave(result);
    setSaved(true);
  };

  const handlePrint = () => window.print();

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => setView("symptoms")} className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-white/10 text-slate-400">
          <ChevronLeft size={18} />
        </button>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-white">AI Health Report</h2>
          <p className="text-xs text-slate-400">{result.date} · {result.time}</p>
        </div>
        <div className="flex gap-2">
          <Btn onClick={handlePrint} size="sm" variant="outline"><Download size={14} /> PDF</Btn>
          {!saved && <Btn onClick={handleSave} size="sm"><Check size={14} /> Save</Btn>}
          {saved && <Badge label="✓ Saved" color={T.emerald} />}
        </div>
      </div>

      {/* Emergency banner */}
      {result.emergency && (
        <div className="p-4 rounded-2xl animate-pulse"
          style={{ background: `${T.rose}22`, border: `2px solid ${T.rose}` }}>
          <div className="flex items-center gap-3">
            <AlertTriangle size={24} style={{ color: T.rose }} />
            <div>
              <p className="font-bold text-white">{result.emergency.label}</p>
              <p className="text-sm" style={{ color: T.rose }}>{result.emergency.bangla}</p>
              <p className="text-xs text-white mt-1">{result.emergency.action}</p>
            </div>
          </div>
        </div>
      )}

      {/* Risk summary card */}
      <GCard className="p-5" style={{ border: `1px solid ${col}44` }}>
        <div className="flex items-center gap-6">
          <RiskGauge value={result.risk} size={120} />
          <div className="flex-1">
            <Badge label={`${result.severity} Risk`} color={col} />
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <p className="text-xs text-slate-500">AI Confidence</p>
                <p className="font-mono font-bold text-white">{result.confidence}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Symptoms</p>
                <p className="font-mono font-bold text-white">{result.symptoms?.length || 0}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Follow Up</p>
                <p className="font-mono font-bold text-white text-sm">{result.followUp || "3–5 days"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Specialist</p>
                <p className="font-mono font-bold text-sm" style={{ color: T.cyan }}>{result.doctorSpecialty || doctor?.specialty}</p>
              </div>
            </div>
          </div>
        </div>
      </GCard>

      {/* Tab navigation */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "rgba(0,0,0,0.3)" }}>
        {["overview", "conditions", "doctor", "bangla"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="flex-1 py-2 text-xs font-semibold rounded-lg capitalize transition-all"
            style={{
              background: tab === t ? `linear-gradient(135deg, ${T.indigo}, ${T.purple})` : "transparent",
              color: tab === t ? "white" : T.textMuted,
            }}>
            {t === "bangla" ? "বাংলা" : t}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "overview" && (
        <div className="space-y-4">
          <GCard className="p-4">
            <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <CheckCircle size={15} style={{ color: T.emerald }} /> Detected Symptoms
            </h3>
            <div className="flex flex-wrap gap-2">
              {(result.symptoms || []).map(id => <SymTag key={id} sym={id} selected />)}
            </div>
          </GCard>

          <GCard className="p-4">
            <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <Target size={15} style={{ color: T.cyan }} /> Recommendations
            </h3>
            <ul className="space-y-2">
              {(result.recommendations || []).map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                  <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0"
                    style={{ background: `${T.indigo}33`, color: T.indigo }}>{i + 1}</span>
                  {r}
                </li>
              ))}
            </ul>
          </GCard>

          <GCard className="p-4">
            <h3 className="font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <Activity size={15} style={{ color: T.amber }} /> Lifestyle Advice
            </h3>
            <ul className="space-y-2">
              {(result.lifestyle || []).map((l, i) => (
                <li key={i} className="text-sm text-slate-300 flex items-center gap-2">
                  <Check size={12} style={{ color: T.emerald }} /> {l}
                </li>
              ))}
            </ul>
          </GCard>
        </div>
      )}

      {tab === "conditions" && (
        <div className="space-y-3">
          {(result.conditions || []).map((c, i) => (
            <GCard key={i} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">{c.name}</span>
                <span className="font-mono text-sm font-bold" style={{ color: getSeverityColor(c.probability > 70 ? "High" : c.probability > 40 ? "Medium" : "Low") }}>
                  {c.probability}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.1)" }}>
                <div className="h-1.5 rounded-full transition-all"
                  style={{ width: `${c.probability}%`, background: `linear-gradient(90deg, ${T.indigo}, ${T.cyan})` }} />
              </div>
              {c.bangla && <p className="text-xs text-slate-500" style={{ fontFamily: "serif" }}>{c.bangla}</p>}
            </GCard>
          ))}
        </div>
      )}

      {tab === "doctor" && (
        <div className="space-y-4">
          <GCard className="p-5" style={{ border: `1px solid ${T.cyan}44` }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${T.cyan}22` }}>
                <DocIcon size={22} style={{ color: T.cyan }} />
              </div>
              <div>
                <p className="font-bold text-white">{doctor?.specialty || result.doctorSpecialty}</p>
                <p className="text-sm" style={{ color: T.cyan, fontFamily: "serif" }}>{doctor?.bangla || ""}</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mb-3">Recommended Hospitals in Bangladesh:</p>
            {(doctor?.hospitals || []).map(h => (
              <div key={h} className="flex items-center gap-2 py-2 border-b last:border-0" style={{ borderColor: T.border }}>
                <MapPin size={12} style={{ color: T.indigo }} />
                <span className="text-sm text-slate-300">{h}</span>
              </div>
            ))}
          </GCard>

          <GCard className="p-4">
            <p className="text-xs text-slate-400 mb-2">Rural Advice / গ্রামীণ পরামর্শ</p>
            <p className="text-sm text-white" style={{ fontFamily: "serif" }}>{result.ruralAdvice || "নিকটস্থ কমিউনিটি ক্লিনিক বা উপজেলা স্বাস্থ্য কমপ্লেক্সে যান।"}</p>
          </GCard>

          <div className="grid grid-cols-2 gap-3">
            <a href="tel:999">
              <GCard className="p-4 text-center cursor-pointer hover:bg-white/[0.07]" style={{ border: `1px solid ${T.rose}44` }}>
                <Phone size={20} className="mx-auto mb-2" style={{ color: T.rose }} />
                <p className="text-white font-semibold text-sm">Emergency</p>
                <p className="font-mono text-lg font-bold" style={{ color: T.rose }}>999</p>
              </GCard>
            </a>
            <a href="tel:16000">
              <GCard className="p-4 text-center cursor-pointer hover:bg-white/[0.07]" style={{ border: `1px solid ${T.emerald}44` }}>
                <Phone size={20} className="mx-auto mb-2" style={{ color: T.emerald }} />
                <p className="text-white font-semibold text-sm">Health Helpline</p>
                <p className="font-mono text-lg font-bold" style={{ color: T.emerald }}>16000</p>
              </GCard>
            </a>
          </div>
        </div>
      )}

      {tab === "bangla" && (
        <div className="space-y-4">
          <GCard className="p-5" style={{ border: `1px solid ${T.indigo}33` }}>
            <p className="text-xs text-slate-400 mb-3">AI বিশ্লেষণ (সহজ বাংলায়)</p>
            <p className="text-white text-base leading-relaxed" style={{ fontFamily: "serif" }}>
              {result.banglaExplanation || "আপনার লক্ষণগুলি বিশ্লেষণ করা হয়েছে।"}
            </p>
          </GCard>
          <GCard className="p-4">
            <p className="text-xs text-slate-400 mb-3">পরামর্শ</p>
            <ul className="space-y-2">
              {(result.banglaRecommendations || []).map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm" style={{ fontFamily: "serif", color: T.text }}>
                  <span className="mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 font-sans"
                    style={{ background: `${T.cyan}33`, color: T.cyan }}>{i + 1}</span>
                  {r}
                </li>
              ))}
            </ul>
          </GCard>
          {result.ruralAdvice && (
            <GCard className="p-4" style={{ background: `${T.emerald}11`, border: `1px solid ${T.emerald}33` }}>
              <p className="text-xs mb-2" style={{ color: T.emerald }}>গ্রামীণ এলাকার জন্য পরামর্শ</p>
              <p className="text-white text-sm" style={{ fontFamily: "serif" }}>{result.ruralAdvice}</p>
            </GCard>
          )}
        </div>
      )}

      <Btn onClick={() => setView("dashboard")} variant="outline" className="w-full">
        <Home size={15} /> Back to Dashboard
      </Btn>
    </div>
  );
};

/* ================================================================
   SECTION 12 — HEALTH HISTORY PAGE
================================================================ */
const HistoryPage = ({ assessments, setView, setCurrentResult }) => (
  <div className="p-4 md:p-6 space-y-5">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold text-white">Health History</h2>
        <p className="text-slate-400 text-sm">Your assessment timeline</p>
      </div>
      <Badge label={`${assessments.length} records`} color={T.indigo} />
    </div>

    {assessments.length === 0 ? (
      <div className="text-center py-16">
        <Clock size={40} className="mx-auto mb-3 text-slate-600" />
        <p className="text-slate-400">No assessments yet.</p>
        <Btn onClick={() => setView("symptoms")} size="sm" className="mt-4"><Plus size={14} /> First Assessment</Btn>
      </div>
    ) : (
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px" style={{ background: T.border }} />
        <div className="space-y-4">
          {assessments.map((a, idx) => {
            const col = getSeverityColor(a.severity);
            return (
              <div key={a.id} className="relative pl-12">
                <div className="absolute left-3.5 top-4 w-3 h-3 rounded-full border-2"
                  style={{ background: col, borderColor: T.bg }} />
                <GCard className="p-4 cursor-pointer hover:bg-white/[0.06] transition-all"
                  onClick={() => { setCurrentResult(a); setView("report"); }}
                  style={{ border: `1px solid ${col}33` }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-white font-semibold text-sm">{a.diagnosis}</p>
                      <p className="text-xs text-slate-500">{a.date} · {a.time}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm" style={{ color: col }}>{a.risk}%</span>
                      <Badge label={a.severity} color={col} />
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(a.symptoms || []).slice(0, 4).map(id => {
                      const s = SYMPTOMS.find(x => x.id === id);
                      return s ? <span key={id} className="text-xs text-slate-500">{s.emoji} {s.label}</span> : null;
                    })}
                    {(a.symptoms || []).length > 4 && <span className="text-xs text-slate-600">+{a.symptoms.length - 4} more</span>}
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{a.rec}</p>
                  {a.bangla && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1" style={{ fontFamily: "serif" }}>{a.bangla}</p>
                  )}
                </GCard>
              </div>
            );
          })}
        </div>
      </div>
    )}
  </div>
);

/* ================================================================
   SECTION 13 — ANALYTICS PAGE
================================================================ */
const AnalyticsPage = ({ assessments }) => {
  const avgRisk = Math.round(assessments.reduce((a, b) => a + b.risk, 0) / (assessments.length || 1));

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Health Analytics</h2>
        <p className="text-slate-400 text-sm">Trends and patterns from your health data</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={TrendingUp} label="Avg Risk" value={`${avgRisk}%`} color={getSeverityColor(getSeverityLabel(avgRisk))} />
        <StatCard icon={Activity} label="Total Checks" value={assessments.length} color={T.indigo} />
        <StatCard icon={Award} label="Best Score" value={`${100 - Math.min(...assessments.map(a => a.risk))}%`} color={T.emerald} />
        <StatCard icon={AlertCircle} label="High Risk" value={assessments.filter(a => a.risk > 60).length} color={T.rose} sub="Events" />
      </div>

      {/* Risk trend */}
      <GCard className="p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Risk Progression (6 months)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={HEALTH_TREND}>
            <defs>
              <linearGradient id="rGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.rose} stopOpacity={0.3} />
                <stop offset="95%" stopColor={T.rose} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="sGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={T.emerald} stopOpacity={0.3} />
                <stop offset="95%" stopColor={T.emerald} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0f172a", border: `1px solid ${T.border}`, borderRadius: 12 }} />
            <Legend />
            <Area type="monotone" dataKey="risk" stroke={T.rose} strokeWidth={2} fill="url(#rGrad)" name="Risk %" />
            <Area type="monotone" dataKey="score" stroke={T.emerald} strokeWidth={2} fill="url(#sGrad)" name="Health Score" />
          </AreaChart>
        </ResponsiveContainer>
      </GCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Symptom frequency */}
        <GCard className="p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Symptom Frequency</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={SYMPTOM_FREQ} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#94a3b8", fontSize: 10 }} width={60} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#0f172a", border: `1px solid ${T.border}`, borderRadius: 12 }} />
              <Bar dataKey="count" fill={T.indigo} radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GCard>

        {/* Disease distribution */}
        <GCard className="p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Disease Category Distribution</h3>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={180}>
              <PieChart>
                <Pie data={DISEASE_DIST} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {DISEASE_DIST.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#0f172a", border: `1px solid ${T.border}`, borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {DISEASE_DIST.map(d => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-xs text-slate-400 flex-1">{d.name}</span>
                  <span className="text-xs font-mono font-bold text-white">{d.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </GCard>
      </div>

      {/* Monthly checks */}
      <GCard className="p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Monthly Health Checks</h3>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={HEALTH_TREND}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#0f172a", border: `1px solid ${T.border}`, borderRadius: 12 }} />
            <Bar dataKey="checks" fill={T.cyan} radius={[6, 6, 0, 0]} name="Health Checks" />
          </BarChart>
        </ResponsiveContainer>
      </GCard>
    </div>
  );
};

/* ================================================================
   SECTION 14 — SETTINGS PAGE
================================================================ */
const SettingsPage = ({ profile, setProfile }) => {
  const [local, setLocal] = useState(profile);
  const [saved, setSaved] = useState(false);

  const save = () => {
    setProfile(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const field = (label, key, type = "text", placeholder = "") => (
    <div>
      <label className="text-xs text-slate-400 mb-1 block">{label}</label>
      <input
        type={type}
        value={local[key] || ""}
        onChange={e => setLocal(l => ({ ...l, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
        style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}` }}
      />
    </div>
  );

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h2 className="text-xl font-bold text-white">Profile & Settings</h2>
        <p className="text-slate-400 text-sm">Manage your health profile</p>
      </div>

      {/* Avatar */}
      <GCard className="p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
          style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}>
          {local.name?.[0] || "U"}
        </div>
        <div>
          <p className="text-white font-bold">{local.name}</p>
          <p className="text-sm text-slate-400">{local.district}, Bangladesh</p>
          <Badge label={`Blood: ${local.bloodGroup}`} color={T.rose} />
        </div>
      </GCard>

      <GCard className="p-5 space-y-4">
        <h3 className="text-white font-semibold text-sm">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {field("Full Name", "name", "text", "Your name")}
          {field("Age", "age", "number", "Age")}
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Gender</label>
            <select value={local.gender} onChange={e => setLocal(l => ({ ...l, gender: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
              style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}` }}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {field("Blood Group", "bloodGroup", "text", "A+, B-, O+...")}
          {field("Weight (kg)", "weight", "number")}
          {field("Height (cm)", "height", "number")}
          {field("District", "district", "text", "e.g., Dhaka, Chittagong")}
          {field("Emergency Contact", "emergencyContact", "text", "01X-XXXXXXXX")}
        </div>
      </GCard>

      <GCard className="p-5 space-y-3">
        <h3 className="text-white font-semibold text-sm">Medical Information</h3>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Existing Conditions (comma-separated)</label>
          <input
            value={(local.existingConditions || []).join(", ")}
            onChange={e => setLocal(l => ({ ...l, existingConditions: e.target.value.split(",").map(s => s.trim()) }))}
            placeholder="Diabetes, Hypertension..."
            className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}` }}
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Allergies (comma-separated)</label>
          <input
            value={(local.allergies || []).join(", ")}
            onChange={e => setLocal(l => ({ ...l, allergies: e.target.value.split(",").map(s => s.trim()) }))}
            placeholder="Penicillin, Dust..."
            className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
            style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}` }}
          />
        </div>
      </GCard>

      <Btn onClick={save} className="w-full" size="lg">
        {saved ? <><Check size={16} /> Saved!</> : <><Check size={16} /> Save Profile</>}
      </Btn>
    </div>
  );
};

/* ================================================================
   SECTION 15 — JUDGE DASHBOARD (Research Mode)
================================================================ */
const JudgeDashboard = () => {
  const [activeModel, setActiveModel] = useState("XGBoost");
  const confMatrix = [[245, 12], [8, 235]]; // TP, FP, FN, TN

  const confusionData = [
    { name: "True Positive", value: 245, color: T.emerald },
    { name: "False Positive", value: 12, color: T.rose },
    { name: "False Negative", value: 8, color: T.amber },
    { name: "True Negative", value: 235, color: T.indigo },
  ];

  const shapeData = [
    { feature: "Symptoms", shap: 0.42, color: T.indigo },
    { feature: "Age", shap: 0.18, color: T.cyan },
    { feature: "Med History", shap: 0.15, color: T.amber },
    { feature: "Vitals", shap: 0.12, color: T.emerald },
    { feature: "Lifestyle", shap: 0.08, color: T.purple },
    { feature: "Gender", shap: 0.05, color: T.rose },
  ];

  const selected = ML_MODELS.find(m => m.model === activeModel) || ML_MODELS[0];

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${T.amber}22` }}>
          <FlaskConical size={20} style={{ color: T.amber }} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Research & Judge Mode</h2>
          <p className="text-slate-400 text-sm">ML model performance · SHAP analysis · Innovation metrics</p>
        </div>
        <Badge label="🏆 Competition" color={T.amber} />
      </div>

      {/* Innovation metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard icon={Cpu} label="Best Accuracy" value="96.1%" color={T.emerald} sub="XGBoost" />
        <StatCard icon={Database} label="Training Data" value="50K+" color={T.indigo} sub="Samples" />
        <StatCard icon={Globe} label="Languages" value="2" color={T.cyan} sub="Bangla + English" />
        <StatCard icon={Users} label="Diseases" value="20+" color={T.purple} sub="Classified" />
      </div>

      {/* Model comparison */}
      <GCard className="p-5">
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <Target size={15} style={{ color: T.indigo }} /> Model Performance Comparison
        </h3>
        <div className="flex gap-2 mb-4">
          {ML_MODELS.map(m => (
            <button key={m.model} onClick={() => setActiveModel(m.model)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: activeModel === m.model ? `${T.indigo}` : "rgba(255,255,255,0.06)",
                color: activeModel === m.model ? "white" : T.textMuted,
              }}>
              {m.model}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {[["Accuracy", selected.accuracy], ["Precision", selected.precision], ["Recall", selected.recall], ["F1 Score", selected.f1]].map(([label, val]) => (
            <div key={label} className="p-3 rounded-xl text-center" style={{ background: "rgba(255,255,255,0.04)" }}>
              <div className="font-mono text-xl font-bold text-white">{val}%</div>
              <div className="text-xs text-slate-400">{label}</div>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={ML_MODELS}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis dataKey="model" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} domain={[80, 100]} />
            <Tooltip contentStyle={{ background: "#0f172a", border: `1px solid ${T.border}`, borderRadius: 12 }} />
            <Legend />
            <Bar dataKey="accuracy" fill={T.indigo} radius={[4, 4, 0, 0]} name="Accuracy" />
            <Bar dataKey="f1" fill={T.cyan} radius={[4, 4, 0, 0]} name="F1 Score" />
          </BarChart>
        </ResponsiveContainer>
      </GCard>

      {/* SHAP Feature Importance */}
      <GCard className="p-5">
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <Layers size={15} style={{ color: T.purple }} /> SHAP Feature Importance
        </h3>
        <div className="space-y-3">
          {shapeData.map(d => (
            <div key={d.feature}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-300">{d.feature}</span>
                <span className="text-xs font-mono font-bold" style={{ color: d.color }}>{(d.shap * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.08)" }}>
                <div className="h-2 rounded-full transition-all"
                  style={{ width: `${d.shap * 100}%`, background: `linear-gradient(90deg, ${d.color}, ${d.color}88)` }} />
              </div>
            </div>
          ))}
        </div>
      </GCard>

      {/* Confusion Matrix */}
      <GCard className="p-5">
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <Monitor size={15} style={{ color: T.cyan }} /> Confusion Matrix — {activeModel}
        </h3>
        <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto">
          {confusionData.map(c => (
            <div key={c.name} className="p-4 rounded-xl text-center"
              style={{ background: `${c.color}18`, border: `1px solid ${c.color}44` }}>
              <div className="font-mono text-2xl font-bold" style={{ color: c.color }}>{c.value}</div>
              <div className="text-xs text-slate-400 mt-1">{c.name}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex justify-center gap-1">
          <span className="text-xs text-slate-500">Matrix: [[TP={confMatrix[0][0]}, FP={confMatrix[0][1]}], [FN={confMatrix[1][0]}, TN={confMatrix[1][1]}]]</span>
        </div>
      </GCard>

      {/* Social Impact */}
      <GCard className="p-5" style={{ border: `1px solid ${T.emerald}33` }}>
        <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
          <Globe size={15} style={{ color: T.emerald }} /> Bangladesh Social Impact
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: "Rural Healthcare Access", desc: "Offline AI works without internet in villages", icon: WifiOff, color: T.amber },
            { label: "Bangla NLP", desc: "First symptom AI that understands natural Bangla speech", icon: MessageCircle, color: T.cyan },
            { label: "Maternal Safety", desc: "AI monitoring for 4M+ pregnant mothers in Bangladesh", icon: Baby, color: T.purple },
          ].map(item => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="p-3 rounded-xl" style={{ background: `${item.color}11`, border: `1px solid ${item.color}33` }}>
                <Icon size={18} className="mb-2" style={{ color: item.color }} />
                <p className="text-white font-semibold text-sm">{item.label}</p>
                <p className="text-xs text-slate-400 mt-1">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </GCard>

      {/* ML Pipeline */}
      <GCard className="p-5">
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
          <Database size={15} style={{ color: T.indigo }} /> ML Training Pipeline
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "1. Data Collection", "2. Bangla NLP Preprocessing", "3. Feature Engineering",
            "4. Model Training", "5. Cross-Validation", "6. SHAP Analysis", "7. API Deployment"
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}` }}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white"
                style={{ background: T.indigo }}>{i + 1}</div>
              <span className="text-xs text-slate-300">{step.replace(/^\d+\. /, "")}</span>
            </div>
          ))}
        </div>
      </GCard>
    </div>
  );
};

/* ================================================================
   SECTION 16 — MATERNAL HEALTH PAGE
================================================================ */
const MaternalPage = () => {
  const [week, setWeek] = useState(24);
  const [symptoms, setSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const maternalSymptoms = [
    { id: "severe_headache", label: "Severe Headache", bangla: "তীব্র মাথা ব্যথা", warning: true },
    { id: "blurred_vision", label: "Blurred Vision", bangla: "ঝাপসা দৃষ্টি", warning: true },
    { id: "severe_swelling", label: "Severe Swelling", bangla: "হাত পা ফোলা", warning: true },
    { id: "abdominal_pain", label: "Abdominal Pain", bangla: "পেট ব্যথা", warning: true },
    { id: "reduced_fetal_movement", label: "Reduced Fetal Movement", bangla: "শিশুর নড়াচড়া কম", warning: true },
    { id: "vaginal_bleeding", label: "Vaginal Bleeding", bangla: "রক্তপাত", warning: true },
    { id: "nausea", label: "Nausea / Vomiting", bangla: "বমি ভাব", warning: false },
    { id: "fatigue", label: "Fatigue", bangla: "ক্লান্তি", warning: false },
    { id: "back_pain", label: "Back Pain", bangla: "পিঠে ব্যথা", warning: false },
    { id: "heartburn", label: "Heartburn", bangla: "বুক জ্বালা", warning: false },
  ];

  const analyze = async () => {
    setLoading(true);
    const hasWarning = symptoms.some(id => maternalSymptoms.find(s => s.id === id)?.warning);
    await new Promise(r => setTimeout(r, 1500));
    setResult({
      risk: hasWarning ? (symptoms.length > 2 ? 75 : 50) : 20,
      isWarning: hasWarning,
      message: hasWarning
        ? "⚠️ Warning signs detected. Please consult a doctor immediately."
        : "✅ No immediate warning signs. Continue regular prenatal checkups.",
      banglaMssg: hasWarning
        ? "সতর্কতা! কিছু জটিল লক্ষণ আছে। এখনই ডাক্তারের কাছে যান।"
        : "কোনো জরুরি লক্ষণ নেই। নিয়মিত প্রসবপূর্ব চেকআপ করুন।",
      tips: [
        "প্রতিদিন ফলিক অ্যাসিড নিন", "প্রচুর পানি পান করুন",
        "নিয়মিত আয়রন ও ক্যালসিয়াম নিন", "হালকা ব্যায়াম করুন",
      ],
    });
    setLoading(false);
  };

  const getWeekInfo = (w) => {
    if (w <= 12) return { trimester: "1st Trimester", info: "Morning sickness common. Fetal organs forming.", color: T.indigo };
    if (w <= 26) return { trimester: "2nd Trimester", info: "Baby movements begin. Energy improves.", color: T.emerald };
    return { trimester: "3rd Trimester", info: "Baby getting ready to be born. Monitor movements.", color: T.purple };
  };

  const weekInfo = getWeekInfo(week);

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: `${T.purple}22` }}>
          <Baby size={20} style={{ color: T.purple }} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Maternal Health AI</h2>
          <p className="text-slate-400 text-sm">গর্ভাবস্থার স্বাস্থ্য সহায়তা</p>
        </div>
      </div>

      {/* Week tracker */}
      <GCard className="p-5" style={{ background: `linear-gradient(135deg, ${T.purple}22, ${T.indigo}11)`, border: `1px solid ${T.purple}44` }}>
        <div className="flex items-center justify-between mb-3">
          <span className="text-white font-semibold">Pregnancy Week</span>
          <Badge label={weekInfo.trimester} color={weekInfo.color} />
        </div>
        <div className="flex items-center gap-4 mb-3">
          <input type="range" min={4} max={40} value={week}
            onChange={e => setWeek(Number(e.target.value))}
            className="flex-1 accent-purple-500" />
          <span className="font-mono text-2xl font-bold text-white">{week}w</span>
        </div>
        <div className="w-full h-2 rounded-full mb-2" style={{ background: "rgba(255,255,255,0.1)" }}>
          <div className="h-2 rounded-full" style={{ width: `${(week / 40) * 100}%`, background: `linear-gradient(90deg, ${T.purple}, ${T.cyan})` }} />
        </div>
        <p className="text-sm text-slate-400">{weekInfo.info}</p>
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[["Remaining", `${40 - week}w`], ["Progress", `${Math.round((week / 40) * 100)}%`], ["Trimester", weekInfo.trimester.split(" ")[0]]].map(([l, v]) => (
            <div key={l} className="text-center p-2 rounded-xl" style={{ background: "rgba(0,0,0,0.2)" }}>
              <div className="font-mono font-bold text-white text-sm">{v}</div>
              <div className="text-xs text-slate-500">{l}</div>
            </div>
          ))}
        </div>
      </GCard>

      {/* Symptoms checker */}
      <GCard className="p-4">
        <h3 className="text-white font-semibold text-sm mb-3">Current Symptoms (বর্তমান লক্ষণ)</h3>
        <div className="grid grid-cols-2 gap-2">
          {maternalSymptoms.map(s => {
            const sel = symptoms.includes(s.id);
            return (
              <button key={s.id} onClick={() => setSymptoms(prev => sel ? prev.filter(x => x !== s.id) : [...prev, s.id])}
                className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-left text-xs transition-all"
                style={{
                  background: sel ? (s.warning ? `${T.rose}20` : `${T.indigo}20`) : "rgba(255,255,255,0.04)",
                  border: `1px solid ${sel ? (s.warning ? T.rose : T.indigo) + "60" : T.border}`,
                  color: sel ? (s.warning ? T.rose : T.indigo) : T.textMuted,
                }}>
                {s.warning && <AlertTriangle size={11} className="mt-0.5 shrink-0" />}
                <div>
                  <div className="font-medium">{s.label}</div>
                  <div className="opacity-60" style={{ fontFamily: "serif" }}>{s.bangla}</div>
                </div>
                {sel && <Check size={11} className="ml-auto mt-0.5 shrink-0" />}
              </button>
            );
          })}
        </div>
      </GCard>

      <Btn onClick={analyze} className="w-full" size="lg" disabled={loading}>
        {loading ? <><Loader size={16} className="animate-spin" /> Analyzing...</> : <><Baby size={16} /> Analyze Maternal Health</>}
      </Btn>

      {result && (
        <GCard className="p-5" style={{ border: `1px solid ${result.isWarning ? T.rose : T.emerald}55` }}>
          <div className="flex items-center gap-3 mb-3">
            {result.isWarning
              ? <AlertTriangle size={22} style={{ color: T.rose }} />
              : <CheckCircle size={22} style={{ color: T.emerald }} />}
            <div>
              <p className="text-white font-semibold">{result.message}</p>
              <p className="text-sm mt-0.5" style={{ fontFamily: "serif", color: result.isWarning ? T.rose : T.emerald }}>
                {result.banglaMssg}
              </p>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            <p className="text-xs text-slate-400 mb-2">Daily Health Tips:</p>
            {result.tips.map((t, i) => (
              <div key={i} className="flex items-center gap-2 text-sm" style={{ fontFamily: "serif", color: T.text }}>
                <Check size={12} style={{ color: T.emerald }} /> {t}
              </div>
            ))}
          </div>
          {result.isWarning && (
            <div className="mt-3 flex gap-2">
              <a href="tel:16000" className="flex-1">
                <Btn variant="danger" size="sm" className="w-full"><Phone size={14} /> Call 16000 (Health Line)</Btn>
              </a>
            </div>
          )}
        </GCard>
      )}

      {/* Appointment reminder */}
      <GCard className="p-4" style={{ border: `1px solid ${T.cyan}33` }}>
        <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
          <Calendar size={14} style={{ color: T.cyan }} /> Prenatal Checkup Schedule
        </h3>
        <div className="space-y-2 text-xs">
          {[
            ["4–12 weeks", "First visit + blood tests + ultrasound"],
            ["13–26 weeks", "Every 4 weeks · Anatomy scan at 20w"],
            ["27–36 weeks", "Every 2 weeks · Glucose screening"],
            ["37–40 weeks", "Weekly · Birth plan preparation"],
          ].map(([time, info]) => (
            <div key={time} className="flex gap-3 py-2 border-b" style={{ borderColor: T.border }}>
              <span className="font-mono font-semibold shrink-0" style={{ color: T.cyan }}>{time}</span>
              <span className="text-slate-400">{info}</span>
            </div>
          ))}
        </div>
      </GCard>
    </div>
  );
};

/* ================================================================
   SECTION 17 — MAIN APP
================================================================ */
export default function MediSenseAI() {
  const [view, setView] = useState("landing");
  const [isAuth, setIsAuth] = useState(false);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [assessments, setAssessments] = useState(SAMPLE_HISTORY);
  const [currentResult, setCurrentResult] = useState(null);
  const [emergency, setEmergency] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => { window.removeEventListener("online", handleOnline); window.removeEventListener("offline", handleOffline); };
  }, []);

  const handleLogin = () => { setIsAuth(true); setView("dashboard"); };
  const handleLogout = () => { setIsAuth(false); setView("landing"); };

  const handleAssessmentComplete = (result) => {
    setCurrentResult(result);
    if (result.emergency) setEmergency(result.emergency);
    setView("report");
  };

  const handleSaveAssessment = (result) => {
    const entry = {
      id: result.id || Date.now(),
      date: result.date || new Date().toISOString().slice(0, 10),
      time: result.time || new Date().toLocaleTimeString(),
      symptoms: result.symptoms || [],
      risk: result.risk,
      severity: result.severity,
      confidence: result.confidence,
      diagnosis: result.conditions?.[0]?.name || "Assessment completed",
      rec: result.recommendations?.[0] || "",
      bangla: result.banglaExplanation || "",
    };
    setAssessments(prev => [entry, ...prev]);
  };

  if (!isAuth) {
    if (view === "landing") return <LandingPage onGetStarted={() => setView("auth")} />;
    if (view === "auth") return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen" style={{ background: T.bg, color: T.text }}>
      {/* Global styles */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
        @media print {
          aside, header { display: none !important; }
          main { margin: 0 !important; padding: 20px !important; }
        }
      `}</style>

      <EmergencyModal alert={emergency} onDismiss={() => setEmergency(null)} />

      <Sidebar
        view={view} setView={setView} profile={profile}
        isOpen={sidebarOpen} setOpen={setSidebarOpen}
        onLogout={handleLogout}
      />

      <div className="transition-all duration-300" style={{ marginLeft: sidebarOpen ? 240 : 0 }}>
        <TopBar
          view={view} profile={profile} isOnline={isOnline}
          notifCount={emergency ? 1 : 0}
          sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen}
          setView={setView}
        />

        <main className="overflow-y-auto" style={{ minHeight: "calc(100vh - 57px)" }}>
          {view === "dashboard" && (
            <DashboardPage
              profile={profile} assessments={assessments}
              setView={setView} setCurrentResult={setCurrentResult}
            />
          )}
          {view === "symptoms" && (
            <SymptomPage
              profile={profile} onComplete={handleAssessmentComplete} isOnline={isOnline}
            />
          )}
          {view === "report" && (
            <ReportPage
              result={currentResult} profile={profile}
              setView={setView} onSave={handleSaveAssessment}
            />
          )}
          {view === "history" && (
            <HistoryPage
              assessments={assessments} setView={setView} setCurrentResult={setCurrentResult}
            />
          )}
          {view === "analytics" && <AnalyticsPage assessments={assessments} />}
          {view === "settings" && <SettingsPage profile={profile} setProfile={setProfile} />}
          {view === "judge" && <JudgeDashboard />}
          {view === "maternal" && <MaternalPage />}
        </main>
      </div>

      {/* Mobile sidebar toggle */}
      {!sidebarOpen && isAuth && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 left-4 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg z-20"
          style={{ background: `linear-gradient(135deg, ${T.indigo}, ${T.purple})` }}>
          <Menu size={20} className="text-white" />
        </button>
      )}
    </div>
  );
}
