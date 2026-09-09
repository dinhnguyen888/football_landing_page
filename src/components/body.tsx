import React, { ReactNode } from "react";

interface BodyProps {
  children: ReactNode;
  className?: string;
}

const Body: React.FC<BodyProps> = ({ children, className = "" }) => {
  return (
    <main className={`w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 lg:py-10 min-w-0 ${className}`}>
      {children}
    </main>
  );
};

export default Body;
