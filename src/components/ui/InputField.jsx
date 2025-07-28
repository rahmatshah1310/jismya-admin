// components/commons/InputField.jsx
import React from "react";

const InputField = ({
  label,
  name,
  value = "",
  onChange,
  placeholder,
  type = "text",
  required = false,
  maxLength,
  className = "",
  ...rest
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        maxLength={maxLength} // ✅ This works as long as value is string
        onChange={onChange}
        onWheel={(e) => {
          if (type === "number") e.target.blur();
        }}
        className={className}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

export default InputField;
