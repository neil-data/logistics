import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { 
  Truck, BarChart3, ShieldCheck, Zap, Globe, ChevronRight, 
  ArrowRight, Users, Play, Star, CheckCircle2, Menu, X
} from 'lucide-react';

interface PremiumLandingPageProps {
  onGetStarted: (mode: 'login' | 'register') => void;
}

const PremiumLandingPage: React.FC<PremiumLandingPageProps> = ({ onGetStarted }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const headerY = useTransform(scrollY, [0, 100], [-20, 0]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 text-blue-400" />,
      title: "Real-time Analytics",
      description: " actionable insights into your fleet's performance with live data visualization."
    },
    {
      icon: <Truck className="w-6 h-6 text-indigo-400" />,
      title: "Smart Dispatch",
      description: "AI-powered route optimization to reduce fuel costs and improve delivery times."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />,
      title: "Safety First",
      description: "Monitor driver behavior and vehicle health to prevent accidents and breakdowns."
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-400" />,
      title: "Instant Alerts",
      description: "Get notified immediately about critical events like maintenance needs or delays."
    }
  ];

  const stats = [
    { value: "40%", label: "Cost Reduction" },
    { value: "2.5x", label: "Efficiency Boost" },
    { value: "10k+", label: "Vehicles Tracked" },
    { value: "99.9%", label: "Uptime" }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* --- Navigation --- */}
      <motion.nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0B0F19]/80 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'}`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Truck className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              FleetFlow
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#solutions" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">Solutions</a>
            <a href="#about" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">About Us</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => onGetStarted('login')}
              className="text-white font-medium hover:text-blue-400 transition-colors px-4 py-2"
            >
              Log In
            </button>
            <button 
              onClick={() => onGetStarted('register')}
              className="px-6 py-2.5 bg-white text-black hover:bg-slate-200 rounded-full font-bold text-sm transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>

           {/* Mobile Menu Toggle */}
           <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-[#0B0F19] border-b border-white/5 overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-4">
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="text-slate-400">Features</a>
                <a href="#solutions" onClick={() => setMobileMenuOpen(false)} className="text-slate-400">Solutions</a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-slate-400">About Us</a>
                <hr className="border-white/5 my-2" />
                <button onClick={() => { onGetStarted('login'); setMobileMenuOpen(false); }} className="text-left text-white py-2">Log In</button>
                <button onClick={() => { onGetStarted('register'); setMobileMenuOpen(false); }} className="text-left text-blue-400 font-bold py-2">Get Started</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* --- Hero Section --- */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none z-0">
           <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
           <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] mix-blend-screen" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-300 text-xs font-medium mb-8 backdrop-blur-sm"
            >
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              The #1 Choice for Modern Fleets
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-8 leading-[1.1]"
            >
              Fleet Management <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                Reimagined.
              </span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Optimize operations, cut costs, and boost efficiency with the most advanced AI-powered fleet intelligence platform.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button 
                onClick={() => onGetStarted('register')}
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                Start Free Trial <ChevronRight className="w-5 h-5" />
              </button>
              <button 
                className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl font-bold text-lg backdrop-blur-md transition-all flex items-center justify-center gap-2 group"
              >
                <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                    <Play className="w-3 h-3 text-black fill-current ml-0.5" />
                </div>
                Watch Demo
              </button>
            </motion.div>
          </div>
        </div>
        
        {/* --- Dashboard Preview (Glassmorphism) --- */}
        <motion.div 
             initial={{ opacity: 0, y: 100, rotateX: 10 }}
             animate={{ opacity: 1, y: 0, rotateX: 0 }}
             transition={{ duration: 1, delay: 0.5, type: 'spring' }}
             className="container mx-auto px-4 mt-20 relative z-10 perspective-1000"
        >
            <div className="relative rounded-xl border border-white/10 bg-[#131B2C]/50 backdrop-blur-xl shadow-2xl overflow-hidden aspect-video max-w-5xl mx-auto group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none" />
                
                 {/* Fake UI Header */}
                <div className="h-10 border-b border-white/5 bg-white/5 flex items-center px-4 gap-2">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                </div>

                {/* Content Placeholder */}
                <div className="p-8 grid grid-cols-12 gap-6 h-full">
                    {/* Sidebar */}
                    <div className="col-span-2 hidden md:flex flex-col gap-4">
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className="h-2 w-full bg-white/5 rounded my-2" />
                        ))}
                    </div>
                    {/* Main Area */}
                    <div className="col-span-12 md:col-span-10 flex flex-col gap-6">
                        <div className="flex gap-4">
                             <div className="h-32 w-1/3 bg-blue-500/10 rounded-xl border border-blue-500/20" />
                             <div className="h-32 w-1/3 bg-indigo-500/10 rounded-xl border border-indigo-500/20" />
                             <div className="h-32 w-1/3 bg-purple-500/10 rounded-xl border border-purple-500/20" />
                        </div>
                         <div className="flex-1 bg-white/5 rounded-xl border border-white/5" />
                    </div>
                </div>

                 {/* Shine Effect */}
                 <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer pointer-events-none" />
            </div>
        </motion.div>
      </section>

      {/* --- Stats Section --- */}
      <section className="py-20 border-y border-white/5 bg-[#0D111D]">
        <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="text-center"
                    >
                        <div className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 mb-2">
                            {stat.value}
                        </div>
                        <div className="text-sm font-medium text-slate-500 uppercase tracking-widest">
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* --- Features Grid --- */}
      <section id="features" className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to <br/> scale your fleet</h2>
                <p className="text-slate-400 max-w-2xl mx-auto">Powerful tools designed for fleet managers, drivers, and operations teams.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-colors group cursor-pointer"
                    >
                        <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            {feature.description}
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>
      {/* --- Solutions Section --- */}
      <section id="solutions" className="py-24 bg-[#0D111D] border-y border-white/5 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/5 blur-3xl rounded-full pointer-events-none" />
         <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row items-center gap-16">
                 <div className="md:w-1/2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold mb-6">
                        <Zap className="w-3 h-3" />
                        INTELLIGENT SOLUTIONS
                      </div>
                      <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                          Transforming data into <br />
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">actionable decisions.</span>
                      </h2>
                      <p className="text-slate-400 mb-8 text-lg leading-relaxed">
                          Our platform doesn't just track location; it analyzes thousands of data points to optimize every aspect of your fleet operation.
                      </p>
                      
                      <div className="space-y-4">
                          {[
                              "Predictive maintenance scheduling",
                              "Automated fuel tax reporting",
                              "Driver safety scoring & coaching",
                              "Dynamic route optimization"
                          ].map((item, i) => (
                              <div key={i} className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                      <CheckCircle2 className="w-4 h-4 text-blue-400" />
                                  </div>
                                  <span className="text-slate-300">{item}</span>
                              </div>
                          ))}
                      </div>
                 </div>
                 <div className="md:w-1/2">
                      <div className="relative">
                          <div className="absolute inset-0 bg-blue-500/30 blur-2xl transform rotate-6 rounded-3xl" />
                          <div className="relative bg-[#131B2C] border border-white/10 rounded-2xl p-6 shadow-2xl">
                              <div className="flex items-center justify-between mb-8">
                                  <div>
                                      <div className="text-sm text-slate-500">Total Savings</div>
                                      <div className="text-2xl font-bold text-white">$124,500</div>
                                  </div>
                                  <div className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-bold rounded-full">
                                      +24% vs last month
                                  </div>
                              </div>
                              <div className="space-y-3">
                                  {[75, 45, 90].map((val, i) => (
                                      <div key={i} className="space-y-1">
                                          <div className="flex justify-between text-xs text-slate-400">
                                              <span>{["Fuel Efficiency", "Maintenance Costs", "Driver Safety"][i]}</span>
                                              <span>{val}%</span>
                                          </div>
                                          <div className="h-2 w-full bg-slate-700/50 rounded-full overflow-hidden">
                                              <motion.div 
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${val}%` }}
                                                transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                                                className={`h-full rounded-full ${[
                                                    "bg-blue-500", "bg-purple-500", "bg-emerald-500"
                                                ][i]}`} 
                                              />
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      </div>
                 </div>
            </div>
         </div>
      </section>

      {/* --- About Us Section --- */}
      <section id="about" className="py-24 relative">
          <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-4">Driven by innovation</h2>
                  <p className="text-slate-400 max-w-2xl mx-auto">We're on a mission to build the operating system for the world's commercial fleets.</p>
              </div>

              <div className="grid md:grid-cols-3 gap-8">
                  <div className="col-span-1 md:col-span-2 bg-[#131B2C] rounded-3xl p-8 border border-white/5 flex flex-col justify-center relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                      <h3 className="text-2xl font-bold mb-4 relative z-10">Our Story</h3>
                      <p className="text-slate-400 leading-relaxed mb-6 relative z-10">
                          Founded in 2024, FleetFlow started with a simple idea: logistics software shouldn't be complicated. We combined advanced AI with intuitive design to create a platform that users actually enjoy using. Today, we process millions of data points daily for fleets across the globe.
                      </p>
                      <div className="flex gap-4 relative z-10">
                          <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                              <div className="text-2xl font-bold text-white">2024</div>
                              <div className="text-xs text-slate-500">Founded</div>
                          </div>
                           <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/5">
                              <div className="text-2xl font-bold text-white">15+</div>
                              <div className="text-xs text-slate-500">Countries</div>
                          </div>
                      </div>
                  </div>
                  <div className="bg-blue-600 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
                       <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
                       <div className="relative z-10">
                           <Globe className="w-12 h-12 text-white/50 mb-6" />
                           <h3 className="text-2xl font-bold text-white mb-2">Global Impact</h3>
                           <p className="text-blue-100">Reducing carbon emissions through smarter routing algorithms.</p>
                       </div>
                  </div>
              </div>
          </div>
      </section>

      {/* --- So
      {/* --- Social Proof / Testimonial --- */}
       <section className="py-24 bg-[#0D111D] relative">
          <div className="container mx-auto px-6 text-center">
               <div className="flex justify-center mb-8 gap-1">
                   {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />)}
               </div>
               <h3 className="text-3xl md:text-4xl font-medium mb-10 max-w-3xl mx-auto leading-normal">
                   "FleetFlow has completely transformed how we manage our logistics. The real-time tracking alone has saved us thousands in fuel costs."
               </h3>
               <div className="flex items-center justify-center gap-4">
                   <div className="w-12 h-12 rounded-full bg-slate-700 overflow-hidden">
                       <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="User" />
                   </div>
                   <div className="text-left">
                       <div className="font-bold text-white">Sarah Jenkins</div>
                       <div className="text-slate-500 text-sm">Logistics Director, SwiftTrans</div>
                   </div>
               </div>
          </div>
       </section>

      {/* --- CTA Section --- */}
      <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/5"></div>
           <div className="container mx-auto px-6 relative z-10 text-center">
               <h2 className="text-4xl md:text-5xl font-bold mb-8">Ready to modernize your fleet?</h2>
               <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                   Join over 500+ companies using FleetFlow to streamline their operations.
               </p>
               <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button 
                         onClick={() => onGetStarted('register')}
                         className="px-8 py-4 bg-white text-blue-600 rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-xl"
                    >
                         Get Started Now
                    </button>
                     <button 
                         onClick={() => onGetStarted('login')}
                         className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/5 transition-all"
                    >
                         Contact Sales
                    </button>
               </div>
           </div>
      </section>

      {/* --- Footer --- */}
      <footer className="py-12 border-t border-white/5 bg-[#0B0F19] text-center text-slate-500 text-sm">
          <div className="container mx-auto px-6">
              <div className="flex items-center justify-center gap-2 mb-8 opacity-50">
                  <Truck className="w-5 h-5" />
                  <span className="font-bold text-lg">FleetFlow</span>
              </div>
              <div className="flex justify-center gap-8 mb-8">
                  <a href="#" className="hover:text-white transition-colors">Privacy</a>
                  <a href="#" className="hover:text-white transition-colors">Terms</a>
                  <a href="#" className="hover:text-white transition-colors">Contact</a>
                  <a href="#" className="hover:text-white transition-colors">Twitter</a>
              </div>
              <p>© 2026 Fleet Code Systems. All rights reserved.</p>
          </div>
      </footer>

    </div>
  );
};

export default PremiumLandingPage;
