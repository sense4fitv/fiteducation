"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
              aria-label="Remove FAQ"
            >
              <Trash2 size={15} />
            </Button>
          </div>
          <Separator />
          <div className="space-y-1">
            <Label className="text-gray-700">Question</Label>
            <Input
              type="text"
              value={item.question}
              onChange={(e) => handleChange(index, "question", e.target.value)}
              placeholder="Enter question..."
            />
          </div>
          <div className="space-y-1">
            <Label className="text-gray-700">Answer</Label>
            <Textarea
              value={item.answer}
              onChange={(e) => handleChange(index, "answer", e.target.value)}
              placeholder="Enter answer..."
              rows={3}
              className="resize-y"
            />
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
      >
        <Plus size={15} />
        Add FAQ
      </Button>
    </div>
  );
}
