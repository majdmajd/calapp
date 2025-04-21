import * as React from "react";

function Tabs({ value, onValueChange, defaultValue, className, children }) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const currentValue = value ?? internalValue;

  const setValue = (val) => {
    setInternalValue(val);
    if (onValueChange) onValueChange(val);
  };

  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        return React.cloneElement(child, { currentValue, setValue });
      })}
    </div>
  );
}

function TabsList({ children, className }) {
  return <div className={`inline-flex p-1 ${className}`}>{children}</div>;
}

function TabsTrigger({ value, currentValue, setValue, children, className }) {
  const active = value === currentValue;
  return (
    <button
      onClick={() => setValue(value)}
      className={`px-4 py-2 text-sm font-medium rounded-md transition-all
        ${active ? "bg-blue-600 text-white shadow" : "bg-[#1a1a1a] text-gray-400 hover:bg-[#222] hover:text-white"}
        ${className}`}
    >
      {children}
    </button>
  );
}

function TabsContent({ value, currentValue, children }) {
  return value === currentValue ? <div>{children}</div> : null;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
