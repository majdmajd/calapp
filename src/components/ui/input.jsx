import * as React from "react";

const Input = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`flex h-10 w-full rounded-md border border-gray-600 bg-black px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
