import * as React from "react";

const Card = React.forwardRef(({ className = "", ...props }, ref) => (
  <div
    ref={ref}
    className={`rounded-xl border border-[#333] bg-[#111] text-white shadow p-6 ${className}`}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = ({ className = "", ...props }) => (
  <div className={`mb-4 ${className}`} {...props} />
);
CardHeader.displayName = "CardHeader";

const CardTitle = ({ className = "", ...props }) => (
  <h3 className={`text-lg font-semibold ${className}`} {...props} />
);
CardTitle.displayName = "CardTitle";

const CardContent = ({ className = "", ...props }) => (
  <div className={`${className}`} {...props} />
);
CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardContent };
