import { Outlet } from "react-router-dom";
import { Navbar, Footer } from "@/components/layout";

export default function MainLayout() {
  return (
    <div className="relative min-h-screen bg-[#050507] text-white selection:bg-white/10 overflow-x-hidden antialiased flex flex-col">
        <Navbar />
        <main className="grow flex flex-col justify-center">
          <Outlet />
        </main>
        <Footer />
    </div>
  );
}
