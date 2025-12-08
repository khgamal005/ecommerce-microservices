import React from 'react';

interface TitleBorderProps {
  className?: string;
  colorFrom?: string;
  colorTo?: string;
}

export default function TitleBorder({ 
  className = "",
  colorFrom = "#3B82F6", // blue-500
  colorTo = "#8B5CF6"    // purple-500
}: TitleBorderProps) {
  return (
    <svg
      width="200"
      height="24"
      viewBox="0 0 200 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Modern decorative border */}
      <path
        d="M10 12H190"
        stroke={`url(#borderGradient-${colorFrom.replace('#', '')}-${colorTo.replace('#', '')})`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="8 8"
      />
      
      {/* Decorative elements at ends */}
      <circle cx="5" cy="12" r="3" fill={colorFrom} />
      <circle cx="195" cy="12" r="3" fill={colorTo} />
      
      {/* Accent elements */}
      <path
        d="M0 12H5M195 12H200"
        stroke={`url(#accentGradient-${colorFrom.replace('#', '')}-${colorTo.replace('#', '')})`}
        strokeWidth="1"
        strokeLinecap="round"
      />
      
      {/* Decorative dots */}
      <circle cx="40" cy="12" r="1.5" fill={colorFrom} opacity="0.6" />
      <circle cx="60" cy="12" r="1.5" fill={colorTo} opacity="0.6" />
      <circle cx="140" cy="12" r="1.5" fill={colorFrom} opacity="0.6" />
      <circle cx="160" cy="12" r="1.5" fill={colorTo} opacity="0.6" />
      
      {/* Animated dot */}
      <circle cx="100" cy="12" r="2" fill="white" className="animate-pulse">
        <animate
          attributeName="r"
          values="2;3;2"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
      
      {/* Gradients */}
      <defs>
        <linearGradient 
          id={`borderGradient-${colorFrom.replace('#', '')}-${colorTo.replace('#', '')}`} 
          x1="0%" 
          y1="0%" 
          x2="100%" 
          y2="0%"
        >
          <stop offset="0%" stopColor={colorFrom} />
          <stop offset="50%" stopColor={colorTo} />
          <stop offset="100%" stopColor={colorTo} />
        </linearGradient>
        
        <linearGradient 
          id={`accentGradient-${colorFrom.replace('#', '')}-${colorTo.replace('#', '')}`} 
          x1="0%" 
          y1="0%" 
          x2="100%" 
          y2="0%"
        >
          <stop offset="0%" stopColor={colorFrom} stopOpacity="0.5" />
          <stop offset="100%" stopColor={colorTo} stopOpacity="0.5" />
        </linearGradient>
      </defs>
    </svg>
  );
}