import re
import os

filepath = r"c:\Users\inesa\OneDrive\Bureau\Doku\test\frontend\src\App.tsx"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

new_landing_page = """const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* ─── FIXED NAVIGATION BAR ─── */}
      <nav className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-5xl">
        <div className="bg-white/10 backdrop-blur-xl border border-gray-400/30 rounded-full px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <span className="text-black font-black text-sm">D</span>
            </div>
            <span className="text-lg font-bold text-white tracking-tighter">DOKU</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors text-xs uppercase tracking-widest font-medium">
              Smart Coaching
            </a>
            <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors text-xs uppercase tracking-widest font-medium">
              Nutrition
            </a>
            <a href="#" className="text-gray-300 hover:text-orange-500 transition-colors text-xs uppercase tracking-widest font-medium">
              Memberships
            </a>
          </div>

          {/* CTA Button */}
          <button className="bg-white text-black hover:bg-orange-500 hover:text-white font-bold rounded-full px-6 py-2 text-xs uppercase transition-all duration-300">
            Join the elite
          </button>
        </div>
      </nav>

      {/* ─── HERO SECTION ─── */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://d2xsxph8kpxj0f.cloudfront.net/310519663514401596/8nV6kT5EAXUYjRDEZYhNg6/doku-hero-bg-f49VNcJaXTy2h472EBRk2H.webp)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </div>

        {/* Content Overlay - Centered */}
        <div className="relative h-full flex flex-col items-center justify-center px-6 pt-32">
          {/* Badge */}
          <div className="mb-8 px-6 py-2 bg-orange-500/10 border border-orange-500/50 rounded-full backdrop-blur-md">
            <span className="text-[10px] font-bold text-orange-500 tracking-[0.3em] uppercase">
              Advanced Motion Tracking
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-8xl font-light text-center mb-6 max-w-5xl leading-[1.1] tracking-tight">
            Redefine your <br />
            <span className="italic font-serif">potential</span> with AI
          </h1>

          {/* Subheading - Focus on results and technology without jargon */}
          <p className="text-base md:text-lg text-gray-400 text-center max-w-2xl mb-12 leading-relaxed font-light">
            Real-time form analysis, personalized high-tech programming, and automated nutritional insights. Welcome to the era of precision fitness.
          </p>

          {/* CTA Button - Large */}
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-full px-12 py-5 text-sm uppercase tracking-widest flex items-center gap-4 group shadow-2xl shadow-orange-500/40 transition-all duration-500">
            Start the experience
            <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>
      
      <FloatingChat />
    </div>
  );
};
"""

pattern = re.compile(r'const LandingPage: React\.FC = \(\) => \{.*?\};\n', re.DOTALL)
new_content, count = pattern.subn(new_landing_page + '\n', content)

if count > 0:
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully updated to English version.")
else:
    print("Could not find the LandingPage component.")