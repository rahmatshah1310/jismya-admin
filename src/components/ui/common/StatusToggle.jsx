"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import ToggleSwitch from "../ToggleSwitch";

export default function StatusToggle({ id, isActive, mutationFn, activeText = "Active", inactiveText = "Inactive", onSuccess, onError, className = "" }) {
  const [active, setActive] = useState(isActive);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setActive(isActive);
  }, [isActive]);

  const handleToggle = async () => {
    if (loading) return;
    const previous = active;
    const next = !active;

    setActive(next);
    setLoading(true);

    try {
      await mutationFn({ id, isActive: next });
      onSuccess?.(id, next);
      //   toast.success(`Status updated to ${next ? activeText : inactiveText}`);
    } catch (error) {
      setActive(previous);
      onError?.(error);
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToggleSwitch isActive={active} onToggle={handleToggle} activeText={activeText} inactiveText={inactiveText} disabled={loading} className={className} />
  );
}
