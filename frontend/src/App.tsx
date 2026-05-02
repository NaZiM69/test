import React, { useState } from "react";
import { api } from "./services/api";

//import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import {
  Dumbbell,
  Users,
  Calendar,
  Shield,
  ArrowRight,
  Check,
  Menu,
  X,
  Target,
  Zap,
  Camera,
} from "lucide-react";
import "./App.css";

// Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import MemberManagementPage from "./pages/admin/MemberManagementPage";
import AdminsPage from "./pages/admin/AdminsPage";
import PlansPage from "./pages/admin/PlansPage";
import AddPlanPage from "./pages/admin/AddPlanPage";
import ClientProblemsPage from "./pages/admin/ClientProblemsPage";
import LoginPage from "./pages/LoginPage";
import ClientLayout from "./components/client/ClientLayout";
import ClientDashboard from "./pages/ClientDashboard";
import SubscriptionPage from "./pages/client/SubscriptionPage";
import FoodCaloriePage from "./pages/client/FoodCaloriePage";
import BicepCoach from "./pages/client/BicepCoach"; // Updated to .tsx
import PushupCoach from "./pages/client/PushupCoach"; // Updated to .tsx
import ChatPage from "./pages/client/ChatPage";
import FloatingChat from "./components/client/FloatingChat";
import GenerateProgramPage from "./pages/client/GenerateProgramPage";
import WorkoutPlanPage from "./pages/client/WorkoutPlanPage";
import ProblemsPage from "./pages/client/ProblemsPage";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link,
} from "react-router-dom";

// ... (Garder tes imports de composants ici: LoginPage, ClientLayout, etc.)

import { MapPin } from "lucide-react"; // Ajout de MapPin pour le côté physique
import LogoDoku from "./components/LogoDoku";

// ... (Garder tes autres imports)

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-5xl">
        <div className="bg-white/10 backdrop-blur-md border border-gray-400/30 rounded-full px-8 py-4 flex items-center justify-between">
          {/* ─── REMPLACEMENT ICI ─── */}
          <div className="flex items-center gap-1">
            {/* On réduit le gap car le SVG a déjà des marges internes */}
            <LogoDoku size="w-32" showText={true} />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="#gym"
              className="text-gray-300 hover:text-orange-500 transition-colors text-xs uppercase tracking-widest font-medium"
            >
              The Club
            </a>
            <a
              href="#features"
              className="text-gray-300 hover:text-orange-500 transition-colors text-xs uppercase tracking-widest font-medium"
            >
              AI Coaching
            </a>
            <Link
              to="/login"
              className="text-gray-300 hover:text-orange-500 transition-colors text-xs uppercase tracking-widest font-medium"
            >
              {" "}
              Memberships
            </Link>
          </div>

          <Link to="/login">
            <button className="bg-orange-500 text-white hover:bg-white hover:text-black font-bold rounded-full px-6 py-2 text-xs uppercase transition-all">
              Join Now
            </button>
          </Link>
        </div>
      </nav>

      {/* ─── HERO SECTION (Identique) ─── */}
      <section className="relative w-full h-screen flex flex-col items-center justify-center px-6">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/bg.png')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
        </div>
        <div className="relative text-center z-10">
          <div className="mb-8 px-6 py-2 bg-orange-500/10 border border-orange-500/50 rounded-full inline-flex items-center gap-2">
            <MapPin className="w-3 h-3 text-orange-500" />
            <span className="text-[10px] font-bold text-orange-500 tracking-[0.3em] uppercase">
              Premium Fitness Club
            </span>
          </div>
          <h1 className="text-5xl md:text-8xl font-light mb-6 leading-tight tracking-tight">
            Your ultimate <br />
            <span className="italic font-serif text-orange-500">
              hybrid
            </span>{" "}
            experience
          </h1>
          {/*<p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-12 font-light italic">Access our premium facility and power your progress with real-time motion tracking.</p>*/}
          <Link
            to="/login"
            className="mt-12 bg-orange-500 hover:bg-white hover:text-black font-bold rounded-full px-11 py-9 text-sm uppercase tracking-widest transition-all inline-flex items-center gap-2 shadow-[0_0_20px_rgba(239,159,39,0.4)] hover:shadow-[0_0_35px_rgba(239,159,39,0.6)]"
          >
            Get Membership <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ─── SECTION 1: THE PHYSICAL GYM ─── */}
      <section id="gym" className="py-24 px-6 bg-black">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-5xl font-light mb-8 tracking-tight">
              The <span className="text-orange-500">Facility</span>
            </h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Located in the heart of the city, DOKU is more than a gym it's a
              sanctuary for performance. Our facility features high-end
              equipment integrated with sensory members to sync directly with
              your digital profile.
            </p>
            <ul className="space-y-4">
              {[
                "Pro-grade strength zones",
                "Personal recovery lounge",
                "Cardio training environment",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium tracking-wide uppercase text-gray-200"
                >
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />{" "}
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            {/* Remplacer par une image de la salle physique */}
            <img
              src="/gym.jpeg"
              alt="Doku Physical Gym"
              className="w-full h-full object-cover opacity-80"
            />
          </div>
        </div>
      </section>

      {/* ─── SECTION 2: AI COACHING & MEMBERSHIPS ─── */}
      <section
        id="features"
        className="py-24 px-6 bg-[#0a0a0a] border-y border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-light mb-4">
              Premium{" "}
              <span className="italic text-orange-500">Environment</span>
            </h2>
            <p className="text-gray-500 tracking-widest uppercase text-[10px] font-bold">
              Tech-Driven Performance
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Motion Tracking */}
            <div className="p-8 bg-black/40 border border-white/10 rounded-3xl hover:border-orange-500/50 transition-colors">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
                <Camera className="text-orange-500 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">
                AI Motion Coach
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Advanced motion tracking analyzes your form in real-time. Count
                reps and perfect your technique with instant feedback.
              </p>
            </div>

            {/* Feature 2: Smart Planning */}
            <div className="p-8 bg-black/40 border border-white/10 rounded-3xl hover:border-orange-500/50 transition-colors">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-orange-500 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">
                Smart Programming
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Dynamic workout plans that adapt to your progress. No more
                generic routines—experience precision-engineered fitness.
              </p>
            </div>

            {/* Feature 3: Nutrition */}
            <div className="p-8 bg-black/40 border border-white/10 rounded-3xl hover:border-orange-500/50 transition-colors">
              <div className="w-12 h-12 bg-orange-500/20 rounded-xl flex items-center justify-center mb-6">
                <Target className="text-orange-500 w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4 uppercase tracking-tighter">
                Vision Nutrition
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Snap a photo to track your intake. Our intelligent vision system
                identifies macros instantly to keep your diet on point.
              </p>
            </div>
          </div>

          {/* Membership Quick Glance */}
          <div
            id="pricing"
            className="mt-20 p-1 bg-gradient-to-r from-orange-500/20 via-orange-500 to-orange-500/20 rounded-[40px]"
          >
            <div className="bg-black rounded-[38px] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div>
                <h4 className="text-2xl font-bold uppercase tracking-tighter mb-2">
                  Ready to join DOKU?
                </h4>
                <p className="text-gray-400">
                  Choose between Basic, Pro, and Premium memberships. Physical
                  access included.
                </p>
              </div>
              <Link
                to="/login"
                className="bg-orange-500 text-white hover:bg-white hover:text-black font-bold px-10 py-4 rounded-full uppercase text-xs tracking-widest hover:bg-orange-500  transition-all"
              >
                Explore Plans
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*<FloatingChat />*/}
    </div>
  );
};

const CoachWrapper: React.FC<{ component: any }> = ({
  component: Component,
}) => {
  const navigate = useNavigate();
  return <Component onBack={() => navigate("/dashboard")} />;
};

const App: React.FC = () => {
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // api.setToken(token); // Assure-toi que l'objet api est importé
    }
  }, []);

  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Client Routes */}
        <Route
          path="/dashboard"
          element={
            <ClientLayout>
              <ClientDashboard />
            </ClientLayout>
          }
        />

        <Route
          path="/subscription"
          element={
            <ClientLayout>
              <SubscriptionPage />
            </ClientLayout>
          }
        />

        <Route
          path="/food-calorie"
          element={
            <ClientLayout>
              <FoodCaloriePage />
            </ClientLayout>
          }
        />

        <Route
          path="/bicep-coach"
          element={
            <ClientLayout>
              <CoachWrapper component={BicepCoach} />
            </ClientLayout>
          }
        />

        <Route
          path="/pushup-coach"
          element={
            <ClientLayout>
              <CoachWrapper component={PushupCoach} />
            </ClientLayout>
          }
        />

        <Route
          path="/chat"
          element={
            <ClientLayout>
              <ChatPage />
            </ClientLayout>
          }
        />

        <Route
          path="/generate-plan"
          element={
            <ClientLayout>
              <GenerateProgramPage />
            </ClientLayout>
          }
        />

        <Route
          path="/workout-plan"
          element={
            <ClientLayout>
              <WorkoutPlanPage />
            </ClientLayout>
          }
        />

        <Route
          path="/support"
          element={
            <ClientLayout>
              <ProblemsPage />
            </ClientLayout>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminLayout>
              <div className="p-4 bg-orange-600/10 border border-orange-500/20 rounded-2xl">
                <h2 className="text-xl font-bold">
                  Welcome to Admin Dashboard
                </h2>
                <p className="text-gray-400 mt-2 text-sm">
                  Select a section from the sidebar to manage the gym facility.
                </p>
              </div>
            </AdminLayout>
          }
        />

        <Route
          path="/admin/members"
          element={
            <AdminLayout>
              <MemberManagementPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/admins"
          element={
            <AdminLayout>
              <AdminsPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/plans"
          element={
            <AdminLayout>
              <PlansPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/plans/add"
          element={
            <AdminLayout>
              <AddPlanPage />
            </AdminLayout>
          }
        />

        <Route
          path="/admin/problems"
          element={
            <AdminLayout>
              <ClientProblemsPage />
            </AdminLayout>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
