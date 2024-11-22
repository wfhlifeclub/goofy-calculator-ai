import React from 'react';

type ButtonProps = {
  onClick: () => void;
  gridArea: string;
  color: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
};

export const CalculatorButton: React.FC<ButtonProps> = ({ 
  onClick, 
  color, 
  children, 
  position, 
  size 
}) => {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        transition: 'all 0.3s ease-in-out',
      }}
      className={`${color} hover:brightness-110 rounded-full 
        flex items-center justify-center text-2xl font-bold`}
    >
      {children}
    </button>
  );
};