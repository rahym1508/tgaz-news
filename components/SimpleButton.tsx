import React from "react"

interface SimpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost"
  size?: "sm" | "md" | "lg"
}

const SimpleButton: React.FC<SimpleButtonProps> = ({
  variant = "default",
  size = "md",
  className,
  children,
  ...props
}) => {
  const sizeClasses = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-base",
    lg: "h-11 px-8 text-lg",
  }

  const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    ghost: "text-primary hover:bg-primary/10",
  }

  return (
    <button
      className={`rounded-md font-medium transition-colors ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default SimpleButton 