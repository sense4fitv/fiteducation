"use client";

import { Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface ListEditorProps {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export default function ListEditor({
  label,
  value,
  onChange,
  placeholder = "Enter item...",
}: ListEditorProps) {
  const items = value ?? [];

  function handleChange(index: number, newVal: string) {
    const updated = items.map((item, i) => (i === index ? newVal : item));
    onChange(updated);
  }

  function handleAdd() {
    onChange([...items, ""]);
  }

  function handleRemove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  function handleMoveUp(index: number) {
    if (index === 0) return;
    const updated = [...items];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    onChange(updated);
  }

  function handleMoveDown(index: number) {
    if (index === items.length - 1) return;
    const updated = [...items];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    onChange(updated);
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-gray-700">{label}</Label>
      )}
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                aria-label="Move up"
                className="h-5 w-5"
              >
                <ChevronUp size={14} />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleMoveDown(index)}
                disabled={index === items.length - 1}
                aria-label="Move down"
                className="h-5 w-5"
              >
                <ChevronDown size={14} />
              </Button>
            </div>
            <Input
              type="text"
              value={item}
              onChange={(e) => handleChange(index, e.target.value)}
              placeholder={placeholder}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
              aria-label="Remove item"
            >
              <X size={16} />
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="mt-1"
      >
        <Plus size={15} />
        Add item
      </Button>
    </div>
  );
}
