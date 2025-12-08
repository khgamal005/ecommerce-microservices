import React from 'react';
import TitleBorder from '../../assets/svgs/TitleBorder';



interface SectionTitleProps {
  title: string;
  subtitle?: string;
  alignment?: 'left' | 'center' | 'right';
  variant?: 'default' | 'gradient' | 'outlined' | 'gradient-fancy';
  showBorder?: boolean;
  className?: string;
  titleClassName?: string;
  gradientColors?: {
    from: string;
    via?: string;
    to: string;
  };
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  alignment = 'left',
  variant = 'gradient-fancy',
  showBorder = true,
  className = '',
  titleClassName = '',
  gradientColors = {
    from: '#3B82F6', // blue-500
    to: '#8B5CF6',   // purple-500
  },
}) => {
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const variantClasses = {
    default: 'text-slate-900',
    gradient: 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500',
    'gradient-fancy': 'text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
    outlined: 'text-slate-900',
  };

  const borderPositions = {
    left: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    right: 'right-0',
  };

  // Custom gradient style for dynamic colors
  const customGradientStyle = variant === 'gradient' && gradientColors ? {
    backgroundImage: gradientColors.via 
      ? `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.via}, ${gradientColors.to})`
      : `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.to})`
  } : undefined;

  return (
    <div className={`relative mb-12 ${alignmentClasses[alignment]} ${className}`}>
      {/* Badge/Pre-title */}
      {subtitle && (
        <div className="mb-3 inline-block">
          <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-700 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200/50 shadow-sm">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            {subtitle}
          </span>
        </div>
      )}
      
      {/* Main Title with Gradient */}
      <div className="relative">
        <h1 
          className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight relative z-10 leading-tight ${variantClasses[variant]} ${titleClassName}`}
          style={customGradientStyle}
        >
          {title}
        </h1>
        
        {/* Optional underline effect with same gradient */}
        {variant === 'outlined' && (
          <span 
            className="block w-24 h-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-4 mb-6"
            style={{
              backgroundImage: gradientColors.via 
                ? `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.via}, ${gradientColors.to})`
                : `linear-gradient(to right, ${gradientColors.from}, ${gradientColors.to})`
            }}
          ></span>
        )}
      </div>
      
      {/* Border SVG */}
      {showBorder && (
        <div className={`absolute ${borderPositions[alignment]} w-full max-w-xs mt-6`}>
          <TitleBorder className={`w-full ${
            alignment === 'center' ? 'mx-auto' : 
            alignment === 'right' ? 'ml-auto' : ''
          }`} />
        </div>
      )}
      
      {/* Decorative background elements */}
      <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-r from-blue-100/40 to-purple-100/40 rounded-full blur-3xl -z-10"></div>
      <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-r from-purple-100/30 to-pink-100/30 rounded-full blur-2xl -z-10"></div>
      
      {/* Optional description */}
      {alignment === 'center' && variant === 'gradient-fancy' && (
        <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg">
          Discover our curated collection of premium products
        </p>
      )}
    </div>
  );
};

export default SectionTitle;