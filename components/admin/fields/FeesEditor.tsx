"use client";

interface FeesValue {
  inscription: string;
  monthly: string;
  total: string;
}

interface FeesEditorProps {
  value: FeesValue;
  onChange: (value: FeesValue) => void;
}

const inputClass =
  "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#B8001F] focus:border-transparent";
const labelClass = "text-sm font-medium text-gray-700 mb-1 block";

export default function FeesEditor({ value, onChange }: FeesEditorProps) {
  const fees: FeesValue = value ?? { inscription: "", monthly: "", total: "" };

  function handleChange(field: keyof FeesValue, newVal: string) {
    onChange({ ...fees, [field]: newVal });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div>
        <label className={labelClass}>Inscription Fee</label>
        <input
          type="text"
          value={fees.inscription}
          onChange={(e) => handleChange("inscription", e.target.value)}
          placeholder="e.g. 200 RON"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Monthly Fee</label>
        <input
          type="text"
          value={fees.monthly}
          onChange={(e) => handleChange("monthly", e.target.value)}
          placeholder="e.g. 350 RON"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Total</label>
        <input
          type="text"
          value={fees.total}
          onChange={(e) => handleChange("total", e.target.value)}
          placeholder="e.g. 1400 RON"
          className={inputClass}
        />
      </div>
    </div>
  );
}
