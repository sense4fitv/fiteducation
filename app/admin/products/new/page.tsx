import ProductForm from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 font-poppins">
          Add Product
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a new course or workshop
        </p>
      </div>
      <ProductForm />
    </div>
  );
}
