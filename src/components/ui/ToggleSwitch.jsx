// components/ui/ToggleSwitch.jsx

import Button from "./Button";

export default function ToggleSwitch({
  isActive,
  onToggle,
  activeText = "Active",
  inactiveText = "Inactive",
  className
}) {
  return (
    <Button
      onClick={onToggle}
      className={`relative flex items-center h-8 w-24 ml-15 rounded-full transition-colors duration-300 ${className} ${
        isActive ? "bg-green-500" : "bg-red-500"
      }`}
    >
      <span
        className={`absolute left-3 text-sm font-semibold text-white transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      >
        {activeText}
      </span>
      <span
        className={`absolute right-3 text-sm font-semibold text-white transition-opacity duration-300 ${
          isActive ? "opacity-0" : "opacity-100"
        }`}
      >
        {inactiveText}
      </span>
      <span
        className={`absolute left-1 top-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
          isActive ? "translate-x-[64px]" : "translate-x-0"
        }`}
      />
    </Button>
  );
}
