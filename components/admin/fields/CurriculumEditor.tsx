"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import ListEditor from "./ListEditor";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CurriculumModule {
  title: string;
  topics: string[];
}

interface CurriculumEditorProps {
  value: CurriculumModule[];
  onChange: (value: CurriculumModule[]) => void;
}

export default function CurriculumEditor({
  value,
  onChange,
}: CurriculumEditorProps) {
  const modules = value ?? [];
  const [expandedIndexes, setExpandedIndexes] = useState<Set<number>>(
    new Set()
  );

  function toggleExpand(index: number) {
    setExpandedIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  function handleTitleChange(index: number, newTitle: string) {
    const updated = modules.map((mod, i) =>
      i === index ? { ...mod, title: newTitle } : mod
    );
    onChange(updated);
  }

  function handleTopicsChange(index: number, newTopics: string[]) {
    const updated = modules.map((mod, i) =>
      i === index ? { ...mod, topics: newTopics } : mod
    );
    onChange(updated);
  }

  function handleAdd() {
    const newIndex = modules.length;
    onChange([...modules, { title: "", topics: [] }]);
    setExpandedIndexes((prev) => new Set(prev).add(newIndex));
  }

  function handleRemove(index: number) {
    onChange(modules.filter((_, i) => i !== index));
    setExpandedIndexes((prev) => {
      const next = new Set<number>();
      prev.forEach((i) => {
        if (i < index) next.add(i);
        else if (i > index) next.add(i - 1);
      });
      return next;
    });
  }

  return (
    <div className="space-y-2">
      {modules.map((mod, index) => {
        const isExpanded = expandedIndexes.has(index);
        return (
          <div
            key={index}
            className="border border-gray-200 rounded-lg bg-gray-50 overflow-hidden"
          >
            {/* Module header */}
            <div className="flex items-center gap-2 px-4 py-3">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => toggleExpand(index)}
                className="flex-shrink-0 h-7 w-7"
                aria-label={isExpanded ? "Collapse module" : "Expand module"}
              >
                {isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </Button>
              <Input
                type="text"
                value={mod.title}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                placeholder={`Module ${index + 1} title...`}
                className="flex-1"
                onClick={(e) => e.stopPropagation()}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemove(index)}
                className="flex-shrink-0"
                aria-label="Remove module"
              >
                <Trash2 size={15} />
              </Button>
            </div>

            {/* Topics (collapsible) */}
            {isExpanded && (
              <div className="px-4 pb-4 border-t border-gray-200 pt-3">
                <ListEditor
                  label="Topics"
                  value={mod.topics}
                  onChange={(newTopics) => handleTopicsChange(index, newTopics)}
                  placeholder="Enter topic..."
                />
              </div>
            )}
          </div>
        );
      })}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
      >
        <Plus size={15} />
        Add Module
      </Button>
    </div>
  );
}
