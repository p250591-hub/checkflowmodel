import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Check, 
  Clock, 
  RotateCw, 
  Layers, 
  Zap, 
  ShieldCheck, 
  Users,
  Compass
} from 'lucide-react';

interface LandingPipelinePreviewProps {
  onStartRealFlow: () => void;
}

export const LandingPipelinePreview: React.FC<LandingPipelinePreviewProps> = ({
  onStartRealFlow,
}) => {
  const [activeStep, setActiveStep] = useState<number>(0);

  // Auto-looping simulator step
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Problem & Solution Card */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm p-8 md:p-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#F4F4F7] border border-[#E5E5E5] text-[11px] font-mono text-[#1A1A1A] mb-4">
            <Zap className="w-3.5 h-3.5 text-black" />
            <span>CAMPUS CLEARANCE, RESOLVED IN SECONDS — NOT DAYS</span>
          </div>

          <h2 className="text-3xl md:text-4xl font-light tracking-tight text-[#1A1A1A] mb-4 leading-tight">
            Stop forcing graduating students to walk between three closed offices.
          </h2>

          <p className="text-sm md:text-base text-[#666666] leading-relaxed mb-6 font-normal">
            At traditional universities, students spend days walking between the Bursar, the Library, and the Department Head.
            Each office already has their records on file in an instant database, but they don't communicate with each other.
            <strong className="text-black font-medium"> What costs days is the physical walk between offices, not the verification itself.</strong>
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={onStartRealFlow}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white text-xs font-medium rounded-md hover:bg-neutral-800 transition-colors shadow-sm"
            >
              <span>Launch Live Clearance Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Grid: Manual Walk vs ClearFlow */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Manual Process Card */}
        <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#999999]">
              TRADITIONAL PROCESS
            </span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
              ~3 to 5 Days
            </span>
          </div>

          <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">
            Sequential Physical Walking & Queues
          </h3>
          <p className="text-xs text-[#666666] mb-4 leading-relaxed">
            Students stand in line on Monday at the Bursar, return Tuesday because the library counter was closed for lunch,
            and discover on Thursday that their capstone sign-off form is on an advisor's desk.
          </p>

          <ul className="space-y-2 text-xs text-[#666666]">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></span>
              <span>Sequential blocking — if one office delays, the entire clearance halts.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></span>
              <span>Lost paper chits and stamp requirements prone to forgery.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></span>
              <span>No granular feedback until arriving at the physical window.</span>
            </li>
          </ul>
        </div>

        {/* ClearFlow Process Card */}
        <div className="bg-white p-6 rounded-xl border border-black shadow-sm ring-1 ring-black/5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#999999]">
              CLEARFLOW ARCHITECTURE
            </span>
            <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              ~1.4 Seconds
            </span>
          </div>

          <h3 className="text-base font-semibold text-[#1A1A1A] mb-2">
            Concurrent Multi-Agent Fan-Out
          </h3>
          <p className="text-xs text-[#666666] mb-4 leading-relaxed">
            One Orchestrator dispatches three specialized micro-agents to query the shared institutional record store
            simultaneously. Clearance finishes in the time of the slowest single API check.
          </p>

          <ul className="space-y-2 text-xs text-[#1A1A1A]">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Parallel verification — Finance, Library, and Dept Head audit at once.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Targeted "Resolve & Retry" — fix one hold without restarting others.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>Tamper-evident certificate with in-browser SHA-256 fingerprint & QR.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Auto-Looping Interactive Architecture Visualizer */}
      <div className="bg-white rounded-xl border border-[#E5E5E5] shadow-sm p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E5] mb-6">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-[#1A1A1A]">
              Interactive Pipeline Loop
            </h3>
            <p className="text-xs text-[#666666]">
              Real-time demonstration of the four-agent dispatch and resolution pattern.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F4F4F7] text-[#666666] border border-[#E5E5E5]">
            Looping Simulation: Step {activeStep + 1} of 4
          </span>
        </div>

        {/* Step Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-3.5 rounded-lg border transition-all ${
            activeStep === 0 ? 'border-black bg-[#FAFAFA]' : 'border-[#E5E5E5] bg-white opacity-70'
          }`}>
            <span className="text-[10px] font-mono text-[#999999] block mb-1">01 / DISPATCH</span>
            <h4 className="text-xs font-semibold text-[#1A1A1A] mb-1">Orchestrator Request</h4>
            <p className="text-[11px] text-[#666666]">
              Student initiates clearance request; Orchestrator generates clearance ID.
            </p>
          </div>

          <div className={`p-3.5 rounded-lg border transition-all ${
            activeStep === 1 ? 'border-black bg-[#FAFAFA]' : 'border-[#E5E5E5] bg-white opacity-70'
          }`}>
            <span className="text-[10px] font-mono text-[#999999] block mb-1">02 / PARALLEL AUDIT</span>
            <h4 className="text-xs font-semibold text-[#1A1A1A] mb-1">Concurrent Checks</h4>
            <p className="text-[11px] text-[#666666]">
              Finance, Library, and Dept Head agents verify record store simultaneously.
            </p>
          </div>

          <div className={`p-3.5 rounded-lg border transition-all ${
            activeStep === 2 ? 'border-black bg-[#FAFAFA]' : 'border-[#E5E5E5] bg-white opacity-70'
          }`}>
            <span className="text-[10px] font-mono text-[#999999] block mb-1">03 / ISOLATION</span>
            <h4 className="text-xs font-semibold text-[#1A1A1A] mb-1">Targeted Feedback</h4>
            <p className="text-[11px] text-[#666666]">
              Specific holds flagged with inline actions. No need to visit other offices.
            </p>
          </div>

          <div className={`p-3.5 rounded-lg border transition-all ${
            activeStep === 3 ? 'border-black bg-[#FAFAFA]' : 'border-[#E5E5E5] bg-white opacity-70'
          }`}>
            <span className="text-[10px] font-mono text-[#999999] block mb-1">04 / CERTIFICATION</span>
            <h4 className="text-xs font-semibold text-[#1A1A1A] mb-1">Instant Issuance</h4>
            <p className="text-[11px] text-[#666666]">
              Tamper-evident digital PDF certificate & scannable verification QR generated.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
