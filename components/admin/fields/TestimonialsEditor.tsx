"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
              aria-label="Remove testimonial"
            >
              <Trash2 size={15} />
            </Button>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-gray-700">Name</Label>
              <Input
                type="text"
                value={item.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                placeholder="e.g. Ion Popescu"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-gray-700">Role</Label>
              <Input
                type="text"
                value={item.role}
                onChange={(e) => handleChange(index, "role", e.target.value)}
                placeholder="e.g. Personal Trainer"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-gray-700">Image URL</Label>
            <Input
              type="text"
              value={item.image_url}
              onChange={(e) => handleChange(index, "image_url", e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-1">
            <Label className="text-gray-700">Testimonial Text</Label>
            <Textarea
              value={item.text}
              onChange={(e) => handleChange(index, "text", e.target.value)}
              placeholder="What did they say..."
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
        Add Testimonial
      </Button>
    </div>
  );
}
