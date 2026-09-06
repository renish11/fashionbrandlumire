import Link from "next/link";

export default function BackendHomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#0a0a0a] text-white">
      <div className="max-w-md w-full p-8 rounded-2xl bg-[#141414] border border-[#262626] shadow-2xl">
        <h1 className="text-3xl font-serif text-[#D4AF37] mb-1 tracking-wider">LUMIÈRE</h1>
        <p className="text-xs uppercase tracking-[0.25em] text-[#888] mb-6">Backend & Admin Engine</p>
        
        <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#222] mb-6 text-left text-xs space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-[#777]">API Server:</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
              Port 4000 (Active)
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#777]">Payment Gateway:</span>
            <span className="text-[#D4AF37] font-mono">Razorpay Integration</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#777]">Catalog:</span>
            <span className="text-zinc-300 font-mono">Women&apos;s Luxury Fashion</span>
          </div>
        </div>

        <Link
          href="/admin"
          className="block w-full py-3 px-6 rounded-lg bg-[#D4AF37] text-black font-semibold tracking-wide hover:bg-[#c5a030] transition-colors shadow-lg"
        >
          Open Admin Dashboard
        </Link>
      </div>
    </main>
  );
}
