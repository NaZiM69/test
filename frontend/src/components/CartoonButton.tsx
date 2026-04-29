import React from 'react';

interface CartoonButtonProps {
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  color?: string;
  className?: string;
}

const CartoonButton: React.FC<CartoonButtonProps> = ({ 
  children, 
  onClick, 
  disabled, 
  type = 'button', 
  color = 'bg-blue-600', 
  className = '' 
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        relative px-8 py-4 rounded-2xl font-black text-lg uppercase tracking-wider
        transition-all duration-200 active:translate-y-1 active:shadow-none
        disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none
        ${color} text-white shadow-[0_8px_0_0_rgba(0,0,0,0.2)]
        hover:brightness-110 border-2 border-black/10
        ${className}
      `}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default CartoonButton;
