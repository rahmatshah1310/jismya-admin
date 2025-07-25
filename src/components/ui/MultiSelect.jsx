"use client";

import React from "react";
import Select from "react-select";

export default function MultiSelect({
  label,
  name,
  value = [],
  options = [],
  onChange,
  className = "",
}) {
  // Convert simple string options to react-select format
  const formattedOptions = options.map((opt) => ({ value: opt, label: opt }));

  const formattedValue = formattedOptions.filter((opt) =>
    value.includes(opt.value)
  );

  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions?.map((opt) => opt.value) || [];
    onChange?.(name, selectedValues);
  };

  return (
    <div className={className}>
      {label && <label className="block font-semibold text-gray-700 mb-1">{label}</label>}
      <Select
        options={formattedOptions}
        value={formattedValue}
        onChange={handleChange}
        isMulti
        name={name}
        className="react-select-container"
        classNamePrefix="react-select"
      />
    </div>
  );
}
