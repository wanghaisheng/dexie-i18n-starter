// src/components/common/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
  loadingText?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading = false,
  loadingText = "Loading...",
  ...props
}) => {
  const baseStyle = "button-common";
  const variantStyle = variant === 'primary' ? "button-primary" : "button-secondary";
  return (
    <button className={`${baseStyle} ${variantStyle}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? loadingText : children}
    </button>
  );
};
export default Button; 