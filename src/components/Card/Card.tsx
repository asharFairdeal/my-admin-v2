// components/Card/Card.tsx
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ onClick, children, className = '' }) => {
  return (
    <div onClick={onClick} className={`rounded-lg overflow-hidden border border-gray-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card;
