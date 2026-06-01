"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import ListEditor from "./ListEditor";

interface CurriculumModule {
  title: string;
  topics: string[];
}

interface CurriculumEditorProps {
  value: CurriculumModule[];
  onChange: (value: CurriculumModule[]) => void;
}

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8001F] focus:border-transparent";

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
              <button
                type="button"
                onClick={() => toggleExpand(index)}
                className="p-0.5 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
                aria-label={isExpanded ? "Collapse module" : "Expand module"}
              >
                {isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>
              <input
                type="text"
                value={mod.title}
                onChange={(e) => handleTitleChange(index, e.target.value)}
                placeholder={`Module ${index + 1} title...`}
                className={`${inputClass} flex-1`}
                onClick={(e) => e.stopPropagation()}
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                aria-label="Remove module"
              >
                <Trash2 size={15} />
              </button>
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
      <button
        type="button"
        onClick={handleAdd}
        className="text-sm text-[#B8001F] hover:text-[#490207] flex items-center gap-1 transition-colors"
      >
        <Plus size={15} />
        Add Module
      </button>
    </div>
  );
}
