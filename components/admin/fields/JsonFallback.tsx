"use client";

import { useState, useEffect } from "react";
import { Code2, ChevronDown, ChevronUp } from "lucide-react";

interface JsonFallbackProps {
  value: unknown;
  onChange: (value: unknown) => void;
  label?: string;
}

export default function JsonFallback({
  value,
  onChange,
  label = "Raw JSON",
}: JsonFallbackProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [raw, setRaw] = useState(() => JSON.stringify(value, null, 2));
  const [error, setError] = useState<string | null>(null);

  // Keep raw in sync if value changes externally while closed
  useEffect(() => {
    if (!isOpen) {
      setRaw(JSON.stringify(value, null, 2));
      setError(null);
    }
  }, [value, isOpen]);

  function handleBlur() {
    try {
      const parsed = JSON.parse(raw);
      setError(null);
      onChange(parsed);
    } catch {
      setError("Invalid JSON — changes not saved.");
    }
  }

  function handleToggle() {
    if (!isOpen) {
      // Refresh raw from latest value when opening
      setRaw(JSON.stringify(value, null, 2));
      setError(null);
    }
    setIsOpen((prev) => !prev);
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleToggle}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <Code2 size={15} />
        {label}
        {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>

      {isOpen && (
        <div className="space-y-1">
          <textarea
            value={raw}
            onChange={(e) => {
              setRaw(e.target.value);
              setError(null);
            }}
            onBlur={handleBlur}
            rows={12}
            spellCheck={false}
            className={`w-full px-3 py-2 border rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:border-transparent resize-y bg-white ${
              error
                ? "border-red-500 focus:ring-red-400"
                : "border-gray-300 focus:ring-[#B8001F]"
            }`}
          />
          {error && (
            <p className="text-xs text-red-600 flex items-center gap-1">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
