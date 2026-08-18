import React from "react";
const Grid = () => {
  return (
    <div className="absolute inset-0 w-full h-full bg-transparent z-0 select-none pointer-events-none">
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050507]/40 pointer-events-none" />
    </div>
  );
};
export default Grid;