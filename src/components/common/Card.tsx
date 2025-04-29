import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string | ReactNode;
  description?: string;
  footer?: ReactNode;
  className?: string;
  headerAction?: ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  description,
  footer,
  className = '',
  headerAction
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm overflow-hidden ${className}`}>
      {(title || description) && (
        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-start">
          <div>
            {title && (
              typeof title === 'string' 
                ? <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>
                : title
            )}
            {description && (
              <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
          </div>
          {headerAction && (
            <div className="ml-4">{headerAction}</div>
          )}
        </div>
      )}
      <div className="px-6 py-5">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;