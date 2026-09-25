import React from 'react';

export default function LogoVE({ className = 'w-24 h-24', monochrome = false }) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <img
        src="/ve-logo.jpg"
        alt="Vedant Enterprises Logo"
        className={`w-full h-full object-contain ${
          monochrome ? 'filter grayscale contrast-125' : ''
        }`}
      />
    </div>
  );
}
