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
    <div className={`p-4 sm:p-7 md:p-8 rounded-2xl portal-card card-hover-fx space-y-4 sm:space-y-5 transition-all group ${className}`}>
      {(title || badgeNumber || action) && (
        <div className="border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 relative">
          <div className="flex items-center space-x-3">
            {badgeNumber !== undefined && (
              <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white font-fco font-black flex items-center justify-center text-xs sm:text-sm flex-shrink-0 shadow-md shadow-emerald-700/30 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                {badgeNumber}
              </span>
            )}
            <div>
              {title && (
                <h2 className="font-fco text-lg sm:text-2xl font-black uppercase text-slate-900 dark:text-white leading-tight tracking-wide group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
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
