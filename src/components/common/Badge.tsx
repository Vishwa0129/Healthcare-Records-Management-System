import React from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'default';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = false,
  className = '',
}) => {
  const getVariantClasses = (): string => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-100 text-blue-800';
      case 'secondary':
        return 'bg-indigo-100 text-indigo-800';
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'danger':
        return 'bg-red-100 text-red-800';
      case 'info':
        return 'bg-cyan-100 text-cyan-800';
      case 'default':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSizeClasses = (): string => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5';
      case 'md':
        return 'text-sm px-2.5 py-0.5';
      case 'lg':
        return 'text-base px-3 py-1';
      default:
        return 'text-sm px-2.5 py-0.5';
    }
  };

  const roundedClass = rounded ? 'rounded-full' : 'rounded';

  return (
    <span
      className={`inline-flex items-center font-medium ${getVariantClasses()} ${getSizeClasses()} ${roundedClass} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;