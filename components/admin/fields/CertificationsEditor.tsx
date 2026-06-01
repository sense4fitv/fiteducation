"use client";

import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface CertificationItem {
  label: string;
  title: string;
  description: string;
}

interface CertificationsEditorProps {
  value: CertificationItem[];
  onChange: (value: CertificationItem[]) => void;
}

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
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
              aria-label="Remove certification"
            >
              <Trash2 size={15} />
            </Button>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-gray-700">Label</Label>
              <Input
                type="text"
                value={item.label}
                onChange={(e) => handleChange(index, "label", e.target.value)}
                placeholder="e.g. Level 1"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-gray-700">Title</Label>
              <Input
                type="text"
                value={item.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                placeholder="e.g. Personal Trainer"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-gray-700">Description</Label>
            <Textarea
              value={item.description}
              onChange={(e) => handleChange(index, "description", e.target.value)}
              placeholder="Describe this certification..."
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
        Add Certification
      </Button>
    </div>
  );
}
