"use client";

import { Plus, Trash2 } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQEditorProps {
  value: FAQItem[];
  onChange: (value: FAQItem[]) => void;
}

export default function FAQEditor({ value, onChange }: FAQEditorProps) {
  const items = value ?? [];

  function handleChange(index: number, field: keyof FAQItem, newVal: string) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: newVal } : item
    );
    onChange(updated);
  }

  function handleAdd() {
    onChange([...items, { question: "", answer: "" }]);
  }

  function handleRemove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">FAQ #{index + 1}</span>
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Remove FAQ"
            >
              <Trash2 size={15} />
            </button>
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Question</label>
            <input
              type="text"
              value={item.question}
              onChange={(e) => handleChange(index, "question", e.target.value)}
              placeholder="Enter question..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8001F] focus:border-transparent"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">Answer</label>
            <textarea
              value={item.answer}
              onChange={(e) => handleChange(index, "answer", e.target.value)}
              placeholder="Enter answer..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8001F] focus:border-transparent resize-y"
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
        Add FAQ
      </button>
    </div>
  );
}
