"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FeesValue {
  inscription: string;
  monthly: string;
  total: string;
}

interface FeesEditorProps {
  value: FeesValue;
  onChange: (value: FeesValue) => void;
}

export default function FeesEditor({ value, onChange }: FeesEditorProps) {
  const fees: FeesValue = value ?? { inscription: "", monthly: "", total: "" };

  function handleChange(field: keyof FeesValue, newVal: string) {
    onChange({ ...fees, [field]: newVal });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="space-y-1">
        <Label className="text-gray-700">Inscription Fee</Label>
        <Input
          type="text"
          value={fees.inscription}
          onChange={(e) => handleChange("inscription", e.target.value)}
          placeholder="e.g. 200 RON"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-gray-700">Monthly Fee</Label>
        <Input
          type="text"
          value={fees.monthly}
          onChange={(e) => handleChange("monthly", e.target.value)}
          placeholder="e.g. 350 RON"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-gray-700">Total</Label>
        <Input
          type="text"
          value={fees.total}
          onChange={(e) => handleChange("total", e.target.value)}
          placeholder="e.g. 1400 RON"
        />
      </div>
    </div>
  );
}
