import { Scene3D } from "@/components/three";
import UIOverlay from "./UIOverlay";
export default function Home() {
  return (
    <div className="relative w-full min-h-screen bg-[#050507] overflow-x-hidden">
      {}
      <div className="fixed inset-0 z-0 pointer-events-auto">
        <Scene3D />
      </div>
      {}
      <UIOverlay />
    </div>
  );
}