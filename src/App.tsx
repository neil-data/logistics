import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, updateProfile, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './lib/firebase';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  MapPin, 
  Wrench, 
  BarChart3, 
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Receipt,
  Gauge,
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { Card, CardHeader, CardContent, Badge } from './components/UI';
import { Vehicle, Driver, Trip, DashboardStats, User } from './types';
import PremiumLandingPage from './components/PremiumLandingPage';

// --- Mock Data for Charts ---
const performanceData = [
  { name: 'Mon', trips: 12, efficiency: 85 },
  { name: 'Tue', trips: 19, efficiency: 88 },
  { name: 'Wed', trips: 15, efficiency: 82 },
  { name: 'Thu', trips: 22, efficiency: 91 },
  { name: 'Fri', trips: 30, efficiency: 94 },
  { name: 'Sat', trips: 10, efficiency: 89 },
  { name: 'Sun', trips: 8, efficiency: 87 },
];

const vehicleTypeData = [
  { name: 'Trucks', value: 45 },
  { name: 'Vans', value: 32 },
  { name: 'Bikes', value: 18 },
];

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
const fetchApi = (path: string, init?: RequestInit) =>
  fetch(`${API_BASE_URL}${path}`, init);

// --- Components ---

const LandingPage = ({ onGetStarted }: { onGetStarted: (mode: 'login' | 'register') => void }) => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 overflow-x-hidden relative font-sans text-slate-300 selection:bg-blue-500/30">
      {/* Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('home')}>
             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/50">
                <Truck className="text-white w-6 h-6" />
              </div>
            <span className="text-2xl font-bold text-white tracking-tight">FleetFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('home')} className="text-sm font-medium hover:text-white transition-colors">Home</button>
            <button onClick={() => scrollToSection('solutions')} className="text-sm font-medium hover:text-white transition-colors">Solutions</button>
            <button onClick={() => scrollToSection('about')} className="text-sm font-medium hover:text-white transition-colors">About Us</button>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => onGetStarted('login')}
              className="text-white font-medium hover:text-blue-400 transition-colors"
            >
              Log In
            </button>
            <button 
                onClick={() => onGetStarted('register')}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-sm shadow-lg shadow-blue-900/30 transition-all"
            >
                Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10">
        
        {/* Home Section */}
        <section id="home" className="min-h-screen flex flex-col justify-center container mx-auto px-6 pt-20">
          <div className="flex-1 flex flex-col justify-center max-w-4xl mx-auto text-center py-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-slate-700 text-blue-400 text-sm font-medium mb-8 backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                Now live in Mumbai, Delhi & Bangalore
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight leading-tight">
                The Future of <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Logistics Intelligence</span>
              </h1>
              
              <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                Optimize fleet operations, reduce fuel costs, and ensure driver safety with our AI-powered management platform designed for the modern supply chain.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onGetStarted('register')}
                  className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold text-lg shadow-lg shadow-blue-900/30 transition-all flex items-center gap-2 group"
                >
                  Start Free Trial
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onGetStarted('login')}
                   className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 text-white border border-slate-700 rounded-full font-bold text-lg backdrop-blur-sm transition-all"
                >
                  Request Demo
                </motion.button>
              </div>
            </motion.div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 text-left">
              {[
                { icon: ShieldCheck, title: "Driver Safety", desc: "Real-time monitoring & scoring" },
                { icon: Zap, title: "Efficiency", desc: "AI-optimized route planning" },
                { icon: Globe, title: "Nationwide", desc: "Seamless cross-state logistics" }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <feature.icon className="w-8 h-8 text-blue-400 mb-4" />
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-400 text-sm">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Solutions Section */}
        <section id="solutions" className="py-24 bg-slate-900 relative">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
               <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Comprehensive Solutions</h2>
               <p className="text-lg text-slate-400">Everything you need to manage your fleet, drivers, and expenses in one unified platform.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                 { icon: MapPin, title: "Route Optimization", desc: "Reduce mileage and fuel usage with AI-driven route planning that considers traffic, weather, and vehicle type." },
                 { icon: Wrench, title: "Predictive Maintenance", desc: "Prevent breakdowns before they happen. Track service history and get alerts for upcoming maintenance." },
                 { icon: Receipt, title: "Expense Tracking", desc: "Digital logging of fuel, tolls, and miscellaneous expenses. Automated reports for financial analysis." },
                 { icon: Users, title: "Driver Performance", desc: "Gamified driver scoring system to encourage safe driving habits and reduce accidents." },
                 { icon: BarChart3, title: "Advanced Analytics", desc: "Deep insights into fleet utilization, cost-per-mile, and operational efficiency trends." },
                 { icon: Truck, title: "Asset Management", desc: "Complete lifecycle management for every vehicle from acquisition to retirement." }
               ].map((sol, i) => (
                  <div key={i} className="p-8 rounded-3xl bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 transition-all hover:bg-slate-800 group">
                    <div className="w-14 h-14 bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all">
                      <sol.icon className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{sol.title}</h3>
                    <p className="text-slate-400 leading-relaxed">{sol.desc}</p>
                  </div>
               ))}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-900/10 skew-y-3 transform origin-bottom-left scale-110 z-0"></div>
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <div className="inline-block px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 font-bold text-sm mb-6">
                  Our Mission
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  Driving the Future of <br />
                  <span className="text-blue-400">Indian Logistics</span>
                </h2>
                <div className="space-y-6 text-lg text-slate-300">
                  <p>
                    Founded in 2024, FleetFlow was born from a simple observation: the Indian logistics sector needed a digital revolution. With millions of trucks on the road, efficiency wasn't just a business goal—it was an environmental necessity.
                  </p>
                  <p>
                    We built FleetFlow to be more than just software. It's a partner for fleet owners, dispatchers, and drivers. By combining world-class technology with deep local insights, we're helping businesses across the subcontinent move goods faster, safer, and cheaper.
                  </p>
                  <p>
                    Today, we process over 50,000 trips daily, ensuring that essential goods reach every corner of the nation.
                  </p>
                </div>
                
                <div className="mt-10 grid grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-4xl font-bold text-white mb-1">50k+</h4>
                    <p className="text-slate-500">Daily Trips</p>
                  </div>
                  <div>
                    <h4 className="text-4xl font-bold text-white mb-1">120+</h4>
                    <p className="text-slate-500">Cities Covered</p>
                  </div>
                  <div>
                    <h4 className="text-4xl font-bold text-white mb-1">98%</h4>
                    <p className="text-slate-500">Client Retention</p>
                  </div>
                   <div>
                    <h4 className="text-4xl font-bold text-white mb-1">24/7</h4>
                    <p className="text-slate-500">Support</p>
                  </div>
                </div>
              </div>
              
              <div className="lg:w-1/2 relative">
                <div className="aspect-square rounded-3xl overflow-hidden bg-slate-800 border border-slate-700 relative shadow-2xl shadow-blue-900/20">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10"></div>
                     {/* Abstract Representation of Map/Tech */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                       <Globe className="w-64 h-64 text-blue-500 animate-pulse" />
                    </div>
                     <div className="absolute bottom-10 left-10 right-10 p-6 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-700 z-20">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-12 h-12 rounded-full bg-slate-700"></div>
                           <div>
                              <div className="h-4 w-32 bg-slate-700 rounded mb-2"></div>
                              <div className="h-3 w-20 bg-slate-700 rounded"></div>
                           </div>
                        </div>
                        <div className="h-2 w-full bg-slate-700 rounded mb-2"></div>
                        <div className="h-2 w-2/3 bg-slate-700 rounded"></div>
                     </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Footer */}
        <section className="py-20 bg-gradient-to-br from-blue-900 to-slate-900 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Ready to modernize your fleet?</h2>
            <button 
              onClick={() => onGetStarted('register')}
              className="px-10 py-5 bg-white text-blue-900 rounded-full font-bold text-xl shadow-xl hover:bg-blue-50 transition-all transform hover:-translate-y-1"
            >
              Get Started Now
            </button>
            <p className="mt-8 text-blue-200 text-sm">&copy; 2026 FleetFlow Logistics Systems. Made with ❤️ for India.</p>
          </div>
        </section>
      </main>
    </div>
  );
};

const LoadingScreen = () => (
  <div className="fixed inset-0 bg-slate-900 z-50 flex flex-col items-center justify-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative items-center justify-center flex flex-col"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-900 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-900/50 mb-8 relative overflow-hidden">
        <motion.div
           animate={{ x: [0, 100, 0] }}
           transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
           className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
        />
        <Truck className="text-white w-12 h-12" />
      </div>
      <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">FleetFlow</h1>
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{ duration: 2 }}
        className="h-1 bg-blue-600 rounded-full w-32 overflow-hidden"
      >
        <motion.div 
          animate={{ x: [-128, 128] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="h-full w-full bg-blue-400/50"
        />
      </motion.div>
    </motion.div>
  </div>
);

const Login = ({ onLogin, initialMode = 'login' }: { onLogin: (user: User) => void, initialMode?: 'login' | 'register' }) => {
  const [isRegistering, setIsRegistering] = useState(initialMode === 'register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<User['role']>('Fleet Manager');
  const [error, setError] = useState('');

  const roles: User['role'][] = ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegistering) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (name) {
          await updateProfile(userCredential.user, { displayName: name });
        }
        // Store selected role in localStorage to persist across session initialization
        localStorage.setItem('userRole', role);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        // For existing users, we might want to let them select role on login or retrieve it
        // For this demo, we'll update the role based on selection
        localStorage.setItem('userRole', role);
      }
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      localStorage.setItem('userRole', role);
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-900 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
            <Truck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 italic">FleetFlow India</h1>
          <p className="text-slate-500 font-medium">Smart Logistics for the Indian Subcontinent</p>
        </div>

        <Card className="p-8 border-slate-200">
          <div className="flex border-b border-slate-100 mb-6">
            <button 
              onClick={() => setIsRegistering(false)}
              className={`flex-1 pb-3 text-sm font-bold transition-all ${!isRegistering ? 'text-blue-900 border-b-2 border-orange-500' : 'text-slate-400'}`}
            >
              Sign In
            </button>
            <button 
              onClick={() => setIsRegistering(true)}
              className={`flex-1 pb-3 text-sm font-bold transition-all ${isRegistering ? 'text-blue-900 border-b-2 border-orange-500' : 'text-slate-400'}`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-200">{error}</div>}
            
            {isRegistering && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                  placeholder="e.g. Rahul Sharma"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                placeholder="name@company.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-900 transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Role</label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`px-3 py-2 rounded-lg border text-[10px] font-bold transition-all uppercase tracking-wider ${
                      role === r 
                        ? 'bg-blue-900 border-blue-800 text-white shadow-md' 
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-900 text-white font-semibold py-3 rounded-lg hover:bg-blue-800 transition-all shadow-md mt-4"
            >
              {isRegistering ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">Or continue with</span>
              </div>
            </div>

            <button 
              type="button"
              onClick={handleGoogleLogin}
              className="mt-4 w-full bg-white border border-slate-200 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              Sign in with Google
            </button>
          </div>
          
          {!isRegistering && (
            <div className="text-center mt-4">
              <button 
                type="button" 
                onClick={() => alert("Please contact support to reset your password.")}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium transition-colors"
               >
                Forgot Password?
              </button>
            </div>
          )}
        </Card>

        
        <p className="text-center mt-8 text-slate-400 text-sm">
          &copy; 2026 FleetFlow Logistics Systems. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};

const Sidebar = ({ activeTab, setActiveTab, user }: { 
  activeTab: string, 
  setActiveTab: (t: string) => void,
  user: User
}) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard', roles: ['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'] },
    { id: 'vehicles', icon: Truck, label: 'Vehicle Registry', roles: ['Fleet Manager', 'Dispatcher'] },
    { id: 'trips', icon: MapPin, label: 'Trip Dispatcher', roles: ['Fleet Manager', 'Dispatcher'] },
    { id: 'maintenance', icon: Wrench, label: 'Maintenance', roles: ['Fleet Manager', 'Dispatcher'] },
    { id: 'expenses', icon: Receipt, label: 'Trip & Expense', roles: ['Fleet Manager', 'Financial Analyst'] },
    { id: 'performance', icon: Gauge, label: 'Performance', roles: ['Fleet Manager', 'Safety Officer'] },
    { id: 'analytics', icon: BarChart3, label: 'Analytics', roles: ['Fleet Manager', 'Financial Analyst'] },
    { id: 'users', icon: Users, label: 'User Management', roles: ['Fleet Manager'] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(user.role));

  return (
    <div className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0 shadow-sm">
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-900 rounded-lg flex items-center justify-center shadow-md">
            <Truck className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-blue-900">FleetFlow</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {filteredItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeTab === item.id 
                ? 'bg-blue-900 text-white font-medium shadow-md' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-blue-900'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="mb-4 px-4">
          <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Current Session</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
            <span className="text-xs text-slate-600 font-medium">{user.role}</span>
          </div>
        </div>
        <button 
          onClick={() => signOut(auth)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const Header = ({ title, user }: { title: string, user: User }) => (
  <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
    <h1 className="text-lg font-bold text-slate-900">{title}</h1>
    <div className="flex items-center gap-4">
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search fleet..." 
          className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-700 focus:ring-2 focus:ring-blue-900 w-64 outline-none"
        />
      </div>
      <button 
        onClick={() => alert("No new notifications")}
        className="p-2 text-slate-500 hover:bg-slate-100 rounded-full relative"
      >
        <Bell className="w-5 h-5" />
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
      </button>
      <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-bold text-slate-900">{user.name}</p>
          <p className="text-[10px] text-blue-700 font-bold">{user.role}</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold text-xs shadow-sm">
          {user.avatar}
        </div>
      </div>
    </div>
  </header>
);

const Dashboard = ({ setActiveTab }: { setActiveTab: (t: string) => void }) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [groupBy, setGroupBy] = useState('none');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchApi('/api/dashboard/stats').then(res => res.json()),
      fetchApi('/api/vehicles').then(res => res.json())
    ]).then(([statsData, vehiclesData]) => {
      setStats(statsData);
      setVehicles(vehiclesData);
    }).catch(err => {
      console.error("Failed to load dashboard data", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // Fallback if stats fail to load entirely
  const safeStats = stats || {
    activeFleet: 0,
    maintenanceAlerts: 0,
    utilizationRate: 0,
    pendingCargo: 0,
    totalRevenue: 0,
    fuelSpend: 0
  };

  const kpis = [
    { label: 'Active Fleet', value: safeStats.activeFleet, sub: 'Vehicles on trip', icon: Truck, color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'Maintenance', value: safeStats.maintenanceAlerts, sub: 'Vehicles in shop', icon: AlertCircle, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Utilization', value: `${safeStats.utilizationRate}%`, sub: 'Fleet assigned', icon: BarChart3, color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'Pending Cargo', value: safeStats.pendingCargo, sub: 'Waiting assignment', icon: Clock, color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  const financialStats = [
    { label: 'Total Revenue', value: `₹${(safeStats.totalRevenue / 100000).toFixed(1)}L`, sub: 'Current Month', icon: ArrowUpRight, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Fuel Spend', value: `₹${(safeStats.fuelSpend / 100000).toFixed(1)}L`, sub: 'Current Month', icon: ArrowDownRight, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const filteredVehicles = vehicles
    .filter(v => 
      (v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.licensePlate.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (filterStatus === 'All' || v.status === filterStatus)
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'load') return b.maxCapacity - a.maxCapacity;
      return 0;
    });

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE': return <Badge variant="success">Available</Badge>;
      case 'IN_SHOP': case 'IN SHOP': return <Badge variant="warning">In Shop</Badge>;
      case 'ON_TRIP': case 'ON TRIP': return <Badge variant="info">On Trip</Badge>;
      case 'RETIRED': case 'OUT OF SERVICE': return <Badge variant="error">Retired</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('trips')}
            className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-all shadow-md"
          >
            <Plus className="w-4 h-4" />
            New Trip
          </button>
          <button 
            onClick={() => setActiveTab('vehicles')}
            className="bg-white text-blue-900 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-50 transition-all border border-slate-200 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New Vehicle
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className={`w-12 h-12 ${kpi.bg} rounded-xl flex items-center justify-center border border-slate-100`}>
                  <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{kpi.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{kpi.value}</h3>
                  <p className="text-xs text-slate-400">{kpi.sub}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {financialStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <Card className="bg-gradient-to-br from-white to-slate-50 border-blue-100">
              <CardContent className="flex items-center justify-between py-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 ${stat.bg} rounded-full flex items-center justify-center`}>
                    <stat.icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                    <h3 className="text-3xl font-bold text-slate-900">{stat.value}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">{stat.sub}</p>
                  <div className={`flex items-center gap-1 mt-1 font-bold ${stat.color}`}>
                    <span>+12.5%</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Fleet Overview with Controls */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="font-bold text-slate-900">Fleet Overview</h3>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search fleet..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 focus:ring-1 focus:ring-blue-900 outline-none w-48"
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-900"
            >
              <option value="All">All Status</option>
              <option value="AVAILABLE">Available</option>
              <option value="ON_TRIP">On Trip</option>
              <option value="IN_SHOP">In Shop</option>
            </select>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-900"
            >
              <option value="name">Sort by Name</option>
              <option value="load">Sort by Load</option>
            </select>
            <select 
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-600 text-xs rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-blue-900"
            >
              <option value="none">No Grouping</option>
              <option value="type">Group by Type</option>
              <option value="region">Group by Region</option>
            </select>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Region</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {groupBy === 'none' ? (
                filteredVehicles.map((v) => (
                  <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{v.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{v.licensePlate}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{v.type}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{v.region}</td>
                    <td className="px-6 py-4">{getStatusBadge(v.status)}</td>
                  </tr>
                ))
              ) : (
                (Object.entries(
                  filteredVehicles.reduce((acc, v) => {
                    const key = (groupBy === 'type' ? v.type : v.region) || 'Unassigned';
                    if (!acc[key]) acc[key] = [];
                    acc[key].push(v);
                    return acc;
                  }, {} as Record<string, Vehicle[]>)
                ) as [string, Vehicle[]][]).map(([group, items]) => (
                  <React.Fragment key={group}>
                    <tr className="bg-slate-50/30">
                      <td colSpan={4} className="px-6 py-2 text-[10px] font-bold text-blue-700 uppercase tracking-widest border-y border-slate-100">
                        {group} ({items.length})
                      </td>
                    </tr>
                    {items.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-slate-900">{v.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">{v.licensePlate}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{v.type}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{v.region}</td>
                        <td className="px-6 py-4">{getStatusBadge(v.status)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const VehicleRegistry = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicleId, setEditingVehicleId] = useState<string | number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    licensePlate: '',
    maxCapacity: '',
    odometer: '',
    type: 'Truck',
    name: '',
    region: 'North'
  });

  const fetchVehicles = () => {
    fetchApi('/api/vehicles')
      .then(res => res.json())
      .then(setVehicles)
      .catch(() => setError('Failed to load vehicles. Please refresh.'));
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const isEditing = editingVehicleId !== null;
      const endpoint = isEditing ? `/api/vehicles/${editingVehicleId}` : '/api/vehicles';
      const res = await fetchApi(endpoint, {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          maxCapacity: Number(formData.maxCapacity),
          odometer: Number(formData.odometer)
        })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Failed to register vehicle');
      }

      setIsModalOpen(false);
      setEditingVehicleId(null);
      setFormData({ licensePlate: '', maxCapacity: '', odometer: '', type: 'Truck', name: '', region: 'North' });
      fetchVehicles();
    } catch (submitError: any) {
      setError(submitError?.message || 'Failed to register vehicle');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setError('');
    setEditingVehicleId(vehicle.id);
    setFormData({
      licensePlate: vehicle.licensePlate,
      maxCapacity: String(vehicle.maxCapacity),
      odometer: String(vehicle.odometer),
      type: vehicle.type,
      name: vehicle.name,
      region: vehicle.region || 'North',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingVehicleId(null);
    setError('');
    setFormData({ licensePlate: '', maxCapacity: '', odometer: '', type: 'Truck', name: '', region: 'North' });
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE': return <Badge variant="success">Available</Badge>;
      case 'IN_SHOP': case 'IN SHOP': return <Badge variant="warning">In Shop</Badge>;
      case 'ON_TRIP': case 'ON TRIP': return <Badge variant="info">On Trip</Badge>;
      case 'RETIRED': case 'OUT OF SERVICE': return <Badge variant="error">Retired</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Vehicle Registry</h2>
          <p className="text-slate-500">Manage your physical assets and fleet health.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Vehicle
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4 text-slate-900">{editingVehicleId ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Model Name</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Tata Prima"
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">License Plate</label>
                  <input 
                    required
                    type="text" 
                    placeholder="MH-12-AB-1234"
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                    value={formData.licensePlate}
                    onChange={e => setFormData({...formData, licensePlate: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Max Payload (kg)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                    value={formData.maxCapacity}
                    onChange={e => setFormData({...formData, maxCapacity: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Initial Odometer</label>
                  <input 
                    required
                    type="number" 
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                    value={formData.odometer}
                    onChange={e => setFormData({...formData, odometer: e.target.value})}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Type</label>
                  <select 
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                    <option value="Bike">Bike</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Region</label>
                  <select 
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                    value={formData.region}
                    onChange={e => setFormData({...formData, region: e.target.value})}
                  >
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (editingVehicleId ? 'Saving...' : 'Registering...') : (editingVehicleId ? 'Save' : 'Register')}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">License Plate</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Region</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Max Load</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((v) => (
                <tr key={v.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-700 border border-blue-100">
                        <Truck className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-900">{v.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-sm text-slate-500">{v.licensePlate}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{v.type}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <Badge variant="default">{v.region}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{v.maxCapacity.toLocaleString()} kg</td>
                  <td className="px-6 py-4">{getStatusBadge(v.status)}</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleEditVehicle(v)}
                      className="text-slate-400 hover:text-blue-900 font-bold text-sm transition-colors"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const TripDispatcher = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vehicleId: '',
    driverId: '',
    cargoWeight: '',
    origin: '',
    destination: '',
    estimatedFuelCost: ''
  });
  const [error, setError] = useState('');

  const fetchData = () => {
    fetchApi('/api/trips').then(res => res.json()).then(setTrips);
    fetchApi('/api/vehicles').then(res => res.json()).then((v: Vehicle[]) => setVehicles(v.filter(x => x.status === 'AVAILABLE')));
    fetchApi('/api/drivers').then(res => res.json()).then((d: Driver[]) => setDrivers(d.filter(x => ['ON_DUTY', 'OFF_DUTY'].includes(x.status))));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Estimate revenue logic: (CargoWeight * 12) + (FuelCost * 1.3)
    const cargoWeight = parseFloat(formData.cargoWeight);
    const fuelCost = parseFloat(formData.estimatedFuelCost);
    const estimatedRevenue = Math.round((cargoWeight * 12) + (fuelCost * 1.3));

    const res = await fetchApi('/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        vehicleId: formData.vehicleId,
        driverId: formData.driverId,
        cargoWeight: cargoWeight,
        estimatedFuelCost: fuelCost,
        revenue: estimatedRevenue
      })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
    } else {
      setIsModalOpen(false);
      setFormData({ vehicleId: '', driverId: '', cargoWeight: '', origin: '', destination: '', estimatedFuelCost: '' });
      fetchData();
    }
  };

  const handleCompleteTrip = async (id: string) => {
    if(!confirm("Mark this trip as completed? This will free up the vehicle and driver.")) return;
    
    // Prompt for end odometer
    const endOdoStr = prompt("Enter final odometer reading:", "0");
    if (endOdoStr === null) return;
    const endOdo = parseFloat(endOdoStr);

    const res = await fetchApi(`/api/trips/${id}/complete`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endOdo })
    });

    if(res.ok) {
        fetchData();
    } else {
        alert("Failed to complete trip");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DISPATCHED': return <Badge variant="info">Dispatched</Badge>;
      case 'COMPLETED': return <Badge variant="success">Completed</Badge>;
      case 'CANCELLED': return <Badge variant="error">Cancelled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Trip Dispatcher</h2>
          <p className="text-slate-500">Assign vehicles and drivers to new delivery routes.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create Trip
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4 text-slate-900">New Trip Dispatch</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-lg border border-rose-200">{error}</div>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle</label>
                <select 
                  required
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                  value={formData.vehicleId}
                  onChange={e => setFormData({...formData, vehicleId: e.target.value})}
                >
                  <option value="">Select Available Vehicle</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.name} ({v.maxCapacity}kg)</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Driver</label>
                <select 
                  required
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                  value={formData.driverId}
                  onChange={e => setFormData({...formData, driverId: e.target.value})}
                >
                  <option value="">Select Available Driver</option>
                  {drivers.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Cargo Weight (kg)</label>
                <input 
                  required
                  type="number" 
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                  value={formData.cargoWeight}
                  onChange={e => setFormData({...formData, cargoWeight: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Origin Address</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Full origin address"
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                    value={formData.origin}
                    onChange={e => setFormData({...formData, origin: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Destination Address</label>
                  <input 
                    required
                    type="text" 
                    placeholder="Full destination address"
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                    value={formData.destination}
                    onChange={e => setFormData({...formData, destination: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Fuel Cost (₹)</label>
                <input 
                  required
                  type="number" 
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                  value={formData.estimatedFuelCost}
                  onChange={e => setFormData({...formData, estimatedFuelCost: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all shadow-md"
                >
                  Dispatch
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-blue-900 text-white border-none shadow-lg">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Available Fleet</p>
              <h3 className="text-3xl font-bold">{vehicles.length}</h3>
            </div>
            <Truck className="w-10 h-10 text-blue-300 opacity-50" />
          </CardContent>
        </Card>
        <Card className="bg-orange-500 text-white border-none shadow-lg">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-orange-50 text-sm">Ready Drivers</p>
              <h3 className="text-3xl font-bold">{drivers.length}</h3>
            </div>
            <Users className="w-10 h-10 text-orange-200 opacity-50" />
          </CardContent>
        </Card>
        <Card className="bg-slate-800 text-white border-none shadow-lg">
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-slate-300 text-sm">Active Trips</p>
              <h3 className="text-3xl font-bold">{trips.filter(t => t.status === 'DISPATCHED').length}</h3>
            </div>
            <MapPin className="w-10 h-10 text-slate-500 opacity-50" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Trip ID</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Load</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trips.map((t: any) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-sm text-slate-500">#TRP-{typeof t.id === 'string' ? t.id.slice(0, 8) : t.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{t.origin}</span>
                      <span className="text-xs text-slate-500">to {t.destination}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{t.vehicle?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 font-medium">{t.driver?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{Number(t.cargoWeight || t.cargo_weight).toLocaleString()} kg</td>
                  <td className="px-6 py-4">{getStatusBadge(t.status)}</td>
                  <td className="px-6 py-4 text-right">
                    {t.status === 'DISPATCHED' && (
                        <button 
                            onClick={() => handleCompleteTrip(t.id)}
                            className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-md transition-colors"
                        >
                            Complete
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const Maintenance = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ vehicleId: '', description: '', date: '' });

  const fetchData = () => {
    fetchApi('/api/maintenance').then(res => res.json()).then(setLogs);
    fetchApi('/api/vehicles').then(res => res.json()).then(setVehicles);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetchApi('/api/maintenance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setIsModalOpen(false);
      setFormData({ vehicleId: '', description: '', date: '' });
      fetchData();
    }
  };

  const handleCompleteTask = async (id: number) => {
    if(!confirm("Mark this service as completed? This will verify the vehicle is ready for work.")) return;

    const res = await fetchApi(`/api/maintenance/${id}/complete`, { method: 'POST' });
    if(res.ok) {
        fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Maintenance</h2>
          <p className="text-slate-500">Track and schedule vehicle service logs.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create New Service
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4 text-slate-900">Schedule Service</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Vehicle Name</label>
                <select 
                  required
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                  value={formData.vehicleId}
                  onChange={e => setFormData({...formData, vehicleId: e.target.value})}
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Issue/Service</label>
                <textarea 
                  required
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-3"
                  rows={3}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <input 
                  required
                  type="date" 
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all shadow-md">Schedule</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Vehicle</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Issue/Service</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider text-right">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{log.vehicle?.name || 'Unknown'}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{log.description}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant={log.status === 'Completed' ? 'success' : log.status === 'Pending' ? 'warning' : 'info'}>
                      {log.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {log.status === 'Pending' && (
                        <button 
                            onClick={() => handleCompleteTask(log.id)}
                            className="text-xs font-bold text-green-600 hover:text-green-800 bg-green-50 px-3 py-1.5 rounded-md transition-colors"
                        >
                            Finish
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const TripExpenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ trip_id: '', driver_name: '', fuel_cost: '', misc_expense: '' });

  const fetchData = () => {
    fetchApi('/api/expenses').then(res => res.json()).then(setExpenses);
    fetchApi('/api/trips').then(res => res.json()).then(setTrips);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetchApi('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        trip_id: parseInt(formData.trip_id),
        fuel_cost: parseFloat(formData.fuel_cost),
        misc_expense: parseFloat(formData.misc_expense)
      })
    });
    if (res.ok) {
      setIsModalOpen(false);
      setFormData({ trip_id: '', driver_name: '', fuel_cost: '', misc_expense: '' });
      fetchData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Trip & Expense</h2>
          <p className="text-slate-500">Monitor fuel and miscellaneous costs per trip.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Log New Expense
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4 text-slate-900">Log Trip Expense</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trip ID</label>
                <select 
                  required
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                  value={formData.trip_id}
                  onChange={e => {
                    const selectedTripId = e.target.value;
                    const trip = trips.find(t => String(t.id) === selectedTripId) as any;
                    setFormData({
                      ...formData,
                      trip_id: selectedTripId,
                      driver_name: trip?.driverName || trip?.driver?.name || ''
                    });
                  }}
                >
                  <option value="">Select Trip</option>
                  {trips.map(t => <option key={t.id} value={t.id}>#TRP-{t.id} ({t.origin} to {t.destination})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Driver</label>
                <input 
                  readOnly
                  type="text" 
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-sm outline-none p-2"
                  value={formData.driver_name}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fuel Cost (₹)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                    value={formData.fuel_cost}
                    onChange={e => setFormData({...formData, fuel_cost: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Misc Expense (₹)</label>
                  <input 
                    required
                    type="number" 
                    className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                    value={formData.misc_expense}
                    onChange={e => setFormData({...formData, misc_expense: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all shadow-md">Log Expense</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Trip ID</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Driver</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Fuel Cost</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Misc Expense</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {expenses.map((exp) => (
                <tr key={exp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">#TRP-{exp.trip_id}</td>
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{exp.driver_name}</td>
                  <td className="px-6 py-4 text-sm text-blue-700 font-medium">₹{exp.fuel_cost.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-orange-600 font-medium">₹{exp.misc_expense.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-400 text-right">{exp.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const Performance = () => {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
      name: '',
      licenseType: '',
      licenseExpiry: '',
      status: 'OFF_DUTY',
      safetyScore: 100
  });

  const fetchDrivers = () => {
    fetchApi('/api/drivers').then(res => res.json()).then(setDrivers);
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetchApi('/api/drivers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    if (res.ok) {
      setIsModalOpen(false);
      setFormData({ name: '', licenseType: '', licenseExpiry: '', status: 'OFF_DUTY', safetyScore: 100 });
      fetchDrivers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Performance & Drivers</h2>
          <p className="text-slate-500">Driver registry, safety scores, and operational metrics.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-800 transition-all shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Driver
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4 text-slate-900">Register New Driver</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  required
                  type="text" 
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">License Type</label>
                <input 
                  required
                  type="text" 
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                  value={formData.licenseType}
                  onChange={e => setFormData({...formData, licenseType: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">License Expiry</label>
                <input 
                  required
                  type="date" 
                  className="w-full rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-sm outline-none focus:ring-2 focus:ring-blue-900 p-2"
                  value={formData.licenseExpiry}
                  onChange={e => setFormData({...formData, licenseExpiry: e.target.value})}
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-all">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-all shadow-md">Register</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">License</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Expiry</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Completion Rate</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Safety Score</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider text-right">Complaints</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {drivers.map((d) => (
                <tr key={d.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{d.name}</td>
                  <td className="px-6 py-4 text-sm font-mono text-slate-500">{d.licenseType}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{new Date(d.licenseExpiry).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-sm text-blue-700 font-bold">100%</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-900" style={{ width: `${d.safetyScore}%` }}></div>
                      </div>
                      <span className="text-xs font-bold text-blue-900">{d.safetyScore}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Badge variant="success">0</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const Analytics = () => {
  const [summary, setSummary] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetchApi('/api/analytics/summary').then(res => res.json()),
      fetchApi('/api/dashboard/stats').then(res => res.json())
    ]).then(([summaryData, statsData]) => {
      setSummary(summaryData);
      setStats(statsData);
    }).catch(err => {
      console.error("Failed to load analytics", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900"></div>
      </div>
    );
  }
  
  // Safe detail access
  const safeStats = stats || { fuelSpend: 0, utilizationRate: 0 };

  const metrics = [
    { label: 'Total Fuel Cost', value: `₹${(safeStats.fuelSpend / 100000).toFixed(1)}L`, icon: Receipt, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Fleet ROI', value: '18.4%', icon: ArrowUpRight, color: 'text-blue-700', bg: 'bg-blue-50' },
    { label: 'Utilization Rate', value: `${safeStats.utilizationRate}%`, icon: Gauge, color: 'text-slate-600', bg: 'bg-slate-100' },
  ];

  // Rest of render...
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
        <p className="text-slate-500">Financial performance and operational efficiency.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((m) => (
          <div key={m.label}>
            <Card>
              <CardContent className="flex items-center gap-4">
                <div className={`w-12 h-12 ${m.bg} rounded-xl flex items-center justify-center`}>
                  <m.icon className={`w-6 h-6 ${m.color}`} />
                </div>
                <div>
                  <p className="text-sm text-slate-500 font-medium">{m.label}</p>
                  <h3 className="text-2xl font-bold text-slate-900">{m.value}</h3>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-bold text-slate-900">Revenue vs Profit</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={summary}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  <Bar dataKey="revenue" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="net_profit" fill="#f97316" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="font-bold text-slate-900">Fuel Cost Trend</h3>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={summary}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="fuel_cost" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#ef4444' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h3 className="font-bold text-slate-900">Financial Summary of Month</h3>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Month</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Fuel Cost</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Maintenance</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summary.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-slate-900">{row.month}</td>
                  <td className="px-6 py-4 text-sm text-blue-700 font-medium">₹{row.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-rose-600">₹{row.fuel_cost.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-orange-600">₹{row.maintenance.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-slate-900 font-bold text-right">₹{row.net_profit.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = () => {
    fetchApi('/api/users').then(res => res.json()).then(setUsers);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId: string | number, newRole: string) => {
    const res = await fetchApi(`/api/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
    });
    if(res.ok) fetchUsers();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">User Management</h2>
        <p className="text-slate-500">View all registered users and their roles.</p>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-blue-900 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                        {u.avatar || u.name[0]}
                      </div>
                      <span className="font-bold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <select 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg px-2 py-1 outline-none focus:ring-1 focus:ring-blue-900"
                    >
                        {['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'].map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="success">Active</Badge>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    No users found in database yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authState, setAuthState] = useState<'loading' | 'landing' | 'login' | 'app'>('loading');
  const [loginMode, setLoginMode] = useState<'login' | 'register'>('login');

  useEffect(() => {
    // Artificial minimum loading time for the animation
    setAuthState('loading');
    const timer = setTimeout(() => {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          const userData: User = {
            id: currentUser.uid, 
            name: currentUser.displayName || currentUser.email?.split('@')[0] || 'User',
            email: currentUser.email || '',
            role: (localStorage.getItem('userRole') as User['role']) || 'Fleet Manager', 
            avatar: (currentUser.email?.[0] || 'U').toUpperCase()
          };

          // Sync user with backend
          try {
            await fetchApi('/api/users/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(userData)
            });
          } catch (err) {
            console.error("Failed to sync user", err);
          }

          setUser(userData);
          setAuthState('app');
        } else {
          setUser(null);
          setAuthState('landing');
        }
      });
    }, 2500); // 2.5s loading screen

    return () => clearTimeout(timer);
  }, []);

  if (authState === 'loading') {
    return <LoadingScreen />;
  }

  if (authState === 'landing') {
    return <PremiumLandingPage onGetStarted={(mode) => {
      setLoginMode(mode);
      setAuthState('login');
    }} />;
  }

  if (authState === 'login') {
    return <Login onLogin={(u) => {
      setUser(u);
      setAuthState('app');
    }} initialMode={loginMode} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard setActiveTab={setActiveTab} />;
      case 'vehicles': return <VehicleRegistry />;
      case 'trips': return <TripDispatcher />;
      case 'maintenance': return <Maintenance />;
      case 'expenses': return <TripExpenses />;
      case 'performance': return <Performance />;
      case 'analytics': return <Analytics />;
      case 'users': return <UserManagement />;
      default: return (
        <div className="flex flex-col items-center justify-center h-64 text-slate-400">
          <Settings className="w-12 h-12 mb-4 opacity-20" />
          <p>Module under development</p>
        </div>
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
      />
      
      <main className="flex-1 flex flex-col min-w-0">
        <Header 
          title={
            activeTab === 'dashboard' ? 'Dashboard' : 
            activeTab === 'vehicles' ? 'Vehicle Registry' : 
            activeTab === 'trips' ? 'Trip Dispatcher' : 
            activeTab === 'maintenance' ? 'Maintenance' :
            activeTab === 'expenses' ? 'Trip & Expense' :
            activeTab === 'performance' ? 'Performance' :
            activeTab === 'analytics' ? 'Analytics' :
            activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
          } 
          user={user}
        />
        
        <div className="p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
