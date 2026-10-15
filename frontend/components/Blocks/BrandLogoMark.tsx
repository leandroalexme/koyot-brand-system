import React from 'react';
import { BrandLogoId } from '../../types';

interface BrandLogoMarkProps {
  logoId: BrandLogoId;
  color?: string;
  size?: number;
  className?: string;
}

export const BrandLogoMark: React.FC<BrandLogoMarkProps> = ({
  logoId,
  color = 'currentColor',
  size = 28,
  className = '',
}) => {
  switch (logoId) {
    case 'koyot':
      // Swiss Brutalist Geometric Monolith K
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          className={className}
        >
          <rect x="5" y="5" width="9" height="30" fill={color} />
          <polygon points="16,20 31,5 36,5 36,11 23,22" fill={color} />
          <polygon points="20,18 36,30 36,35 29,35 16,23" fill={color} />
        </svg>
      );

    case 'vesper':
      // Atelier Editorial Crest / Architectural V Chalice
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          className={className}
        >
          <path
            d="M 7 8 L 20 33 L 33 8"
            stroke={color}
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="20" cy="12" r="3.5" fill={color} />
          <path
            d="M 12 24 C 16 20 24 20 28 24"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'vortex':
      // Neo Kinetic Interlocking Rotor Blades
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          className={className}
        >
          <path
            d="M 20 4 C 29 4 36 11 36 20 C 30 14 23 14 20 20 C 17 14 11 11 20 4 Z"
            fill={color}
          />
          <path
            d="M 36 20 C 36 29 29 36 20 36 C 26 30 26 23 20 20 C 26 17 29 11 36 20 Z"
            fill={color}
            fillOpacity="0.85"
          />
          <path
            d="M 20 36 C 11 36 4 29 4 20 C 10 26 17 26 20 20 C 23 26 29 29 20 36 Z"
            fill={color}
            fillOpacity="0.7"
          />
          <path
            d="M 4 20 C 4 11 11 4 20 4 C 14 10 14 17 20 20 C 14 23 11 29 4 20 Z"
            fill={color}
            fillOpacity="0.55"
          />
        </svg>
      );

    case 'poulp':
    default:
      // Felt Organic P Loop Mark (matches the 'p' mark in the bottom-left of the reference poster)
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 40 40"
          fill="none"
          className={className}
        >
          <path
            d="M 12 34 L 12 18 C 12 10.5 17.5 6 24.5 6 C 31 6 35 10.5 35 16.5 C 35 22.5 31 27 24.5 27 L 18 27"
            stroke={color}
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          <circle cx="24" cy="16.5" r="3.5" fill={color} />
        </svg>
      );
  }
};
