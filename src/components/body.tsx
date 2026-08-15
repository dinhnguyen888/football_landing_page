import React, { ReactNode } from "react";

interface BodyProps {
  children: ReactNode;
  className?: string;
}

const Body: React.FC<BodyProps> = ({ children, className = "" }) => {
  return (
    <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 ${className}`}>
      {children}
    </main>
  );
};

export default Body;
