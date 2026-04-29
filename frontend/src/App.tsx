import React, { useState } from 'react';
import { api } from './services/api';

import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Dumbbell, Users, Calendar, Shield, ArrowRight, Check, Menu, X } from 'lucide-react';
import './App.css';

// Admin Components
import AdminLayout from './components/admin/AdminLayout';
import MemberManagementPage from './pages/admin/MemberManagementPage';
import AdminsPage from './pages/admin/AdminsPage';
import PlansPage from './pages/admin/PlansPage';
import AddPlanPage from './pages/admin/AddPlanPage';
import ClientProblemsPage from './pages/admin/ClientProblemsPage';
import LoginPage from './pages/LoginPage';
import ClientLayout from './components/client/ClientLayout';
import ClientDashboard from './pages/ClientDashboard';
import SubscriptionPage from './pages/client/SubscriptionPage';
import FoodCaloriePage from './pages/client/FoodCaloriePage';
import BicepCoach from './pages/client/BicepCoach'; // Updated to .tsx
import PushupCoach from './pages/client/PushupCoach'; // Updated to .tsx
import ChatPage from './pages/client/ChatPage';
import FloatingChat from './components/client/FloatingChat';
import GenerateProgramPage from './pages/client/GenerateProgramPage';
import WorkoutPlanPage from './pages/client/WorkoutPlanPage';
import ProblemsPage from './pages/client/ProblemsPage';




const LandingPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const plans = [
    {
      name: 'Basic',
      price: '$29',
      features: ['Access to gym floor', 'Locker room access', '1 Fitness assessment', 'Free Wi-Fi'],
      color: 'border-slate-700',
      button: 'bg-slate-800 hover:bg-slate-700'
    },
    {
      name: 'Pro',
      price: '$59',
      features: ['Everything in Basic', 'Group classes', 'Personal trainer (2/mo)', 'Sauna access', 'Guest passes (2/mo)'],
      color: 'border-blue-500 shadow-lg shadow-blue-500/20',
      button: 'bg-blue-600 hover:bg-blue-500',
      recommended: true
    },
    {
      name: 'Elite',
      price: '$99',
      features: ['Everything in Pro', 'Unlimited PT sessions', 'Nutrition planning', 'VIP lounge', 'Massage therapy'],
      color: 'border-purple-500 shadow-lg shadow-purple-500/20',
      button: 'bg-purple-600 hover:bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-blue-500/30">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Dumbbell className="text-white" size={24} />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                IRON<span className="text-blue-500">CORE</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
              <a href="#" className="hover:text-blue-400 transition-colors">Programs</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Membership</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Coaches</a>
              <a href="/login" className="px-6 py-2.5 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all hover:scale-105">
                Sign In
              </a>

            </div>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-400">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95 border-b border-white/10 p-6 space-y-4">
            <a href="#" className="block text-lg font-medium text-gray-300">Programs</a>
            <a href="#" className="block text-lg font-medium text-gray-300">Membership</a>
            <a href="#" className="block text-lg font-medium text-gray-300">Coaches</a>
            <a href="/login" className="block text-lg font-medium text-white">Sign In</a>

          </div>
        )}
      </nav>

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.png" 
            alt="Gym Background" 
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New Modern Facility Open in London
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tight leading-none">
            UNLEASH YOUR <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
              INNER STRENGTH
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Experience the future of fitness with state-of-the-art equipment, 
            expert coaching, and a community that pushes you further.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto px-10 py-4 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 transition-all hover:scale-105 flex items-center justify-center gap-2 group">
              Get Started Today <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-10 py-4 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg hover:bg-white/10 transition-all">
              Watch Preview
            </button>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-24 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Shield className="text-blue-500" />, title: 'Premium Gear', desc: 'The latest equipment from TechnoGym and Rogue.' },
              { icon: <Users className="text-purple-500" />, title: 'Expert Coaches', desc: 'Certified trainers dedicated to your progress.' },
              { icon: <Calendar className="text-pink-500" />, title: '24/7 Access', desc: 'Train on your own schedule, day or night.' },
              { icon: <Dumbbell className="text-green-500" />, title: 'Custom Plans', desc: 'Personalized nutrition and workout routines.' },
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:-translate-y-2">
                <div className="mb-4">{f.icon}</div>
                <h3 className="text-xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Dumbbell className="text-blue-500" size={24} />
            <span className="text-xl font-bold tracking-tighter">IRONCORE</span>
          </div>
          <p className="text-gray-500 text-sm">© 2026 IronCore Fitness. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Floating Chat for landing page */}
      <FloatingChat />
    </div>
  );
};

const CoachWrapper: React.FC<{ component: any }> = ({ component: Component }) => {
  const navigate = useNavigate();
  return <Component onBack={() => navigate('/dashboard')} />;
};

const App: React.FC = () => {
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.setToken(token);
    }
  }, []);

  return (

    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Client Routes */}
        <Route path="/dashboard" element={
          <ClientLayout>
            <ClientDashboard />
          </ClientLayout>
        } />

        <Route path="/subscription" element={
          <ClientLayout>
            <SubscriptionPage />
          </ClientLayout>
        } />

        <Route path="/food-calorie" element={
          <ClientLayout>
            <FoodCaloriePage />
          </ClientLayout>
        } />

        <Route path="/bicep-coach" element={
          <ClientLayout>
            <CoachWrapper component={BicepCoach} />
          </ClientLayout>
        } />

        <Route path="/pushup-coach" element={
          <ClientLayout>
            <CoachWrapper component={PushupCoach} />
          </ClientLayout>
        } />

        <Route path="/chat" element={
          <ClientLayout>
            <ChatPage />
          </ClientLayout>
        } />

        <Route path="/generate-plan" element={
          <ClientLayout>
            <GenerateProgramPage />
          </ClientLayout>
        } />

        <Route path="/workout-plan" element={
          <ClientLayout>
            <WorkoutPlanPage />
          </ClientLayout>
        } />

        <Route path="/support" element={
          <ClientLayout>
            <ProblemsPage />
          </ClientLayout>
        } />



        
        {/* Admin Routes */}
        <Route path="/admin" element={
          <AdminLayout>
            <div className="p-4 bg-blue-600/10 border border-blue-500/20 rounded-2xl">
              <h2 className="text-xl font-bold">Welcome to Admin Dashboard</h2>
              <p className="text-gray-400 mt-2 text-sm">Select a section from the sidebar to manage the gym facility.</p>
            </div>
          </AdminLayout>
        } />
        
        <Route path="/admin/members" element={
          <AdminLayout>
            <MemberManagementPage />
          </AdminLayout>
        } />
        
        <Route path="/admin/admins" element={
          <AdminLayout>
            <AdminsPage />
          </AdminLayout>
        } />
        
        <Route path="/admin/plans" element={
          <AdminLayout>
            <PlansPage />
          </AdminLayout>
        } />
        
        <Route path="/admin/plans/add" element={
          <AdminLayout>
            <AddPlanPage />
          </AdminLayout>
        } />

        <Route path="/admin/problems" element={
          <AdminLayout>
            <ClientProblemsPage />
          </AdminLayout>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
