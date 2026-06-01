import { createClient } from "@/lib/supabase/server";
import { GraduationCap } from "lucide-react";

export default async function EnrollmentsPage() {
  const supabase = await createClient();

  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, products(title)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
      </div>

      {!enrollments || enrollments.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No enrollments yet
          </h3>
          <p className="text-gray-500">
            Enrollments will appear here once users start signing up for courses and workshops.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {enrollment.user_id?.slice(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {(enrollment.products as { title: string } | null)?.title ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        enrollment.status === "paid_stripe" || enrollment.status === "paid_manual"
                          ? "bg-green-100 text-green-800"
                          : enrollment.status === "cancelled"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {enrollment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {enrollment.amount_paid
                      ? `${enrollment.amount_paid} RON`
                      : "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {enrollment.created_at
                      ? new Date(enrollment.created_at).toLocaleDateString("ro-RO")
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
