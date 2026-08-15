import React, { ReactNode } from "react";

interface CardSectionProps {
  title?: string;
  badgeNumber?: string | number;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const CardSection: React.FC<CardSectionProps> = ({
  title,
  badgeNumber,
  subtitle,
  action,
  children,
  className = "",
}) => {
  return (
    <div className={`p-6 sm:p-8 rounded-xl portal-card space-y-4 ${className}`}>
      {(title || badgeNumber || action) && (
        <div className="border-b border-slate-200 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            {badgeNumber !== undefined && (
              <span className="w-8 h-8 rounded-lg bg-emerald-700 text-white font-fco font-bold flex items-center justify-center text-sm flex-shrink-0 shadow-sm">
                {badgeNumber}
              </span>
            )}
            <div>
              {title && (
                <h2 className="font-fco text-xl font-bold uppercase text-slate-900 leading-tight">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default CardSection;
