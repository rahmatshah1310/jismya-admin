'use client'

import React from 'react'
import Select from 'react-select'

export default function MultiSelect({
  label,
  name,
  value = [],
  options = [],
  onChange,
  className = '',
}) {
  // Convert simple string options to react-select format
  const formattedOptions = options.map((opt) => ({ value: opt, label: opt }))

  const formattedValue = formattedOptions.filter((opt) =>
    value.includes(opt.value)
  )

  const handleChange = (selectedOptions) => {
    const selectedValues = selectedOptions?.map((opt) => opt.value) || []
    onChange?.(name, selectedValues)
  }

  return (
    <div className={className}>
      {label && <label className="block font-semibold  mb-1">{label}</label>}
      <Select
        options={formattedOptions}
        value={formattedValue}
        onChange={handleChange}
        isMulti
        name={name}
        className="react-select-container"
        classNamePrefix="react-select"
        styles={{
          control: (provided, state) => ({
            ...provided,
            backgroundColor: `transparent`,
            borderColor: state.isFocused
              ? `hsl(var(--primary))`
              : `hsl(var(--border))`,
          }),
          menu: (provided) => ({
            ...provided,
            backgroundColor: `hsl(var(--background))`,
            borderColor: `hsl(var(--border))`,
            borderWidth: '1px',
            borderStyle: 'solid',
          }),
          menuList: (provided) => ({
            ...provided,
            padding: 0,
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected
              ? `hsl(var(--accent))`
              : state.isFocused
              ? `hsl(var(--muted))`
              : `hsl(var(--background))`,
            color: state.isSelected
              ? `hsl(var(--accent-foreground))`
              : `hsl(var(--foreground))`,
          }),
          multiValue: (provided) => ({
            ...provided,
            backgroundColor: `hsl(var(--accent))`,
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: `hsl(var(--accent-foreground))`,
          }),
        }}
      />
    </div>
  )
}
