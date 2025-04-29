import React from 'react';
import { User } from 'lucide-react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  name,
  size = 'md',
  className = '',
}) => {
  const getSizeClasses = (): { container: string; text: string; icon: number } => {
    switch (size) {
      case 'xs':
        return { container: 'h-6 w-6', text: 'text-xs', icon: 14 };
      case 'sm':
        return { container: 'h-8 w-8', text: 'text-sm', icon: 16 };
      case 'md':
        return { container: 'h-10 w-10', text: 'text-base', icon: 20 };
      case 'lg':
        return { container: 'h-12 w-12', text: 'text-lg', icon: 24 };
      case 'xl':
        return { container: 'h-16 w-16', text: 'text-xl', icon: 32 };
      default:
        return { container: 'h-10 w-10', text: 'text-base', icon: 20 };
    }
  };

  const sizeClasses = getSizeClasses();

  // Get initials from name
  const getInitials = (): string => {
    if (!name) return '';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (
      nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)
    ).toUpperCase();
  };

  const initials = getInitials();

  return (
    <div
      className={`relative inline-flex items-center justify-center ${sizeClasses.container} rounded-full bg-gray-200 ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full rounded-full object-cover"
        />
      ) : initials ? (
        <span className={`font-medium text-gray-700 ${sizeClasses.text}`}>
          {initials}
        </span>
      ) : (
        <User size={sizeClasses.icon} className="text-gray-500" />
      )}
    </div>
  );
};

export default Avatar;