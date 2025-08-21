'use client'

import * as Switch from '@radix-ui/react-switch'

export default function ToggleSwitch({ isActive, onToggle }) {
  return (
    <Switch.Root
      checked={isActive}
      onCheckedChange={onToggle}
      className={`relative inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out
        ${isActive ? 'bg-green-500' : 'bg-red-500'}`}
    >
      <Switch.Thumb
        className={`pointer-events-none inline-block h-[18px] w-[18px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out
          ${isActive ? 'translate-x-[20px]' : 'translate-x-0'}`}
      />
    </Switch.Root>
  )
}
