"use client";

import { Plus, Trash2 } from "lucide-react";

interface TestimonialItem {
  name: string;
  role: string;
  text: string;
  image_url: string;
}

interface TestimonialsEditorProps {
  value: TestimonialItem[];
  onChange: (value: TestimonialItem[]) => void;
}

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8001F] focus:border-transparent";
const labelClass = "text-sm font-medium text-gray-700 mb-1 block";

export default function TestimonialsEditor({
  value,
  onChange,
}: TestimonialsEditorProps) {
  const items = value ?? [];

  function handleChange(
    index: number,
    field: keyof TestimonialItem,
    newVal: string
  ) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: newVal } : item
    );
    onChange(updated);
  }

  function handleAdd() {
    onChange([...items, { name: "", role: "", text: "", image_url: "" }]);
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
              Testimonial #{index + 1}
            </span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Remove testimonial"
            >
              <Trash2 size={15} />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Name</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="e.g. Ion Popescu"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Role</label>
              <input
                type="text"
                value={item.role}
                onChange={(e) => handleChange(index, "role", e.target.value)}
                placeholder="e.g. Personal Trainer"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Image URL</label>
            <input
              type="text"
              value={item.image_url}
              onChange={(e) => handleChange(index, "image_url", e.target.value)}
              placeholder="https://..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Testimonial Text</label>
            <textarea
              value={item.text}
              onChange={(e) => handleChange(index, "text", e.target.value)}
              placeholder="What did they say..."
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
        Add Testimonial
      </button>
    </div>
  );
}
