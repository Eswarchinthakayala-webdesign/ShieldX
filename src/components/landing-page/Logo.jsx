import React from 'react';

const Logo = ({ className = "w-8 h-8", ...props }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
      {...props}
    >
      {/* Outer Hexagon Shield Frame */}
      <path 
        d="M50 5L90 25V75L50 95L10 75V25L50 5Z" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinejoin="round"
        className="text-[#ff1e1e]"
      />
      
      {/* Inner Glowing Core */}
      <path 
        d="M50 20L75 32.5V67.5L50 80L25 67.5V32.5L50 20Z" 
        fill="currentColor" 
        className="text-[#ff1e1e]/20"
      />
      
      {/* Geometric "X" Integration */}
      <path 
        d="M35 35L65 65M65 35L35 65" 
        stroke="currentColor" 
        strokeWidth="4" 
        strokeLinecap="round"
        className="text-[#ff1e1e]"
      />
      
      {/* Tech Accents (Dots) */}
      <circle cx="50" cy="5" r="2" fill="currentColor" className="text-[#ff1e1e]" />
      <circle cx="50" cy="95" r="2" fill="currentColor" className="text-[#ff1e1e]" />
      <circle cx="10" cy="25" r="2" fill="currentColor" className="text-[#ff1e1e]" />
      <circle cx="90" cy="25" r="2" fill="currentColor" className="text-[#ff1e1e]" />
      <circle cx="10" cy="75" r="2" fill="currentColor" className="text-[#ff1e1e]" />
      <circle cx="90" cy="75" r="2" fill="currentColor" className="text-[#ff1e1e]" />
    </svg>
  );
};

export default Logo;
