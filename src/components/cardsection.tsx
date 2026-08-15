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
    <div className={`p-6 sm:p-8 rounded-2xl portal-card space-y-5 ${className}`}>
      {(title || badgeNumber || action) && (
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative">
          <div className="flex items-center space-x-3.5">
            {badgeNumber !== undefined && (
              <span className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white font-fco font-black flex items-center justify-center text-sm flex-shrink-0 shadow-md shadow-emerald-700/30">
                {badgeNumber}
              </span>
            )}
            <div>
              {title && (
                <h2 className="font-fco text-xl sm:text-2xl font-black uppercase text-slate-900 leading-tight tracking-wide">
                  {title}
                </h2>
              )}
              {subtitle && (
                <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default CardSection;
