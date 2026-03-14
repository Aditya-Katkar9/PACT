import { ShieldCheck, Zap, FileCheck, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 animate-fade-in border border-blue-100">
            <ShieldCheck className="w-4 h-4 mr-2" /> Verified Micro-Agreements
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6 animate-slide-up" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
            Trust <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">verified</span> in seconds.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 mb-10 animate-slide-up" style={{ animationDelay: '0.2s', animationFillMode: 'both' }}>
            PACT is the fastest way to create, verify, and document everyday commitments—from lending money to fulfilling tasks.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md animate-slide-up" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
            <Link href="/auth" className="inline-flex justify-center items-center px-8 py-4 border border-transparent text-base font-medium rounded-full shadow-lg text-white bg-primary hover:bg-primary/90 transition-all hover:-translate-y-1 w-full sm:w-auto">
              Create an Agreement
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Premium commitment technology</h2>
            <p className="mt-4 text-lg text-gray-500">Everything you need to secure your everyday deals.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-primary" />}
              title="60-Second Creation"
              description="Simple, intuitive wizard layout gets your terms documented instantly. No legal jargon required."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-success" />}
              title="Biometric Verification"
              description="Privacy-focused Face ID verification. Both parties confirm presence without storing raw images."
            />
            <FeatureCard
              icon={<FileCheck className="w-6 h-6 text-purple-500" />}
              title="Tamper-Proof Certificates"
              description="Cryptographic hash (CIH) ensures integrity, formatted into a professional PDF ready to share."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How PACT works</h2>
          </div>
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center z-0 hidden md:flex">
              <div className="w-full h-0.5 bg-gray-200"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
              <Step number="1" title="Draft terms" desc="Input the basics: who, what, when, and how much." />
              <Step number="2" title="Verify identities" desc="Both parties confirm the agreement layout via rapid Face ID." />
              <Step number="3" title="Generate proof" desc="PACT issues a mathematically secure, printable PDF certificate." />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="glass-card p-8 group">
      <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-base text-gray-500 leading-relaxed">{description}</p>
    </div>
  );
}

function Step({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center text-center bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div className="w-12 h-12 rounded-full bg-primary text-white font-bold flex items-center justify-center text-xl mb-6 shadow-md">
        {number}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">{desc}</p>
    </div>
  );
}
