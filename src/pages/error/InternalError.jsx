import { Navbar, Footer } from "@/components/layout";
export default function InternalError() {
  return (
    <div className="relative min-h-screen bg-[#050507] text-white selection:bg-white/10 overflow-x-hidden antialiased flex flex-col">
      <Navbar />
      <div className="min-h-screen w-full bg-[#050507] text-white flex flex-col items-center justify-center p-6 font-mono">
        <h2 className="text-sm font-semibold mb-2 text-red-400">
          ⚡ Connection / Graphics Render Exception
        </h2>
        <p className="text-xs text-gray-500 max-w-sm text-center mb-6">
          Unable to complete localized data initialization loop. Please check
          your network linkage or refresh the browser frame.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white text-black font-semibold text-xs rounded-lg hover:bg-gray-200 transition-colors"
        >
          Retry Connection
        </button>
      </div>
      <Footer />
    </div>
  );
}
