"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ExamInfoValue {
  format: string;
  duration: string;
  passing_grade: string;
  certification: string;
}

interface ExamInfoEditorProps {
  value: ExamInfoValue;
  onChange: (value: ExamInfoValue) => void;
}

export default function ExamInfoEditor({ value, onChange }: ExamInfoEditorProps) {
  const info: ExamInfoValue = value ?? {
    format: "",
    duration: "",
    passing_grade: "",
    certification: "",
  };

  function handleChange(field: keyof ExamInfoValue, newVal: string) {
    onChange({ ...info, [field]: newVal });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-1">
        <Label className="text-gray-700">Format</Label>
        <Input
          type="text"
          value={info.format}
          onChange={(e) => handleChange("format", e.target.value)}
          placeholder="e.g. Written + Practical"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-gray-700">Duration</Label>
        <Input
          type="text"
          value={info.duration}
          onChange={(e) => handleChange("duration", e.target.value)}
          placeholder="e.g. 3 hours"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-gray-700">Passing Grade</Label>
        <Input
          type="text"
          value={info.passing_grade}
          onChange={(e) => handleChange("passing_grade", e.target.value)}
          placeholder="e.g. 70%"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-gray-700">Certification</Label>
        <Input
          type="text"
          value={info.certification}
          onChange={(e) => handleChange("certification", e.target.value)}
          placeholder="e.g. NASM Certified"
        />
      </div>
    </div>
  );
}
