import React from "react";

interface CardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  className = "",
  children,
  onClick,
  hover = true,
}) => {
  return (
    <div
      className={`
        card 
        ${hover ? "hover:shadow-lg" : ""} 
        ${onClick ? "cursor-pointer" : ""} 
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = "", children }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

export const CardContent: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = "", children }) => {
  return <div className={`p-4 pt-0 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = "", children }) => {
  return <div className={`p-4 pt-0 ${className}`}>{children}</div>;
};

export default Card;
