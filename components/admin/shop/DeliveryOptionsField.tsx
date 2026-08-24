"use client";

import { Label } from "@/components/ui/label";
import { DELIVERY_LABEL, DELIVERY_OPTIONS, type DeliveryOption } from "@/lib/shop";

export function DeliveryOptionsField({
  value,
  onChange,
  idPrefix,
}: {
  value: DeliveryOption[];
  onChange: (next: DeliveryOption[]) => void;
  idPrefix: string;
}) {
  function toggle(option: DeliveryOption, checked: boolean) {
    onChange(
      checked
        ? [...value, option]
        : value.filter((existing) => existing !== option),
    );
  }

  return (
    <div className="space-y-2">
      <Label>Metode de livrare</Label>
      <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
        {DELIVERY_OPTIONS.map((option) => {
          const id = `${idPrefix}-${option}`;
          return (
            <div key={option} className="flex items-center gap-2">
              <input
                id={id}
                type="checkbox"
                className="size-4 rounded border-border"
                checked={value.includes(option)}
                onChange={(e) => toggle(option, e.target.checked)}
              />
              <Label htmlFor={id} className="cursor-pointer font-normal">
                {DELIVERY_LABEL[option]}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
}
