import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProductForm from "@/components/admin/ProductForm";

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  const { data: productTrainers } = await supabase
    .from("product_trainers")
    .select("trainer_id, sort_order")
    .eq("product_id", id);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
          Edit Product
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Update product details
        </p>
      </div>
      <ProductForm
        product={{
          ...product,
          product_trainers: productTrainers ?? [],
        }}
      />
    </div>
  );
}
