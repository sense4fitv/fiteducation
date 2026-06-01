"use client";

import { Plus, Trash2 } from "lucide-react";
import ListEditor from "./ListEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

interface CompetencyItem {
  title: string;
  icon: string;
  items: string[];
}

interface CompetenciesEditorProps {
  value: CompetencyItem[];
  onChange: (value: CompetencyItem[]) => void;
}

export default function CompetenciesEditor({
  value,
  onChange,
}: CompetenciesEditorProps) {
  const items = value ?? [];

  function handleChange(
    index: number,
    field: keyof CompetencyItem,
    newVal: string | string[]
  ) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: newVal } : item
    );
    onChange(updated);
  }

  function handleAdd() {
    onChange([...items, { title: "", icon: "", items: [] }]);
  }

  function handleRemove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      {items.map((competency, index) => (
        <div
          key={index}
          className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">
              Competency #{index + 1}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
              aria-label="Remove competency"
            >
              <Trash2 size={15} />
            </Button>
          </div>
          <Separator />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-gray-700">Title</Label>
              <Input
                type="text"
                value={competency.title}
                onChange={(e) => handleChange(index, "title", e.target.value)}
                placeholder="e.g. Nutrition"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-gray-700">Icon (Lucide name)</Label>
              <Input
                type="text"
                value={competency.icon}
                onChange={(e) => handleChange(index, "icon", e.target.value)}
                placeholder="e.g. Apple, Dumbbell, Heart"
              />
            </div>
          </div>
          <div>
            <ListEditor
              label="Items"
              value={competency.items}
              onChange={(newItems) => handleChange(index, "items", newItems)}
              placeholder="Enter competency item..."
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
        Add Competency
      </Button>
    </div>
  );
}
