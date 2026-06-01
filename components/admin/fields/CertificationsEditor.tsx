"use client";

import { Plus, Trash2 } from "lucide-react";

interface CertificationItem {
  label: string;
  title: string;
  description: string;
}

interface CertificationsEditorProps {
  value: CertificationItem[];
  onChange: (value: CertificationItem[]) => void;
}

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8001F] focus:border-transparent";
const labelClass = "text-sm font-medium text-gray-700 mb-1 block";

export default function CertificationsEditor({
  value,
  onChange,
}: CertificationsEditorProps) {
  const items = value ?? [];

  function handleChange(
    index: number,
    field: keyof CertificationItem,
    newVal: string
  ) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: newVal } : item
    );
    onChange(updated);
  }

  function handleAdd() {
    onChange([...items, { label: "", title: "", description: "" }]);
  }

  function handleRemove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              Certification #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Remove certification"
            >
              <Trash2 size={15} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Label</label>
              <input
                type="text"
                value={item.label}
                onChange={(e) => handleChange(index, "label", e.target.value)}
                placeholder="e.g. Level 1"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Title</label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                placeholder="e.g. Personal Trainer"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={item.description}
              onChange={(e) => handleChange(index, "description", e.target.value)}
              placeholder="Describe this certification..."
              rows={3}
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAdd}
        className="text-sm text-[#B8001F] hover:text-[#490207] flex items-center gap-1 transition-colors"
      >
        <Plus size={15} />
        Add Certification
      </button>
    </div>
  );
}
