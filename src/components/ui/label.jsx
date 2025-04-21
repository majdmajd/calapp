import * as React from "react";

const Label = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={`text-sm font-medium leading-none text-white ${className}`}
      {...props}
    />
  );
});
Label.displayName = "Label";

export { Label };
