import React, { ReactNode, useState } from "react";

interface ClickDetailProps {
  description: string;
  badge?: string;
  icon?: string;
  defaultOpen?: boolean;
  details: ReactNode;
}

const Click: React.FC<ClickDetailProps> = ({
  description,
  badge,
  icon = "fa-chevron-down",
  defaultOpen = false,
  details,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="mb-4 rounded-3xl overflow-hidden soft-card-interactive transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 sm:py-5 flex items-center justify-between text-left cursor-pointer bg-white hover:bg-slate-50/80 transition-colors"
      >
        <div className="flex items-center space-x-3">
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              {badge}
            </span>
          )}
          <span className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            {description}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <div
            className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 transition-transform duration-200 ${
              isOpen ? "rotate-180 bg-emerald-100 text-emerald-700" : ""
            }`}
          >
            <i className={`fa-solid ${icon} text-xs`}></i>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50/50 text-slate-700 text-sm leading-relaxed">
          {details}
        </div>
      )}
    </div>
  );
};

export default Click;
