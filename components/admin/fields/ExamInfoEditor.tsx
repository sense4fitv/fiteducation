"use client";

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

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8001F] focus:border-transparent";
const labelClass = "text-sm font-medium text-gray-700 mb-1 block";

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
      <div>
        <label className={labelClass}>Format</label>
        <input
          type="text"
          value={info.format}
          onChange={(e) => handleChange("format", e.target.value)}
          placeholder="e.g. Written + Practical"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Duration</label>
        <input
          type="text"
          value={info.duration}
          onChange={(e) => handleChange("duration", e.target.value)}
          placeholder="e.g. 3 hours"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Passing Grade</label>
        <input
          type="text"
          value={info.passing_grade}
          onChange={(e) => handleChange("passing_grade", e.target.value)}
          placeholder="e.g. 70%"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Certification</label>
        <input
          type="text"
          value={info.certification}
          onChange={(e) => handleChange("certification", e.target.value)}
          placeholder="e.g. NASM Certified"
          className={inputClass}
        />
      </div>
    </div>
  );
}
