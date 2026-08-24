import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export function ShopSubrouteHeader({
  productId,
  productName,
  title,
  description,
}: {
  productId: string;
  productName: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <Link
        href={`/admin/shop/${productId}`}
        className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft className="size-3" />
        {productName}
      </Link>
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
    </div>
  );
}
